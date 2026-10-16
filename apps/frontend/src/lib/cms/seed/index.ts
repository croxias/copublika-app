import type { CmsState } from '../store';
import type { CollectionKey } from '../types';
import type { SeedPart } from './types';
import { seed as content } from './content';
import { seed as research } from './research';
import { seed as programs } from './programs';
import { seed as library } from './library';
import { seed as home } from './home';
import { seed as pages } from './pages';
import { seed as about } from './about';
import { seed as settings } from './settings';
import { seed as testimonials } from './testimonials';
import { seed as people } from './people';
import { seed as blog } from './blog';
import { seed as review } from './review';
import { seed as eventPage } from './event';
import { seed as contact } from './contact';

const EMPTY: Record<CollectionKey, []> = {
  blog: [], events: [], projects: [], publications: [], heroSlides: [], people: [], testimonials: [], faqs: [], registrations: [], messages: [],
};

const parts: SeedPart[] = [content, research, programs, library, home, pages, about, settings, testimonials, people, blog, review, eventPage, contact];

/** Initial CMS content: what the public site shows today, before any admin edit. */
export const CMS_SEED: CmsState = {
  // Several parts may seed the same collection (e.g. FAQs for two pages), so lists are concatenated.
  collections: parts.reduce<CmsState['collections']>((acc, p) => {
    for (const [k, items] of Object.entries(p.collections ?? {})) acc[k as CollectionKey] = [...acc[k as CollectionKey], ...(items ?? [])];
    return acc;
  }, { ...EMPTY }),
  sections: Object.assign({}, ...parts.map((p) => p.sections ?? {})),
};
