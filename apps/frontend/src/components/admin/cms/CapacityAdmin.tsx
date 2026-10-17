'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Award, CalendarClock, CalendarDays, CircleAlert, Gauge, Hourglass, Infinity as InfinityIcon, Layers3, NotebookPen, Pencil, Users } from 'lucide-react';
import { useCms } from '@/lib/cms/store';
import { CAP_KIND, CAP_STATE, buildCapacity, daysTo, type CapKind, type CapRow, type CapState } from '@/lib/cms/capacity';
import { KpiTile } from './TableKit';
import { PageHeader, StagingNote, formatDate } from './ui';
import { useRegistrationSettings } from './useRegistrationSettings';

const EASE = [0.22, 1, 0.36, 1] as const;
const KIND_ICON: Record<CapKind, React.ReactNode> = { event: <CalendarDays size={16} />, mentor: <Award size={16} />, bootcamp: <NotebookPen size={16} /> };

/** Rows of the capacity list, shared by the page and the dashboard card. */
export function useCapacity() {
  const cms = useCms();
  const settings = useRegistrationSettings();
  const [now] = useState(() => Date.now());
  const rows = useMemo(() => buildCapacity(cms.sections, cms.collections, now, settings.payDeadlineHours), [cms.sections, cms.collections, now, settings.payDeadlineHours]);
  return { rows, now };
}

/** Keanggotaan → Kuota & Kapasitas: every limited seat in one place, edited where it is set. */
export function CapacityAdmin() {
  const { rows, now } = useCapacity();
  const settings = useRegistrationSettings();
  const [kind, setKind] = useState<CapKind | 'all'>('all');
  const [state, setState] = useState<CapState | 'active'>('active');
  const live = rows.filter((r) => r.state !== 'ended');
  const shown = rows.filter((r) => (kind === 'all' || r.kind === kind) && (state === 'active' ? r.state !== 'ended' : r.state === state));
  const cap = live.reduce((n, r) => n + r.cap, 0);
  const held = live.reduce((n, r) => n + r.held, 0);
  const tight = live.filter((r) => r.state === 'almost' || r.state === 'full').length;
  const soon = live.filter((r) => { const d = daysTo(r.deadline, now); return d >= 0 && d <= 7; }).length;
  const countKind = (k: CapKind | 'all') => rows.filter((r) => (k === 'all' || r.kind === k) && (state === 'active' ? r.state !== 'ended' : r.state === state)).length;

  return (
    <section className="cms-page">
      <PageHeader
        crumb={['Keanggotaan', 'Kuota & Kapasitas']}
        title="Kuota"
        accent="& Kapasitas"
        description="Semua kursi terbatas dalam satu daftar: event dan webinar, mentor Siap Tembus Scopus per bulan, dan angkatan Bootcamp. Angka dibaca langsung dari editor masing-masing."
      />
      <StagingNote />

      <section className="pov bov" aria-label="Ringkasan kapasitas">
        <header className="pov-head"><div><span className="pov-k">Ringkasan kapasitas aktif</span></div></header>
        <div className="pov-kpis bov-kpis evt-kpis">
          <KpiTile icon={<Users size={17} />} label="Kursi terisi" value={held} share={held / Math.max(1, cap)} />
          <KpiTile icon={<Layers3 size={17} />} label="Total kapasitas" value={cap} share={1} tone="ink" delay={0.05} />
          <KpiTile icon={<Gauge size={17} />} label="Hampir penuh / penuh" value={tight} share={tight / Math.max(1, live.length)} tone="danger" delay={0.1} />
          <KpiTile icon={<Hourglass size={17} />} label="Tenggat ≤ 7 hari" value={soon} share={soon / Math.max(1, live.length)} tone="ink" delay={0.15} />
        </div>
      </section>

      <div className="cms-list">
        <div className="cms-toolbar">
          <div className="cms-chips" role="tablist" aria-label="Jenis kuota">
            {(['all', 'event', 'mentor', 'bootcamp'] as const).map((k) => (
              <button type="button" role="tab" key={k} aria-selected={kind === k} onClick={() => setKind(k)}>{k === 'all' ? 'Semua' : CAP_KIND[k].label} <b>{countKind(k)}</b></button>
            ))}
          </div>
          <div className="cms-toolbar-right cap-states" role="radiogroup" aria-label="Status">
            {(['active', 'almost', 'full', 'ended'] as const).map((s) => (
              <button type="button" role="radio" key={s} aria-checked={state === s} onClick={() => setState(s)}>{s === 'active' ? 'Sedang berjalan' : CAP_STATE[s].label}</button>
            ))}
          </div>
        </div>
        <CapacityList rows={shown} now={now} />
        {!shown.length && <div className="cms-empty"><p>Tidak ada kuota dengan filter ini.</p></div>}
      </div>

      <section className="cap-member">
        <span className="cap-member__ico" aria-hidden="true"><InfinityIcon size={18} /></span>
        <div>
          <b>Membership terbuka tanpa kuota</b>
          <p>Registrasi member {settings.freeOpen ? 'sedang dibuka' : 'sedang ditutup'} dan ditinjau Tim Admin dalam {settings.reviewHours} jam. Buka atau tutup lewat Pengaturan Membership.</p>
        </div>
        <Link href="/admin/registration-settings" className="cms-btn cms-btn--ghost cms-btn--sm">Pengaturan Membership <ArrowUpRight size={13} /></Link>
      </section>
    </section>
  );
}

