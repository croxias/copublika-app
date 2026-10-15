import {
  ABOUT_FACTS, ABOUT_HERO, ABOUT_INTRO, ABOUT_STATS, CEO_WELCOME, ECOSYSTEM, JOIN_MENTOR, JOIN_TEAM, JOURNEY_KPIS, MENTOR_HOW,
  MENTORS_HERO, MENTORS_PER_PAGE, MISSIONS, ORG, TEAM_HERO, TEAM_SECTION, TIMELINE, TOTAL_MENTORS, VALUES, VISION, VISION_SHORT,
} from '@/lib/content/about';
import { personId } from '../slug';
import type { SeedPart } from './types';

// About Us / Our Team / Our Mentors, built from lib/content/about.ts so the admin starts from
// exactly what the public pages show.

const join = (j: typeof JOIN_TEAM) => ({
  visible: true,
  eyebrow: j.eyebrow,
  title: j.title,
  accent: j.accent,
  perks: j.perks.map((p) => ({ ...p })),
  ctaLabel: j.cta.label,
  ctaHref: j.cta.href,
  secondaryLabel: j.secondary?.label ?? '',
  secondaryHref: j.secondary?.href ?? '',
  note: j.note ?? '',
});

const unit = (key: string) =>
  (ORG.find((u) => u.key === key)?.members ?? []).map((m) => ({ roleId: m.roleId, role: m.role, scope: m.scope, person: m.person ? personId(m.person.name) : '' }));

export const seed: SeedPart = {
  sections: {
    // ── About Us ──
    'aboutUs.hero': {
      eyebrow: ABOUT_HERO.eyebrow,
      line1: ABOUT_HERO.line1,
      accent: ABOUT_HERO.accent,
      line2: ABOUT_HERO.line2,
      lead: ABOUT_HERO.lead,
      primaryLabel: ABOUT_HERO.primary.label,
      primaryHref: ABOUT_HERO.primary.href,
      secondaryLabel: ABOUT_HERO.secondary.label,
      secondaryHref: ABOUT_HERO.secondary.href,
      videoUrl: ABOUT_HERO.video.url,
      videoPoster: ABOUT_HERO.video.poster,
      videoTitle: ABOUT_HERO.video.title,
      videoCaption: ABOUT_HERO.video.caption,
      stats: ABOUT_STATS.map((s) => ({ ...s })),
    },
    'aboutUs.intro': {
      visible: true,
      tag: 'Tentang CoPublika',
      title: 'Satu ekosistem,',
      accent: 'dari ide sampai terbit.',
      lead: ABOUT_INTRO.lead,
      nodes: ECOSYSTEM.map((n) => ({ icon: n.icon, title: n.title, stat: n.stat, statLabel: n.statLabel, text: n.text })),
      facts: ABOUT_FACTS.map((f) => ({ ...f })),
    },
    'aboutUs.vision': {
      visible: true,
      tag: 'Visi & Misi',
      title: 'Empat misi,',
      accent: 'satu arah.',
      vision: VISION,
      visionShort: VISION_SHORT,
      hubText: 'Ketika akademisi berkolaborasi dan gagasan diasah bersama, riset tumbuh menjadi publikasi bereputasi. Itulah ekosistem yang kami bangun.',
      missions: MISSIONS.map((m) => ({ ...m })),
    },
    'aboutUs.values': {
      visible: true,
      tag: 'Nilai CoPublika',
      title: 'Empat prinsip',
      accent: 'yang kami pegang.',
      items: VALUES.map((v) => {
        const [yes, no] = v.title.split(', bukan ');
        return { icon: v.icon, yes, no: no ?? '', text: v.text };
      }),
    },
    'aboutUs.journey': {
      visible: true,
      tag: 'Perjalanan kami',
      title: 'Singkat,',
      accent: 'tapi berarti.',
      kpis: JOURNEY_KPIS.map((k) => ({ ...k })),
      steps: TIMELINE.map((t) => ({ ...t, metrics: t.metrics.map((m) => ({ ...m })) })),
    },

    // ── Our Team ──
    'aboutTeam.hero': { ...TEAM_HERO },
    'aboutTeam.ceo': {
      visible: true,
      person: personId(CEO_WELCOME.person.name),
      title: CEO_WELCOME.title,
      heading: CEO_WELCOME.heading,
      body: CEO_WELCOME.paragraphs.join('\n\n'),
      signoff: CEO_WELCOME.signoff,
    },
    'aboutTeam.org': {
      visible: true,
      ...TEAM_SECTION,
      exec: unit('exec'),
      divisions: unit('divisions'),
      secretariat: unit('secretariat'),
    },
    'aboutTeam.join': join(JOIN_TEAM),

    // ── Our Mentors ──
    'aboutMentors.hero': { ...MENTORS_HERO },
    'aboutMentors.how': { visible: true, cards: MENTOR_HOW.map((c) => ({ ...c })) },
    'aboutMentors.directory': { total: TOTAL_MENTORS, perPage: MENTORS_PER_PAGE },
    'aboutMentors.join': {
      ...join(JOIN_MENTOR),
      listTitle: JOIN_MENTOR.listTitle,
      list: JOIN_MENTOR.list.map((text) => ({ text })),
    },
  },
};
