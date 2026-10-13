// Konten Website — types (staging/demo mode)
// Fase: Konten Website (Hero Slider, Konfigurasi, About, Research Project)
// Scope: staging/demo ONLY. Production/Supabase tidak disentuh pada fase ini.

export type SlideStatus = 'Published' | 'Draft' | 'Archived';

export type StagingHeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  titleAccent: string; // bagian heading yang diberi aksen (em)
  dek: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  note: string;
  status: SlideStatus;
  order: number;
};

export type StagingSiteConfig = {
  id: string; // selalu 'site-config' (record tunggal)
  siteName: string;
  tagline: string;
  logoUrl: string;
  contactEmail: string;
  contactPhone: string;
  instagram: string;
  threads: string;
  linkedin: string;
  footerBatchLabel: string; // contoh: "Batch #4: Open"
  showAnnounceBar: boolean;
  announceText: string;
  navBlogEnabled: boolean;
  navEventEnabled: boolean;
  navResearchEnabled: boolean;
};

export type AboutSectionKey = 'visi' | 'misi' | 'nilai' | 'profil';

export type StagingAboutSection = {
  id: string;
  key: AboutSectionKey;
  title: string;
  body: string;
  status: 'Published' | 'Draft';
  order: number;
};

export type LandingResearchHighlight = {
  id: string;
  projectId: string; // referensi bebas ke proyek (staging, tidak FK ketat)
  title: string;
  field: string;
  leadName: string;
  leadInstitution: string;
  teaser: string;
  status: 'Published' | 'Draft';
  order: number;
};

export type WebsiteContentState = {
  heroSlides: StagingHeroSlide[];
  siteConfig: StagingSiteConfig | null;
  aboutSections: StagingAboutSection[];
  landingResearch: LandingResearchHighlight[];
};

// Perluasan StagingState dilakukan via komposisi di seed & provider (append-only, aman untuk localStorage lama).