/** Capacity rows with a fill bar; `limit` keeps the dashboard card short. */
export function CapacityList({ rows, now, limit }: { rows: CapRow[]; now: number; limit?: number }) {
  const reduce = useReducedMotion();
  return (
    <ul className={`cap-list ${limit ? 'is-compact' : ''}`}>
      {rows.slice(0, limit ?? rows.length).map((r, i) => {
        const st = CAP_STATE[r.state];
        const share = r.cap ? Math.min(1, r.held / r.cap) : 0;
        const pend = r.cap ? Math.min(share, r.pending / r.cap) : 0;
        const d = daysTo(r.deadline, now);
        return (
          <motion.li key={r.id} className={`cap-row is-${r.state}`} initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE, delay: Math.min(i, 8) * 0.03 }}>
            <span className={`cap-row__ico is-${r.kind}`} aria-hidden="true">{KIND_ICON[r.kind]}</span>
            <div className="cap-row__main">
              <div className="cap-row__head">
                <b>{r.title}</b>
                <span className={`cms-badge cms-badge--${st.tone}`}>{st.label}</span>
              </div>
              <small>{CAP_KIND[r.kind].label} · {r.sub}</small>
              <div className="cap-bar" role="img" aria-label={`${r.held} dari ${r.cap} kursi terisi`}>
                <motion.i className="is-held" initial={reduce ? false : { scaleX: 0 }} animate={{ scaleX: share }} transition={{ duration: reduce ? 0 : 0.7, ease: EASE }} />
                {pend > 0 && <i className="is-pend" style={{ left: `${(share - pend) * 100}%`, width: `${pend * 100}%` }} />}
              </div>
              {r.parts && !limit && (
                <div className="cap-parts">
                  {r.parts.map((p) => (
                    <span key={p.label} className={p.held >= p.cap ? 'is-full' : ''} title={`${p.label}: ${p.held}/${p.cap}`}>
                      <i>{Array.from({ length: p.cap }, (_, k) => <em key={k} className={k < p.held ? 'is-on' : ''} />)}</i>
                      {p.label.replace(/^(Dr|Prof)\.?\s+/i, '')}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="cap-row__nums">
              <b>{r.held}<small>/{r.cap}</small></b>
              <span>{Math.max(0, r.cap - r.held)} sisa{r.pending ? ` · ${r.pending} belum bayar` : ''}{r.waitlist ? ` · ${r.waitlist} tunggu` : ''}</span>
            </div>
            <div className="cap-row__when">
              <span className={d >= 0 && d <= 7 && r.state !== 'ended' ? 'is-soon' : ''}>{d >= 0 && d <= 7 && r.state !== 'ended' ? <CircleAlert size={13} aria-hidden="true" /> : <CalendarClock size={13} aria-hidden="true" />} {r.state === 'ended' ? 'Selesai' : d < 0 ? 'Lewat' : d === 0 ? 'Hari ini' : `${d} hari lagi`}</span>
              <small>{r.kind === 'mentor' ? 'akhir bulan' : r.kind === 'bootcamp' ? 'tutup' : 'mulai'} {formatDate(r.deadline)}</small>
            </div>
            {!limit && <Link href={r.href} className="cms-btn cms-btn--ghost cms-btn--sm cap-row__edit"><Pencil size={13} /> Atur</Link>}
          </motion.li>
        );
      })}
    </ul>
  );
}
