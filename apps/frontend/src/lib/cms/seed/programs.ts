import { BTM_COPY, STS_COPY } from '@/lib/content/programs';
import { BOOKED, BOOTCAMP_BATCHES, PROGRAMS, SEATS_PER_MENTOR, STS_MENTORS } from '@/lib/data/programs';
import type { SeedPart } from './types';

// "Program" menus start from exactly what /siap-tembus-scopus and /bootcamp-menulis show.
const head = ({ tag, title, accent, lead }: { tag: string; title: string; accent: string; lead: string }) => ({ tag, title, accent, lead });
const sts = PROGRAMS['siap-tembus-scopus'];
const btm = PROGRAMS['bootcamp-menulis'];

export const seed: SeedPart = {
  sections: {
    // Siap Tembus Scopus 1-on-1
    'program.sts.offer': {
      price: sts.price,
      unit: sts.unit,
      seatsPerMentor: SEATS_PER_MENTOR,
      mentors: STS_MENTORS.map((m) => ({ mentor: m.id, bookedThis: BOOKED[m.id]?.[0] ?? 0, bookedNext: BOOKED[m.id]?.[1] ?? 0 })),
    },
    'program.sts.hero': { ...STS_COPY.hero, trust: [...STS_COPY.hero.trust] },
    'program.sts.benefits': {
      visible: true,
      ...head(STS_COPY.benefits),
      agenda: STS_COPY.agenda.map((a) => ({ ...a })),
      rounds: STS_COPY.rounds.map((r) => ({ ...r, checks: [...r.checks] })),
      kitTag: STS_COPY.kit.tag,
      kitTitle: STS_COPY.kit.title,
      kit: STS_COPY.kit.items.map((k) => ({ ...k })),
    },
    'program.sts.flow': { visible: true, ...head(STS_COPY.flow), steps: STS_COPY.steps.map((x) => ({ ...x })) },
    'program.sts.mentors': { visible: true, ...head(STS_COPY.mentors) },
    'program.sts.fitfaq': { visible: true, checks: STS_COPY.checks.map(({ text }) => ({ text })), faq: STS_COPY.faq.map((f) => ({ ...f })) },
    'program.sts.final': { visible: true, ...STS_COPY.final },

    // Bootcamp 30 Hari Menulis
    'program.btm.offer': { price: btm.price, unit: btm.unit, batches: BOOTCAMP_BATCHES.map((b) => ({ ...b })) },
    'program.btm.hero': { ...BTM_COPY.hero, trust: [...BTM_COPY.hero.trust] },
    'program.btm.benefits': {
      visible: true,
      ...head(BTM_COPY.benefits),
      weeks: BTM_COPY.weeks.map((w) => ({ ...w })),
      imrad: BTM_COPY.imrad.map((x) => ({ ...x })),
      journalChecks: [...BTM_COPY.journalChecks],
      paragraph: BTM_COPY.paragraph.map((x) => ({ ...x })),
      reviewTag: BTM_COPY.review.tag,
      reviewTitle: BTM_COPY.review.title,
      reviewLead: BTM_COPY.review.lead,
      pins: BTM_COPY.review.pins.map((x) => ({ ...x })),
    },
    'program.btm.plan': { visible: true, ...head(BTM_COPY.plan), dailyWords: BTM_COPY.dailyWords },
    'program.btm.batches': { visible: true, ...head(BTM_COPY.batches) },
    'program.btm.fitfaq': { visible: true, checks: BTM_COPY.checks.map(({ text }) => ({ text })), faq: BTM_COPY.faq.map((f) => ({ ...f })) },
    'program.btm.final': { visible: true, ...BTM_COPY.final },
  },
};
