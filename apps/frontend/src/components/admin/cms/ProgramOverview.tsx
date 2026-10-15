'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, animate, motion, useReducedMotion } from 'framer-motion';
import { CalendarClock, ChevronDown, Layers, Users, Wallet } from 'lucide-react';
import { useCms } from '@/lib/cms/store';
import type { Values } from '@/lib/cms/types';
import { formatDate, formatRupiah, seatMonths } from '@/lib/data/programs';

const EASE = [0.22, 1, 0.36, 1] as const;
const num = (v: unknown) => (Number.isFinite(Number(v)) ? Number(v) : 0);

/** Number that counts up when it changes. */
function Count({ value, format = (n: number) => String(n) }: { value: number; format?: (n: number) => string }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(value);
  useEffect(() => {
    if (reduce) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShown(value);
      return;
    }
    const c = animate(shown, value, { duration: 0.8, ease: EASE, onUpdate: (v) => setShown(Math.round(v)) });
    return () => c.stop();
    // Animate from whatever is on screen to the new value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduce]);
  return <>{format(shown)}</>;
}

/** Ring that fills to the share of seats still open. */
function SeatRing({ left, total, label }: { left: number; total: number; label: string }) {
  const share = total > 0 ? left / total : 0;
  const tone = left === 0 ? 'is-full' : share <= 0.25 ? 'is-low' : '';
  return (
    <div className={`pov-ring ${tone}`}>
      <svg viewBox="0 0 44 44" aria-hidden="true">
        <circle cx="22" cy="22" r="18" />
        <motion.circle cx="22" cy="22" r="18" pathLength={1} initial={{ pathLength: 0 }} animate={{ pathLength: share }} transition={{ duration: 0.9, ease: EASE }} />
      </svg>
      <div>
        <strong><Count value={left} /><small>/{total}</small></strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

function Bar({ value, total, label }: { value: number; total: number; label: string }) {
  const left = Math.max(0, total - value);
  return (
    <div className={`pov-bar ${left === 0 ? 'is-full' : ''}`}>
      <span className="pov-bar__label">{label}</span>
      <span className="pov-bar__track" aria-hidden="true">
        <motion.i initial={{ width: 0 }} animate={{ width: `${total > 0 ? Math.min(100, (value / total) * 100) : 0}%` }} transition={{ duration: 0.7, ease: EASE }} />
      </span>
      <span className="pov-bar__text">{left === 0 ? 'Penuh' : `${left} sisa`}</span>
    </div>
  );
}

/**
 * Summary above a program editor: price, open seats and per-mentor / per-batch bars,
 * read from the saved CMS values so it reflects what the public page will show.
 */
export function ProgramOverview({ kind }: { kind: 'sts' | 'btm' }) {
  const cms = useCms();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(true);
  const offer: Values = cms.sections[`program.${kind}.offer`] ?? {};
  const people = cms.collections.people ?? [];

  return (
    <section className="pov" aria-label="Ringkasan program">
      <header className="pov-head">
        <div>
          <span className="pov-k">Ringkasan program</span>
          <p>Dari data yang tersimpan. Ubah di tab {kind === 'sts' ? 'Harga & kursi' : 'Harga & angkatan'}.</p>
        </div>
        <button type="button" className="cms-btn cms-btn--ghost cms-btn--sm" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? 'Sembunyikan' : 'Tampilkan'} <ChevronDown size={14} className={`pov-caret ${open ? 'is-open' : ''}`} />
        </button>
      </header>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="pov-body"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE }}
          >
            {kind === 'sts' ? <StsSummary offer={offer} people={people} /> : <BtmSummary offer={offer} />}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Kpi({ icon, label, children, delay = 0 }: { icon: React.ReactNode; label: string; children: React.ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className="pov-kpi" initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay, ease: EASE }}>
      <span className="pov-kpi__ico" aria-hidden="true">{icon}</span>
      <span className="pov-kpi__label">{label}</span>
      <div className="pov-kpi__value">{children}</div>
    </motion.div>
  );
}

