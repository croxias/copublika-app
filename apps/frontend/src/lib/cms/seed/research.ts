import { ACTIVE_PROJECTS } from '@/lib/data/active-projects';
import { PUBS } from '@/lib/data/publications';
import { CARDS } from '@/components/landing/ResearchMarquee';
import { HERO_COPY, STATS } from '@/components/research/ResearchHero';
import { PROCESS_COPY, STEPS } from '@/components/research/ResearchProcess';
import { GALLERY_COPY } from '@/components/research/ActiveProjectsGallery';
import { PUBS_COPY } from '@/components/research/PublicationsExplorer';
import type { CmsItem } from '../types';
import type { SeedPart } from './types';
import { SEEDED_AT } from './types';

// Projects from lib/data/active-projects.ts. The slug keeps the public URL
// (/research-project/p01) working.
const projectId = (id: string) => `project-${id}`;

const projects: CmsItem[] = ACTIVE_PROJECTS.map((p, i) => ({
  id: projectId(p.id),
  title: p.title,
  slug: p.id,
  cluster: p.cluster,
  phase: p.status,
  abstract: p.abstract,
  tags: [...p.tags],
  methodology: p.methodology,
  targetJournals: [...p.targetJournals],
  requiredExpertise: [...p.requiredExpertise],
  timeline: p.timeline,
  leadName: p.lead,
  leadRole: p.leadRole,
  leadAffiliation: p.affiliation,
  collaborators: p.collaborators.map((c) => ({ ...c })),
  startedAt: p.startedAt,
  status: 'published',
  order: i + 1,
  updatedAt: SEEDED_AT,
}));

// Publications: /research explorer (PUBS) merged with the landing marquee
// (CARDS). Marquee papers come first, in marquee order, and are starred.
const quartileOf = (quartile: string, qLabel: string) =>
  quartile === 'sinta' ? `sinta${qLabel.replace(/\D/g, '') || '2'}` : quartile;

const homeCards = CARDS.map((c) => ({ card: c, pub: PUBS.find((p) => p.title.startsWith(c.title)) }));
const homeTitles = new Set(homeCards.map((h) => h.pub?.title).filter(Boolean));
const rest = PUBS.filter((p) => !homeTitles.has(p.title));

const linkedProject = (title: string) => ACTIVE_PROJECTS.find((p) => p.title === title);

const publications: CmsItem[] = [
  ...homeCards.map(({ card, pub }) => ({
    title: pub?.title ?? card.title,
    journal: pub?.journal ?? card.journal,
    quartile: pub ? quartileOf(pub.quartile, pub.qLabel) : card.q,
    cluster: pub?.cluster ?? '',
    cardCategory: card.cat,
    authors: pub?.authors ?? '',
    year: Number(pub?.date.slice(0, 4) ?? card.year),
    month: pub ? String(Number(pub.date.slice(5, 7))) : '',
    url: '',
    pdf: pub?.pdf ?? '',
    image: card.img,
    showOnHome: true,
  })),
  ...rest.map((pub) => ({
    title: pub.title,
    journal: pub.journal,
    quartile: quartileOf(pub.quartile, pub.qLabel),
    cluster: pub.cluster,
    cardCategory: '',
    authors: pub.authors,
    year: Number(pub.date.slice(0, 4)),
    month: String(Number(pub.date.slice(5, 7))),
    url: '',
    pdf: pub.pdf ?? '',
    image: '',
    showOnHome: false,
  })),
].map((p, i) => {
  const project = linkedProject(p.title);
  return { ...p, id: `pub-${i + 1}`, projectId: project ? projectId(project.id) : '', status: 'published', order: i + 1, updatedAt: SEEDED_AT };
});

const clusters = Array.from(new Set([...ACTIVE_PROJECTS.map((p) => p.cluster), ...PUBS.map((p) => p.cluster)]))
  .sort((a, b) => a.localeCompare(b))
  .map((name) => ({ name }));

// /research page sections, taken from the copy constants the public components render.
const sections = {
  'research.clusters': { items: clusters },
  'research.hero': {
    pulse: HERO_COPY.eyebrow,
    title: HERO_COPY.title,
    titleAccent: HERO_COPY.titleAccent,
    lead: HERO_COPY.lead,
    ctaPrimary: HERO_COPY.ctaPrimary,
    ctaSecondary: HERO_COPY.ctaSecondary,
    stats: STATS.map((s) => ({ value: s.v, label: s.l })),
  },
  'research.gallery': { visible: true, ...GALLERY_COPY },
  'research.process': {
    visible: true,
    ...PROCESS_COPY,
    steps: STEPS.map((s) => ({ phase: s.phase, title: s.title, desc: s.desc, output: s.output })),
  },
  'research.publications': { visible: true, ...PUBS_COPY },
};

export const seed: SeedPart = { collections: { projects, publications }, sections };
