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
export function Count({ value, format = (n: number) => String(n) }: { value: number; format?: (n: number) => string }) {
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

/**
 * Summary above a program editor: price, open seats and per-mentor / per-batch bars,
 * read from the saved CMS values so it reflects what the public page will show.
 */
export function ProgramOverview({ kind }: { kind: 'sts' | 'btm' }) {
  const cms = useCms();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(true);
  const offer: Values = cms.sections[`program.${kind}.offer`] ?? {};

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
            {kind === 'sts' ? <StsSummary offer={offer} /> : <BtmSummary offer={offer} />}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export function Kpi({ icon, label, children, delay = 0 }: { icon: React.ReactNode; label: string; children: React.ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className="pov-kpi" initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay, ease: EASE }}>
      <span className="pov-kpi__ico" aria-hidden="true">{icon}</span>
      <span className="pov-kpi__label">{label}</span>
      <div className="pov-kpi__value">{children}</div>
    </motion.div>
  );
}

function StsSummary({ offer }: { offer: Values }) {
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
    </>
  );
}

function BtmSummary({ offer }: { offer: Values }) {
  const reduce = useReducedMotion();
  const batches = (Array.isArray(offer.batches) ? offer.batches : []) as Values[];
  // Read the clock once per mount so render stays pure. Dates are compared in WIB.
  const [now] = useState(() => Date.now());
  const closesAt = (b: Values) => new Date(`${String(b.closes ?? '')}T23:59:00+07:00`).getTime();
  const daysTo = (b: Values) => Math.ceil((closesAt(b) - now) / 86_400_000);
  // Registration closed (closing date passed) means the batch leaves the summary on its own.
  const open = batches.filter((b) => b.closes && closesAt(b) >= now).sort((x, y) => closesAt(x) - closesAt(y));
  const hidden = batches.length - open.length;
  const next = open[0];
  const left = (b: Values) => Math.max(0, num(b.seats) - num(b.booked));

  return (
    <>
      <div className="pov-kpis">
        <Kpi icon={<Wallet size={16} />} label="Harga program">
          <strong><Count value={num(offer.price)} format={formatRupiah} /></strong>
          <small>{String(offer.unit ?? '')}</small>
        </Kpi>
        <Kpi icon={<Layers size={16} />} label="Angkatan berikutnya" delay={0.05}>
          <strong>{String(next?.name ?? 'Belum ada')}</strong>
          <small>
            {next ? `${formatDate(String(next.start))} – ${formatDate(String(next.end))} · tutup ${daysTo(next)} hari lagi` : 'Tambahkan angkatan di tab Harga & angkatan'}
          </small>
        </Kpi>
        <Kpi icon={<CalendarClock size={16} />} label="Sisa kursi" delay={0.1}>
          {next ? <SeatRing left={left(next)} total={num(next.seats)} label={String(next.name ?? '')} /> : <small>—</small>}
        </Kpi>
      </div>

      <div className="pov-batches">
        <div className="pov-batches__head">
          <span className="pov-list__head">Angkatan yang dibuka</span>
          {hidden > 0 && <small>{hidden} angkatan sudah ditutup dan disembunyikan</small>}
        </div>
        {open.length ? (
          <div className="pov-batches__grid">
            {open.map((b, i) => {
              const total = num(b.seats);
              const taken = num(b.booked);
              const share = total ? Math.min(1, taken / total) : 0;
              const full = left(b) === 0;
              const d = daysTo(b);
              const tone = full ? 'is-full' : d <= 7 ? 'is-soon' : 'is-open';
              return (
                <motion.article
                  key={`${String(b.id ?? b.name)}-${i}`}
                  className={`pov-batch ${tone}`}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * i, ease: EASE }}
                >
                  <header>
                    <strong>{String(b.name ?? '')}</strong>
                    <span className={`pov-status ${full ? 'is-full' : 'is-open'}`}>{full ? 'Penuh' : 'Dibuka'}</span>
                  </header>
                  <p className="pov-batch__dates">{b.start ? `${formatDate(String(b.start), false)} – ${formatDate(String(b.end))}` : ''}</p>
                  <div className="pov-batch__seats">
                    <span><b><Count value={taken} /></b>/{total} kursi terisi</span>
                    <span>{full ? 'Tidak ada sisa' : `${left(b)} sisa`}</span>
                  </div>
                  <span className="pov-batch__track" aria-hidden="true">
                    <motion.i initial={{ width: 0 }} animate={{ width: `${share * 100}%` }} transition={{ duration: 0.8, delay: 0.1 + 0.05 * i, ease: EASE }} />
                  </span>
                  <footer>
                    <CalendarClock size={13} aria-hidden="true" />
                    {d <= 0 ? 'Pendaftaran tutup hari ini' : `Pendaftaran tutup ${d} hari lagi`} · {formatDate(String(b.closes))}
                  </footer>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <p className="pov-batches__empty">Tidak ada angkatan yang sedang dibuka. Tambahkan angkatan baru di tab Harga & angkatan.</p>
        )}
      </div>
    </>
  );
}
