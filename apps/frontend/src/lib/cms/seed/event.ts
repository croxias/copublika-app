import { EVENT_COPY } from '@/lib/content/event';
import { REGISTRATION_SEED } from '../registrations';
import type { SeedPart } from './types';

// "Halaman Event" starts from the copy the public /event pages render, and the Pendaftar tab
// from a few sample sign-ups.
export const seed: SeedPart = {
  collections: { registrations: REGISTRATION_SEED },
  sections: {
    'event.hero': { ...EVENT_COPY.hero },
    'event.next': { ...EVENT_COPY.next, visible: true },
    'event.agenda': { ...EVENT_COPY.agenda },
    'event.detail': { ...EVENT_COPY.detail },
  },
};
