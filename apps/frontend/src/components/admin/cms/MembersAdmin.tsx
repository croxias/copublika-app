'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import * as Menu from '@radix-ui/react-dropdown-menu';
import { ArrowUpRight, BadgeCheck, UserRoundPlus, CalendarClock, Check, ChevronDown, Clock3, Copy, Download, ExternalLink, History, IdCard, Mail, MailCheck, MessageCircle, MoreVertical, Power, RefreshCw, Search, Trash2, UserRoundCheck, UserRoundX, X } from 'lucide-react';
import { useCms } from '@/lib/cms/store';
import { RESPONDER } from '@/lib/cms/messages';
import { EXPIRING_DAYS, SOURCE_LABEL, addMonths, memberEvents, memberState, withMemberEvent, type MemberEvent, type MemberSource, type MemberState } from '@/lib/cms/members';
import { ID_TYPES, ROLE_LABEL, withSignupEvent } from '@/lib/cms/signups';
import type { CmsItem, Values } from '@/lib/cms/types';
import { disciplineLabel, streamLabel } from '@/lib/data/disciplines';
import { DisciplineEditor, STREAM_FILTER, StreamBadge, matchStream } from './Discipline';
import { CmsSelect } from './CmsSelect';
import { MemberCreateDialog } from './MemberCreateDialog';
import { MemberCardDialog } from './MemberCardDialog';
import { cardEligibility, cardNumber, nextCardNo } from '@/lib/member-card';
import { KpiTile, PAGE_SIZE, Pager } from './TableKit';
import { ConfirmDialog, Drawer, PageHeader, StagingNote, formatDate } from './ui';

