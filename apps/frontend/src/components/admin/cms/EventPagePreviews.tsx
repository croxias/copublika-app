'use client';

import { CopublikaMark } from '@/components/brand/CopublikaMark';
import { EVENT_TYPES, eventPhase, seatsTaken } from '@/lib/cms/config/events';
import type { CmsItem, FieldContext, Values } from '@/lib/cms/types';
import { formatRupiah } from '@/lib/data/programs';

// Live, clickable schematics of the /event sections for "Halaman Event". Parts with a group key
// open that sub-tab; dashed parts come from Agenda Event.

const str = (v: unknown) => (v === undefined || v === null ? '' : String(v));
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
type Props = { values: Values; active: string; onPick: (group: string) => void; ctx: FieldContext };

function Part({ group, active, onPick, className = '', children, label }: { group: string; active: string; onPick: (g: string) => void; className?: string; children: React.ReactNode; label: string }) {
  return (
    <button type="button" className={`cms-mini-part ${className} ${active === group ? 'is-active' : ''}`} onClick={() => onPick(group)} aria-label={`Edit ${label}`} aria-pressed={active === group}>
      {children}
    </button>
  );
}

function Data({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`cms-mini-part bpp-data ${className}`}>
      <span className="bpp-data__k">Otomatis · Agenda Event</span>
      {children}
    </div>
  );
}

function Head({ v, active, onPick }: Pick<Props, 'active' | 'onPick'> & { v: Values }) {
  return (
    <Part group="h-head" active={active} onPick={onPick} className="cms-mini-head" label="judul section">
      <span className="cms-mini-tag bpp-tag">{str(v.tag) || 'Label kecil'}</span>
      <span className="cms-mini-title">{str(v.title) || 'Judul'} <em>{str(v.accent)}</em></span>
      {str(v.lead) && <span className="cms-mini-text cms-mini-text--wrap">{str(v.lead)}</span>}
    </Part>
  );
}

const upcomingOf = (ctx: FieldContext) =>
  (ctx.collections.events ?? []).filter((e) => e.status === 'published' && eventPhase(e) !== 'ended').sort((a, b) => str(a.date).localeCompare(str(b.date)));
const day = (e?: CmsItem) => (e ? Number(str(e.date).slice(8)) : '--');
const mon = (e?: CmsItem) => (e ? MONTHS[Number(str(e.date).slice(5, 7)) - 1] : '');

export function EventHeroPreview({ values: v, active, onPick, ctx }: Props) {
  const up = upcomingOf(ctx);
  return (
    <div className="cms-mini-surface is-ink">
      <div className="bpp-hero">
        <div className="bpp-hero__copy">
          <Part group="h-text" active={active} onPick={onPick} label="teks pembuka">
            <span className="bpp-pill">{str(v.pill) || 'Label kecil'}</span>
            <span className="cms-mini-hero__h">{str(v.title)} <em>{str(v.accent)}</em></span>
            <span className="cms-mini-text cms-mini-text--wrap">{str(v.lead)}</span>
          </Part>
          <Part group="h-cta" active={active} onPick={onPick} className="cms-mini-ctas" label="tombol">
            <span className="is-primary">{str(v.ctaPrimary) || 'Tombol utama'}</span>
            {str(v.ctaSecondary) && <span>{str(v.ctaSecondary)}</span>}
          </Part>
          <Data className="bpp-stats">
            <span><b>{up.length}</b> mendatang</span>
            <span><b>{up.filter((e) => !e.isPaid).length}</b> gratis</span>
            <span><b>{up.reduce((n, e) => n + Math.max(0, (Number(e.capacity) || 0) - seatsTaken(e.id, ctx)), 0)}</b> kursi</span>
          </Data>
        </div>
        <Data className="epp-cal">
          <span className="epp-cal__head">{mon(up[0]) || 'Bulan'}</span>
          <span className="epp-cal__grid" aria-hidden="true">
            {Array.from({ length: 21 }, (_, i) => <i key={i} className={up.some((e) => Number(str(e.date).slice(8)) === i + 8) ? 'is-on' : ''} />)}
          </span>
          <span className="cms-mini-text">Kalender 3D · {up.length} acara</span>
        </Data>
      </div>
    </div>
  );
}

export function EventNextPreview({ values: v, active, onPick, ctx }: Props) {
  const up = upcomingOf(ctx);
  const next = up.find((e) => e.pinned) ?? up[0];
  return (
    <div className="cms-mini-surface bpp-warm">
      <Head v={v} active={active} onPick={onPick} />
      <Data className="epp-ticket">
        <span className="epp-ticket__date"><b>{day(next)}</b><small>{mon(next)}</small></span>
        <span className="epp-ticket__body">
          <small>{EVENT_TYPES.find((t) => t.value === next?.type)?.label ?? 'Event'}{next?.pinned ? ' · disematkan' : ''}</small>
          <strong>{next ? str(next.title) : 'Belum ada acara mendatang'}</strong>
        </span>
        <span className="epp-ticket__stub"><b>08</b><b>11</b><b>42</b></span>
      </Data>
    </div>
  );
}

export function EventAgendaPreview({ values: v, active, onPick, ctx }: Props) {
  const up = upcomingOf(ctx).slice(1, 5);
  return (
    <div className="cms-mini-surface">
      <Head v={v} active={active} onPick={onPick} />
      <Data className="epp-table">
        {up.map((e) => (
          <span key={e.id} className="epp-row">
            <b>{day(e)}</b>
            <strong>{str(e.title)}</strong>
            <small>{Math.max(0, (Number(e.capacity) || 0) - seatsTaken(e.id, ctx))} kursi</small>
          </span>
        ))}
        {!up.length && <span className="cms-mini-text">Belum ada acara lain.</span>}
      </Data>
    </div>
  );
}

export function EventDetailPreview({ values: v, active, onPick }: Props) {
  return (
    <div className="cms-mini-surface bpp-detail">
      <Part group="h-price" active={active} onPick={onPick} className="epp-reg" label="harga dan pendaftaran">
        <small>Biaya</small>
        <strong>Gratis</strong>
        <span className="cms-mini-text">Untuk anggota · umum {formatRupiah(Number(v.nonMemberPrice) || 0)}</span>
        <i>{str(v.doneTitle) || 'Pendaftaran diterima.'}</i>
      </Part>
      <Part group="h-more" active={active} onPick={onPick} className="cms-mini-head" label="acara berikutnya">
        <span className="cms-mini-tag bpp-tag">{str(v.moreTag)}</span>
        <span className="cms-mini-title">{str(v.moreTitle)} <em>{str(v.moreAccent)}</em></span>
      </Part>
      <span className="epp-mark" aria-hidden="true"><CopublikaMark /></span>
    </div>
  );
}
