'use client';

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

// Date input for the admin: type it as DD/MM/YYYY (slashes are added as you type) or pick it from
// a calendar. The value stays an ISO day ("2026-10-17"), like <input type="date">.

const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const pad = (n: number) => String(n).padStart(2, '0');
const isoOf = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromIso = (v: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
};
const toText = (v: string) => {
  const d = fromIso(v);
  return d ? `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}` : '';
};
/** "17/10/2026", "17-10-2026" or "17.10.2026" → ISO, or null when it is not a real date. */
const parseText = (t: string) => {
  const m = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/.exec(t.trim());
  if (!m) return null;
  const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  return d.getDate() === Number(m[1]) && d.getMonth() === Number(m[2]) - 1 ? isoOf(d) : null;
};
/**
 * Keeps typing in DD/MM/YYYY shape: digits fill day (2), month (2) and year (4) in turn and the
 * slashes appear on their own; a typed "/", "-" or "." moves on early ("1/11/2026" works too).
 */
const mask = (raw: string) => {
  const limits = [2, 2, 4];
  const parts = ['', '', ''];
  let i = 0;
  for (const ch of raw) {
    if (/\d/.test(ch)) {
      if (parts[i].length === limits[i]) i += 1;
      if (i > 2) break;
      parts[i] += ch;
    } else if (/[/.-]/.test(ch) && parts[i] && i < 2) {
      i += 1;
    }
  }
  return parts.slice(0, i + 1).join('/');
};
export const longDate = (v: string) => {
  const d = fromIso(v);
  return d ? d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '';
};

/** hint shows the chosen day in words ("Minggu, 1 November 2026") under the field. */
type Props = { id?: string; value: string; onChange: (iso: string) => void; min?: string; max?: string; invalid?: boolean; hint?: boolean; 'aria-label'?: string };

