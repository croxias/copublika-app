'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import * as Menu from '@radix-ui/react-dropdown-menu';
import { ArrowUpRight, Ban, Check, CheckCircle2, ChevronDown, CircleAlert, Clock3, Copy, Download, ExternalLink, HelpCircle, History, Inbox, Mail, MailCheck, MessageCircle, MoreVertical, RotateCcw, Search, ShieldCheck, Trash2, Wallet, X, XCircle } from 'lucide-react';
import { useCms } from '@/lib/cms/store';
import { RESPONDER } from '@/lib/cms/messages';
import { addMonths, memberFromSignup, withMemberEvent } from '@/lib/cms/members';
import {
  ID_TYPES,
  OPEN_STATUSES,
  REVIEW_HOURS,
  ROLE_LABEL,
  SIGNUP_KINDS,
  autoChecks,
  inQueue,
  kindOf,
  normalizeSignup,
  signupEvents,
  signupStatusOf,
  withSignupEvent,
  type SignupEvent,
  type SignupKind,
  type SignupStatus,
} from '@/lib/cms/signups';
import type { CmsItem, Values } from '@/lib/cms/types';
import { formatRupiah } from '@/lib/data/programs';
import { CmsSelect } from './CmsSelect';
import { KpiTile, PAGE_SIZE, Pager } from './TableKit';
import { ConfirmDialog, Drawer, PageHeader, StagingNote, formatDate } from './ui';

