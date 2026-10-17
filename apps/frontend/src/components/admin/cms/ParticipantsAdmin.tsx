'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import * as Menu from '@radix-ui/react-dropdown-menu';
import { ArrowUpRight, CalendarDays, Copy, Download, Eye, GraduationCap, Mail, MessageCircle, MoreVertical, Search, ShieldCheck, Sparkles, UserPlus, Users, Wallet, X } from 'lucide-react';
import { useCms } from '@/lib/cms/store';
import { MEMBER_LINK_LABEL, MIN_PROSPECT, buildParticipants, type Participant } from '@/lib/cms/participants';
import { fillTemplate, monthsText } from '@/lib/cms/registration-settings';
import { formatRupiah } from '@/lib/data/programs';
import { CmsSelect } from './CmsSelect';
import { KpiTile, PAGE_SIZE, Pager } from './TableKit';
import { Drawer, PageHeader, StagingNote, formatDate } from './ui';
import { useRegistrationSettings } from './useRegistrationSettings';

type Tab = 'all' | 'nonmember' | 'prospect' | 'member';
const TABS: { value: Tab; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'nonmember', label: 'Non-member' },
  { value: 'prospect', label: 'Calon member' },
  { value: 'member', label: 'Member' },
];
const initials = (n: string) => n.replace(/^(dr|prof)\.?\s+/i, '').split(/[\s,]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const firstName = (n: string) => n.replace(/^(dr|prof)\.?\s+/i, '').split(/[\s,]+/)[0] ?? n;
const waNumber = (n: string) => n.replace(/\D/g, '').replace(/^0/, '62');

/** Keanggotaan → Peserta: everyone who joined an event or program, with their history. */
export function ParticipantsAdmin() {
  const cms = useCms();
  const reduce = useReducedMotion();
  const settings = useRegistrationSettings();
  const [now] = useState(() => Date.now());
  const all = useMemo(() => buildParticipants(cms.collections, now, settings.expiringDays), [cms.collections, now, settings.expiringDays]);
  const events = useMemo(() => [...(cms.collections.events ?? [])].sort((a, b) => String(b.date).localeCompare(String(a.date))), [cms.collections.events]);
  const [tab, setTab] = useState<Tab>('all');
  const [eventId, setEventId] = useState('all');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [openEmail, setOpenEmail] = useState<string | null>(null);

  const inTab = (p: Participant, t: Tab) => (t === 'all' ? true : t === 'member' ? p.member === 'active' || p.member === 'pending' : t === 'prospect' ? p.prospect : p.member === 'none' || p.member === 'past');
  const eventTitle = eventId === 'all' ? '' : String(events.find((e) => e.id === eventId)?.title ?? '');
  const shown = all
    .filter((p) => inTab(p, tab))
    .filter((p) => !eventTitle || p.activities.some((a) => a.kind === 'event' && a.title === eventTitle))
    .filter((p) => !q || `${p.name} ${p.email} ${p.org} ${p.whatsapp}`.toLowerCase().includes(q.toLowerCase()));
  const pages = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = shown.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const resetTo = <T,>(set: (v: T) => void) => (v: T) => { set(v); setPage(1); };
  const count = (t: Tab) => all.filter((p) => inTab(p, t)).length;
  const total = Math.max(1, all.length);
  const non = count('nonmember');
  const prospects = count('prospect');
  const reachable = all.filter((p) => p.consent).length;
  const open = all.find((p) => p.email === openEmail) ?? null;

  const inviteText = (p: Participant) => fillTemplate(settings.templates.invite, {
    nama: firstName(p.name),
    kegiatan: p.activities[0]?.title ?? 'kegiatan CoPublika',
    masa_gratis: monthsText(settings.freeMonths),
    link: 'copublika.id/daftar',
  });
  const canInvite = (p: Participant) => p.consent && p.member !== 'active' && p.member !== 'pending';

  const exportCsv = () => {
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const head = ['Nama', 'Email', 'WhatsApp', 'Instansi', 'Status', 'Calon member', 'Kegiatan', 'Hadir', 'Total bayar', 'Kegiatan terakhir', 'Bersedia dihubungi'];
    const lines = shown.map((p) => [p.name, p.email, p.whatsapp, p.org, MEMBER_LINK_LABEL[p.member].label, p.prospect ? 'Ya' : '', p.joined, p.attended, p.spent, p.activities[0]?.title ?? '', p.consent ? 'Ya' : 'Tidak'].map(esc).join(','));
    const url = URL.createObjectURL(new Blob(['﻿' + [head.map(esc).join(','), ...lines].join('\r\n')], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `peserta-${new Date(now).toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="cms-page">
      <PageHeader
        crumb={['Keanggotaan', 'Data Peserta Event']}
        title="Data Peserta"
        accent="Event"
        description="Semua orang yang pernah mendaftar event, webinar, atau program, baik member maupun bukan, lengkap dengan riwayat kegiatannya."
        actions={<Link href="/admin/events" className="cms-btn cms-btn--ghost">Agenda Event <ArrowUpRight size={15} /></Link>}
      />
      <StagingNote />

      <section className="pov bov" aria-label="Ringkasan peserta">
        <header className="pov-head"><div><span className="pov-k">Ringkasan peserta</span></div></header>
        <div className="pov-kpis bov-kpis evt-kpis">
          <KpiTile icon={<Users size={17} />} label="Peserta unik" value={all.length} share={1} tone="ink" />
          <KpiTile icon={<UserPlus size={17} />} label="Non-member" value={non} share={non / total} delay={0.05} />
          <KpiTile icon={<Sparkles size={17} />} label={`Calon member (≥${MIN_PROSPECT} kegiatan)`} value={prospects} share={prospects / Math.max(1, non)} tone="ok" delay={0.1} />
          <KpiTile icon={<ShieldCheck size={17} />} label="Bersedia dihubungi" value={reachable} share={reachable / total} tone="ink" delay={0.15} />
        </div>
      </section>

      <div className="cms-list">
        <div className="cms-toolbar">
          <div className="cms-chips" role="tablist" aria-label="Kelompok peserta">
            {TABS.map((t) => (
              <button type="button" role="tab" key={t.value} aria-selected={tab === t.value} onClick={() => resetTo(setTab)(t.value)}>{t.label} <b>{count(t.value)}</b></button>
            ))}
          </div>
          <div className="cms-toolbar-right">
            <CmsSelect size="sm" prefix="Event" aria-label="Filter event" value={eventId} onChange={resetTo(setEventId)} options={[{ value: 'all', label: 'Semua kegiatan' }, ...events.map((e) => ({ value: e.id, label: String(e.title), hint: formatDate(String(e.date)) }))]} className="msg-filter prt-event" />
            <div className="cms-search">
              <Search size={14} aria-hidden="true" />
              <input aria-label="Cari peserta" placeholder="Cari nama, email, instansi…" value={q} onChange={(e) => resetTo(setQ)(e.target.value)} />
              {q && <button type="button" aria-label="Hapus pencarian" onClick={() => resetTo(setQ)('')}><X size={13} /></button>}
            </div>
            <button type="button" className="cms-btn cms-btn--ghost cms-btn--sm" onClick={exportCsv} disabled={!shown.length}><Download size={14} /> CSV</button>
          </div>
        </div>

        <div className="cms-table-wrap">
          <table className="cms-table sgn-table prt-table">
            <thead>
              <tr>
                <th>Peserta</th>
                <th>Instansi</th>
                <th style={{ width: 132 }}>Status</th>
                <th>Kegiatan terakhir</th>
                <th style={{ width: 96 }}>Kegiatan</th>
                <th style={{ width: 110 }}>Total bayar</th>
                <th className="cms-col-actions">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p, i) => {
                const ml = MEMBER_LINK_LABEL[p.member];
                return (
                  <motion.tr key={p.email} className="cms-row msg-row" onClick={() => setOpenEmail(p.email)} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25, delay: Math.min(i, 10) * 0.025 }}>
                    <td className="cms-col-title">
                      <div className="msg-cell sgn-cell">
                        <span className="msg-av" aria-hidden="true">{initials(p.name)}</span>
                        <span className="sgn-who"><strong>{p.name}</strong><small title={p.email}>{p.email}</small></span>
                      </div>
                    </td>
                    <td className="cms-col-meta" data-label="Instansi"><span className="sgn-text">{p.org || <span className="cms-muted">—</span>}</span></td>
                    <td className="cms-col-meta" data-label="Status">
                      <span className="prt-status">
                        <span className={`cms-badge cms-badge--${ml.tone}`}>{ml.label}</span>
                        {p.prospect && <span className="prt-prospect"><Sparkles size={11} aria-hidden="true" /> Calon member</span>}
                      </span>
                    </td>
                    <td className="cms-col-meta" data-label="Kegiatan terakhir">
                      <span className="prt-last"><b>{p.activities[0]?.title ?? '—'}</b><small>{p.last ? formatDate(p.last) : ''} · {p.activities[0]?.status ?? ''}</small></span>
                    </td>
                    <td className="cms-col-meta" data-label="Kegiatan"><span className="prt-count"><b>{p.joined}</b>{p.attended ? <small>{p.attended} hadir</small> : null}</span></td>
                    <td className="cms-col-meta" data-label="Total bayar"><span className="sgn-price">{p.spent ? formatRupiah(p.spent) : <span className="cms-muted">—</span>}</span></td>
                    <td className="cms-col-actions" onClick={(e) => e.stopPropagation()}>
                      <Menu.Root modal={false}>
                        <Menu.Trigger className="cms-kebab" aria-label={`Aksi untuk ${p.name}`}><MoreVertical size={16} /></Menu.Trigger>
                        <Menu.Portal>
                          <Menu.Content className="cms-menu" align="end" sideOffset={6} collisionPadding={12}>
                            <Menu.Item className="cms-menu-item" onSelect={() => setOpenEmail(p.email)}><Eye size={14} /> Lihat riwayat</Menu.Item>
                            <Menu.Item className="cms-menu-item mcd-menu" disabled={!canInvite(p) || !p.whatsapp} asChild={canInvite(p) && !!p.whatsapp}>
                              {canInvite(p) && p.whatsapp ? (
                                <a href={`https://wa.me/${waNumber(p.whatsapp)}?text=${encodeURIComponent(inviteText(p))}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={14} /> <span>Ajak jadi member</span></a>
                              ) : (
                                <><MessageCircle size={14} /> <span>Ajak jadi member<small>{p.member === 'active' || p.member === 'pending' ? 'Sudah member.' : !p.consent ? 'Belum bersedia dihubungi.' : 'Tidak ada nomor WhatsApp.'}</small></span></>
                              )}
                            </Menu.Item>
                            <Menu.Item className="cms-menu-item" onSelect={() => navigator.clipboard?.writeText(p.email).then(() => cms.toast('Email disalin.')).catch(() => {})}><Copy size={14} /> Salin email</Menu.Item>
                          </Menu.Content>
                        </Menu.Portal>
                      </Menu.Root>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {!shown.length && <div className="cms-empty"><p>{all.length ? 'Tidak ada peserta yang cocok dengan filter.' : 'Belum ada peserta. Pendaftaran event dan program akan muncul di sini.'}</p></div>}
          {shown.length > 0 && (
            <div className="cms-table-hint">
              <span>Menampilkan {(current - 1) * PAGE_SIZE + 1}–{Math.min(current * PAGE_SIZE, shown.length)} dari {shown.length} peserta</span>
              <Pager page={current} pages={pages} onPage={setPage} />
            </div>
          )}
        </div>
      </div>

      {open && <ParticipantDialog p={open} inviteText={inviteText(open)} canInvite={canInvite(open)} onClose={() => setOpenEmail(null)} />}
    </section>
  );
}

function ParticipantDialog({ p, inviteText, canInvite, onClose }: { p: Participant; inviteText: string; canInvite: boolean; onClose: () => void }) {
  const reduce = useReducedMotion();
  const ml = MEMBER_LINK_LABEL[p.member];
  const isMember = p.member === 'active' || p.member === 'pending';
  return (
    <Drawer
      open
      size="center"
      title={p.name}
      subtitle={`${ml.label} · ${p.joined} kegiatan`}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="cms-btn cms-btn--ghost" onClick={onClose}>Tutup</button>
          <div className="cms-drawer-foot-right">
            {isMember ? (
              <Link href="/admin/members" className="cms-btn cms-btn--solid"><GraduationCap size={15} /> Lihat di Anggota</Link>
            ) : (
              <>
                <a className={`cms-btn cms-btn--ghost ${canInvite ? '' : 'is-disabled'}`} aria-disabled={!canInvite} href={canInvite ? `mailto:${p.email}?subject=${encodeURIComponent('Gabung member CoPublika')}&body=${encodeURIComponent(inviteText)}` : undefined}><Mail size={15} /> Email ajakan</a>
                <a className={`cms-btn cms-btn--solid ${canInvite && p.whatsapp ? '' : 'is-disabled'}`} aria-disabled={!canInvite || !p.whatsapp} href={canInvite && p.whatsapp ? `https://wa.me/${waNumber(p.whatsapp)}?text=${encodeURIComponent(inviteText)}` : undefined} target="_blank" rel="noopener noreferrer"><MessageCircle size={15} /> Ajak via WhatsApp</a>
              </>
            )}
          </div>
        </>
      }
    >
      <div className="prt-dlg">
        <div className="prt-dlg__main">
          <article className="rvd-card prt-profile">
            <header>
              <span className="msg-av is-lg" aria-hidden="true">{initials(p.name)}</span>
              <div><b>{p.name}</b><small>{p.org || 'Instansi belum diisi'}</small></div>
              <span className={`cms-badge cms-badge--${ml.tone}`}>{ml.label}</span>
            </header>
            <dl className="sgn-facts">
              <div><dt>Email</dt><dd>{p.email}</dd></div>
              <div><dt>WhatsApp</dt><dd>{p.whatsapp || '—'}</dd></div>
              <div><dt>Bersedia dihubungi</dt><dd>{p.consent ? <span className="prt-yes"><ShieldCheck size={14} aria-hidden="true" /> Ya</span> : 'Belum'}</dd></div>
              {p.memberCode && <div><dt>ID member</dt><dd className="is-mono">{p.memberCode}</dd></div>}
            </dl>
          </article>

          <section className="rvd-card prt-timeline">
            <span className="rvd-k"><CalendarDays size={13} aria-hidden="true" /> Riwayat kegiatan</span>
            <ol>
              {p.activities.map((a, i) => (
                <motion.li key={a.id} initial={reduce ? false : { opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: i * 0.04 }}>
                  <i className={`is-${a.kind}`} aria-hidden="true" />
                  <div>
                    <b>{a.title}</b>
                    <small>{a.kind === 'program' ? 'Program' : 'Event'} · {a.date ? formatDate(a.date) : '—'}</small>
                  </div>
                  <span className="prt-timeline__right">
                    <span className={`cms-badge cms-badge--${a.tone}`}>{a.status}</span>
                    {a.amount > 0 && <small>{formatRupiah(a.amount)}{a.paid ? '' : ' · belum lunas'}</small>}
                  </span>
                </motion.li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="prt-dlg__side">
          <div className="prt-stats">
            <div><CalendarDays size={16} aria-hidden="true" /><b>{p.joined}</b><small>kegiatan</small></div>
            <div><ShieldCheck size={16} aria-hidden="true" /><b>{p.attended}</b><small>hadir</small></div>
            <div><Wallet size={16} aria-hidden="true" /><b>{p.spent ? formatRupiah(p.spent) : '—'}</b><small>total bayar</small></div>
          </div>
          {!isMember && (
            <section className={`rvd-card prt-invite ${p.prospect ? 'is-hot' : ''}`}>
              <span className="rvd-k"><Sparkles size={13} aria-hidden="true" /> {p.prospect ? 'Calon member' : 'Ajak jadi member'}</span>
              <p>{p.prospect ? `Sudah ikut ${p.joined} kegiatan. Tawarkan keanggotaan gratis agar ia mendapat harga member dan info program lebih dulu.` : 'Belum menjadi member CoPublika.'}</p>
              {canInvite ? <blockquote>{inviteText}</blockquote> : <p className="prt-invite__lock">Tombol ajakan aktif setelah peserta mencentang “bersedia menerima info kegiatan” saat mendaftar.</p>}
              <Link href="/admin/registration-settings" className="prt-invite__edit">Ubah teks ajakan di Pengaturan Membership</Link>
            </section>
          )}
        </aside>
      </div>
    </Drawer>
  );
}
