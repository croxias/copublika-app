// Shared helpers for the public research pages (/research, /research-project/[slug]).

import { PEOPLE } from '@/lib/cms/seed/people';
import type { ActiveProject, ActiveProjectStatus } from '@/lib/data/active-projects';

/**
 * Cards and the detail page show the full research (methodology, journals, team) without the
 * member lock while the content is being reviewed. Set to false to bring the lock back.
 */
export const RESEARCH_PREVIEW_OPEN = true;

export const STATUS_ID: Record<ActiveProjectStatus, string> = {
  recruiting: 'Mencari kolaborator',
  writing: 'Sedang ditulis',
  review: 'Review artikel',
  submitted: 'Sudah submit',
};

/** Where a project is in its life: recruiting → writing → internal review → submitted to a journal. */
export const PHASES = [
  { key: 'recruiting', label: 'Rekrut tim' },
  { key: 'writing', label: 'Penulisan' },
  { key: 'review', label: 'Review artikel' },
  { key: 'submitted', label: 'Submit' },
] as const;
export const phaseIndex = (s: ActiveProjectStatus) => PHASES.findIndex((p) => p.key === s);

export const RESEARCH_STATS = [
  { value: '24', accent: '', label: 'Cluster aktif' },
  { value: '12', accent: '', label: 'Proyek berjalan' },
  { value: '318', accent: '', label: 'Publikasi' },
  { value: '76', accent: '%', label: 'Akseptasi' },
];

/** Photo from the people library when the name matches, else null (initials are shown). */
export function personPhoto(name: string): string | null {
  const strip = (n: string) => n.replace(/^(Dr\.|Prof\.)\s*/i, '').replace(/,.*$/, '').trim().toLowerCase();
  const p = PEOPLE.find((x) => strip(x.name) === strip(name));
  return p && !p.photo.includes('100?') ? p.photo : null;
}

export function initials(name: string) {
  return name
    .replace(/,.*$/, '')
    .split(' ')
    .filter((w) => /^[A-Za-z]/.test(w) && !/^(Dr|Prof)\.?$/i.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

const MONTH_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
export function formatMonth(iso: string) {
  if (!iso || !iso.includes('-')) return iso || '—';
  const [y, m] = iso.split('-');
  return `${MONTH_ID[Math.max(0, Math.min(11, parseInt(m, 10) - 1))]} ${y}`;
}

export const teamSize = (p: ActiveProject) => 1 + p.collaborators.length;
