'use client';

import {
  Building2, CalendarRange, ChartColumn, ChevronLeft, ChevronRight, CircleHelp, Eye, FileText, Footprints, GraduationCap, Heading,
  ImageIcon, LayoutGrid, Link2, MousePointerClick, Orbit, PenLine, Quote, Search, ShieldCheck, Star, Tag, Ticket, TrendingUp, Type, UserRound, Users,
} from 'lucide-react';
import type { Field, GroupIcon, Values } from '@/lib/cms/types';
import type { Errors } from './validate';

const ICONS: Record<GroupIcon, typeof Heading> = {
  heading: Heading, link: Link2, display: LayoutGrid, users: Users, orbit: Orbit, mentor: GraduationCap,
  shield: ShieldCheck, progress: TrendingUp, steps: Footprints, calendar: CalendarRange, ticket: Ticket,
  cursor: MousePointerClick, quote: Quote, help: CircleHelp, chart: ChartColumn, text: Type,
  file: FileText, user: UserRound, image: ImageIcon, star: Star, pen: PenLine, search: Search, tag: Tag, building: Building2, eye: Eye,
};

export function GroupIconView({ icon, size = 15 }: { icon?: GroupIcon; size?: number }) {
  const Icon = icon ? ICONS[icon] : LayoutGrid;
  return <Icon size={size} strokeWidth={1.9} aria-hidden="true" />;
}

export type Group = { key: string; label: string; short: string; icon?: GroupIcon; help?: string; fields: Field[] };

/** Splits a section's fields at its heading fields: each heading starts a group (sub-tab). */
export function splitGroups(fields: Field[]): Group[] {
  const groups: Group[] = [];
  let current: Group | null = null;
  for (const f of fields) {
    if (f.type === 'heading') {
      current = { key: f.key, label: f.label, short: f.short ?? f.label, icon: f.icon, help: f.help, fields: [] };
      groups.push(current);
    } else {
      if (!current) {
        current = { key: '_main', label: 'Umum', short: 'Umum', fields: [] };
        groups.push(current);
      }
      current.fields.push(f);
    }
  }
  return groups;
}

const keysOf = (g: Group) => g.fields.filter((f) => f.type !== 'heading').map((f) => f.key);
export const groupHasError = (g: Group, errors: Errors) => {
  const keys = keysOf(g);
  return Object.keys(errors).some((path) => keys.includes(path.split('.')[0]));
};
export const groupIsDirty = (g: Group, a: Values, b: Values) => keysOf(g).some((k) => JSON.stringify(a[k] ?? '') !== JSON.stringify(b[k] ?? ''));

/** Sub-tab strip for one section: icon, short label, and a dot when the group has edits or errors. */
export function GroupTabs({
  groups,
  active,
  onPick,
  errors,
  stored,
  values,
}: {
  groups: Group[];
  active: string;
  onPick: (key: string) => void;
  errors: Errors;
  stored: Values;
  values: Values;
}) {
  return (
    <div className="cms-groups" role="tablist" aria-label="Bagian section">
      {groups.map((g) => {
        const err = groupHasError(g, errors);
        const dirty = !err && groupIsDirty(g, stored, values);
        return (
          <button
            key={g.key}
            type="button"
            role="tab"
            aria-selected={g.key === active}
            className={err ? 'has-error' : ''}
            onClick={() => onPick(g.key)}
          >
            <GroupIconView icon={g.icon} />
            <span>{g.short}</span>
            {err && <span className="cms-group-flag" aria-label="Ada isian yang perlu diperbaiki" />}
            {dirty && <span className="cms-dot" aria-label="Belum disimpan" />}
          </button>
        );
      })}
    </div>
  );
}

/** Title row of the open group plus previous/next navigation at the bottom. */
export function GroupHeader({ group, index, total }: { group: Group; index: number; total: number }) {
  return (
    <div className="cms-group-head">
      <span className="cms-group-badge"><GroupIconView icon={group.icon} size={17} /></span>
      <div>
        <h3>{group.label}</h3>
        {group.help && <p>{group.help}</p>}
      </div>
      <span className="cms-group-step">{index + 1} / {total}</span>
    </div>
  );
}

export function GroupPager({ groups, index, onPick }: { groups: Group[]; index: number; onPick: (key: string) => void }) {
  const prev = groups[index - 1];
  const next = groups[index + 1];
  return (
    <div className="cms-group-pager">
      {prev ? (
        <button type="button" className="cms-btn cms-btn--ghost cms-btn--sm" onClick={() => onPick(prev.key)}>
          <ChevronLeft size={14} /> {prev.short}
        </button>
      ) : <span />}
      {next && (
        <button type="button" className="cms-btn cms-btn--ghost cms-btn--sm" onClick={() => onPick(next.key)}>
          {next.short} <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}
