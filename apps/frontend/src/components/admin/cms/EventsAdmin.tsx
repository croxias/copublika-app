'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import * as Menu from '@radix-ui/react-dropdown-menu';
import * as Popover from '@radix-ui/react-popover';
import { BadgeCheck, CalendarClock, Check, ChevronLeft, UserPlus, UserRound, CalendarDays, ChevronDown, CircleAlert, Copy, Download, Eye, MapPin, MessageCircle, MessageSquareText, MoreVertical, RotateCcw, Search, Ticket, Trash2, Users, Wallet, X } from 'lucide-react';
import { useCms } from '@/lib/cms/store';
import { EVENT_TYPES, FORMATS, eventPhase, seatsTaken, speakerName } from '@/lib/cms/config/events';
import { HOLDS_SEAT, PAY_STATES, REG_STATUSES, amountOf, payState, ticketCode, type PayState, type RegStatus } from '@/lib/cms/registrations';
import { memberState } from '@/lib/cms/members';
import { accountText, fillTemplate, primaryAccount } from '@/lib/cms/registration-settings';
import { RESPONDER } from '@/lib/cms/messages';
import { DateField } from './DateField';
import { useRegistrationSettings } from './useRegistrationSettings';
import type { CmsItem, FieldContext, Values } from '@/lib/cms/types';
import { formatRupiah } from '@/lib/data/programs';
import { CmsSelect } from './CmsSelect';
import { Count, Kpi } from './ProgramOverview';
import { Pager } from './TableKit';
import { ConfirmDialog, Drawer, formatDate } from './ui';

const EASE = [0.22, 1, 0.36, 1] as const;
/** "17 Okt 2026 - 14.30 WIB", always in Jakarta time. */
const WIB = new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
function wibStamp(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const part = Object.fromEntries(WIB.formatToParts(d).map((x) => [x.type, x.value]));
  return `${part.day} ${String(part.month).replace('.', '')} ${part.year} - ${part.hour}.${part.minute} WIB`;
}

const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const statusOf = (s: unknown) => REG_STATUSES.find((x) => x.value === s) ?? REG_STATUSES[0];

/** Summary above Agenda Event: what is coming, how full it is, and the next event. */
export function EventsOverview() {
  const cms = useCms();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(true);
  // Read the clock once per mount so render stays pure.
  const [now] = useState(() => Date.now());
  const ctx: FieldContext = { sections: cms.sections, collections: cms.collections };
  const events = (cms.collections.events ?? []).filter((e) => e.status === 'published');
  const upcoming = events.filter((e) => eventPhase(e, now) !== 'ended').sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const monthKey = new Date(now).toISOString().slice(0, 7);
  const thisMonth = upcoming.filter((e) => String(e.date).startsWith(monthKey)).length;
  const regs = (cms.collections.registrations ?? []).filter((r) => upcoming.some((e) => e.id === r.eventId));
  const held = regs.filter((r) => HOLDS_SEAT.includes(r.status as RegStatus)).length;
  const waiting = regs.filter((r) => r.status === 'waitlist').length;
  const capacity = upcoming.reduce((n, e) => n + (Number(e.capacity) || 0), 0);
  const fill = capacity ? Math.round((held / capacity) * 100) : 0;
  const next = upcoming.find((e) => e.pinned) ?? upcoming[0];

  return (
    <section className="pov bov" aria-label="Ringkasan event">
      <header className="pov-head">
        <div>
          <span className="pov-k">Ringkasan event</span>
          <p>Dari event berstatus Tampil. Teks halaman /event diatur di Konfigurasi Website Publik → Halaman Event.</p>
        </div>
        <button type="button" className="cms-btn cms-btn--ghost cms-btn--sm" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? 'Sembunyikan' : 'Tampilkan'} <ChevronDown size={14} className={`pov-caret ${open ? 'is-open' : ''}`} />
        </button>
      </header>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div className="pov-body" initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32, ease: EASE }}>
            <div className="pov-kpis bov-kpis evt-kpis">
              <Kpi icon={<CalendarDays size={16} />} label="Event mendatang">
                <strong><Count value={upcoming.length} /></strong>
                <small>{thisMonth} di bulan ini</small>
              </Kpi>
              <Kpi icon={<Users size={16} />} label="Total pendaftar" delay={0.05}>
                <strong><Count value={held} /></strong>
                <small>{waiting ? `${waiting} di daftar tunggu` : 'Tidak ada daftar tunggu'}</small>
              </Kpi>
              <Kpi icon={<Ticket size={16} />} label="Kursi terisi" delay={0.1}>
                <strong><Count value={fill} />%</strong>
                <span className="evt-fill" aria-hidden="true"><motion.i initial={{ width: 0 }} animate={{ width: `${fill}%` }} transition={{ duration: 0.8, ease: EASE }} /></span>
                <small>{held} dari {capacity} kursi</small>
              </Kpi>
              <Kpi icon={<CalendarClock size={16} />} label={next?.pinned ? 'Acara disematkan' : 'Acara terdekat'} delay={0.15}>
                <strong className="evt-next">{next ? `${Number(String(next.date).slice(8))} ${MONTHS[Number(String(next.date).slice(5, 7)) - 1]}` : 'Belum ada'}</strong>
                <small className="bov-clip">{next ? String(next.title) : 'Tambahkan event baru'}</small>
                {next && <small>{seatsTaken(next.id, ctx)}/{String(next.capacity ?? '—')} pendaftar</small>}
              </Kpi>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

type EvtSort = 'date' | 'regs' | 'att';
const EVT_PAGE = 10;

