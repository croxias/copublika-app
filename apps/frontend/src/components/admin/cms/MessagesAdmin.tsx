'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import * as Menu from '@radix-ui/react-dropdown-menu';
import { Archive, Check, ChevronDown, Clock3, Download, FileText, History, Inbox, Mail, MessageCircle, MoreVertical, Search, Send, ShieldAlert, Tag, Trash2, X } from 'lucide-react';
import { CopublikaMark } from '@/components/brand/CopublikaMark';
import { useCms } from '@/lib/cms/store';
import { MSG_STATUSES, RESPONDER, codeOf, eventsOf, fillTemplate, slaOf, withMsgEvent, type MsgEvent, type MsgStatus } from '@/lib/cms/messages';
import type { CmsItem, Values } from '@/lib/cms/types';
import { CONTACT_COPY, type ContactTopic } from '@/lib/content/contact';
import { CmsSelect } from './CmsSelect';
import { Count, Kpi } from './ProgramOverview';
import { ConfirmDialog, Drawer, PageHeader, StagingNote, formatDate } from './ui';

const EASE = [0.22, 1, 0.36, 1] as const;
const statusOf = (s: unknown) => MSG_STATUSES.find((x) => x.value === s) ?? MSG_STATUSES[0];
const hours = (a: string, b: string) => (new Date(b).getTime() - new Date(a).getTime()) / 3_600_000;
const initials = (n: string) => n.replace(/^(dr|prof)\.?\s+/i, '').split(/[\s,]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const waNumber = (n: unknown) => String(n ?? '').replace(/\D/g, '').replace(/^0/, '62');

function ago(iso: string, now: number) {
  const h = Math.max(0, (now - new Date(iso).getTime()) / 3_600_000);
  if (h < 1) return `${Math.max(1, Math.round(h * 60))} menit lalu`;
  if (h < 24) return `${Math.round(h)} jam lalu`;
  return `${Math.round(h / 24)} hari lalu`;
}

const EVENT_LABEL: Record<string, string> = {
  created: 'Pesan masuk',
  opened: 'Dibuka',
  replied: 'Dibalas',
  status: 'Status diubah',
  note: 'Catatan diperbarui',
};

/** Status change with its history entry; marking replied/closed also stamps repliedAt once. */
const statusPatch = (r: CmsItem, s: MsgStatus): [Omit<MsgEvent, 'at'>, Values] => [
  { by: RESPONDER, action: 'status', detail: statusOf(s).label },
  { status: s, ...((s === 'replied' || s === 'closed') && !r.repliedAt ? { repliedAt: new Date().toISOString() } : {}) },
];

function downloadCsv(rows: CmsItem[]) {
  const head = ['Kode', 'Masuk', 'Nama', 'Instansi', 'Email', 'WhatsApp', 'Topik', 'Status', 'Dibalas', 'Pesan'];
  const cell = (v: unknown) => `"${String(v ?? '').replaceAll('"', '""')}"`;
  const lines = rows.map((x) => [codeOf(x), x.createdAt, x.name, x.org, x.email, x.whatsapp, x.topic, statusOf(x.status).label, x.repliedAt, x.message].map(cell).join(','));
  const blob = new Blob(['﻿' + [head.join(','), ...lines].join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `kotak-pesan-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

/** Konten → Kotak Pesan: messages from the /contact form, answered by the admin team. */
export function MessagesAdmin() {
  const cms = useCms();
  const reduce = useReducedMotion();
  // Read the clock once per mount so render stays pure.
  const [now] = useState(() => Date.now());
  const all = [...(cms.collections.messages ?? [])].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  const [status, setStatus] = useState<MsgStatus | 'all' | 'open'>('open');
  const [topic, setTopic] = useState('all');
  const [q, setQ] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState<CmsItem[] | null>(null);
  const [kpiOpen, setKpiOpen] = useState(true);

  const topics = ((cms.sections['contact.topics']?.topics as ContactTopic[] | undefined) ?? CONTACT_COPY.topics).filter((t) => t.label);
  const targetOf = (x: CmsItem) => Number(topics.find((t) => t.label === x.topic)?.replyHours) || 24;

  const isOpen = (x: CmsItem) => x.status === 'new' || x.status === 'replied';
  const shown = all
    .filter((x) => (status === 'all' ? true : status === 'open' ? isOpen(x) : x.status === status))
    .filter((x) => topic === 'all' || x.topic === topic)
    .filter((x) => !q || `${String(x.name)} ${String(x.email)} ${String(x.org)} ${String(x.message)} ${codeOf(x)}`.toLowerCase().includes(q.toLowerCase()));
  const fresh = all.filter((x) => x.status === 'new');
  const late = fresh.filter((x) => slaOf(x, targetOf(x), now).tone === 'late');
  const answered = all.filter((x) => x.repliedAt);
  const onTime = answered.filter((x) => slaOf(x, targetOf(x), now).label === 'Tepat waktu').length;
  const avg = answered.length ? answered.reduce((n, x) => n + hours(String(x.createdAt), String(x.repliedAt)), 0) / answered.length : 0;
  const byTopic = topics.map((t) => ({ label: t.label, n: all.filter((x) => x.topic === t.label && x.status !== 'spam').length }));
  const top = [...byTopic].sort((a, b) => b.n - a.n)[0];
  const open = all.find((x) => x.id === openId);
  const sel = shown.filter((x) => picked.has(x.id));
  const allPicked = shown.length > 0 && sel.length === shown.length;

  const patchMany = (ids: Set<string>, make: (r: CmsItem) => CmsItem) => cms.setCollection('messages', (cms.collections.messages ?? []).map((x) => (ids.has(x.id) ? make(x) : x)));
  const patchOne = (r: CmsItem, e: Omit<MsgEvent, 'at'> | null, patch: Values) =>
    patchMany(new Set([r.id]), (x) => (e ? withMsgEvent(x, e, patch) : { ...x, ...patch, updatedAt: new Date().toISOString() }));
  const openMessage = (x: CmsItem) => {
    if (eventsOf(x).at(-1)?.action !== 'opened') patchOne(x, { by: RESPONDER, action: 'opened' }, {});
    setOpenId(x.id);
  };
  const bulkStatus = (s: MsgStatus) => {
    patchMany(new Set(sel.map((x) => x.id)), (x) => withMsgEvent(x, ...statusPatch(x, s)));
    cms.toast(`${sel.length} pesan ditandai ${statusOf(s).label.toLowerCase()}.`);
    setPicked(new Set());
  };
  const remove = (rows: CmsItem[]) => {
    const before = cms.collections.messages ?? [];
    const ids = new Set(rows.map((r) => r.id));
    cms.setCollection('messages', before.filter((x) => !ids.has(x.id)));
    cms.toast(rows.length > 1 ? `${rows.length} pesan dihapus.` : 'Pesan dihapus.', 'ok', { label: 'Urungkan', run: () => cms.setCollection('messages', before) });
    setConfirmDelete(null);
    setOpenId(null);
    setPicked(new Set());
  };
  const toggle = (id: string) =>
    setPicked((p) => {
      const n = new Set(p);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const count = (s: MsgStatus) => all.filter((x) => x.status === s).length;

  return (
    <section className="cms-page">
      <PageHeader
        crumb={['Konten', 'Kotak Pesan']}
        title="Kotak"
        accent="Pesan"
        description="Pesan dari formulir /contact. Semua balasan dikirim atas nama Tim Admin CoPublika."
        publicHref="/contact"
        actions={<Link href="/admin/messages/templates" className="cms-btn cms-btn--ghost"><FileText size={15} /> Template balasan</Link>}
      />
      <StagingNote />

      <section className="pov bov" aria-label="Ringkasan pesan">
        <header className="pov-head">
          <div>
            <span className="pov-k">Ringkasan pesan</span>
            <p>Target balasan mengikuti topik (Konfigurasi Website Publik → Kontak → Topik & tim).</p>
          </div>
          <button type="button" className="cms-btn cms-btn--ghost cms-btn--sm" aria-expanded={kpiOpen} onClick={() => setKpiOpen((o) => !o)}>
            {kpiOpen ? 'Sembunyikan' : 'Tampilkan'} <ChevronDown size={14} className={`pov-caret ${kpiOpen ? 'is-open' : ''}`} />
          </button>
        </header>
        <AnimatePresence initial={false}>
          {kpiOpen && (
            <motion.div className="pov-body" initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32, ease: EASE }}>
              <div className="pov-kpis bov-kpis evt-kpis">
                <Kpi icon={<Inbox size={16} />} label="Pesan baru">
                  <strong className={fresh.length ? 'bov-hot' : ''}><Count value={fresh.length} /></strong>
                  <small>{all.length} pesan masuk total</small>
                </Kpi>
                <Kpi icon={<ShieldAlert size={16} />} label="Lewat target" delay={0.05}>
                  <strong className={late.length ? 'bov-no' : 'bov-ok'}><Count value={late.length} /></strong>
                  <small>{late.length ? 'Belum dibalas melewati target topik' : 'Semua masih dalam target'}</small>
                </Kpi>
                <Kpi icon={<Clock3 size={16} />} label="Rata-rata balasan" delay={0.1}>
                  <strong>{answered.length ? (avg < 24 ? `${Math.max(1, Math.round(avg))} jam` : `${(avg / 24).toFixed(1)} hari`) : '—'}</strong>
                  <small>{answered.length ? `${onTime} dari ${answered.length} tepat waktu` : 'Belum ada balasan'}</small>
                </Kpi>
                <Kpi icon={<Tag size={16} />} label="Topik terbanyak" delay={0.15}>
                  <strong className="evt-next">{top?.n ? top.label : '—'}</strong>
                  <span className="msg-topics" aria-hidden="true">
                    {byTopic.map((t) => <i key={t.label} style={{ flexGrow: t.n || 0.0001 }} title={`${t.label}: ${t.n}`} />)}
                  </span>
                  <small>{byTopic.filter((t) => t.n).map((t) => `${t.label} ${t.n}`).join(' · ') || 'Belum ada pesan'}</small>
                </Kpi>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <div className="cms-list">
        <div className="cms-toolbar">
          <div className="cms-chips" role="tablist" aria-label="Status pesan">
            <button type="button" role="tab" aria-selected={status === 'open'} onClick={() => setStatus('open')}>Perlu tindak lanjut <b>{all.filter(isOpen).length}</b></button>
            {MSG_STATUSES.map((s) => (
              <button type="button" role="tab" key={s.value} aria-selected={status === s.value} onClick={() => setStatus(s.value)}>{s.label} <b>{count(s.value)}</b></button>
            ))}
            <button type="button" role="tab" aria-selected={status === 'all'} onClick={() => setStatus('all')}>Semua <b>{all.length}</b></button>
          </div>
          <div className="cms-toolbar-right">
            <CmsSelect size="sm" prefix="Topik" aria-label="Filter topik" value={topic} onChange={setTopic} options={[{ value: 'all', label: 'Semua' }, ...topics.map((t) => ({ value: t.label, label: t.label }))]} className="msg-filter" />
            <div className="cms-search">
              <Search size={14} aria-hidden="true" />
              <input aria-label="Cari pesan" placeholder="Cari nama, email, kode…" value={q} onChange={(e) => setQ(e.target.value)} />
              {q && <button type="button" aria-label="Hapus pencarian" onClick={() => setQ('')}><X size={13} /></button>}
            </div>
            <button type="button" className="cms-btn cms-btn--ghost cms-btn--sm" onClick={() => downloadCsv(sel.length ? sel : shown)} disabled={!shown.length}>
              <Download size={14} /> CSV{sel.length ? ` (${sel.length})` : ''}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {sel.length > 0 && (
            <motion.div className="msg-bulk" role="toolbar" aria-label="Aksi untuk pesan terpilih" initial={reduce ? false : { opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2, ease: EASE }}>
              <strong>{sel.length} dipilih</strong>
              <button type="button" onClick={() => bulkStatus('replied')}><Send size={14} /> Dibalas</button>
              <button type="button" onClick={() => bulkStatus('closed')}><Archive size={14} /> Selesai</button>
              <button type="button" onClick={() => bulkStatus('spam')}><ShieldAlert size={14} /> Spam</button>
              <button type="button" className="is-danger" onClick={() => setConfirmDelete(sel)}><Trash2 size={14} /> Hapus</button>
              <button type="button" className="msg-bulk__x" aria-label="Batal pilih" onClick={() => setPicked(new Set())}><X size={14} /></button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="cms-table-wrap">
          <table className="cms-table">
            <thead>
              <tr>
                <th className="msg-col-check">
                  <input type="checkbox" className="msg-check" aria-label="Pilih semua pesan yang tampil" checked={allPicked} ref={(el) => { if (el) el.indeterminate = sel.length > 0 && !allPicked; }} onChange={() => setPicked(allPicked ? new Set() : new Set(shown.map((x) => x.id)))} />
                </th>
                <th style={{ width: 120 }}>ID pesan</th>
                <th>Pengirim & pesan</th>
                <th style={{ width: 150 }}>Topik</th>
                <th style={{ width: 130 }}>Status</th>
                <th style={{ width: 190 }}>Target balasan</th>
                <th className="cms-col-actions">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((x, i) => {
                const st = statusOf(x.status);
                const sla = slaOf(x, targetOf(x), now);
                return (
                  <motion.tr key={x.id} className={`cms-row msg-row ${x.status === 'new' ? 'is-unread' : ''} ${picked.has(x.id) ? 'is-picked' : ''}`} onClick={() => openMessage(x)} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25, delay: Math.min(i, 10) * 0.025 }}>
                    <td className="msg-col-check" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className="msg-check" aria-label={`Pilih pesan ${String(x.name)}`} checked={picked.has(x.id)} onChange={() => toggle(x.id)} />
                    </td>
                    <td className="cms-col-meta" data-label="ID pesan"><span className="msg-code">{codeOf(x)}</span></td>
                    <td className="cms-col-title">
                      <div className="msg-cell">
                        <span className="msg-av" aria-hidden="true">{initials(String(x.name))}</span>
                        <span className="msg-cell__main">
                          <strong>{String(x.name)}{x.org ? <small> · {String(x.org)}</small> : null}</strong>
                          <span className="msg-cell__text">{String(x.message)}</span>
                        </span>
                      </div>
                    </td>
                    <td className="cms-col-meta" data-label="Topik"><span className="cms-pill">{String(x.topic)}</span></td>
                    <td className="cms-col-meta" data-label="Status"><span className={`cms-badge cms-badge--${st.tone}`}>{st.label}</span></td>
                    <td className="cms-col-meta" data-label="Target balasan">
                      <span className={`msg-sla is-${sla.tone}`}>
                        <span className="msg-sla__label">{sla.label}</span>
                        <span className="msg-sla__bar" aria-hidden="true"><i style={{ transform: `scaleX(${sla.share})` }} /></span>
                        <small>{ago(String(x.createdAt), now)} · target {targetOf(x)} jam</small>
                      </span>
                    </td>
                    <td className="cms-col-actions" onClick={(e) => e.stopPropagation()}>
                      <Menu.Root modal={false}>
                        <Menu.Trigger className="cms-kebab" aria-label={`Aksi untuk pesan ${String(x.name)}`}><MoreVertical size={16} /></Menu.Trigger>
                        <Menu.Portal>
                          <Menu.Content className="cms-menu" align="end" sideOffset={6} collisionPadding={12}>
                            <Menu.Item className="cms-menu-item" onSelect={() => openMessage(x)}><Mail size={14} /> Buka & balas</Menu.Item>
                            {MSG_STATUSES.filter((s) => s.value !== x.status).map((s) => (
                              <Menu.Item key={s.value} className="cms-menu-item" onSelect={() => patchOne(x, ...statusPatch(x, s.value))}>
                                <span className={`evt-dot is-${s.tone}`} aria-hidden="true" /> Tandai {s.label.toLowerCase()}
                              </Menu.Item>
                            ))}
                            <Menu.Separator className="cms-menu-sep" />
                            <Menu.Item className="cms-menu-item is-danger" onSelect={() => setConfirmDelete([x])}><Trash2 size={14} /> Hapus</Menu.Item>
                          </Menu.Content>
                        </Menu.Portal>
                      </Menu.Root>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {!shown.length && <div className="cms-empty"><p>{status === 'open' ? 'Semua pesan sudah ditindaklanjuti.' : 'Tidak ada pesan dengan filter ini.'}</p></div>}
          {shown.length > 0 && <p className="cms-table-hint"><span>Menampilkan {shown.length} dari {all.length} pesan</span></p>}
        </div>
      </div>

      {open && (
        <MessageDialog
          key={open.id}
          item={open}
          topic={topics.find((t) => t.label === open.topic)}
          targetHours={targetOf(open)}
          now={now}
          onClose={() => setOpenId(null)}
          onPatch={(e, p) => patchOne(open, e, p)}
          onDelete={() => setConfirmDelete([open])}
        />
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        danger
        title={confirmDelete && confirmDelete.length > 1 ? `Hapus ${confirmDelete.length} pesan?` : 'Hapus pesan?'}
        confirmLabel="Hapus"
        body={confirmDelete && confirmDelete.length > 1 ? <p>{confirmDelete.length} pesan terpilih akan dihapus. Untuk pesan iklan, tandai Spam saja.</p> : <p>Pesan dari <strong>{String(confirmDelete?.[0]?.name ?? '')}</strong> akan dihapus. Untuk pesan iklan, tandai Spam saja.</p>}
        onConfirm={() => confirmDelete && remove(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
      />
    </section>
  );
}

type DialogProps = {
  item: CmsItem;
  topic?: ContactTopic;
  targetHours: number;
  now: number;
  onClose: () => void;
  onPatch: (e: Omit<MsgEvent, 'at'> | null, p: Values) => void;
  onDelete: () => void;
};

function MessageDialog({ item, topic, targetHours, now, onClose, onPatch, onDelete }: DialogProps) {
  const cms = useCms();
  const templates = (cms.collections.replyTemplates ?? [])
    .filter((t) => t.status === 'published' && (!t.topic || t.topic === item.topic))
    .sort((a, b) => Number(!!b.topic) - Number(!!a.topic) || Number(a.order) - Number(b.order));
  const first = templates[0];
  const [tplId, setTplId] = useState(first?.id ?? '');
  const [subject, setSubject] = useState(() => fillTemplate(String(first?.subject ?? 'Re: {topik} — CoPublika ({kode})'), item));
  const [body, setBody] = useState(() => fillTemplate(String(first?.body ?? 'Halo {nama},\n\n\n\nSalam,\n{tim}'), item));
  const [note, setNote] = useState(String(item.note ?? ''));
  const st = statusOf(item.status);
  const sla = slaOf(item, targetHours, now);
  const events = eventsOf(item);
  const tplTitle = String(templates.find((t) => t.id === tplId)?.title ?? 'Balasan manual');

  const pickTemplate = (id: string) => {
    const t = templates.find((x) => x.id === id);
    setTplId(id);
    if (!t) return;
    setSubject(fillTemplate(String(t.subject), item));
    setBody(fillTemplate(String(t.body), item));
  };
  const quoted = `${body}\n\n---\n${formatDate(String(item.createdAt), true)}, ${String(item.name)} menulis:\n${String(item.message)}`;
  const mailHref = `mailto:${String(item.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(quoted)}`;
  const waHref = `https://wa.me/${waNumber(item.whatsapp)}?text=${encodeURIComponent(body)}`;
  const sent = (via: string) => onPatch({ by: RESPONDER, action: 'replied', detail: `${via} · ${tplTitle}` }, { status: item.status === 'new' ? 'replied' : item.status, ...(item.repliedAt ? {} : { repliedAt: new Date().toISOString() }) });

  return (
    <Drawer
      open
      size="center"
      title={`Pesan dari ${String(item.name)}`}
      subtitle={<>{String(item.topic)} · masuk {formatDate(String(item.createdAt), true)} · {codeOf(item)}</>}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="cms-btn cms-btn--ghost is-danger" onClick={onDelete}><Trash2 size={14} /> <span className="cms-hide-sm">Hapus</span></button>
          <div className="cms-drawer-foot-right">
            {item.status !== 'spam' && <button type="button" className="cms-btn cms-btn--ghost" onClick={() => { onPatch(...statusPatch(item, 'spam')); cms.toast('Ditandai spam.'); onClose(); }}><ShieldAlert size={14} /> Spam</button>}
            {item.status !== 'closed' && <button type="button" className="cms-btn cms-btn--ghost" onClick={() => { const [e, p] = statusPatch(item, 'closed'); onPatch(e, { ...p, note }); cms.toast('Pesan ditandai selesai.'); onClose(); }}><Archive size={14} /> Tandai selesai</button>}
            <button type="button" className="cms-btn cms-btn--solid" disabled={note === String(item.note ?? '')} onClick={() => { onPatch({ by: RESPONDER, action: 'note' }, { note }); cms.toast('Catatan disimpan.'); }}>Simpan catatan</button>
          </div>
        </>
      }
    >
      <div className="msg-dlg">
        <div className="msg-dlg__main">
          <article className="msg-dlg__letter">
            <header>
              <span className="msg-av is-lg" aria-hidden="true">{initials(String(item.name))}</span>
              <div>
                <strong>{String(item.name)}</strong>
                <small>{[item.org, item.email, item.whatsapp].filter(Boolean).map(String).join(' · ')}</small>
              </div>
              <span className={`cms-badge cms-badge--${st.tone}`}>{st.label}</span>
            </header>
            <p className="msg-dlg__body">{String(item.message)}</p>
          </article>

          <section className="msg-compose" aria-label="Tulis balasan">
            <header>
              <span className="rvd-k">Balas sebagai {RESPONDER}</span>
              {templates.length > 0 && (
                <CmsSelect size="sm" prefix="Template" aria-label="Pilih template balasan" value={tplId} onChange={pickTemplate} options={templates.map((t) => ({ value: t.id, label: String(t.title), hint: t.topic ? String(t.topic) : 'Semua topik' }))} className="msg-compose__tpl" />
              )}
            </header>
            <label className="msg-compose__subject">
              <span>Subjek</span>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} />
            </label>
            <textarea aria-label="Isi balasan" rows={9} value={body} onChange={(e) => setBody(e.target.value)} />
            <footer>
              <a className="cms-btn cms-btn--solid" href={mailHref} onClick={() => sent('Email')}><Send size={14} /> Kirim lewat email</a>
              {item.whatsapp ? <a className="cms-btn cms-btn--ghost" href={waHref} target="_blank" rel="noopener noreferrer" onClick={() => sent('WhatsApp')}><MessageCircle size={14} /> WhatsApp</a> : null}
              <small className="cms-muted">Membuka aplikasi email dengan teks di atas. Status menjadi Dibalas.</small>
            </footer>
          </section>
        </div>

        <aside className="msg-dlg__side">
          <section className="rvd-card">
            <span className="rvd-k">Ditangani</span>
            <strong className="msg-team"><CopublikaMark /> {RESPONDER}</strong>
            <small className="cms-muted">Nanti dibatasi ke pengguna dengan role admin (Team Management).</small>
          </section>
          <section className="rvd-card">
            <span className="rvd-k">Target balasan</span>
            <span className={`msg-sla is-${sla.tone}`}>
              <span className="msg-sla__label">{sla.label}</span>
              <span className="msg-sla__bar" aria-hidden="true"><i style={{ transform: `scaleX(${sla.share})` }} /></span>
              <small>{targetHours} jam untuk topik {String(item.topic)}{topic?.channel ? ` · saluran terbaik ${topic.channel}` : ''}{item.repliedAt ? ` · dibalas ${formatDate(String(item.repliedAt), true)}` : ''}</small>
            </span>
          </section>
          <section className="rvd-card">
            <label className="rvd-k" htmlFor="msg-note">Catatan internal</label>
            <textarea id="msg-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Hanya terlihat oleh Tim Admin." />
          </section>
          <section className="rvd-card">
            <span className="rvd-k"><History size={13} aria-hidden="true" /> Riwayat</span>
            <ol className="msg-log">
              {[...events].reverse().map((e, i) => (
                <li key={`${e.at}-${i}`} className={`is-${e.action}`}>
                  <span className="msg-log__dot" aria-hidden="true">{e.action === 'replied' ? <Send size={10} /> : e.action === 'status' ? <Check size={10} /> : null}</span>
                  <span>
                    <strong>{EVENT_LABEL[e.action] ?? e.action}{e.detail ? ` · ${e.detail}` : ''}</strong>
                    <small>{e.by} · {formatDate(e.at, true)}</small>
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
    </Drawer>
  );
}