function StsSummary({ offer, people }: { offer: Values; people: Values[] }) {
  const quota = Math.max(1, num(offer.seatsPerMentor) || 4);
  const mentors = (Array.isArray(offer.mentors) ? offer.mentors : []) as Values[];
  const months = seatMonths();
  const leftThis = mentors.reduce((n, m) => n + Math.max(0, quota - num(m.bookedThis)), 0);
  const leftNext = mentors.reduce((n, m) => n + Math.max(0, quota - num(m.bookedNext)), 0);
  const total = mentors.length * quota;

  return (
    <>
      <div className="pov-kpis">
        <Kpi icon={<Wallet size={16} />} label="Harga program">
          <strong><Count value={num(offer.price)} format={formatRupiah} /></strong>
          <small>{String(offer.unit ?? '')}</small>
        </Kpi>
        <Kpi icon={<Users size={16} />} label="Mentor 1-on-1" delay={0.05}>
          <strong><Count value={mentors.length} /></strong>
          <small>kuota {quota} peserta / mentor / bulan</small>
        </Kpi>
        <Kpi icon={<CalendarClock size={16} />} label="Sisa kursi" delay={0.1}>
          <div className="pov-rings">
            <SeatRing left={leftThis} total={total} label={months[0].label} />
            <SeatRing left={leftNext} total={total} label={months[1].label} />
          </div>
        </Kpi>
      </div>
      <div className="pov-list">
        <div className="pov-list__head"><span>Mentor</span><span>{months[0].label}</span><span>{months[1].label}</span></div>
        {mentors.map((m, i) => {
          const person = people.find((p) => p.id === m.mentor);
          return (
            <motion.div key={`${String(m.mentor)}-${i}`} className="pov-row" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.04 * i }}>
              <span className="pov-row__who">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {person?.photo ? <img src={String(person.photo)} alt="" /> : <i />}
                {String(person?.name ?? m.mentor ?? 'Mentor')}
              </span>
              <Bar value={num(m.bookedThis)} total={quota} label="bulan ini" />
              <Bar value={num(m.bookedNext)} total={quota} label="bulan depan" />
            </motion.div>
          );
        })}
      </div>
    </>
  );
}

function BtmSummary({ offer }: { offer: Values }) {
  const batches = (Array.isArray(offer.batches) ? offer.batches : []) as Values[];
  // Read the clock once per mount so render stays pure.
  const [now] = useState(() => Date.now());
  const today = new Date(now).toISOString().slice(0, 10);
  const next = batches.find((b) => String(b.closes ?? '') >= today) ?? batches[0];
  const daysToClose = next?.closes ? Math.ceil((new Date(`${String(next.closes)}T23:59:00+07:00`).getTime() - now) / 86_400_000) : null;
  const status = (b: Values) => {
    const left = Math.max(0, num(b.seats) - num(b.booked));
    if (left === 0) return { text: 'Penuh', tone: 'is-full' };
    if (String(b.closes ?? '') < today) return { text: 'Ditutup', tone: 'is-closed' };
    return { text: 'Dibuka', tone: 'is-open' };
  };

  return (
    <>
      <div className="pov-kpis">
        <Kpi icon={<Wallet size={16} />} label="Harga program">
          <strong><Count value={num(offer.price)} format={formatRupiah} /></strong>
          <small>{String(offer.unit ?? '')}</small>
        </Kpi>
        <Kpi icon={<Layers size={16} />} label="Angkatan berikutnya" delay={0.05}>
          <strong>{String(next?.name ?? '—')}</strong>
          <small>
            {next?.start ? `${formatDate(String(next.start))} – ${formatDate(String(next.end))}` : 'Belum ada angkatan'}
            {daysToClose !== null && daysToClose >= 0 ? ` · tutup ${daysToClose} hari lagi` : ''}
          </small>
        </Kpi>
        <Kpi icon={<CalendarClock size={16} />} label="Sisa kursi" delay={0.1}>
          {next ? <SeatRing left={Math.max(0, num(next.seats) - num(next.booked))} total={num(next.seats)} label={String(next.name ?? '')} /> : <small>—</small>}
        </Kpi>
      </div>
      <div className="pov-list">
        <div className="pov-list__head"><span>Angkatan</span><span>Kursi terisi</span><span>Status</span></div>
        {batches.map((b, i) => {
          const st = status(b);
          return (
            <motion.div key={`${String(b.id ?? b.name)}-${i}`} className="pov-row" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.04 * i }}>
              <span className="pov-row__who">
                <strong>{String(b.name ?? '')}</strong>
                <small>{b.start ? `${formatDate(String(b.start), false)} – ${formatDate(String(b.end))}` : ''}</small>
              </span>
              <Bar value={num(b.booked)} total={num(b.seats)} label={`${num(b.booked)}/${num(b.seats)}`} />
              <span className={`pov-status ${st.tone}`}>{st.text}</span>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