/** "Pendaftar" tab: a table of events (active or finished); a row opens its sign-ups. */
export function RegistrationsPanel() {
  const cms = useCms();
  const reduce = useReducedMotion();
  const [now] = useState(() => Date.now());
  const settings = useRegistrationSettings();
  const all = cms.collections.registrations ?? [];
  const [open, setOpen] = useState<string | null>(null);
  const [period, setPeriod] = useState<'active' | 'ended'>('active');
  const [q, setQ] = useState('');
  const [type, setType] = useState('all');
  const [cost, setCost] = useState('all');
  const [year, setYear] = useState('all');
  const [sort, setSort] = useState<EvtSort>('date');
  const [page, setPage] = useState(1);
  const ended = (e: CmsItem) => eventPhase(e, now) === 'ended';

  const rows = useMemo(() => (cms.collections.events ?? []).map((e) => {
    const regs = all.filter((r) => r.eventId === e.id && r.status !== 'cancelled');
    const came = regs.filter((r) => r.status === 'attended').length;
    const missed = regs.filter((r) => r.status === 'noshow').length;
    const marked = came + missed;
    const paidRegs = regs.filter((r) => r.paid);
    return {
      e,
      ended: ended(e),
      regs: regs.length,
      held: regs.filter((r) => HOLDS_SEAT.includes(r.status as RegStatus)).length,
      waitlist: regs.filter((r) => r.status === 'waitlist').length,
      came,
      missed,
      unmarked: regs.filter((r) => r.status === 'registered').length,
      rate: marked ? came / marked : null,
      income: paidRegs.filter((r) => payState(r, now, settings.payDeadlineHours) === 'paid').reduce((n, r) => n + amountOf(r), 0),
      waiting: paidRegs.filter((r) => payState(r, now, settings.payDeadlineHours) !== 'paid').length,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [cms.collections.events, all, now, settings.payDeadlineHours]);

  if (open) return <EventRegistrations eventId={open} onBack={() => setOpen(null)} />;

  const inPeriod = rows.filter((r) => (period === 'ended' ? r.ended : !r.ended));
  const years = [...new Set(inPeriod.map((r) => String(r.e.date ?? '').slice(0, 4)).filter(Boolean))].sort().reverse();
  const shown = inPeriod
    .filter((r) => type === 'all' || r.e.type === type)
    .filter((r) => cost === 'all' || (cost === 'paid' ? !!r.e.isPaid : cost === 'free' ? !r.e.isPaid : cost === 'member' ? !!r.e.memberOnly : !r.e.memberOnly))
    .filter((r) => year === 'all' || String(r.e.date ?? '').startsWith(year))
    .filter((r) => !q || String(r.e.title).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => sort === 'regs' ? b.regs - a.regs : sort === 'att' ? (b.rate ?? -1) - (a.rate ?? -1) : period === 'ended' ? String(b.e.date).localeCompare(String(a.e.date)) : String(a.e.date).localeCompare(String(b.e.date)));
  const pages = Math.max(1, Math.ceil(shown.length / EVT_PAGE));
  const current = Math.min(page, pages);
  const pageRows = shown.slice((current - 1) * EVT_PAGE, current * EVT_PAGE);
  const reset = <T,>(set: (v: T) => void) => (v: T) => { set(v); setPage(1); };

  return (
    <div className="cms-list">
      <div className="cms-toolbar">
        <div className="mcd-tabs evt-period" role="tablist" aria-label="Periode event">
          {(['active', 'ended'] as const).map((p) => (
            <button type="button" role="tab" key={p} aria-selected={period === p} onClick={() => { setPeriod(p); setPage(1); setYear('all'); setSort('date'); }}>
              {period === p && <motion.span layoutId="evt-period" className="mcd-tabs__pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
              <span className="mcd-tabs__text">{p === 'active' ? 'Aktif' : 'Selesai'} <b>{rows.filter((r) => (p === 'ended' ? r.ended : !r.ended)).length}</b></span>
            </button>
          ))}
        </div>
        <div className="cms-toolbar-right">
          <CmsSelect size="sm" prefix="Jenis" aria-label="Filter jenis" value={type} onChange={reset(setType)} options={[{ value: 'all', label: 'Semua' }, ...EVENT_TYPES.map((t) => ({ value: t.value, label: t.label }))]} className="msg-filter" />
          <CmsSelect size="sm" prefix="Akses" aria-label="Filter akses dan biaya" value={cost} onChange={reset(setCost)} options={[{ value: 'all', label: 'Semua' }, { value: 'public', label: 'Umum' }, { value: 'member', label: 'Khusus member' }, { value: 'free', label: 'Gratis' }, { value: 'paid', label: 'Berbayar' }]} className="msg-filter" />
          {period === 'ended' && years.length > 1 && <CmsSelect size="sm" prefix="Tahun" aria-label="Filter tahun" value={year} onChange={reset(setYear)} options={[{ value: 'all', label: 'Semua' }, ...years.map((y) => ({ value: y, label: y }))]} className="msg-filter" />}
          <CmsSelect size="sm" prefix="Urut" aria-label="Urutkan" value={sort} onChange={(v) => setSort(v as EvtSort)} options={[{ value: 'date', label: period === 'ended' ? 'Terbaru' : 'Terdekat' }, { value: 'regs', label: 'Pendaftar terbanyak' }, ...(period === 'ended' ? [{ value: 'att', label: 'Kehadiran tertinggi' }] : [])]} className="msg-filter" />
          <div className="cms-search">
            <Search size={14} aria-hidden="true" />
            <input aria-label="Cari event" placeholder="Cari judul event…" value={q} onChange={(e) => reset(setQ)(e.target.value)} />
            {q && <button type="button" aria-label="Hapus pencarian" onClick={() => reset(setQ)('')}><X size={13} /></button>}
          </div>
        </div>
      </div>
      <div className="cms-table-wrap">
        <table className="cms-table evl-table">
          <thead>
            <tr>
              <th style={{ width: 128 }}>Tanggal</th>
              <th>Event</th>
              <th style={{ width: 170 }}>Pendaftar</th>
              <th style={{ width: 200 }}>{period === 'ended' ? 'Kehadiran' : 'Pembayaran'}</th>
              <th style={{ width: 130 }}>Pemasukan</th>
              <th className="cms-col-actions" style={{ width: 72 }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r, i) => {
              const d = new Date(String(r.e.date));
              const cap = Number(r.e.capacity) || 0;
              const tl = EVENT_TYPES.find((t) => t.value === r.e.type)?.label ?? 'Event';
              return (
                <motion.tr key={r.e.id} className="cms-row evl-row" onClick={() => setOpen(String(r.e.id))} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25, delay: Math.min(i, 10) * 0.025 }}>
                  <td className="cms-col-meta" data-label="Tanggal">
                    {Number.isNaN(d.getTime()) ? <span className="cms-muted">—</span> : <span className="evl-date"><b>{d.getDate()}</b> {MONTHS[d.getMonth()].slice(0, 3)} {d.getFullYear()}</span>}
                  </td>
                  <td className="cms-col-title">
                    <div className="cms-cell-title">
                      <strong>{String(r.e.title)}</strong>
                      <div className="evl-tags">
                        <i>{tl}</i>
                        <i className={r.e.memberOnly ? 'is-member' : ''}>{r.e.memberOnly ? 'Khusus member' : 'Umum'}</i>
                        <i className={r.e.isPaid ? 'is-paid' : ''}>{r.e.isPaid ? (Number(r.e.price) ? formatRupiah(Number(r.e.price)) : 'Berbayar') : 'Gratis'}</i>
                        {r.e.status !== 'published' && <i className="is-draft">{r.e.status === 'draft' ? 'Draft' : 'Arsip'}</i>}
                      </div>
                    </div>
                  </td>
                  <td className="cms-col-meta" data-label="Pendaftar">
                    <span className="evl-fill">
                      <span><b>{period === 'ended' ? r.regs : r.held}</b>{period === 'ended' ? ' orang' : `/${cap || '—'}`}{r.waitlist ? <small> · {r.waitlist} tunggu</small> : null}</span>
                      {period !== 'ended' && <i aria-hidden="true"><em style={{ width: `${cap ? Math.min(100, (r.held / cap) * 100) : 0}%` }} /></i>}
                    </span>
                  </td>
                  <td className="cms-col-meta" data-label={period === 'ended' ? 'Kehadiran' : 'Pembayaran'}>
                    {period === 'ended' ? (
                      <span className="evl-attn">
                        <span><b>{r.rate === null ? '—' : `${Math.round(r.rate * 100)}%`}</b> <small>{r.came} hadir · {r.missed} tidak{r.unmarked ? ` · ${r.unmarked} belum` : ''}</small></span>
                        <i aria-hidden="true"><em className="is-ok" style={{ flexGrow: r.came }} /><em className="is-no" style={{ flexGrow: r.missed }} /><em style={{ flexGrow: r.unmarked }} /></i>
                      </span>
                    ) : r.e.isPaid ? (
                      <span className="evl-paysum">{r.waiting ? <span className="cms-badge cms-badge--pending">{r.waiting} menunggu bayar</span> : <span className="cms-badge cms-badge--ok">Semua lunas</span>}</span>
                    ) : <span className="cms-muted">Gratis</span>}
                  </td>
                  <td className="cms-col-meta" data-label="Pemasukan"><span className="sgn-price">{r.income ? formatRupiah(r.income) : <span className="cms-muted">—</span>}</span></td>
                  <td className="cms-col-actions" onClick={(ev) => ev.stopPropagation()}><EventPeek e={r.e} speaker={speakerName(r.e, { collections: cms.collections } as FieldContext)} onOpen={() => setOpen(String(r.e.id))} /></td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
        {!shown.length && <div className="cms-empty"><p>{inPeriod.length ? 'Tidak ada event yang cocok dengan filter.' : period === 'ended' ? 'Belum ada event yang selesai.' : 'Belum ada event aktif.'}</p></div>}
        {shown.length > 0 && (
          <div className="cms-table-hint">
            <span>Menampilkan {(current - 1) * EVT_PAGE + 1}–{Math.min(current * EVT_PAGE, shown.length)} dari {shown.length} event</span>
            <Pager page={current} pages={pages} onPage={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}

/** One event's sign-ups with status, attendance, payment, questions and a CSV export. */
function EventRegistrations({ eventId, onBack }: { eventId: string; onBack: () => void }) {
  const cms = useCms();
  const reduce = useReducedMotion();
  const events = useMemo(() => [...(cms.collections.events ?? [])].sort((a, b) => String(a.date).localeCompare(String(b.date))), [cms.collections.events]);
  const all = cms.collections.registrations ?? [];
  // Read the clock once per mount so render stays pure.
  const [clock] = useState(() => Date.now());
  const isEnded = (e: CmsItem) => eventPhase(e, clock) === 'ended';
  const [status, setStatus] = useState<RegStatus | 'all'>('all');
  const [q, setQ] = useState('');
  const [onlyQuestions, setOnlyQuestions] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<CmsItem | null>(null);
  const [pay, setPay] = useState<PayState | 'all'>('all');
  const [paying, setPaying] = useState<CmsItem | null>(null);
  const [payDate, setPayDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [payRef, setPayRef] = useState('');
  const [releaseOpen, setReleaseOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  // Read the clock once per mount so render stays pure.
  const [now] = useState(() => Date.now());
  const settings = useRegistrationSettings();
  const ps = (r: CmsItem) => payState(r, now, settings.payDeadlineHours);

  const scoped = all.filter((r) => r.eventId === eventId);
  const shown = scoped
    .filter((r) => (status === 'all' || r.status === status) && (!onlyQuestions || String(r.question ?? '').trim()))
    .filter((r) => pay === 'all' || ps(r) === pay)
    .filter((r) => !q || `${String(r.name)} ${String(r.email)} ${String(r.org)} ${String(r.code ?? '')} ${String(r.whatsapp ?? '')}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
  const event = events.find((e) => e.id === eventId);
  const ended = !!event && isEnded(event);
  const eventTitle = (r: CmsItem) => String(events.find((e) => e.id === r.eventId)?.title ?? r.eventTitle ?? '—');
  const held = scoped.filter((r) => HOLDS_SEAT.includes(r.status as RegStatus)).length;
  const cap = Number(event?.capacity) || 0;
  const live = scoped.filter((r) => r.status !== 'cancelled');
  const income = live.filter((r) => ps(r) === 'paid').reduce((n, r) => n + amountOf(r), 0);
  const waiting = live.filter((r) => ps(r) === 'pending' || ps(r) === 'overdue').reduce((n, r) => n + amountOf(r), 0);
  const overdue = live.filter((r) => ps(r) === 'overdue' && HOLDS_SEAT.includes(r.status as RegStatus));
  const paidAny = scoped.some((r) => r.paid);

  const setRow = (r: CmsItem, patch: Values) =>
    cms.setCollection('registrations', all.map((x) => (x.id === r.id ? { ...x, ...patch, updatedAt: new Date().toISOString() } : x)));
  const markAll = (from: RegStatus, to: RegStatus) => {
    const ids = new Set(shown.filter((r) => r.status === from).map((r) => r.id));
    if (!ids.size) return;
    cms.setCollection('registrations', all.map((x) => (ids.has(x.id) ? { ...x, status: to } : x)));
    cms.toast(`${ids.size} pendaftar ditandai ${statusOf(to).label.toLowerCase()}.`);
  };
  /** Payment confirmed: date and reference are kept for the books. */
  const markPaid = () => {
    if (!paying) return;
    setRow(paying, { payment: 'paid', paidAt: new Date(`${payDate}T12:00:00`).toISOString(), paymentRef: payRef.trim(), paidBy: RESPONDER });
    cms.toast(`Lunas: ${String(paying.name)} · ${formatRupiah(amountOf(paying))}.`);
    setPaying(null);
    setPayRef('');
  };
  /** Seats held past the pay deadline go back to the event. */
  const releaseOverdue = () => {
    const ids = new Set(overdue.map((r) => r.id));
    cms.setCollection('registrations', all.map((x) => (ids.has(x.id) ? { ...x, status: 'cancelled', note: 'Kursi dilepas: lewat batas pembayaran', updatedAt: new Date().toISOString() } : x)));
    cms.toast(`${ids.size} kursi dilepas dan kembali tersedia.`);
    setReleaseOpen(false);
  };
  const waLink = (r: CmsItem) => `https://wa.me/${String(r.whatsapp ?? '').replace(/\D/g, '').replace(/^0/, '62')}?text=${encodeURIComponent(fillTemplate(settings.templates.payReminder, { nama: String(r.name).split(/\s+/)[0], kode: String(r.code ?? ''), jenis: eventTitle(r), nominal: formatRupiah(amountOf(r)), rekening: accountText(primaryAccount(settings)) }))}`;
  const remove = (r: CmsItem) => {
    const before = all;
    cms.removeItem('registrations', r.id);
    cms.toast('Pendaftar dihapus.', 'ok', { label: 'Urungkan', run: () => cms.setCollection('registrations', before) });
    setConfirmDelete(null);
  };
  const exportCsv = () => {
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = [['Kode tiket', 'Event', 'Nama', 'Email', 'WhatsApp', 'Institusi', 'Status', 'Pembayaran', 'Nominal', 'Harga member', 'Tanggal lunas', 'Referensi', 'Bersedia dihubungi', 'Pertanyaan', 'Waktu daftar'], ...shown.map((r) => [r.code, eventTitle(r), r.name, r.email, r.whatsapp, r.org, statusOf(r.status).label, PAY_STATES[ps(r)].label, amountOf(r), r.memberPrice ? 'Ya' : '', r.paidAt ? formatDate(String(r.paidAt)) : '', r.paymentRef, r.consent ? 'Ya' : 'Tidak', r.question, formatDate(String(r.createdAt ?? r.updatedAt), true)])];
    const url = URL.createObjectURL(new Blob(['﻿' + rows.map((r) => r.map(esc).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `pendaftar-${event ? String(event.slug) : 'semua-event'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const count = (s: RegStatus) => scoped.filter((r) => r.status === s).length;

  return (
    <div className="cms-list">
      <div className="cms-toolbar evt-reg-bar">
        <button type="button" className="evt-back" onClick={onBack}><ChevronLeft size={15} /> {event && isEnded(event) ? 'Event selesai' : 'Event aktif'}</button>
        {event && (
          <div className="evt-reg-title">
            <b>{String(event.title)}</b>
            <small>{formatDate(String(event.date))} · {String(event.location || '')} · {event.memberOnly ? 'Khusus member' : 'Umum'} · {event.isPaid ? 'Berbayar' : 'Gratis'}</small>
          </div>
        )}
        {event && (
          <span className={`evt-reg-cap ${cap && held >= cap ? 'is-full' : ''}`}>
            <span><b>{held}</b>/{cap || '—'} kursi terisi</span>
            <i aria-hidden="true"><em style={{ width: `${cap ? Math.min(100, (held / cap) * 100) : 0}%` }} /></i>
          </span>
        )}
        {paidAny && (
          <span className="evt-reg-money">
            <Wallet size={14} aria-hidden="true" />
            <span><b>{formatRupiah(income)}</b> lunas</span>
            {waiting > 0 && <span className="is-wait">{formatRupiah(waiting)} menunggu</span>}
          </span>
        )}
        <div className="cms-toolbar-right">
          <button type="button" className="cms-btn cms-btn--solid cms-btn--sm" onClick={() => setAdding(true)} disabled={!event} title={event ? undefined : 'Pilih event dulu'}><UserPlus size={14} /> Tambah pendaftar</button>
          <button type="button" className="cms-btn cms-btn--ghost cms-btn--sm" onClick={exportCsv} disabled={!shown.length}><Download size={14} /> Ekspor CSV</button>
        </div>
      </div>
      <div className="cms-toolbar evt-reg-filters">
        <div className="cms-chips" role="tablist" aria-label="Status pendaftar">
          <button type="button" role="tab" aria-selected={status === 'all'} onClick={() => setStatus('all')}>Semua <b>{scoped.length}</b></button>
          {REG_STATUSES.map((s) => (
            <button type="button" role="tab" key={s.value} aria-selected={status === s.value} onClick={() => setStatus(s.value)}>{ended && s.value === 'registered' ? 'Belum ditandai' : s.label} <b>{count(s.value)}</b></button>
          ))}
        </div>
        <div className="cms-toolbar-right">
          {paidAny && <CmsSelect size="sm" prefix="Bayar" aria-label="Filter pembayaran" value={pay} onChange={(v) => setPay(v as PayState | 'all')} options={[{ value: 'all', label: 'Semua' }, ...(['pending', 'overdue', 'paid', 'free'] as PayState[]).map((k) => ({ value: k, label: PAY_STATES[k].label }))]} className="msg-filter" />}
          <button type="button" className={`cms-btn cms-btn--ghost cms-btn--sm ${onlyQuestions ? 'is-on' : ''}`} aria-pressed={onlyQuestions} onClick={() => setOnlyQuestions((v) => !v)}><MessageSquareText size={14} /> Ada pertanyaan</button>
          <div className="cms-search">
            <Search size={14} aria-hidden="true" />
            <input aria-label="Cari pendaftar" placeholder="Cari nama, email, institusi…" value={q} onChange={(e) => setQ(e.target.value)} />
            {q && <button type="button" aria-label="Hapus pencarian" onClick={() => setQ('')}><X size={13} /></button>}
          </div>
        </div>
      </div>
      {event && isEnded(event) && (() => {
        const came = scoped.filter((r) => r.status === 'attended').length;
        const missed = scoped.filter((r) => r.status === 'noshow').length;
        const unmarked = scoped.filter((r) => r.status === 'registered').length;
        const base = Math.max(1, came + missed + unmarked);
        return (
          <section className="evt-recap" aria-label="Rekap event selesai">
            <div className="evt-recap__head">
              <span className="pov-k">Rekap event selesai</span>
              <b>{String(event.title)}</b>
              <small>{formatDate(String(event.date))} · {String(event.location || '')}</small>
            </div>
            <div className="evt-recap__nums">
              <div><b>{came + missed + unmarked}</b><small>pendaftar</small></div>
              <div className="is-ok"><b>{came}</b><small>hadir · {Math.round((came / base) * 100)}%</small></div>
              <div className="is-no"><b>{missed}</b><small>tidak hadir</small></div>
              <div><b>{unmarked}</b><small>belum ditandai</small></div>
              {paidAny && <div><b>{formatRupiah(income)}</b><small>pemasukan</small></div>}
            </div>
            <div className="evt-recap__bar" aria-hidden="true"><i className="is-ok" style={{ flexGrow: came }} /><i className="is-no" style={{ flexGrow: missed }} /><i style={{ flexGrow: unmarked }} /></div>
            <button type="button" className="cms-btn cms-btn--ghost cms-btn--sm" onClick={exportCsv} disabled={!scoped.length}><Download size={14} /> Ekspor daftar hadir</button>
          </section>
        );
      })()}
      {overdue.length > 0 && (
        <div className="evt-reg-bulk is-warn">
          <span><CircleAlert size={15} aria-hidden="true" /> {overdue.length} pendaftar lewat batas bayar {settings.payDeadlineHours} jam dan masih menahan kursi.</span>
          <button type="button" className="cms-btn cms-btn--solid cms-btn--sm" onClick={() => setReleaseOpen(true)}>Lepas kursi</button>
        </div>
      )}
      {status === 'registered' && shown.length > 0 && (
        <div className="evt-reg-bulk">
          <span>{ended ? 'Tandai kehadiran per baris, atau sekaligus semua yang belum ditandai.' : 'Setelah acara selesai, tandai kehadiran untuk sertifikat.'}</span>
          <button type="button" className="cms-btn cms-btn--solid cms-btn--sm" onClick={() => markAll('registered', 'attended')}>Tandai semua hadir</button>
        </div>
      )}
      <div className="cms-table-wrap">
        <table className="cms-table evt-reg-table">
          <thead>
            <tr>
              <th style={{ minWidth: 170 }}>Nama</th>
              {eventId === 'all' && <th style={{ width: 220 }}>Event</th>}
              <th>Email</th>
              <th style={{ width: 150 }}>No. WhatsApp</th>
              <th style={{ minWidth: 160 }}>Institusi</th>
              <th style={{ width: 140 }}>Status</th>
              <th style={{ width: 120 }}>Status bayar</th>
              <th style={{ width: 120 }}>Harga</th>
              <th style={{ width: 170 }}>Waktu daftar</th>
              <th className="cms-col-actions">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r, i) => {
              const st = statusOf(r.status);
              return (
                <motion.tr key={r.id} className="cms-row evt-reg-row" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25, delay: Math.min(i, 10) * 0.025 }}>
                  <td className="cms-col-title">
                    <div className="cms-cell-title">
                      <strong>{String(r.name)}</strong>
                      {r.code ? <span className="evt-reg-code">{String(r.code)}</span> : null}
                    </div>
                  </td>
                  {eventId === 'all' && <td className="cms-col-meta" data-label="Event"><span className="evt-reg-ev">{eventTitle(r)}</span></td>}
                  <td className="cms-col-meta" data-label="Email"><a className="evt-reg-mail" href={`mailto:${String(r.email)}`}>{String(r.email)}</a></td>
                  <td className="cms-col-meta" data-label="No. WhatsApp">
                    {r.whatsapp ? (
                      <span className="evt-reg-wa">{String(r.whatsapp)}{r.consent ? <i title="Bersedia menerima info kegiatan">Bersedia dihubungi</i> : null}</span>
                    ) : <span className="cms-muted">—</span>}
                  </td>
                  <td className="cms-col-meta" data-label="Institusi">{String(r.org || '—')}</td>
                  <td className="cms-col-meta" data-label="Status">
                    {ended && ['registered', 'attended', 'noshow'].includes(String(r.status)) ? (
                      <span className="evt-att" role="group" aria-label={`Kehadiran ${String(r.name)}`}>
                        <button type="button" className={r.status === 'attended' ? 'is-on is-ok' : ''} aria-pressed={r.status === 'attended'} onClick={() => setRow(r, { status: 'attended' })}><Check size={13} /> Hadir</button>
                        <button type="button" className={r.status === 'noshow' ? 'is-on is-no' : ''} aria-pressed={r.status === 'noshow'} onClick={() => setRow(r, { status: 'noshow' })}><X size={13} /> Tidak</button>
                      </span>
                    ) : (
                      <span className={`cms-badge cms-badge--${st.tone}`}>{st.label}</span>
                    )}
                  </td>
                  <td className="cms-col-meta" data-label="Status bayar">
                    {r.paid ? (() => {
                      const st2 = ps(r);
                      return (
                        <button type="button" className={`evt-pay is-${st2}`} onClick={() => (st2 === 'paid' ? undefined : (setPaying(r), setPayRef('')))} title={st2 === 'paid' ? `Lunas ${r.paidAt ? formatDate(String(r.paidAt)) : ''}${r.paymentRef ? ` · ${String(r.paymentRef)}` : ''}` : 'Tandai lunas'} disabled={st2 === 'paid'}>
                          {PAY_STATES[st2].label}
                        </button>
                      );
                    })() : <span className="cms-muted">Gratis</span>}
                  </td>
                  <td className="cms-col-meta" data-label="Harga">
                    {r.paid ? <span className="evt-price"><b>{formatRupiah(amountOf(r))}</b>{r.memberPrice ? <small>Harga member</small> : null}</span> : <span className="cms-muted">—</span>}
                  </td>
                  <td className="cms-col-meta cms-muted cms-nowrap" data-label="Waktu daftar">{wibStamp(String(r.createdAt || r.updatedAt))}</td>
                  <td className="cms-col-actions">
                    <Menu.Root modal={false}>
                      <Menu.Trigger className="cms-kebab" aria-label={`Aksi untuk ${String(r.name)}`}><MoreVertical size={16} /></Menu.Trigger>
                      <Menu.Portal>
                        <Menu.Content className="cms-menu" align="end" sideOffset={6} collisionPadding={12}>
                          {String(r.question ?? '').trim() ? (
                            <>
                              <div className="evt-menu-q"><span><MessageSquareText size={12} aria-hidden="true" /> Pertanyaan</span><p>{String(r.question)}</p></div>
                              <Menu.Separator className="cms-menu-sep" />
                            </>
                          ) : null}
                          {!!r.paid && ps(r) !== 'paid' && <Menu.Item className="cms-menu-item" onSelect={() => { setPaying(r); setPayRef(''); }}><BadgeCheck size={14} /> Tandai lunas</Menu.Item>}
                          {!!r.paid && ps(r) === 'paid' && <Menu.Item className="cms-menu-item" onSelect={() => setRow(r, { payment: 'pending', paidAt: '', paymentRef: '' })}><RotateCcw size={14} /> Batalkan lunas</Menu.Item>}
                          {!!r.paid && ps(r) !== 'paid' && r.whatsapp ? <Menu.Item className="cms-menu-item" asChild><a href={waLink(r)} target="_blank" rel="noopener noreferrer"><MessageCircle size={14} /> Ingatkan bayar</a></Menu.Item> : null}
                          {r.code ? <Menu.Item className="cms-menu-item" onSelect={() => navigator.clipboard?.writeText(String(r.code)).then(() => cms.toast('Kode tiket disalin.')).catch(() => {})}><Copy size={14} /> Salin kode tiket</Menu.Item> : null}
                          {!!r.paid && <Menu.Separator className="cms-menu-sep" />}
                          <Menu.Label className="evt-menu-label">Ubah status</Menu.Label>
                          {REG_STATUSES.filter((s) => s.value !== r.status).map((s) => (
                            <Menu.Item key={s.value} className="cms-menu-item" onSelect={() => setRow(r, { status: s.value })}>
                              <span className={`evt-dot is-${s.tone}`} aria-hidden="true" /> {s.label}
                            </Menu.Item>
                          ))}
                          <Menu.Separator className="cms-menu-sep" />
                          <Menu.Item className="cms-menu-item is-danger" onSelect={() => setConfirmDelete(r)}><Trash2 size={14} /> Hapus</Menu.Item>
                        </Menu.Content>
                      </Menu.Portal>
                    </Menu.Root>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
        {!shown.length && <div className="cms-empty"><p>{scoped.length ? 'Tidak ada pendaftar yang cocok dengan filter.' : 'Belum ada pendaftar untuk event ini. Pendaftaran dari halaman event akan muncul di sini.'}</p></div>}
        {shown.length > 0 && <p className="cms-table-hint"><span>Menampilkan {shown.length} dari {scoped.length} pendaftar</span></p>}
      </div>
      {adding && event && (
        <AddRegistrantDialog
          event={event}
          now={now}
          existing={scoped}
          members={cms.collections.members ?? []}
          held={held}
          onClose={() => setAdding(false)}
          onSave={(r) => {
            cms.setCollection('registrations', [...all, r]);
            cms.toast(`${String(r.name)} ditambahkan ke ${String(event.title)}.`);
            setAdding(false);
          }}
        />
      )}
      <ConfirmDialog
        open={!!paying}
        title="Tandai lunas"
        confirmLabel="Tandai lunas"
        body={paying ? (
          <div className="evt-paydlg">
            <p><b>{String(paying.name)}</b> · {eventTitle(paying)}</p>
            <div className="evt-paydlg__sum"><span>Nominal</span><strong>{formatRupiah(amountOf(paying))}</strong>{paying.memberPrice ? <small>harga member</small> : null}</div>
            <div className="evt-paydlg__grid">
              <div className="evt-paydlg__field"><label htmlFor="evt-pay-date">Tanggal transfer</label><DateField id="evt-pay-date" value={payDate} onChange={setPayDate} max={new Date(now).toISOString().slice(0, 10)} /></div>
              <label className="evt-paydlg__field"><span>Referensi</span><input value={payRef} onChange={(e) => setPayRef(e.target.value)} placeholder="BCA · a.n. pengirim" /></label>
            </div>
          </div>
        ) : null}
        onConfirm={markPaid}
        onCancel={() => setPaying(null)}
      />
      <ConfirmDialog
        open={releaseOpen}
        title="Lepas kursi yang lewat batas bayar?"
        confirmLabel={`Lepas ${overdue.length} kursi`}
        body={<p>{overdue.length} pendaftar belum membayar lebih dari {settings.payDeadlineHours} jam. Status mereka menjadi <strong>Batal</strong> dan kursinya kembali tersedia. Pendaftar di daftar tunggu bisa Anda naikkan setelahnya.</p>}
        onConfirm={releaseOverdue}
        onCancel={() => setReleaseOpen(false)}
      />
      <ConfirmDialog
        open={!!confirmDelete}
        danger
        title="Hapus pendaftar?"
        confirmLabel="Hapus"
        body={<p><strong>{String(confirmDelete?.name ?? '')}</strong> akan dihapus dari daftar. Untuk pembatalan biasa, ubah statusnya menjadi Batal.</p>}
        onConfirm={() => confirmDelete && remove(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}

/** Live ticket preview in the event dialog, as the public "Acara terdekat" card shows it. */
export function EventPreview({ values: v, ctx }: { values: Values; ctx: FieldContext }) {
  const d = String(v.date ?? '');
  const ok = /^\d{4}-\d{2}-\d{2}$/.test(d);
  const cap = Number(v.capacity) || 0;
  const taken = v.id ? seatsTaken(String(v.id), ctx) : 0;
  const name = speakerName(v, ctx);
  return (
    <div className="evt-pv">
      <span className="bpv-k">Tiket di halaman /event</span>
      <div className="evt-pv__ticket">
        <div className="evt-pv__date">
          <small>Tiket masuk</small>
          <b>{ok ? Number(d.slice(8)) : '--'}</b>
          <span>{ok ? `${MONTHS[Number(d.slice(5, 7)) - 1]} ${d.slice(0, 4)}` : 'Tanggal'}</span>
          <em>{v.time ? `${String(v.time)} WIB` : '—'}</em>
        </div>
        <div className="evt-pv__body">
          <span className="evt-pv__pill">{EVENT_TYPES.find((t) => t.value === v.type)?.label ?? 'Event'}{v.memberOnly ? ' · khusus member' : ''}</span>
          <strong>{String(v.title || 'Judul event')}</strong>
          <p>{String(v.summary || 'Ringkasan event tampil di sini.')}</p>
          <ul>
            <li>{FORMATS.find((f) => f.value === v.format)?.label} · {String(v.location || 'Lokasi')}</li>
            <li>{v.isPaid ? `${Number(v.price) ? formatRupiah(Number(v.price)) : 'Berbayar'}${v.memberPrice !== '' && v.memberPrice != null ? ` · member ${Number(v.memberPrice) ? formatRupiah(Number(v.memberPrice)) : 'gratis'}` : ''}` : 'Gratis'}</li>
            {name && <li>{name}</li>}
          </ul>
        </div>
        <div className="evt-pv__stub">
          <small>Kuota</small>
          <b>{cap ? `${Math.max(0, cap - taken)}` : '—'}</b>
          <span>kursi tersisa</span>
          <i aria-hidden="true"><em style={{ width: `${cap ? Math.min(100, (taken / cap) * 100) : 0}%` }} /></i>
        </div>
      </div>
      {!v.guestSpeaker && !v.speakerId && <p className="bpv-warn">Pilih pembicara, atau aktifkan Pembicara tamu.</p>}
    </div>
  );
}

/** Admin adds a sign-up by hand: a member picked from Anggota, or anyone typed in. */
function AddRegistrantDialog({ event, now, existing, members, held, onClose, onSave }: { event: CmsItem; now: number; existing: CmsItem[]; members: CmsItem[]; held: number; onClose: () => void; onSave: (r: CmsItem) => void }) {
  const active = members.filter((m) => ['active', 'expiring'].includes(memberState(m, now).state));
  const [mode, setMode] = useState<'member' | 'guest'>(event.memberOnly ? 'member' : 'guest');
  const [memberId, setMemberId] = useState('');
  const [f, setF] = useState({ name: '', email: '', whatsapp: '', org: '' });
  const [paid, setPaid] = useState(false);
  const [payDate, setPayDate] = useState(() => new Date(now).toISOString().slice(0, 10));
  const [payRef, setPayRef] = useState('');
  const [status, setStatus] = useState<RegStatus>('registered');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const m = active.find((x) => x.id === memberId);
  const person = mode === 'member' && m ? { name: String(m.name), email: String(m.email), whatsapp: String(m.whatsapp ?? ''), org: String(m.institution ?? '') } : f;
  const isPaid = !!event.isPaid;
  const memberRate = mode === 'member' && !event.memberOnly && event.memberPrice !== '' && event.memberPrice != null;
  const [amount, setAmount] = useState<number | null>(null);
  const due = amount ?? (isPaid ? Number(memberRate ? event.memberPrice : event.price) || 0 : 0);
  const cap = Number(event.capacity) || 0;
  const full = cap > 0 && held >= cap;

  const save = () => {
    if (mode === 'member' && !m) return setError('Pilih member.');
    if (mode === 'guest' && person.name.trim().length < 3) return setError('Tulis nama lengkap.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(person.email.trim())) return setError('Email belum valid.');
    if (existing.some((r) => String(r.email).toLowerCase() === person.email.trim().toLowerCase() && r.status !== 'cancelled')) return setError('Email ini sudah terdaftar di event ini.');
    const at = new Date().toISOString();
    onSave({
      id: `reg-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      eventId: event.id,
      eventTitle: event.title,
      code: ticketCode(),
      name: person.name.trim(),
      email: person.email.trim(),
      whatsapp: person.whatsapp.trim(),
      org: person.org.trim(),
      question: '',
      consent: mode === 'member' ? true : consent,
      paid: isPaid && due > 0,
      payment: isPaid && due > 0 ? (paid ? 'paid' : 'pending') : '',
      amount: isPaid ? due : 0,
      memberPrice: memberRate,
      paidAt: paid ? new Date(`${payDate}T12:00:00`).toISOString() : '',
      paymentRef: paid ? payRef.trim() : '',
      status: full && status === 'registered' ? 'waitlist' : status,
      source: 'admin',
      order: existing.length + 1,
      createdAt: at,
      updatedAt: at,
    });
  };

  return (
    <Drawer
      open
      title="Tambah pendaftar"
      subtitle={String(event.title)}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="cms-btn cms-btn--ghost" onClick={onClose}>Batal</button>
          <div className="cms-drawer-foot-right">
            {error && <span className="mbc-foot-err">{error}</span>}
            <button type="button" className="cms-btn cms-btn--solid" onClick={save}><UserPlus size={15} /> Simpan pendaftar</button>
          </div>
        </>
      }
    >
      <div className="evt-add">
        <div className="mcd-tabs evt-add__mode" role="tablist" aria-label="Jenis pendaftar">
          {(['member', 'guest'] as const).map((k) => (
            <button type="button" role="tab" key={k} aria-selected={mode === k} disabled={k === 'guest' && !!event.memberOnly} onClick={() => { setMode(k); setError(''); setAmount(null); }}>
              <span className="mcd-tabs__text">{k === 'member' ? 'Member' : 'Non-member'}</span>
            </button>
          ))}
        </div>
        {event.memberOnly ? <p className="evt-add__note">Event khusus member: pilih member yang mendaftar.</p> : null}

        {mode === 'member' ? (
          <div className="mbc-field">
            <span className="mbc-label">Member aktif <i aria-hidden="true">*</i></span>
            <CmsSelect aria-label="Pilih member" value={memberId} onChange={(v) => { setMemberId(v); setError(''); setAmount(null); }} placeholder={active.length ? 'Pilih member' : 'Belum ada member aktif'} options={active.map((x) => ({ value: x.id, label: String(x.name), hint: `${String(x.email)} · ${String(x.code ?? '')}` }))} />
            {m && <span className="mbc-hint">{String(m.institution || 'Instansi belum diisi')} · {String(m.whatsapp || 'tanpa WhatsApp')}</span>}
          </div>
        ) : (
          <div className="mbc-grid">
            <label className="mbc-field is-wide"><span className="mbc-label">Nama lengkap <i aria-hidden="true">*</i></span><span className="mbc-control"><span className="mbc-control__ico" aria-hidden="true"><UserRound size={16} /></span><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Nama sesuai sertifikat" /></span></label>
            <label className="mbc-field"><span className="mbc-label">Email <i aria-hidden="true">*</i></span><span className="mbc-control"><input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="nama@kampus.ac.id" /></span></label>
            <label className="mbc-field"><span className="mbc-label">WhatsApp</span><span className="mbc-control"><input type="tel" value={f.whatsapp} onChange={(e) => setF({ ...f, whatsapp: e.target.value })} placeholder="0812 3456 7890" /></span></label>
            <label className="mbc-field is-wide"><span className="mbc-label">Institusi</span><span className="mbc-control"><input value={f.org} onChange={(e) => setF({ ...f, org: e.target.value })} placeholder="Universitas / lembaga" /></span></label>
            <label className="evt-add__consent is-wide"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} /> Peserta bersedia menerima info kegiatan CoPublika</label>
          </div>
        )}

        <div className="mbc-grid">
          <div className="mbc-field">
            <span className="mbc-label">Status</span>
            <CmsSelect aria-label="Status pendaftar" value={status} onChange={(v) => setStatus(v as RegStatus)} options={REG_STATUSES.filter((x) => x.value !== 'cancelled').map((x) => ({ value: x.value, label: x.label }))} />
            {full && status === 'registered' && <span className="mbc-hint">Kuota penuh: tersimpan sebagai daftar tunggu.</span>}
          </div>
          {isPaid && (
            <label className="mbc-field">
              <span className="mbc-label">Nominal</span>
              <span className="mbc-control rgs-money"><span className="rgs-money__pre" aria-hidden="true">Rp.</span><input inputMode="numeric" value={due.toLocaleString('id-ID')} onChange={(e) => setAmount(Number(e.target.value.replace(/\D/g, '')) || 0)} /></span>
              <span className="mbc-hint">{memberRate ? 'Harga member' : event.memberOnly ? 'Harga event khusus member' : 'Harga umum'} · bisa diubah, mis. untuk diskon</span>
            </label>
          )}
        </div>

        {isPaid && due > 0 && (
          <div className="evt-add__pay">
            <label className="evt-add__consent"><input type="checkbox" checked={paid} onChange={(e) => setPaid(e.target.checked)} /> Sudah lunas</label>
            {paid && (
              <div className="evt-paydlg__grid">
                <div className="evt-paydlg__field"><label htmlFor="evt-add-date">Tanggal transfer</label><DateField id="evt-add-date" value={payDate} onChange={setPayDate} max={new Date(now).toISOString().slice(0, 10)} /></div>
                <label className="evt-paydlg__field"><span>Referensi</span><input value={payRef} onChange={(e) => setPayRef(e.target.value)} placeholder="BCA · a.n. pengirim" /></label>
              </div>
            )}
          </div>
        )}
      </div>
    </Drawer>
  );
}

/** Eye button: hover or focus shows the event's key details, click opens its registrants. */
function EventPeek({ e, speaker, onOpen }: { e: CmsItem; speaker: string; onOpen: () => void }) {
  const [show, setShow] = useState(false);
  const d = new Date(String(e.date));
  const when = Number.isNaN(d.getTime()) ? '—' : `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  const cap = Number(e.capacity) || 0;
  const price = e.isPaid ? `${formatRupiah(Number(e.price) || 0)}${!e.memberOnly && e.memberPrice !== '' && e.memberPrice != null ? ` · member ${formatRupiah(Number(e.memberPrice) || 0)}` : ''}` : 'Gratis';
  return (
    <Popover.Root open={show} onOpenChange={setShow}>
      <Popover.Anchor asChild>
        <button
          type="button"
          className="evl-go"
          aria-label={`Lihat pendaftar ${String(e.title)}`}
          onClick={onOpen}
          onPointerEnter={() => setShow(true)}
          onPointerLeave={() => setShow(false)}
          onFocus={() => setShow(true)}
          onBlur={() => setShow(false)}
        >
          <Eye size={16} />
        </button>
      </Popover.Anchor>
      <Popover.Portal>
        <Popover.Content className="evl-peek" side="left" align="center" sideOffset={10} collisionPadding={12} onOpenAutoFocus={(ev) => ev.preventDefault()} onPointerEnter={() => setShow(true)} onPointerLeave={() => setShow(false)}>
          <span className="evl-peek__k">{EVENT_TYPES.find((t) => t.value === e.type)?.label ?? 'Event'} · {e.memberOnly ? 'Khusus member' : 'Umum'}</span>
          <b>{String(e.title)}</b>
          <ul>
            <li><CalendarDays size={13} aria-hidden="true" /> {when}{e.time ? ` · ${String(e.time).replace(':', '.')} WIB` : ''}{e.duration ? ` · ${String(e.duration)}` : ''}</li>
            <li><MapPin size={13} aria-hidden="true" /> {FORMATS.find((f) => f.value === e.format)?.label ?? 'Online'}{e.location ? ` · ${String(e.location)}` : ''}</li>
            {speaker && <li><UserRound size={13} aria-hidden="true" /> {speaker}</li>}
            <li><Users size={13} aria-hidden="true" /> Kuota {cap || 'tanpa batas'}</li>
            <li><Wallet size={13} aria-hidden="true" /> {price}</li>
          </ul>
          <small>Klik untuk melihat pendaftar</small>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
