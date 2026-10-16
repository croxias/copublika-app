'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import * as Menu from '@radix-ui/react-dropdown-menu';
import { Archive, ChevronDown, Clock3, Inbox, Mail, MessageCircle, MoreVertical, Search, Send, ShieldAlert, Tag, Trash2, X } from 'lucide-react';
import { useCms } from '@/lib/cms/store';
import { MSG_STATUSES, type MsgStatus } from '@/lib/cms/messages';
import type { CmsItem, Values } from '@/lib/cms/types';
import { CONTACT_COPY } from '@/lib/content/contact';
import { Count, Kpi } from './ProgramOverview';
import { ConfirmDialog, Drawer, PageHeader, StagingNote, formatDate } from './ui';

const EASE = [0.22, 1, 0.36, 1] as const;
const statusOf = (s: unknown) => MSG_STATUSES.find((x) => x.value === s) ?? MSG_STATUSES[0];
const hours = (a: string, b: string) => (new Date(b).getTime() - new Date(a).getTime()) / 3_600_000;
const initials = (n: string) => n.replace(/^(dr|prof)\.?\s+/i, '').split(/[\s,]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const waLink = (n: unknown) => `https://wa.me/${String(n ?? '').replace(/\D/g, '').replace(/^0/, '62')}`;

function ago(iso: string, now: number) {
  const h = Math.max(0, (now - new Date(iso).getTime()) / 3_600_000);
  if (h < 1) return `${Math.max(1, Math.round(h * 60))} menit lalu`;
  if (h < 24) return `${Math.round(h)} jam lalu`;
  return `${Math.round(h / 24)} hari lalu`;
}

/** Konten → Kotak Pesan: messages from the /contact form. */
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
  const [confirmDelete, setConfirmDelete] = useState<CmsItem | null>(null);
  const [kpiOpen, setKpiOpen] = useState(true);

  const isOpen = (x: CmsItem) => x.status === 'new' || x.status === 'replied';
  const shown = all
    .filter((x) => (status === 'all' ? true : status === 'open' ? isOpen(x) : x.status === status))
    .filter((x) => topic === 'all' || x.topic === topic)
    .filter((x) => !q || `${String(x.name)} ${String(x.email)} ${String(x.org)} ${String(x.message)}`.toLowerCase().includes(q.toLowerCase()));
  const fresh = all.filter((x) => x.status === 'new');
  const late = fresh.filter((x) => hours(String(x.createdAt), new Date(now).toISOString()) > 24);
  const answered = all.filter((x) => x.repliedAt);
  const avg = answered.length ? answered.reduce((n, x) => n + hours(String(x.createdAt), String(x.repliedAt)), 0) / answered.length : 0;
  const byTopic = CONTACT_COPY.topics.map((t) => ({ label: t.label, n: all.filter((x) => x.topic === t.label && x.status !== 'spam').length }));
  const top = [...byTopic].sort((a, b) => b.n - a.n)[0];
  const open = all.find((x) => x.id === openId);

  const setRow = (r: CmsItem, patch: Values) => cms.setCollection('messages', (cms.collections.messages ?? []).map((x) => (x.id === r.id ? { ...x, ...patch, updatedAt: new Date().toISOString() } : x)));
  const remove = (r: CmsItem) => {
    const before = cms.collections.messages ?? [];
    cms.removeItem('messages', r.id);
    cms.toast('Pesan dihapus.', 'ok', { label: 'Urungkan', run: () => cms.setCollection('messages', before) });
    setConfirmDelete(null);
    setOpenId(null);
  };
  const count = (s: MsgStatus) => all.filter((x) => x.status === s).length;

  return (
    <section className="cms-page">
      <PageHeader crumb={['Konten', 'Kotak Pesan']} title="Kotak" accent="Pesan" description="Pesan dari formulir /contact. Balas lewat email atau WhatsApp, lalu tandai Dibalas atau Selesai." publicHref="/contact" />
      <StagingNote />

      <section className="pov bov" aria-label="Ringkasan pesan">
        <header className="pov-head">
          <div>
            <span className="pov-k">Ringkasan pesan</span>
            <p>Target balasan: satu hari kerja. Teks halaman Kontak diatur di Konfigurasi Website Publik → Kontak.</p>
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
                <Kpi icon={<ShieldAlert size={16} />} label="Lewat 24 jam" delay={0.05}>
                  <strong className={late.length ? 'bov-no' : 'bov-ok'}><Count value={late.length} /></strong>
                  <small>{late.length ? 'Belum dibalas lebih dari sehari' : 'Semua masih dalam target'}</small>
                </Kpi>
                <Kpi icon={<Clock3 size={16} />} label="Rata-rata balasan" delay={0.1}>
                  <strong>{answered.length ? (avg < 24 ? `${Math.max(1, Math.round(avg))} jam` : `${(avg / 24).toFixed(1)} hari`) : '—'}</strong>
                  <small>dari {answered.length} pesan yang sudah dibalas</small>
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
            <div className="cms-chips msg-topic-chips" role="group" aria-label="Topik">
              <button type="button" aria-pressed={topic === 'all'} className={topic === 'all' ? 'is-on' : ''} onClick={() => setTopic('all')}>Semua topik</button>
              {CONTACT_COPY.topics.map((t) => (
                <button type="button" key={t.label} aria-pressed={topic === t.label} className={topic === t.label ? 'is-on' : ''} onClick={() => setTopic(t.label)}>{t.label}</button>
              ))}
            </div>
            <div className="cms-search">
              <Search size={14} aria-hidden="true" />
              <input aria-label="Cari pesan" placeholder="Cari nama, email, isi…" value={q} onChange={(e) => setQ(e.target.value)} />
              {q && <button type="button" aria-label="Hapus pencarian" onClick={() => setQ('')}><X size={13} /></button>}
            </div>
          </div>
        </div>
        <div className="cms-table-wrap">
          <table className="cms-table">
            <thead>
              <tr>
                <th>Pengirim & pesan</th>
                <th style={{ width: 150 }}>Topik</th>
                <th style={{ width: 130 }}>Status</th>
                <th style={{ width: 150 }}>Masuk</th>
                <th className="cms-col-actions">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((x, i) => {
                const st = statusOf(x.status);
                const overdue = x.status === 'new' && hours(String(x.createdAt), new Date(now).toISOString()) > 24;
                return (
                  <motion.tr key={x.id} className={`cms-row msg-row ${x.status === 'new' ? 'is-unread' : ''}`} onClick={() => setOpenId(x.id)} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25, delay: Math.min(i, 10) * 0.025 }}>
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
                    <td className="cms-col-meta" data-label="Masuk">
                      <span className={`msg-when ${overdue ? 'is-late' : ''}`}>{ago(String(x.createdAt), now)}<small>{formatDate(String(x.createdAt), true)}</small></span>
                    </td>
                    <td className="cms-col-actions" onClick={(e) => e.stopPropagation()}>
                      <Menu.Root modal={false}>
                        <Menu.Trigger className="cms-kebab" aria-label={`Aksi untuk pesan ${String(x.name)}`}><MoreVertical size={16} /></Menu.Trigger>
                        <Menu.Portal>
                          <Menu.Content className="cms-menu" align="end" sideOffset={6} collisionPadding={12}>
                            <Menu.Item className="cms-menu-item" onSelect={() => setOpenId(x.id)}><Mail size={14} /> Buka & balas</Menu.Item>
                            {MSG_STATUSES.filter((s) => s.value !== x.status).map((s) => (
                              <Menu.Item key={s.value} className="cms-menu-item" onSelect={() => setRow(x, { status: s.value, ...(s.value === 'replied' && !x.repliedAt ? { repliedAt: new Date().toISOString() } : {}) })}>
                                <span className={`evt-dot is-${s.tone}`} aria-hidden="true" /> Tandai {s.label.toLowerCase()}
                              </Menu.Item>
                            ))}
                            <Menu.Separator className="cms-menu-sep" />
                            <Menu.Item className="cms-menu-item is-danger" onSelect={() => setConfirmDelete(x)}><Trash2 size={14} /> Hapus</Menu.Item>
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

      {open && <MessageDialog key={open.id} item={open} onClose={() => setOpenId(null)} onPatch={(p) => setRow(open, p)} onDelete={() => setConfirmDelete(open)} />}

      <ConfirmDialog
        open={!!confirmDelete}
        danger
        title="Hapus pesan?"
        confirmLabel="Hapus"
        body={<p>Pesan dari <strong>{String(confirmDelete?.name ?? '')}</strong> akan dihapus. Untuk pesan iklan, tandai Spam saja.</p>}
        onConfirm={() => confirmDelete && remove(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
      />
    </section>
  );
}

function MessageDialog({ item, onClose, onPatch, onDelete }: { item: CmsItem; onClose: () => void; onPatch: (p: Values) => void; onDelete: () => void }) {
  const cms = useCms();
  const [note, setNote] = useState(String(item.note ?? ''));
  const topic = CONTACT_COPY.topics.find((t) => t.label === item.topic);
  const first = String(item.name).replace(/^(dr|prof)\.?\s+/i, '').split(/[\s,]+/)[0];
  const subject = encodeURIComponent(`Re: ${String(item.topic)} — CoPublika${item.code ? ` (${String(item.code)})` : ''}`);
  const body = encodeURIComponent(`Halo ${first},\n\nTerima kasih sudah menghubungi CoPublika.\n\n\n\nSalam,\n${topic?.team ?? 'Tim CoPublika'}\n\n---\n${String(item.message)}`);
  const markReplied = () => {
    if (item.status === 'new') onPatch({ status: 'replied', repliedAt: new Date().toISOString() });
  };
  const st = statusOf(item.status);

  return (
    <Drawer
      open
      size="center"
      title={`Pesan dari ${String(item.name)}`}
      subtitle={<>{String(item.topic)} · masuk {formatDate(String(item.createdAt), true)}{item.code ? ` · ${String(item.code)}` : ''}</>}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="cms-btn cms-btn--ghost is-danger" onClick={onDelete}><Trash2 size={14} /> <span className="cms-hide-sm">Hapus</span></button>
          <div className="cms-drawer-foot-right">
            {item.status !== 'spam' && <button type="button" className="cms-btn cms-btn--ghost" onClick={() => { onPatch({ status: 'spam' }); cms.toast('Ditandai spam.'); onClose(); }}><ShieldAlert size={14} /> Spam</button>}
            {item.status !== 'closed' && <button type="button" className="cms-btn cms-btn--ghost" onClick={() => { onPatch({ status: 'closed', note, ...(item.repliedAt ? {} : { repliedAt: new Date().toISOString() }) }); cms.toast('Pesan ditandai selesai.'); onClose(); }}><Archive size={14} /> Tandai selesai</button>}
            <button type="button" className="cms-btn cms-btn--solid" onClick={() => { onPatch({ note }); cms.toast('Catatan disimpan.'); }}>Simpan catatan</button>
          </div>
        </>
      }
    >
      <div className="msg-dlg">
        <article className="msg-dlg__letter">
          <header>
            <span className="msg-av is-lg" aria-hidden="true">{initials(String(item.name))}</span>
            <div>
              <strong>{String(item.name)}</strong>
              <small>{[item.org, item.email].filter(Boolean).map(String).join(' · ')}</small>
            </div>
            <span className={`cms-badge cms-badge--${st.tone}`}>{st.label}</span>
          </header>
          <p className="msg-dlg__body">{String(item.message)}</p>
        </article>
        <aside className="msg-dlg__side">
          <section className="rvd-card">
            <span className="rvd-k">Balas</span>
            <a className="cms-btn cms-btn--solid msg-reply" href={`mailto:${String(item.email)}?subject=${subject}&body=${body}`} onClick={markReplied}><Send size={14} /> Balas lewat email</a>
            {item.whatsapp ? <a className="cms-btn cms-btn--ghost msg-reply" href={waLink(item.whatsapp)} target="_blank" rel="noopener noreferrer" onClick={markReplied}><MessageCircle size={14} /> WhatsApp {String(item.whatsapp)}</a> : <small className="cms-muted">Pengirim tidak mencantumkan WhatsApp.</small>}
            <small className="cms-muted">Status otomatis menjadi Dibalas saat Anda membuka balasan.</small>
          </section>
          <section className="rvd-card">
            <span className="rvd-k">Diteruskan ke</span>
            <strong className="msg-team">{topic?.team ?? 'Tim CoPublika'}</strong>
            <small className="cms-muted">Target balasan {topic?.reply ?? '± 1 hari kerja'}{item.repliedAt ? ` · dibalas ${formatDate(String(item.repliedAt), true)}` : ''}</small>
          </section>
          <section className="rvd-card">
            <label className="rvd-k" htmlFor="msg-note">Catatan internal</label>
            <textarea id="msg-note" rows={4} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Hanya terlihat oleh admin, mis. sudah diteruskan ke siapa." />
          </section>
        </aside>
      </div>
    </Drawer>
  );
}
