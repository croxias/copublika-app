'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import * as Menu from '@radix-ui/react-dropdown-menu';
import { CalendarClock, CalendarDays, ChevronDown, Download, MessageSquareText, MoreVertical, Search, Ticket, Trash2, Users, X } from 'lucide-react';
import { useCms } from '@/lib/cms/store';
import { EVENT_TYPES, FORMATS, eventPhase, seatsTaken, speakerName } from '@/lib/cms/config/events';
import { HOLDS_SEAT, REG_STATUSES, type RegStatus } from '@/lib/cms/registrations';
import type { CmsItem, FieldContext, Values } from '@/lib/cms/types';
import { formatRupiah } from '@/lib/data/programs';
import { CmsSelect } from './CmsSelect';
import { Count, Kpi } from './ProgramOverview';
import { ConfirmDialog, formatDate } from './ui';

const EASE = [0.22, 1, 0.36, 1] as const;
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

/** "Pendaftar" tab: sign-ups per event with status, payment, questions and a CSV export. */
export function RegistrationsPanel() {
  const cms = useCms();
  const reduce = useReducedMotion();
  const events = useMemo(() => [...(cms.collections.events ?? [])].sort((a, b) => String(a.date).localeCompare(String(b.date))), [cms.collections.events]);
  const all = cms.collections.registrations ?? [];
  const [eventId, setEventId] = useState(() => events.find((e) => all.some((r) => r.eventId === e.id))?.id ?? 'all');
  const [status, setStatus] = useState<RegStatus | 'all'>('all');
  const [q, setQ] = useState('');
  const [onlyQuestions, setOnlyQuestions] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<CmsItem | null>(null);

  const scoped = all.filter((r) => eventId === 'all' || r.eventId === eventId);
  const shown = scoped
    .filter((r) => (status === 'all' || r.status === status) && (!onlyQuestions || String(r.question ?? '').trim()))
    .filter((r) => !q || `${String(r.name)} ${String(r.email)} ${String(r.org)}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
  const event = events.find((e) => e.id === eventId);
  const eventTitle = (r: CmsItem) => String(events.find((e) => e.id === r.eventId)?.title ?? r.eventTitle ?? '—');
  const held = scoped.filter((r) => HOLDS_SEAT.includes(r.status as RegStatus)).length;
  const cap = Number(event?.capacity) || 0;

  const setRow = (r: CmsItem, patch: Values) =>
    cms.setCollection('registrations', all.map((x) => (x.id === r.id ? { ...x, ...patch, updatedAt: new Date().toISOString() } : x)));
  const markAll = (from: RegStatus, to: RegStatus) => {
    const ids = new Set(shown.filter((r) => r.status === from).map((r) => r.id));
    if (!ids.size) return;
    cms.setCollection('registrations', all.map((x) => (ids.has(x.id) ? { ...x, status: to } : x)));
    cms.toast(`${ids.size} pendaftar ditandai ${statusOf(to).label.toLowerCase()}.`);
  };
  const remove = (r: CmsItem) => {
    const before = all;
    cms.removeItem('registrations', r.id);
    cms.toast('Pendaftar dihapus.', 'ok', { label: 'Urungkan', run: () => cms.setCollection('registrations', before) });
    setConfirmDelete(null);
  };
  const exportCsv = () => {
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = [['Event', 'Nama', 'Email', 'Institusi', 'Status', 'Pembayaran', 'Pertanyaan', 'Waktu daftar'], ...shown.map((r) => [eventTitle(r), r.name, r.email, r.org, statusOf(r.status).label, r.paid ? (r.payment === 'paid' ? 'Lunas' : 'Menunggu') : '-', r.question, formatDate(String(r.updatedAt), true)])];
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
        <CmsSelect
          aria-label="Pilih event"
          className="evt-reg-event"
          prefix="Event"
          value={eventId}
          onChange={setEventId}
          options={[{ value: 'all', label: 'Semua event' }, ...events.map((e) => ({ value: e.id, label: String(e.title), hint: `${formatDate(String(e.date))} · ${all.filter((r) => r.eventId === e.id).length} pendaftar` }))]}
        />
        {event && (
          <span className={`evt-reg-cap ${cap && held >= cap ? 'is-full' : ''}`}>
            <span><b>{held}</b>/{cap || '—'} kursi terisi</span>
            <i aria-hidden="true"><em style={{ width: `${cap ? Math.min(100, (held / cap) * 100) : 0}%` }} /></i>
          </span>
        )}
        <div className="cms-toolbar-right">
          <button type="button" className="cms-btn cms-btn--ghost cms-btn--sm" onClick={exportCsv} disabled={!shown.length}><Download size={14} /> Ekspor CSV</button>
        </div>
      </div>
      <div className="cms-toolbar evt-reg-filters">
        <div className="cms-chips" role="tablist" aria-label="Status pendaftar">
          <button type="button" role="tab" aria-selected={status === 'all'} onClick={() => setStatus('all')}>Semua <b>{scoped.length}</b></button>
          {REG_STATUSES.map((s) => (
            <button type="button" role="tab" key={s.value} aria-selected={status === s.value} onClick={() => setStatus(s.value)}>{s.label} <b>{count(s.value)}</b></button>
          ))}
        </div>
        <div className="cms-toolbar-right">
          <button type="button" className={`cms-btn cms-btn--ghost cms-btn--sm ${onlyQuestions ? 'is-on' : ''}`} aria-pressed={onlyQuestions} onClick={() => setOnlyQuestions((v) => !v)}><MessageSquareText size={14} /> Ada pertanyaan</button>
          <div className="cms-search">
            <Search size={14} aria-hidden="true" />
            <input aria-label="Cari pendaftar" placeholder="Cari nama, email, institusi…" value={q} onChange={(e) => setQ(e.target.value)} />
            {q && <button type="button" aria-label="Hapus pencarian" onClick={() => setQ('')}><X size={13} /></button>}
          </div>
        </div>
      </div>
      {status === 'registered' && shown.length > 0 && (
        <div className="evt-reg-bulk">
          <span>Setelah acara selesai, tandai kehadiran untuk sertifikat.</span>
          <button type="button" className="cms-btn cms-btn--solid cms-btn--sm" onClick={() => markAll('registered', 'attended')}>Tandai semua hadir</button>
        </div>
      )}
      <div className="cms-table-wrap">
        <table className="cms-table">
          <thead>
            <tr>
              <th>Pendaftar</th>
              {eventId === 'all' && <th style={{ width: 240 }}>Event</th>}
              <th style={{ width: 200 }}>Institusi</th>
              <th style={{ width: 140 }}>Status</th>
              <th style={{ width: 120 }}>Pembayaran</th>
              <th className="cms-col-updated" style={{ width: 150 }}>Waktu daftar</th>
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
                      <small>{String(r.email)}</small>
                      {String(r.question ?? '').trim() && <span className="evt-reg-q"><MessageSquareText size={12} aria-hidden="true" /> {String(r.question)}</span>}
                    </div>
                  </td>
                  {eventId === 'all' && <td className="cms-col-meta" data-label="Event"><span className="evt-reg-ev">{eventTitle(r)}</span></td>}
                  <td className="cms-col-meta" data-label="Institusi">{String(r.org || '—')}</td>
                  <td className="cms-col-meta" data-label="Status"><span className={`cms-badge cms-badge--${st.tone}`}>{st.label}</span></td>
                  <td className="cms-col-meta" data-label="Pembayaran">
                    {r.paid ? (
                      <button type="button" className={`evt-pay ${r.payment === 'paid' ? 'is-paid' : ''}`} onClick={() => setRow(r, { payment: r.payment === 'paid' ? 'pending' : 'paid' })} title="Klik untuk mengubah">
                        {r.payment === 'paid' ? 'Lunas' : 'Menunggu'}
                      </button>
                    ) : <span className="cms-muted">Gratis</span>}
                  </td>
                  <td className="cms-col-meta cms-col-updated cms-muted cms-nowrap" data-label="Waktu daftar">{formatDate(String(r.updatedAt), true)}</td>
                  <td className="cms-col-actions">
                    <Menu.Root modal={false}>
                      <Menu.Trigger className="cms-kebab" aria-label={`Aksi untuk ${String(r.name)}`}><MoreVertical size={16} /></Menu.Trigger>
                      <Menu.Portal>
                        <Menu.Content className="cms-menu" align="end" sideOffset={6} collisionPadding={12}>
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
          <span className="evt-pv__pill">{EVENT_TYPES.find((t) => t.value === v.type)?.label ?? 'Event'}{v.memberOnly ? ' · khusus anggota' : ''}</span>
          <strong>{String(v.title || 'Judul event')}</strong>
          <p>{String(v.summary || 'Ringkasan event tampil di sini.')}</p>
          <ul>
            <li>{FORMATS.find((f) => f.value === v.format)?.label} · {String(v.location || 'Lokasi')}</li>
            <li>{v.isPaid ? (Number(v.price) ? formatRupiah(Number(v.price)) : 'Berbayar') : 'Gratis untuk anggota'}</li>
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