export function DateField({ id, value, onChange, min, max, invalid, hint, ...rest }: Props) {
  const [text, setText] = useState(() => toText(value));
  const [typedBad, setTypedBad] = useState(false);
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  // Follow outside changes (another control, a reset) without clobbering what is being typed.
  const [shown, setShown] = useState(value);
  if (shown !== value) {
    setShown(value);
    setText(toText(value));
    setTypedBad(false);
  }

  const inRange = (iso: string) => (!min || iso >= min) && (!max || iso <= max);
  const commit = (iso: string) => {
    setShown(iso);
    setText(toText(iso));
    setTypedBad(false);
    onChange(iso);
  };
  const onType = (raw: string) => {
    const t = mask(raw);
    setText(t);
    const iso = parseText(t);
    if (iso && inRange(iso)) {
      setShown(iso);
      setTypedBad(false);
      onChange(iso);
    }
  };
  const onBlur = () => {
    if (!text.trim()) return;
    const iso = parseText(text);
    setTypedBad(!iso || !inRange(iso));
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Anchor asChild>
        <div ref={anchor} className={`dtf ${invalid || typedBad ? 'is-invalid' : ''} ${open ? 'is-open' : ''}`}>
          <input
            ref={input}
            id={id}
            value={text}
            onChange={(e) => onType(e.target.value)}
            onBlur={onBlur}
            onClick={() => setOpen(true)}
            onKeyDown={(e) => {
              // ↓ opens the calendar; ↓ again moves into the days.
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (!open) setOpen(true);
                else document.querySelector<HTMLButtonElement>('.dtf-pop .dtf-grid [tabindex="0"]')?.focus();
              }
              if (e.key === 'Escape' && open) { e.stopPropagation(); setOpen(false); }
            }}
            inputMode="numeric"
            placeholder="HH/BB/TTTT"
            aria-label={rest['aria-label']}
            aria-invalid={invalid || typedBad || undefined}
            autoComplete="off"
          />
          <Popover.Trigger className="dtf-btn" aria-label="Buka kalender" type="button">
            <CalendarDays size={16} />
          </Popover.Trigger>
        </div>
      </Popover.Anchor>
      {typedBad ? <span className="dtf-err">Tanggal tidak valid. Contoh: 17/10/2026.</span> : hint && <span className="dtf-hint">{value ? longDate(value) : 'Ketik HH/BB/TTTT atau pilih dari kalender'}</span>}
      <Popover.Portal>
        <Popover.Content
          className="dtf-pop"
          align="start"
          sideOffset={8}
          collisionPadding={12}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.stopPropagation()}
          onInteractOutside={(e) => { if (anchor.current?.contains(e.target as Node)) e.preventDefault(); }}
        >
          <Calendar key={value} value={value} min={min} max={max} onPick={(iso) => { commit(iso); setOpen(false); input.current?.focus(); }} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function Calendar({ value, min, max, onPick }: { value: string; min?: string; max?: string; onPick: (iso: string) => void }) {
  const today = isoOf(new Date());
  const start = fromIso(value) ?? new Date();
  const [view, setView] = useState({ y: start.getFullYear(), m: start.getMonth() });
  const [mode, setMode] = useState<'days' | 'months'>('days');
  const [focus, setFocus] = useState(value || today);
  const grid = useRef<HTMLDivElement>(null);
  // Only arrow-key navigation moves focus into the grid, so typing in the input is never interrupted.
  const keyed = useRef(false);

  const days = useMemo(() => {
    const first = new Date(view.y, view.m, 1);
    const lead = (first.getDay() + 6) % 7; // Monday first
    return Array.from({ length: 42 }, (_, i) => new Date(view.y, view.m, 1 - lead + i));
  }, [view]);
  const ok = (iso: string) => (!min || iso >= min) && (!max || iso <= max);
  const shift = (months: number) => setView((v) => { const d = new Date(v.y, v.m + months, 1); return { y: d.getFullYear(), m: d.getMonth() }; });

  // Keep keyboard focus on the focused day as it moves across months.
  useEffect(() => {
    if (!keyed.current) return;
    grid.current?.querySelector<HTMLButtonElement>(`[data-iso="${focus}"]`)?.focus({ preventScroll: true });
  }, [focus, view]);

  const move = (e: KeyboardEvent) => {
    const step: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    const d = fromIso(focus) ?? new Date();
    if (e.key in step) d.setDate(d.getDate() + step[e.key]);
    else if (e.key === 'PageUp') d.setMonth(d.getMonth() - 1);
    else if (e.key === 'PageDown') d.setMonth(d.getMonth() + 1);
    else return;
    e.preventDefault();
    keyed.current = true;
    const iso = isoOf(d);
    setFocus(iso);
    if (d.getMonth() !== view.m || d.getFullYear() !== view.y) setView({ y: d.getFullYear(), m: d.getMonth() });
  };

  return (
    <div className="dtf-cal">
      <div className="dtf-head">
        <button type="button" className="dtf-nav" onClick={() => (mode === 'days' ? shift(-1) : setView((v) => ({ ...v, y: v.y - 1 })))} aria-label={mode === 'days' ? 'Bulan sebelumnya' : 'Tahun sebelumnya'}><ChevronLeft size={16} /></button>
        <button type="button" className="dtf-title" onClick={() => setMode((m) => (m === 'days' ? 'months' : 'days'))} aria-label="Pilih bulan dan tahun">
          {mode === 'days' ? <>{MONTHS[view.m]} <b>{view.y}</b></> : <b>{view.y}</b>}
        </button>
        <button type="button" className="dtf-nav" onClick={() => (mode === 'days' ? shift(1) : setView((v) => ({ ...v, y: v.y + 1 })))} aria-label={mode === 'days' ? 'Bulan berikutnya' : 'Tahun berikutnya'}><ChevronRight size={16} /></button>
      </div>

      {mode === 'months' ? (
        <div className="dtf-months">
          {MONTHS.map((name, i) => (
            <button type="button" key={name} className={i === view.m ? 'is-on' : ''} onClick={() => { setView((v) => ({ ...v, m: i })); setMode('days'); }}>{name.slice(0, 3)}</button>
          ))}
        </div>
      ) : (
        <>
          <div className="dtf-week" aria-hidden="true">{DAYS.map((d) => <span key={d} className={d === 'Min' ? 'is-sun' : ''}>{d}</span>)}</div>
          <div className="dtf-grid" role="grid" ref={grid} onKeyDown={move}>
            {days.map((d) => {
              const iso = isoOf(d);
              const outside = d.getMonth() !== view.m;
              return (
                <button
                  type="button"
                  key={iso}
                  data-iso={iso}
                  tabIndex={iso === focus ? 0 : -1}
                  disabled={!ok(iso)}
                  className={`${outside ? 'is-out' : ''} ${iso === today ? 'is-today' : ''} ${iso === value ? 'is-on' : ''} ${d.getDay() === 0 ? 'is-sun' : ''}`}
                  aria-pressed={iso === value}
                  aria-label={longDate(iso)}
                  onClick={() => onPick(iso)}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </>
      )}

      <div className="dtf-foot">
        <button type="button" onClick={() => ok(today) && onPick(today)} disabled={!ok(today)}>Hari ini</button>
        <span>{value ? longDate(value) : 'Belum dipilih'}</span>
      </div>
    </div>
  );
}