const EASE = [0.22, 1, 0.36, 1] as const;
const H = 3_600_000;
const initials = (n: string) => n.replace(/^(dr|prof)\.?\s+/i, '').split(/[\s,]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const waNumber = (n: unknown) => String(n ?? '').replace(/\D/g, '').replace(/^0/, '62');
const firstName = (n: string) => n.replace(/^(dr|prof)\.?\s+/i, '').split(/[\s,]+/)[0] ?? n;

function ago(iso: string, now: number) {
  const h = Math.max(0, (now - new Date(iso).getTime()) / H);
  if (h < 1) return `${Math.max(1, Math.round(h * 60))} menit lalu`;
  if (h < 24) return `${Math.round(h)} jam lalu`;
  return `${Math.round(h / 24)} hari lalu`;
}

/** Against the 1×24 jam review target, or how long it has waited for payment or activation. */
function timing(s: CmsItem, now: number): { tone: 'ok' | 'soon' | 'late' | 'done'; label: string; share: number; bar: boolean } {
  const age = (now - new Date(String(s.createdAt)).getTime()) / H;
  if (s.status === 'new') {
    const left = REVIEW_HOURS - age;
    const share = Math.min(1, Math.max(0, age / REVIEW_HOURS));
    if (left <= 0) return { tone: 'late', label: `Lewat ${Math.max(1, Math.round(-left))} jam`, share: 1, bar: true };
    return { tone: share >= 0.6 ? 'soon' : 'ok', label: `${Math.max(1, Math.round(left))} jam lagi`, share, bar: true };
  }
  if (s.status === 'awaiting_payment' || s.status === 'approved') {
    const since = (now - new Date(String(s.updatedAt)).getTime()) / H;
    return { tone: 'soon', label: since < 24 ? `Menunggu ${Math.max(1, Math.round(since))} jam` : `Menunggu ${Math.round(since / 24)} hari`, share: Math.min(1, since / 72), bar: true };
  }
  return { tone: 'done', label: signupStatusOf(s.status).label, share: 1, bar: false };
}

const EVENT_LABEL: Record<SignupEvent['action'], string> = {
  created: 'Pendaftaran masuk',
  opened: 'Dibuka',
  approved: 'Disetujui',
  rejected: 'Ditolak',
  paid: 'Pembayaran dikonfirmasi',
  activated: 'Member aktif',
  cancelled: 'Dibatalkan',
  note: 'Catatan diperbarui',
  reopened: 'Dibuka kembali',
};

const REJECT_REASONS = ['Data identitas tidak valid', 'Afiliasi tidak dapat diverifikasi', 'Pendaftaran ganda', 'Tidak sesuai kategori yang dipilih'];

function downloadCsv(rows: CmsItem[]) {
  const head = ['ID', 'Masuk', 'Jenis', 'Nama', 'Kategori', 'Instansi', 'Identitas', 'Email', 'WhatsApp', 'Google Scholar', 'Harga', 'Status', 'Ref. pembayaran'];
  const cell = (v: unknown) => `"${String(v ?? '').replaceAll('"', '""')}"`;
  const lines = rows.map((x) => [x.code, x.createdAt, kindOf(x.kind).label, x.name, ROLE_LABEL[String(x.role)] ?? '', x.institution, x.idNumber, x.email, x.whatsapp, x.scholar, x.total, signupStatusOf(x.status).label, x.paymentRef].map(cell).join(','));
  const blob = new Blob(['﻿' + [head.join(','), ...lines].join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `pendaftaran-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

type Tab = SignupStatus | 'open' | 'all';
const TABS: { value: Tab; label: string }[] = [
  { value: 'open', label: 'Perlu tindakan' },
  { value: 'new', label: 'Baru' },
  { value: 'awaiting_payment', label: 'Menunggu bayar' },
  { value: 'approved', label: 'Menunggu aktivasi' },
  { value: 'rejected', label: 'Ditolak' },
  { value: 'cancelled', label: 'Dibatalkan' },
  { value: 'all', label: 'Semua' },
];

/** Keanggotaan → Pendaftaran: registrations from /daftar, reviewed or confirmed by the admin team. */
export function SignupsAdmin() {
  const cms = useCms();
  const reduce = useReducedMotion();
  const [now] = useState(() => Date.now());
  const all = (cms.collections.signups ?? []).map(normalizeSignup).filter(inQueue).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  const [tab, setTab] = useState<Tab>('open');
  const [kind, setKind] = useState('all');
  const [role, setRole] = useState('all');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<CmsItem | null>(null);
  const [kpiOpen, setKpiOpen] = useState(true);

  const shown = all
    .filter((x) => (tab === 'all' ? true : tab === 'open' ? OPEN_STATUSES.includes(x.status as SignupStatus) : x.status === tab))
    .filter((x) => kind === 'all' || x.kind === kind)
    .filter((x) => role === 'all' || x.role === role)
    .filter((x) => !q || `${String(x.name)} ${String(x.email)} ${String(x.institution)} ${String(x.code)} ${String(x.idNumber)}`.toLowerCase().includes(q.toLowerCase()));
  const pages = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = shown.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const resetTo = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setPage(1);
  };

  const fresh = all.filter((x) => x.status === 'new');
  const late = fresh.filter((x) => timing(x, now).tone === 'late');
  const waiting = all.filter((x) => x.status === 'awaiting_payment');
  const pending = all.filter((x) => x.status === 'approved');
  const total = Math.max(1, all.length);
  const open = all.find((x) => x.id === openId);
  const count = (t: Tab) => (t === 'all' ? all.length : t === 'open' ? all.filter((x) => OPEN_STATUSES.includes(x.status as SignupStatus)).length : all.filter((x) => x.status === t).length);

  const patchOne = (r: CmsItem, e: Omit<SignupEvent, 'at'> | null, patch: Values) =>
    cms.setCollection('signups', (cms.collections.signups ?? []).map((x) => (x.id === r.id ? (e ? withSignupEvent(x, e, patch) : { ...x, ...patch, updatedAt: new Date().toISOString() }) : x)));
  const openRow = (x: CmsItem) => {
    if (signupEvents(x).at(-1)?.action !== 'opened') patchOne(x, { by: RESPONDER, action: 'opened' }, {});
    setOpenId(x.id);
  };

  /** Approving a free registration records a member waiting for activation. */
  const approve = (s: CmsItem, note?: string) => {
    patchOne(s, { by: RESPONDER, action: 'approved', detail: 'Link aktivasi dikirim ke email' }, { status: 'approved', ...(note === undefined ? {} : { note }) });
    const members = cms.collections.members ?? [];
    if (!members.some((m) => m.signupId === s.id)) cms.setCollection('members', [memberFromSignup(s, false, RESPONDER), ...members]);
    cms.toast('Disetujui dan tercatat di Anggota sebagai menunggu aktivasi.');
  };

  /** Payment confirmed: the member is active at once (a yearly activation extends an existing one). */
  const markPaid = (s: CmsItem, ref: string, date: string, note: string) => {
    patchOne(s, { by: RESPONDER, action: 'paid', detail: ref }, { status: 'activated', paidAt: new Date(date).toISOString(), paymentRef: ref, note });
    const members = cms.collections.members ?? [];
    const existing = members.find((m) => String(m.email).toLowerCase() === String(s.email).toLowerCase() && m.status !== 'inactive');
    if (existing) {
      const base = existing.expiresAt && new Date(String(existing.expiresAt)).getTime() > Date.now() ? String(existing.expiresAt) : new Date().toISOString();
      const next = withMemberEvent(existing, { by: RESPONDER, action: 'extended', detail: `${kindOf(s.kind).label} · 12 bulan` }, { status: 'active', activatedAt: existing.activatedAt || new Date().toISOString(), expiresAt: addMonths(base, 12), source: s.kind === 'tahunan' ? 'tahunan' : 'program' });
      cms.setCollection('members', members.map((m) => (m.id === existing.id ? next : m)));
    } else {
      cms.setCollection('members', [memberFromSignup(s, true, RESPONDER), ...members]);
    }
    cms.toast('Lunas. Member aktif 12 bulan dan tercatat di Anggota.');
  };

  const remove = (r: CmsItem) => {
    const before = cms.collections.signups ?? [];
    cms.setCollection('signups', before.filter((x) => x.id !== r.id));
    cms.toast('Pendaftaran dihapus.', 'ok', { label: 'Urungkan', run: () => cms.setCollection('signups', before) });
    setConfirmDelete(null);
    setOpenId(null);
  };

  return (
    <section className="cms-page">
      <PageHeader
        crumb={['Keanggotaan', 'Pendaftaran']}
        title="Pendaftaran"
        accent="Member & Program"
        description="Registrasi member gratis ditinjau Tim Admin dalam 1×24 jam. Aktivasi dan program langsung aktif setelah pembayaran lunas."
        publicHref="/daftar"
        actions={<Link href="/admin/members" className="cms-btn cms-btn--ghost">Anggota <ArrowUpRight size={15} /></Link>}
      />
      <StagingNote />

      <section className="pov bov" aria-label="Ringkasan pendaftaran">
        <header className="pov-head">
          <div>
            <span className="pov-k">Ringkasan pendaftaran</span>
          </div>
          <button type="button" className="cms-btn cms-btn--ghost cms-btn--sm" aria-expanded={kpiOpen} onClick={() => setKpiOpen((o) => !o)}>
            {kpiOpen ? 'Sembunyikan' : 'Tampilkan'} <ChevronDown size={14} className={`pov-caret ${kpiOpen ? 'is-open' : ''}`} />
          </button>
        </header>
        <AnimatePresence initial={false}>
          {kpiOpen && (
            <motion.div className="pov-body" initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32, ease: EASE }}>
              <div className="pov-kpis bov-kpis evt-kpis">
                <KpiTile icon={<Inbox size={17} />} label="Menunggu tinjauan" value={fresh.length} share={fresh.length / total} />
                <KpiTile icon={<CircleAlert size={17} />} label="Lewat 1×24 jam" value={late.length} share={late.length / Math.max(1, fresh.length)} tone="danger" delay={0.05} />
                <KpiTile icon={<Wallet size={17} />} label="Menunggu pembayaran" value={waiting.length} share={waiting.length / total} tone="ink" delay={0.1} />
                <KpiTile icon={<MailCheck size={17} />} label="Menunggu aktivasi" value={pending.length} share={pending.length / total} tone="ok" delay={0.15} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <div className="cms-list">
        <div className="cms-toolbar">
          <div className="cms-chips" role="tablist" aria-label="Status pendaftaran">
            {TABS.map((t) => (
              <button type="button" role="tab" key={t.value} aria-selected={tab === t.value} onClick={() => resetTo(setTab)(t.value)}>{t.label} <b>{count(t.value)}</b></button>
            ))}
          </div>
          <div className="cms-toolbar-right">
            <CmsSelect size="sm" prefix="Jenis" aria-label="Filter jenis" value={kind} onChange={resetTo(setKind)} options={[{ value: 'all', label: 'Semua' }, ...SIGNUP_KINDS.map((k) => ({ value: k.value, label: k.label }))]} className="msg-filter" />
            <CmsSelect size="sm" prefix="Kategori" aria-label="Filter kategori" value={role} onChange={resetTo(setRole)} options={[{ value: 'all', label: 'Semua' }, ...Object.entries(ROLE_LABEL).map(([value, label]) => ({ value, label }))]} className="msg-filter" />
            <div className="cms-search">
              <Search size={14} aria-hidden="true" />
              <input aria-label="Cari pendaftaran" placeholder="Cari nama, email, ID, NIK…" value={q} onChange={(e) => resetTo(setQ)(e.target.value)} />
              {q && <button type="button" aria-label="Hapus pencarian" onClick={() => resetTo(setQ)('')}><X size={13} /></button>}
            </div>
            <button type="button" className="cms-btn cms-btn--ghost cms-btn--sm" onClick={() => downloadCsv(shown)} disabled={!shown.length}>
              <Download size={14} /> CSV
            </button>
          </div>
        </div>

        <div className="cms-table-wrap">
          <table className="cms-table sgn-table">
            <thead>
              <tr>
                <th style={{ width: 112 }}>ID</th>
                <th>Pendaftar</th>
                <th>Instansi</th>
                <th>Email</th>
                <th style={{ width: 112 }}>Jenis</th>
                <th style={{ width: 104 }}>Harga</th>
                <th style={{ width: 124 }}>Kategori</th>
                <th style={{ width: 132 }}>Status</th>
                <th style={{ width: 126 }}>Waktu</th>
                <th className="cms-col-actions">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((x, i) => {
                const st = signupStatusOf(x.status);
                const k = kindOf(x.kind);
                const t = timing(x, now);
                return (
                  <motion.tr key={x.id} className={`cms-row msg-row ${x.status === 'new' ? 'is-unread' : ''}`} onClick={() => openRow(x)} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25, delay: Math.min(i, 10) * 0.025 }}>
                    <td className="cms-col-meta" data-label="ID"><span className="msg-code">{String(x.code)}</span></td>
                    <td className="cms-col-title">
                      <div className="msg-cell sgn-cell">
                        <span className="msg-av" aria-hidden="true">{initials(String(x.name))}</span>
                        <strong>{String(x.name)}</strong>
                      </div>
                    </td>
                    <td className="cms-col-meta" data-label="Instansi"><span className="sgn-text">{x.institution ? String(x.institution) : <span className="cms-muted">—</span>}</span></td>
                    <td className="cms-col-meta" data-label="Email"><span className="sgn-email" title={String(x.email)}>{String(x.email).split('@')[0]}<wbr />@{String(x.email).split('@')[1] ?? ''}</span></td>
                    <td className="cms-col-meta" data-label="Jenis"><span className={`sgn-kind is-${k.paid ? 'paid' : 'free'}`}>{k.short}</span></td>
                    <td className="cms-col-meta" data-label="Harga"><span className={`sgn-price ${k.paid ? '' : 'is-free'}`}>{Number(x.total || 0) ? formatRupiah(Number(x.total)) : 'Gratis'}</span></td>
                    <td className="cms-col-meta" data-label="Kategori">{ROLE_LABEL[String(x.role)] ?? <span className="cms-muted">—</span>}</td>
                    <td className="cms-col-meta" data-label="Status"><span className={`cms-badge cms-badge--${st.tone}`}>{st.label}</span></td>
                    <td className="cms-col-meta" data-label="Waktu">
                      <span className={`msg-sla is-${t.tone}`}>
                        <span className="msg-sla__label">{t.label}</span>
                        {t.bar && <span className="msg-sla__bar" aria-hidden="true"><i style={{ transform: `scaleX(${t.share})` }} /></span>}
                        <small>{ago(String(x.createdAt), now)}</small>
                      </span>
                    </td>
                    <td className="cms-col-actions" onClick={(e) => e.stopPropagation()}>
                      <Menu.Root modal={false}>
                        <Menu.Trigger className="cms-kebab" aria-label={`Aksi untuk ${String(x.name)}`}><MoreVertical size={16} /></Menu.Trigger>
                        <Menu.Portal>
                          <Menu.Content className="cms-menu" align="end" sideOffset={6} collisionPadding={12}>
                            <Menu.Item className="cms-menu-item" onSelect={() => openRow(x)}><ShieldCheck size={14} /> Buka & tinjau</Menu.Item>
                            {x.status === 'new' && <Menu.Item className="cms-menu-item" onSelect={() => approve(x)}><CheckCircle2 size={14} /> Setujui</Menu.Item>}
                            {x.status === 'awaiting_payment' && <Menu.Item className="cms-menu-item" onSelect={() => openRow(x)}><Wallet size={14} /> Konfirmasi pembayaran</Menu.Item>}
                            <Menu.Item className="cms-menu-item" onSelect={() => navigator.clipboard?.writeText(String(x.email)).then(() => cms.toast('Email disalin.')).catch(() => {})}><Copy size={14} /> Salin email</Menu.Item>
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
          {!shown.length && <div className="cms-empty"><p>{tab === 'open' ? 'Tidak ada pendaftaran yang perlu ditindaklanjuti.' : 'Tidak ada pendaftaran dengan filter ini.'}</p></div>}
          {shown.length > 0 && (
            <div className="cms-table-hint">
              <span>Menampilkan {(current - 1) * PAGE_SIZE + 1}–{Math.min(current * PAGE_SIZE, shown.length)} dari {shown.length} pendaftaran</span>
              <Pager page={current} pages={pages} onPage={setPage} />
            </div>
          )}
        </div>
      </div>

      {open && (
        <SignupDialog
          key={open.id}
          item={open}
          all={all}
          now={now}
          onClose={() => setOpenId(null)}
          onPatch={(e, p) => patchOne(open, e, p)}
          onApprove={(note) => { approve(open, note); setOpenId(null); }}
          onPaid={(ref, date, note) => { markPaid(open, ref, date, note); setOpenId(null); }}
          onDelete={() => setConfirmDelete(open)}
        />
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        danger
        title="Hapus pendaftaran?"
        confirmLabel="Hapus"
        body={<p>Pendaftaran <strong>{String(confirmDelete?.name ?? '')}</strong> akan dihapus. Untuk pendaftaran yang tidak memenuhi syarat, gunakan <strong>Tolak</strong> agar riwayatnya tetap tersimpan.</p>}
        onConfirm={() => confirmDelete && remove(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
      />
    </section>
  );
}

type DialogProps = {
  item: CmsItem;
  all: CmsItem[];
  now: number;
  onClose: () => void;
  onPatch: (e: Omit<SignupEvent, 'at'> | null, p: Values) => void;
  onApprove: (note: string) => void;
  onPaid: (ref: string, date: string, note: string) => void;
  onDelete: () => void;
};

function SignupDialog({ item, all, now, onClose, onPatch, onApprove, onPaid, onDelete }: DialogProps) {
  const cms = useCms();
  const k = kindOf(item.kind as SignupKind);
  const st = signupStatusOf(item.status);
  const t = timing(item, now);
  const checks = autoChecks(item, all);
  const idRule = ID_TYPES[String(item.role)];
  const [note, setNote] = useState(String(item.note ?? ''));
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState(REJECT_REASONS[0]);
  const [payRef, setPayRef] = useState('');
  const [payDate, setPayDate] = useState(() => new Date(now).toISOString().slice(0, 10));
  const [manual, setManual] = useState<Record<string, boolean>>({});
  const events = signupEvents(item);
  const reviewable = item.status === 'new' && !k.paid;
  const payable = item.status === 'awaiting_payment';
  const closed = item.status === 'rejected' || item.status === 'cancelled';

  const mail = (subject: string, body: string) => `mailto:${String(item.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const copy = (text: string, label: string) => navigator.clipboard?.writeText(text).then(() => cms.toast(`${label} disalin.`)).catch(() => {});

  const reject = () => {
    onPatch({ by: RESPONDER, action: 'rejected', detail: reason }, { status: 'rejected', reason, note });
    cms.toast('Pendaftaran ditolak.');
    onClose();
  };
  const paid = () => {
    if (!payRef.trim()) {
      cms.toast('Isi referensi transfer dulu, mis. bank dan nama pengirim.', 'error');
      return;
    }
    onPaid(payRef.trim(), payDate, note);
  };

  return (
    <Drawer
      open
      size="center"
      title={String(item.name)}
      subtitle={<>{k.label} · masuk {formatDate(String(item.createdAt), true)} · {String(item.code)}</>}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="cms-btn cms-btn--ghost is-danger" onClick={onDelete}><Trash2 size={14} /> <span className="cms-hide-sm">Hapus</span></button>
          <div className="cms-drawer-foot-right">
            {closed && <button type="button" className="cms-btn cms-btn--ghost" onClick={() => { onPatch({ by: RESPONDER, action: 'reopened' }, { status: k.paid ? 'awaiting_payment' : 'new' }); cms.toast('Pendaftaran dibuka kembali.'); }}><RotateCcw size={14} /> Buka kembali</button>}
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
                <small>{[ROLE_LABEL[String(item.role)], item.institution].filter(Boolean).map(String).join(' · ') || 'Member terdaftar'}</small>
              </div>
              <span className={`cms-badge cms-badge--${st.tone}`}>{st.label}</span>
            </header>
            <dl className="sgn-facts">
              <div><dt>Jenis</dt><dd><span className={`sgn-kind is-${k.paid ? 'paid' : 'free'}`}>{k.label}</span></dd></div>
              <div><dt>Detail</dt><dd>{String(item.detail ?? '—')}</dd></div>
              {item.role ? (
                <div>
                  <dt>{idRule?.label ?? 'Identitas'}</dt>
                  <dd className="sgn-id">
                    <code>{String(item.idNumber || '—')}</code>
                    {item.idNumber ? <button type="button" className="sgn-copy" onClick={() => copy(String(item.idNumber), idRule?.label ?? 'Nomor')} aria-label="Salin nomor identitas"><Copy size={13} /></button> : null}
                  </dd>
                </div>
              ) : null}
              <div><dt>Email</dt><dd className="sgn-id"><span>{String(item.email)}</span><button type="button" className="sgn-copy" onClick={() => copy(String(item.email), 'Email')} aria-label="Salin email"><Copy size={13} /></button></dd></div>
              <div><dt>WhatsApp</dt><dd>{String(item.whatsapp || '—')}</dd></div>
              <div><dt>Alamat</dt><dd>{String(item.address || '—')}</dd></div>
              <div>
                <dt>Google Scholar</dt>
                <dd>{item.scholar ? <a className="sgn-link" href={`https://scholar.google.com/citations?user=${encodeURIComponent(String(item.scholar))}`} target="_blank" rel="noopener noreferrer">{String(item.scholar)} <ExternalLink size={12} /></a> : '—'}</dd>
              </div>
              <div><dt>Harga</dt><dd className="sgn-total">{Number(item.total || 0) ? formatRupiah(Number(item.total)) : 'Gratis'}</dd></div>
              {item.reason ? <div><dt>Alasan ditolak</dt><dd>{String(item.reason)}</dd></div> : null}
            </dl>
          </article>

          {reviewable && (
            <section className="msg-compose" aria-label="Tinjau pendaftaran">
              <header><span className="rvd-k"><ShieldCheck size={13} aria-hidden="true" /> Tinjau registrasi</span></header>
              <ul className="sgn-checks">
                {checks.map((c) => (
                  <li key={c.key} className={c.ok === true ? 'is-ok' : c.ok === false ? 'is-no' : 'is-na'}>
                    <span aria-hidden="true">{c.ok === true ? <Check size={12} strokeWidth={3} /> : c.ok === false ? <X size={12} strokeWidth={3} /> : <HelpCircle size={12} />}</span>
                    <b>{c.label}</b>
                    <small>{c.detail}</small>
                  </li>
                ))}
                {['Profil Scholar sesuai nama', 'Afiliasi dapat diverifikasi'].map((m) => (
                  <li key={m} className={manual[m] ? 'is-ok' : 'is-na'}>
                    <label className="sgn-manual">
                      <input type="checkbox" checked={!!manual[m]} onChange={(e) => setManual((s) => ({ ...s, [m]: e.target.checked }))} />
                      <span aria-hidden="true">{manual[m] ? <Check size={12} strokeWidth={3} /> : null}</span>
                      <b>{m}</b>
                      <small>Dicek manual oleh admin</small>
                    </label>
                  </li>
                ))}
              </ul>

              {rejecting ? (
                <div className="sgn-panel">
                  <CmsSelect aria-label="Alasan penolakan" value={reason} onChange={setReason} options={REJECT_REASONS.map((r) => ({ value: r, label: r }))} />
                  <div className="sgn-panel__row">
                    <button type="button" className="cms-btn cms-btn--ghost" onClick={() => setRejecting(false)}>Batal</button>
                    <a className="cms-btn cms-btn--ghost" href={mail('Pendaftaran member CoPublika', `Halo ${firstName(String(item.name))},\n\nTerima kasih sudah mendaftar. Mohon maaf, pendaftaran Anda belum dapat kami setujui: ${reason}.\n\nSalam,\n${RESPONDER}`)}><Mail size={14} /> Email</a>
                    <button type="button" className="cms-btn cms-btn--solid is-danger-solid" onClick={reject}><XCircle size={14} /> Tolak pendaftaran</button>
                  </div>
                </div>
              ) : (
                <footer className="sgn-actions">
                  <button type="button" className="cms-btn cms-btn--solid" onClick={() => onApprove(note)}><CheckCircle2 size={15} /> Setujui & kirim link aktivasi</button>
                  <button type="button" className="cms-btn cms-btn--ghost is-danger" onClick={() => setRejecting(true)}><Ban size={15} /> Tolak</button>
                </footer>
              )}
            </section>
          )}

          {item.status === 'approved' && (
            <section className="msg-compose sgn-wait" aria-label="Menunggu aktivasi">
              <header><span className="rvd-k"><MailCheck size={13} aria-hidden="true" /> Menunggu aktivasi</span></header>
              <p className="cms-muted sgn-note">Link aktivasi sudah dikirim ke {String(item.email)}. Pendaftaran ini hilang dari daftar begitu member membuka link, atau saat admin mengaktifkannya di halaman Anggota.</p>
              <footer className="sgn-actions">
                <Link href="/admin/members" className="cms-btn cms-btn--solid"><ArrowUpRight size={15} /> Buka di Anggota</Link>
              </footer>
            </section>
          )}

          {payable && (
            <section className="msg-compose" aria-label="Konfirmasi pembayaran">
              <header><span className="rvd-k"><Wallet size={13} aria-hidden="true" /> Konfirmasi transfer manual</span><span className="sgn-due">{formatRupiah(Number(item.total || 0))}</span></header>
              <p className="cms-muted sgn-note">Cocokkan mutasi rekening dengan nama dan nominal di atas. Setelah lunas, member langsung aktif 12 bulan dan tercatat di Anggota.</p>
              <div className="sgn-pay">
                <label><span>Tanggal transfer</span><input type="date" value={payDate} onChange={(e) => setPayDate(e.target.value)} /></label>
                <label><span>Referensi</span><input value={payRef} onChange={(e) => setPayRef(e.target.value)} placeholder="BCA · a.n. pengirim · 4 digit akhir" /></label>
              </div>
              <footer className="sgn-actions">
                <button type="button" className="cms-btn cms-btn--solid" onClick={paid}><Wallet size={15} /> Tandai lunas & aktifkan</button>
                <a className="cms-btn cms-btn--ghost" href={`https://wa.me/${waNumber(item.whatsapp)}?text=${encodeURIComponent(`Halo ${firstName(String(item.name))}, pendaftaran ${String(item.code)} (${k.label}) menunggu pembayaran ${formatRupiah(Number(item.total || 0))}. Silakan transfer dan kirim bukti ke nomor ini. — ${RESPONDER}`)}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={15} /> Ingatkan via WhatsApp</a>
                <button type="button" className="cms-btn cms-btn--ghost is-danger" onClick={() => { onPatch({ by: RESPONDER, action: 'cancelled' }, { status: 'cancelled', note }); cms.toast('Pendaftaran dibatalkan.'); onClose(); }}><Ban size={15} /> Batalkan</button>
              </footer>
            </section>
          )}
        </div>

        <aside className="msg-dlg__side">
          <section className="rvd-card">
            <span className="rvd-k">{reviewable ? 'Target tinjauan' : 'Status'}</span>
            <span className={`msg-sla is-${t.tone}`}>
              <span className="msg-sla__label">{t.label}</span>
              {t.bar && <span className="msg-sla__bar" aria-hidden="true"><i style={{ transform: `scaleX(${t.share})` }} /></span>}
              <small>{reviewable ? `Target ${REVIEW_HOURS} jam sejak masuk` : st.hint}</small>
            </span>
          </section>
          <section className="rvd-card">
            <label className="rvd-k" htmlFor="sgn-note">Catatan internal</label>
            <textarea id="sgn-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Hanya terlihat oleh Tim Admin." />
          </section>
          <section className="rvd-card">
            <span className="rvd-k"><History size={13} aria-hidden="true" /> Riwayat</span>
            <ol className="msg-log">
              {[...events].reverse().map((e, i) => (
                <li key={`${e.at}-${i}`} className={`is-${e.action === 'approved' || e.action === 'paid' || e.action === 'activated' ? 'replied' : e.action === 'rejected' || e.action === 'cancelled' ? 'status' : e.action}`}>
                  <span className="msg-log__dot" aria-hidden="true">{e.action === 'approved' || e.action === 'paid' || e.action === 'activated' ? <Check size={10} /> : e.action === 'rejected' ? <X size={10} /> : e.action === 'opened' ? <Clock3 size={9} /> : null}</span>
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
