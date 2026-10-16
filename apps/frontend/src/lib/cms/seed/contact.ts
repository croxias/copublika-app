import { CONTACT_COPY } from '@/lib/content/contact';
import { MESSAGE_SEED } from '../messages';
import type { SeedPart } from './types';

// "Kontak" starts from the copy /contact renders, and Kotak Pesan from a few sample messages.
const c = CONTACT_COPY;
export const seed: SeedPart = {
  collections: { messages: MESSAGE_SEED },
  sections: {
    'contact.hero': { ...c.hero },
    'contact.topics': { topics: c.topics.map((t) => ({ ...t })) },
    'contact.channels': { channels: c.channels.map((x) => ({ ...x })), days: c.hours.days.map((d) => ({ ...d })), note: c.hours.note },
    'contact.form': { ...c.form },
    'contact.location': { ...c.location, visible: true },
    'contact.faq': { tag: c.faq.tag, title: c.faq.title, accent: c.faq.accent, items: c.faq.items.map((x) => ({ ...x })), visible: true },
  },
};
