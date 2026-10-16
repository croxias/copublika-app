import type { PageConfig } from '../types';
import { page as home } from './page-home';
import { page as about } from './page-about';
import { page as aboutTeam } from './page-about-team';
import { page as aboutMentors } from './page-about-mentors';
import { page as research } from './page-research';
import { page as blog } from './page-blog';
import { page as event } from './page-event';
import { btmPage, stsPage } from './page-programs';
import { page as curation } from './page-curation';
import { page as contact } from './page-contact';
import { page as settings } from './page-settings';

/** Page editors (pattern B), keyed by their admin route segment. */
export const PAGES: Record<string, PageConfig | null> = {
  home,
  about,
  'about-team': aboutTeam,
  'about-mentors': aboutMentors,
  research,
  blog,
  event,
  'siap-tembus-scopus': stsPage,
  'bootcamp-menulis': btmPage,
  curation,
  contact,
  settings,
};

/** "home.faq" → "Beranda · FAQ", for "dipakai di" warnings. */
export const SECTION_LABELS: Record<string, string> = Object.fromEntries(
  Object.values(PAGES)
    .filter((p): p is PageConfig => !!p)
    .flatMap((p) => p.tabs.map((t) => [t.key, `${p.title}${p.titleAccent ? ` ${p.titleAccent}` : ''} · ${t.label}`])),
);
