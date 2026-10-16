'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Count } from './ProgramOverview';

const EASE = [0.22, 1, 0.36, 1] as const;

export type KpiTone = 'accent' | 'danger' | 'ok' | 'ink';

/**
 * A KPI card in the same style as the other summary panels (pov-kpi): icon, label and one big
 * number, plus a ring showing its share of the whole instead of a supporting sentence.
 */
export function KpiTile({ icon, label, value, share, tone = 'accent', delay = 0 }: { icon: React.ReactNode; label: string; value: number; share: number; tone?: KpiTone; delay?: number }) {
  const reduce = useReducedMotion();
  const r = 22;
  const c = 2 * Math.PI * r;
  const pct = Math.round(Math.min(1, Math.max(0, share)) * 100);
  const numberTone = !value ? '' : tone === 'danger' ? 'bov-no' : tone === 'ok' ? 'bov-ok' : tone === 'accent' ? 'bov-hot' : '';
  return (
    <motion.div className={`pov-kpi kpt is-${tone}`} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay, ease: EASE }}>
      <span className="pov-kpi__ico" aria-hidden="true">{icon}</span>
      <span className="pov-kpi__label">{label}</span>
      <div className="pov-kpi__value kpt__value-row">
        <strong className={numberTone}><Count value={value} /></strong>
        <svg className="kpt__ring" viewBox="0 0 56 56" role="img" aria-label={`${pct}% dari total`}>
          <circle cx="28" cy="28" r={r} className="kpt__track" />
          <motion.circle
            cx="28"
            cy="28"
            r={r}
            className="kpt__arc"
            strokeDasharray={c}
            initial={reduce ? false : { strokeDashoffset: c }}
            animate={{ strokeDashoffset: c * (1 - pct / 100) }}
            transition={{ duration: 0.9, delay: delay + 0.15, ease: EASE }}
          />
          <text x="28" y="28" className="kpt__pct">{pct}%</text>
        </svg>
      </div>
    </motion.div>
  );
}

/** Page buttons under a table; hides itself for a single page. */
export function Pager({ page, pages, onPage }: { page: number; pages: number; onPage: (p: number) => void }) {
  if (pages <= 1) return null;
  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter((n) => n === 1 || n === pages || Math.abs(n - page) <= 1);
  return (
    <nav className="cms-pager" aria-label="Halaman tabel">
      <button type="button" aria-label="Halaman sebelumnya" disabled={page === 1} onClick={() => onPage(page - 1)}><ChevronLeft size={15} /></button>
      {nums.map((n, i) => (
        <span key={n} style={{ display: 'contents' }}>
          {i > 0 && n - nums[i - 1] > 1 && <span className="kpt-gap" aria-hidden="true">…</span>}
          <button type="button" aria-current={page === n ? 'page' : undefined} onClick={() => onPage(n)}>{n}</button>
        </span>
      ))}
      <button type="button" aria-label="Halaman berikutnya" disabled={page === pages} onClick={() => onPage(page + 1)}><ChevronRight size={15} /></button>
    </nav>
  );
}

export const PAGE_SIZE = 8;