const EASE = [0.22, 1, 0.36, 1] as const;
const initials = (n: string) => n.replace(/^(dr|prof)\.?\s+/i, '').split(/[\s,]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const waNumber = (n: unknown) => String(n ?? '').replace(/\D/g, '').replace(/^0/, '62');
const firstName = (n: string) => n.replace(/^(dr|prof)\.?\s+/i, '').split(/[\s,]+/)[0] ?? n;

const EVENT_LABEL: Record<MemberEvent['action'], string> = {
  joined: 'Tercatat sebagai member',
  activated: 'Diaktifkan',
  extended: 'Diperpanjang',
  deactivated: 'Dinonaktifkan',
  reactivated: 'Diaktifkan kembali',
  reminded: 'Pengingat dikirim',
  note: 'Catatan diperbarui',
  field: 'Bidang ilmu diubah',
  card: 'Kartu member',
};

type Tab = MemberState | 'current' | 'all';
const TABS: { value: Tab; label: string }[] = [
  { value: 'current', label: 'Aktif' },
  { value: 'scheduled', label: 'Terjadwal' },
  { value: 'pending', label: 'Menunggu aktivasi' },
  { value: 'expiring', label: 'Akan habis' },
  { value: 'expired', label: 'Kedaluwarsa' },
  { value: 'inactive', label: 'Nonaktif' },
  { value: 'all', label: 'Semua' },
];

function downloadCsv(rows: CmsItem[], now: number) {
  const head = ['ID member', 'Nama', 'Profesi', 'Rumpun', 'Bidang ilmu', 'Instansi', 'Identitas', 'Email', 'WhatsApp', 'Keanggotaan', 'Status', 'Aktif sejak', 'Berlaku s.d.'];
  const cell = (v: unknown) => `"${String(v ?? '').replaceAll('"', '""')}"`;
  const lines = rows.map((m) => [m.code, m.name, ROLE_LABEL[String(m.role)] ?? '', streamLabel(m.stream), String(m.field ?? ''), m.institution, m.idNumber, m.email, m.whatsapp, SOURCE_LABEL[m.source as MemberSource] ?? '', memberState(m, now).label, m.activatedAt, m.expiresAt].map(cell).join(','));
  const blob = new Blob(['﻿' + [head.join(','), ...lines].join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `anggota-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

/** Keanggotaan → Anggota: every member, their active period, activation and renewals. */
export function MembersAdmin() {
  const cms = useCms();
  const reduce = useReducedMotion();
  const [now] = useState(() => Date.now());
  const all = [...(cms.collections.members ?? [])].sort((a, b) => String(b.joinedAt).localeCompare(String(a.joinedAt)));
  const [tab, setTab] = useState<Tab>('current');
  const [role, setRole] = useState('all');
  const [stream, setStream] = useState('all');
  const [source, setSource] = useState('all');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<CmsItem | null>(null);
  const [kpiOpen, setKpiOpen] = useState(true);
  const [creating, setCreating] = useState(false);
  const [cardId, setCardId] = useState<string | null>(null);

  const stateOf = (m: CmsItem) => memberState(m, now).state;
  const shown = all
    .filter((m) => {
      const s = stateOf(m);
      return tab === 'all' ? true : tab === 'current' ? s === 'active' || s === 'expiring' : s === tab;
    })
    .filter((m) => role === 'all' || m.role === role)
    .filter((m) => matchStream(m.stream, stream))
    .filter((m) => source === 'all' || m.source === source)
    .filter((m) => !q || `${String(m.name)} ${String(m.email)} ${String(m.institution)} ${String(m.code)} ${String(m.idNumber)} ${String(m.field ?? '')}`.toLowerCase().includes(q.toLowerCase()));
  const pages = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = shown.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const resetTo = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setPage(1);
  };

  const by = (s: MemberState) => all.filter((m) => stateOf(m) === s).length;
  const active = by('active') + by('expiring');
  const total = Math.max(1, all.length);
  const count = (t: Tab) => (t === 'all' ? all.length : t === 'current' ? active : by(t));
  const open = all.find((m) => m.id === openId);

  const patchOne = (m: CmsItem, e: Omit<MemberEvent, 'at'> | null, patch: Values) =>
    cms.setCollection('members', (cms.collections.members ?? []).map((x) => (x.id === m.id ? (e ? withMemberEvent(x, e, patch) : { ...x, ...patch, updatedAt: new Date().toISOString() }) : x)));

  /** Activation (what the emailed link will do): starts the active period and closes the registration. */
  const activate = (m: CmsItem) => {
    const at = new Date().toISOString();
    patchOne(m, { by: RESPONDER, action: 'activated', detail: `${Number(m.months) || 1} bulan` }, { status: 'active', activatedAt: at, expiresAt: addMonths(at, Number(m.months) || 1) });
    if (m.signupId) {
      cms.setCollection('signups', (cms.collections.signups ?? []).map((s) => (s.id === m.signupId ? withSignupEvent(s, { by: RESPONDER, action: 'activated', detail: 'Diaktifkan dari halaman Anggota' }, { status: 'activated' }) : s)));
    }
    cms.toast('Member aktif. Pendaftarannya keluar dari daftar Pendaftaran.');
  };
  const extend = (m: CmsItem, ref: string) => {
    const base = m.expiresAt && new Date(String(m.expiresAt)).getTime() > Date.now() ? String(m.expiresAt) : new Date().toISOString();
    patchOne(m, { by: RESPONDER, action: 'extended', detail: ref ? `12 bulan · ${ref}` : '12 bulan' }, { status: 'active', activatedAt: m.activatedAt || new Date().toISOString(), expiresAt: addMonths(base, 12), source: m.source === 'gratis' ? 'tahunan' : m.source });
    cms.toast('Masa aktif diperpanjang 12 bulan.');
  };
  /** Opens the ID card; the first time an eligible member's card is opened it gets the next number. */
  const openCard = (m: CmsItem) => {
    if (!cardEligibility(m, now).ok) return;
    if (!m.cardNo) {
      const n = nextCardNo(all);
      patchOne(m, { by: RESPONDER, action: 'card', detail: `Diterbitkan · ${cardNumber(n)}` }, { cardNo: n, cardIssuedAt: new Date().toISOString() });
    }
    setOpenId(null);
    setCardId(m.id);
  };
  const setInactive = (m: CmsItem, off: boolean) => {
    patchOne(m, { by: RESPONDER, action: off ? 'deactivated' : 'reactivated' }, { status: off ? 'inactive' : m.activatedAt ? 'active' : 'pending' });
    cms.toast(off ? 'Member dinonaktifkan.' : 'Member diaktifkan kembali.');
  };
  const remove = (m: CmsItem) => {
    const before = cms.collections.members ?? [];
    cms.setCollection('members', before.filter((x) => x.id !== m.id));
    cms.toast('Data member dihapus.', 'ok', { label: 'Urungkan', run: () => cms.setCollection('members', before) });
    setConfirmDelete(null);
    setOpenId(null);
  };

  return (
    <section className="cms-page">
      <PageHeader
        crumb={['Keanggotaan', 'Anggota']}
        title="Anggota"
        accent="Member CoPublika"
        description="Member tercatat otomatis dari Pendaftaran, atau ditambahkan langsung oleh admin. Aktifkan, perpanjang, atau nonaktifkan keanggotaan dari sini."
        actions={
          <>
            <Link href="/admin/applicants" className="cms-btn cms-btn--ghost">Pendaftaran <ArrowUpRight size={15} /></Link>
            <button type="button" className="cms-btn cms-btn--solid" onClick={() => setCreating(true)}><UserRoundPlus size={15} /> Tambah member</button>
          </>
        }
      />
      <StagingNote />

      <section className="pov bov" aria-label="Ringkasan anggota">
        <header className="pov-head">
          <div><span className="pov-k">Ringkasan anggota</span></div>
          <button type="button" className="cms-btn cms-btn--ghost cms-btn--sm" aria-expanded={kpiOpen} onClick={() => setKpiOpen((o) => !o)}>
            {kpiOpen ? 'Sembunyikan' : 'Tampilkan'} <ChevronDown size={14} className={`pov-caret ${kpiOpen ? 'is-open' : ''}`} />
          </button>
        </header>
        <AnimatePresence initial={false}>
          {kpiOpen && (
            <motion.div className="pov-body" initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32, ease: EASE }}>
              <div className="pov-kpis bov-kpis evt-kpis">
                <KpiTile icon={<UserRoundCheck size={17} />} label="Member aktif" value={active} share={active / total} tone="ok" />
                <KpiTile icon={<MailCheck size={17} />} label="Menunggu aktivasi" value={by('pending')} share={by('pending') / total} delay={0.05} />
                <KpiTile icon={<CalendarClock size={17} />} label={`Habis ≤ ${EXPIRING_DAYS} hari`} value={by('expiring')} share={by('expiring') / Math.max(1, active)} tone="danger" delay={0.1} />
                <KpiTile icon={<UserRoundX size={17} />} label="Kedaluwarsa" value={by('expired')} share={by('expired') / total} tone="ink" delay={0.15} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <div className="cms-list">
        <div className="cms-toolbar">
          <div className="cms-chips" role="tablist" aria-label="Status anggota">
            {TABS.map((t) => (
              <button type="button" role="tab" key={t.value} aria-selected={tab === t.value} onClick={() => resetTo(setTab)(t.value)}>{t.label} <b>{count(t.value)}</b></button>
            ))}
          </div>
          <div className="cms-toolbar-right">
            <CmsSelect size="sm" prefix="Profesi" aria-label="Filter profesi" value={role} onChange={resetTo(setRole)} options={[{ value: 'all', label: 'Semua' }, ...Object.entries(ROLE_LABEL).map(([value, label]) => ({ value, label }))]} className="msg-filter" />
            <CmsSelect size="sm" prefix="Rumpun" aria-label="Filter rumpun ilmu" value={stream} onChange={resetTo(setStream)} options={STREAM_FILTER} className="msg-filter" />
            <CmsSelect size="sm" prefix="Sumber" aria-label="Filter sumber keanggotaan" value={source} onChange={resetTo(setSource)} options={[{ value: 'all', label: 'Semua' }, ...Object.entries(SOURCE_LABEL).map(([value, label]) => ({ value, label }))]} className="msg-filter" />
            <div className="cms-search">
              <Search size={14} aria-hidden="true" />
              <input aria-label="Cari anggota" placeholder="Cari nama, email, NIK, bidang…" value={q} onChange={(e) => resetTo(setQ)(e.target.value)} />
              {q && <button type="button" aria-label="Hapus pencarian" onClick={() => resetTo(setQ)('')}><X size={13} /></button>}
            </div>
            <button type="button" className="cms-btn cms-btn--ghost cms-btn--sm" onClick={() => downloadCsv(shown, now)} disabled={!shown.length}><Download size={14} /> CSV</button>
          </div>
        </div>

        <div className="cms-table-wrap">
          <table className="cms-table sgn-table">
            <thead>
              <tr>
                <th style={{ width: 100 }}>ID</th>
                <th>Member</th>
                <th>Instansi</th>
                <th style={{ width: 112 }}>Profesi</th>
                <th style={{ width: 96 }}>Rumpun</th>
                <th>Bidang ilmu</th>
                <th style={{ width: 140 }}>Keanggotaan</th>
                <th style={{ width: 132 }}>Status</th>
                <th style={{ width: 140 }}>Masa aktif</th>
                <th className="cms-col-actions">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m, i) => {
                const s = memberState(m, now);
                return (
                  <motion.tr key={m.id} className={`cms-row msg-row ${s.state === 'pending' ? 'is-unread' : ''}`} onClick={() => setOpenId(m.id)} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25, delay: Math.min(i, 10) * 0.025 }}>
                    <td className="cms-col-meta" data-label="ID"><span className="msg-code">{String(m.code)}</span></td>
                    <td className="cms-col-title">
                      <div className="msg-cell sgn-cell">
                        <span className="msg-av" aria-hidden="true">{initials(String(m.name))}</span>
                        <span className="sgn-who"><strong>{String(m.name)}</strong><small title={String(m.email)}>{String(m.email)}</small></span>
                      </div>
                    </td>
                    <td className="cms-col-meta" data-label="Instansi"><span className="sgn-text">{m.institution ? String(m.institution) : <span className="cms-muted">—</span>}</span></td>
                    <td className="cms-col-meta" data-label="Profesi">{ROLE_LABEL[String(m.role)] ?? <span className="cms-muted">—</span>}</td>
                    <td className="cms-col-meta" data-label="Rumpun"><StreamBadge stream={m.stream} /></td>
                    <td className="cms-col-meta" data-label="Bidang ilmu"><span className="sgn-text">{String(m.field ?? '').trim() || <span className="cms-muted">—</span>}</span></td>
                    <td className="cms-col-meta" data-label="Keanggotaan"><span className={`sgn-kind is-${m.source === 'gratis' ? 'free' : 'paid'}`}>{SOURCE_LABEL[m.source as MemberSource] ?? '—'}</span></td>
                    <td className="cms-col-meta" data-label="Status"><span className={`cms-badge cms-badge--${s.tone}`}>{s.label}</span></td>
                    <td className="cms-col-meta" data-label="Masa aktif">
                      {s.state === 'scheduled' ? (
                        <span className="msg-sla is-info">
                          <span className="msg-sla__label">Mulai {s.startsIn} hari lagi</span>
                          <small>mulai {formatDate(String(m.activatedAt))}</small>
                        </span>
                      ) : m.expiresAt && s.state !== 'inactive' ? (
                        <span className={`msg-sla is-${s.state === 'expired' ? 'late' : s.state === 'expiring' ? 'soon' : 'ok'}`}>
                          <span className="msg-sla__label">{s.state === 'expired' ? 'Habis' : `${s.daysLeft} hari lagi`}</span>
                          <span className="msg-sla__bar" aria-hidden="true"><i style={{ transform: `scaleX(${s.share})` }} /></span>
                          <small>s.d. {formatDate(String(m.expiresAt))}</small>
                        </span>
                      ) : (
                        <span className="cms-muted">—</span>
                      )}
                    </td>
                    <td className="cms-col-actions" onClick={(e) => e.stopPropagation()}>
                      <Menu.Root modal={false}>
                        <Menu.Trigger className="cms-kebab" aria-label={`Aksi untuk ${String(m.name)}`}><MoreVertical size={16} /></Menu.Trigger>
                        <Menu.Portal>
                          <Menu.Content className="cms-menu" align="end" sideOffset={6} collisionPadding={12}>
                            <Menu.Item className="cms-menu-item" onSelect={() => setOpenId(m.id)}><BadgeCheck size={14} /> Buka detail</Menu.Item>
                            {(() => {
                              const c = cardEligibility(m, now);
                              return (
                                <Menu.Item className="cms-menu-item mcd-menu" disabled={!c.ok} onSelect={() => openCard(m)}>
                                  <IdCard size={14} />
                                  <span>ID Card Detail{!c.ok && <small>{c.reason}</small>}</span>
                                </Menu.Item>
                              );
                            })()}
                            {s.state === 'pending' && <Menu.Item className="cms-menu-item" onSelect={() => activate(m)}><Power size={14} /> Aktifkan</Menu.Item>}
                            {s.state === 'scheduled' && <Menu.Item className="cms-menu-item" onSelect={() => activate(m)}><Power size={14} /> Aktifkan sekarang</Menu.Item>}
                            {(s.state === 'active' || s.state === 'expiring' || s.state === 'expired') && <Menu.Item className="cms-menu-item" onSelect={() => extend(m, '')}><RefreshCw size={14} /> Perpanjang 12 bulan</Menu.Item>}
                            {s.state !== 'inactive' ? (
                              <Menu.Item className="cms-menu-item" onSelect={() => setInactive(m, true)}><UserRoundX size={14} /> Nonaktifkan</Menu.Item>
                            ) : (
                              <Menu.Item className="cms-menu-item" onSelect={() => setInactive(m, false)}><UserRoundCheck size={14} /> Aktifkan kembali</Menu.Item>
                            )}
                            <Menu.Separator className="cms-menu-sep" />
                            <Menu.Item className="cms-menu-item is-danger" onSelect={() => setConfirmDelete(m)}><Trash2 size={14} /> Hapus</Menu.Item>
                          </Menu.Content>
                        </Menu.Portal>
                      </Menu.Root>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {!shown.length && <div className="cms-empty"><p>Tidak ada anggota dengan filter ini.</p></div>}
          {shown.length > 0 && (
            <div className="cms-table-hint">
              <span>Menampilkan {(current - 1) * PAGE_SIZE + 1}–{Math.min(current * PAGE_SIZE, shown.length)} dari {shown.length} anggota</span>
              <Pager page={current} pages={pages} onPage={setPage} />
            </div>
          )}
        </div>
      </div>

      {open && (
        <MemberDialog
          key={open.id}
          item={open}
          now={now}
          onClose={() => setOpenId(null)}
          onPatch={(e, p) => patchOne(open, e, p)}
          onActivate={() => activate(open)}
          onExtend={(ref) => extend(open, ref)}
          onInactive={(off) => setInactive(open, off)}
          onDelete={() => setConfirmDelete(open)}
          onCard={() => openCard(open)}
        />
      )}

      {cardId && all.find((m) => m.id === cardId) && (
        <MemberCardDialog
          item={all.find((m) => m.id === cardId)!}
          now={now}
          onClose={() => setCardId(null)}
          onDownloaded={(which) => { const m = all.find((x) => x.id === cardId); if (m) patchOne(m, { by: RESPONDER, action: 'card', detail: `Diunduh · ${which}` }, {}); }}
        />
      )}

      {creating && (
        <MemberCreateDialog
          members={all}
          onClose={() => setCreating(false)}
          onCreate={(m) => {
            cms.setCollection('members', [m, ...(cms.collections.members ?? [])]);
            cms.toast(memberState(m, Date.now()).state === 'scheduled' ? `${String(m.name)} terdaftar, aktif mulai ${formatDate(String(m.activatedAt))}.` : `${String(m.name)} terdaftar dan langsung aktif.`);
            setCreating(false);
            setTab('current');
            setPage(1);
          }}
        />
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        danger
        title="Hapus data member?"
        confirmLabel="Hapus"
        body={<p>Data <strong>{String(confirmDelete?.name ?? '')}</strong> akan dihapus dari direktori. Untuk menghentikan akses, gunakan <strong>Nonaktifkan</strong> agar riwayatnya tetap tersimpan.</p>}
        onConfirm={() => confirmDelete && remove(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
      />
    </section>
  );
}

type DialogProps = {
  item: CmsItem;
  now: number;
  onClose: () => void;
  onPatch: (e: Omit<MemberEvent, 'at'> | null, p: Values) => void;
  onCard: () => void;
  onActivate: () => void;
  onExtend: (ref: string) => void;
  onInactive: (off: boolean) => void;
  onDelete: () => void;
};

function MemberDialog({ item, now, onClose, onPatch, onActivate, onExtend, onInactive, onDelete, onCard }: DialogProps) {
  const cms = useCms();
  const s = memberState(item, now);
  const idRule = ID_TYPES[String(item.role)];
  const [note, setNote] = useState(String(item.note ?? ''));
  const [ref, setRef] = useState('');
  const events = memberEvents(item);
  const copy = (text: string, label: string) => navigator.clipboard?.writeText(text).then(() => cms.toast(`${label} disalin.`)).catch(() => {});
  const remind = `https://wa.me/${waNumber(item.whatsapp)}?text=${encodeURIComponent(`Halo ${firstName(String(item.name))}, keanggotaan CoPublika Anda ${s.state === 'expired' ? 'sudah habis' : `berakhir ${item.expiresAt ? formatDate(String(item.expiresAt)) : ''}`}. Perpanjang Rp. 75.000 untuk satu tahun di copublika.id/daftar. — ${RESPONDER}`)}`;
  const resend = `mailto:${String(item.email)}?subject=${encodeURIComponent('Link aktivasi akun CoPublika')}&body=${encodeURIComponent(`Halo ${firstName(String(item.name))},\n\nPendaftaran Anda sudah disetujui. Aktifkan akun lewat link yang kami kirim sebelumnya, atau balas email ini bila link tidak ditemukan.\n\nSalam,\n${RESPONDER}`)}`;

  return (
    <Drawer
      open
      size="center"
      title={String(item.name)}
      subtitle={<>{SOURCE_LABEL[item.source as MemberSource] ?? 'Member'} · {String(item.code)}{item.signupCode ? ` · dari ${String(item.signupCode)}` : ''}</>}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="cms-btn cms-btn--ghost is-danger" onClick={onDelete}><Trash2 size={14} /> <span className="cms-hide-sm">Hapus</span></button>
          <div className="cms-drawer-foot-right">
            {cardEligibility(item, now).ok && <button type="button" className="cms-btn cms-btn--ghost" onClick={onCard}><IdCard size={14} /> ID Card</button>}
            {s.state !== 'inactive' ? (
              <button type="button" className="cms-btn cms-btn--ghost" onClick={() => { onInactive(true); onClose(); }}><UserRoundX size={14} /> Nonaktifkan</button>
            ) : (
              <button type="button" className="cms-btn cms-btn--ghost" onClick={() => { onInactive(false); onClose(); }}><UserRoundCheck size={14} /> Aktifkan kembali</button>
            )}
            <button type="button" className="cms-btn cms-btn--solid" disabled={note === String(item.note ?? '')} onClick={() => { onPatch({ by: RESPONDER, action: 'note' }, { note }); cms.toast('Catatan disimpan.'); }}>Simpan catatan</button>
          </div>
        </>
      }
    >
      <div className="msg-dlg">
        <div className="msg-dlg__main">
          <article className="msg-dlg__letter sgn-profile">
            <header>
              <span className="msg-av is-lg" aria-hidden="true">{initials(String(item.name))}</span>
              <div>
                <strong>{String(item.name)}</strong>
                <small>{[ROLE_LABEL[String(item.role)], item.institution].filter(Boolean).map(String).join(' · ') || 'Member'}</small>
              </div>
              <span className={`cms-badge cms-badge--${s.tone}`}>{s.label}</span>
            </header>
            <dl className="sgn-facts">
              <div><dt>Keanggotaan</dt><dd><span className={`sgn-kind is-${item.source === 'gratis' ? 'free' : 'paid'}`}>{SOURCE_LABEL[item.source as MemberSource] ?? '—'}</span></dd></div>
              {item.role ? (
                <div>
                  <dt>{idRule?.label ?? 'Identitas'}</dt>
                  <dd className="sgn-id"><code>{String(item.idNumber || '—')}</code>{item.idNumber ? <button type="button" className="sgn-copy" onClick={() => copy(String(item.idNumber), idRule?.label ?? 'Nomor')} aria-label="Salin nomor identitas"><Copy size={13} /></button> : null}</dd>
                </div>
              ) : null}
              <div><dt>Email</dt><dd className="sgn-id"><span>{String(item.email)}</span><button type="button" className="sgn-copy" onClick={() => copy(String(item.email), 'Email')} aria-label="Salin email"><Copy size={13} /></button></dd></div>
              <div><dt>Bidang ilmu</dt><dd><DisciplineEditor key={item.id} stream={item.stream} field={item.field} onSave={(stream, field) => { onPatch({ by: RESPONDER, action: 'field', detail: disciplineLabel(stream, field) }, { stream, field }); cms.toast('Bidang ilmu diperbarui.'); }} /></dd></div>
              <div><dt>WhatsApp</dt><dd>{String(item.whatsapp || '—')}</dd></div>
              <div><dt>Google Scholar</dt><dd>{item.scholar ? <a className="sgn-link" href={`https://scholar.google.com/citations?user=${encodeURIComponent(String(item.scholar))}`} target="_blank" rel="noopener noreferrer">{String(item.scholar)} <ExternalLink size={12} /></a> : '—'}</dd></div>
              <div><dt>Tercatat</dt><dd>{formatDate(String(item.joinedAt), true)}</dd></div>
              <div><dt>Aktif sejak</dt><dd>{item.activatedAt ? formatDate(String(item.activatedAt), true) : '—'}</dd></div>
              <div><dt>Berlaku s.d.</dt><dd>{item.expiresAt ? formatDate(String(item.expiresAt)) : '—'}</dd></div>
            </dl>
          </article>

          {s.state === 'pending' && (
            <section className="msg-compose" aria-label="Aktivasi">
              <header><span className="rvd-k"><MailCheck size={13} aria-hidden="true" /> Menunggu aktivasi</span></header>
              <p className="cms-muted sgn-note">Member mengaktifkan akun lewat link di email. Admin juga bisa mengaktifkannya langsung; masa aktif {Number(item.months) || 1} bulan dimulai saat itu.</p>
              <footer className="sgn-actions">
                <button type="button" className="cms-btn cms-btn--solid" onClick={() => { onActivate(); onClose(); }}><Power size={15} /> Aktifkan sekarang</button>
                <a className="cms-btn cms-btn--ghost" href={resend}><Mail size={15} /> Kirim ulang link aktivasi</a>
              </footer>
            </section>
          )}

          {s.state === 'scheduled' && (
            <section className="msg-compose" aria-label="Terjadwal">
              <header>
                <span className="rvd-k"><CalendarClock size={13} aria-hidden="true" /> Terjadwal</span>
                <span className="sgn-due">Mulai {s.startsIn} hari lagi</span>
              </header>
              <p className="cms-muted sgn-note">Masa aktif {Number(item.months) || 1} bulan dimulai {formatDate(String(item.activatedAt))} dan berlaku sampai {formatDate(String(item.expiresAt))}. Sampai tanggal itu member belum dihitung aktif. Aktifkan sekarang bila member perlu akses lebih awal; masa aktifnya dihitung ulang dari hari ini.</p>
              <footer className="sgn-actions">
                <button type="button" className="cms-btn cms-btn--solid" onClick={() => { onActivate(); onClose(); }}><Power size={15} /> Aktifkan sekarang</button>
              </footer>
            </section>
          )}

          {(s.state === 'active' || s.state === 'expiring' || s.state === 'expired') && (
            <section className="msg-compose" aria-label="Masa aktif">
              <header>
                <span className="rvd-k"><CalendarClock size={13} aria-hidden="true" /> Masa aktif</span>
                <span className={`sgn-due ${s.state === 'expired' ? 'is-late' : ''}`}>{s.state === 'expired' ? 'Sudah habis' : `${s.daysLeft} hari lagi`}</span>
              </header>
              <span className={`msg-sla is-${s.state === 'expired' ? 'late' : s.state === 'expiring' ? 'soon' : 'ok'}`}>
                <span className="msg-sla__bar" aria-hidden="true"><i style={{ transform: `scaleX(${s.share})` }} /></span>
              </span>
              <div className="sgn-pay">
                <label><span>Perpanjang 12 bulan</span><input value="Rp. 75.000 · transfer manual" readOnly /></label>
                <label><span>Referensi (opsional)</span><input value={ref} onChange={(e) => setRef(e.target.value)} placeholder="BCA · a.n. pengirim" /></label>
              </div>
              <footer className="sgn-actions">
                <button type="button" className="cms-btn cms-btn--solid" onClick={() => { onExtend(ref.trim()); onClose(); }}><RefreshCw size={15} /> Perpanjang 12 bulan</button>
                <a className="cms-btn cms-btn--ghost" href={remind} target="_blank" rel="noopener noreferrer" onClick={() => onPatch({ by: RESPONDER, action: 'reminded', detail: 'WhatsApp' }, {})}><MessageCircle size={15} /> Kirim pengingat</a>
              </footer>
            </section>
          )}
        </div>

        <aside className="msg-dlg__side">
          <section className="rvd-card">
            <label className="rvd-k" htmlFor="mbr-note">Catatan internal</label>
            <textarea id="mbr-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Hanya terlihat oleh Tim Admin." />
          </section>
          <section className="rvd-card">
            <span className="rvd-k"><History size={13} aria-hidden="true" /> Riwayat</span>
            <ol className="msg-log">
              {[...events].reverse().map((e, i) => (
                <li key={`${e.at}-${i}`} className={`is-${e.action === 'activated' || e.action === 'extended' || e.action === 'reactivated' ? 'replied' : e.action === 'deactivated' ? 'status' : 'created'}`}>
                  <span className="msg-log__dot" aria-hidden="true">{e.action === 'activated' || e.action === 'extended' ? <Check size={10} /> : e.action === 'reminded' ? <Clock3 size={9} /> : null}</span>
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

