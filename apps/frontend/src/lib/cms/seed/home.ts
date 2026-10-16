import { DEFAULT_HERO_SLIDES } from '@/lib/content/hero.schema';
import { personId } from '../slug';
import { LANDING_FAQ_IDS } from './library';
import { HOME_TESTIMONIAL_ROWS } from './testimonials';
import type { CmsItem } from '../types';
import { SEEDED_AT, type SeedPart } from './types';

// Landing page copy as it is hardcoded today in components/landing/*.

// Hero.tsx: the section only carries its on/off switch; slides are their own collection.
const hero = { visible: true };

const heroSlides: CmsItem[] = [...DEFAULT_HERO_SLIDES]
  .sort((a, b) => a.order - b.order)
  .map((s, i) => ({
    id: s.id,
    kicker: s.kicker,
    title: s.title,
    titleAccent: s.titleAccent,
    dek: s.dek,
    ctaLabel: s.cta.label,
    ctaHref: s.cta.href,
    secondaryLabel: s.secondary?.label ?? '',
    secondaryHref: s.secondary?.href ?? '',
    imageSrc: s.image.src,
    imageAlt: s.image.alt,
    status: s.status,
    order: i + 1,
    updatedAt: SEEDED_AT,
  }));

// StatsSection.tsx ("Metode kami"). Station icons stay in code.
const stats = {
  visible: true,
  tag: 'Metode kami',
  heading: 'Dari pertanyaan,',
  headingAccent: 'menuju kontribusi.',
  stages: [
    { label: 'Temukan', title: 'Rekan riset yang tepat', text: 'Cari akademisi berdasarkan bidang keahlian, bukan sekadar koneksi.', tag: 'Pencarian berbasis kepakaran' },
    { label: 'Terhubung', title: 'Kolaborasi lintas disiplin', text: 'Bentuk tim dari kampus dan bidang berbeda, dengan umpan balik yang menajamkan gagasan.', tag: 'Tim lintas kampus' },
    { label: 'Terbitkan', title: 'Naskah sampai terbit', text: 'Mentor, klinik naskah, dan ritme kerja yang jelas sampai ke jurnal bereputasi.', tag: 'Pendampingan hingga terbit' },
  ],
};

// WhyJoinBento.tsx ("Apa yang kami lakukan").
const why = {
  visible: true,
  tag: 'Apa yang kami lakukan',
  heading: 'Satu ekosistem untuk',
  headingAccent: 'riset yang bertumbuh.',
  communityKicker: 'Komunitas terkurasi',
  communityStat: '1.240',
  communityStatSuffix: '+',
  communityTitle: 'akademisi aktif yang saling mendukung',
  communityText: 'Setiap anggota melewati verifikasi profil Google Scholar, sehingga diskusi tetap berkualitas dan kredibel.',
  communityMore: '+1.2k',
  fieldsKicker: 'Lintas disiplin',
  fieldsTitle: 'Kolaborasi lintas kampus dan bidang ilmu',
  fieldsText: 'Satu proyek, banyak sudut pandang. Temukan rekan dengan keahlian yang melengkapi riset Anda.',
  fieldsCore: 'Proyek riset',
  fields: ['Kesehatan', 'Pendidikan', 'Teknik', 'Ekonomi', 'Sosial & humaniora', 'Sains data', 'Hukum', 'Pertanian'],
  mentorsTitle: 'Mentor berpengalaman',
  mentorsText: 'Masukan dari peneliti yang sudah berulang kali menembus jurnal bereputasi.',
  mentors: [personId('Dr. Aulia R.'), personId('Dr. Bayu S.')],
  mentorsMore: '+45 mentor lainnya',
  safeTitle: 'Ruang aman untuk bertanya',
  safeText: 'Tidak ada pertanyaan yang terlalu dasar. Kita belajar bersama, dari pemula hingga senior.',
  chatQuestion: 'Maaf kalau dasar, bedanya jurnal Q1 dan Q2 apa?',
  chatAnswer: 'Pertanyaan bagus! Kita bahas pelan-pelan, ya.',
  progressTitle: 'Progres yang terukur',
  progressText: 'Pantau naskah dari draft hingga terbit dengan tonggak yang jelas.',
  progressLabel: 'Naskah: tinjauan pustaka',
  progressPercent: 50,
  progressSteps: ['Draft', 'Review', 'Revisi', 'Terbit'],
};

// ProgramHighlight.tsx ("Program unggulan").
const program = {
  visible: true,
  tag: 'Program unggulan',
  heading: 'Siap Tembus Scopus,',
  headingAccent: 'sampai terbit.',
  weeks: 12,
  curriculum: [
    { title: 'Pemilihan topik & jurnal target', from: 1, to: 2 },
    { title: 'Tinjauan pustaka sistematis', from: 3, to: 4 },
    { title: 'Metodologi & analisis data', from: 5, to: 6 },
    { title: 'Penulisan akademik bahasa Inggris', from: 7, to: 8 },
    { title: 'Klinik naskah & peer review', from: 9, to: 10 },
    { title: 'Submission & strategi revisi', from: 11, to: 12 },
  ],
  ticketStatus: 'Pendaftaran dibuka',
  ticketBatch: 'Batch 7',
  ticketTitle: 'Siap Tembus Scopus',
  ticketNote: 'Kursi terbatas agar setiap peserta mendapat pendampingan penuh.',
  details: [
    { label: 'Mulai', value: '15 Sep 2025' },
    { label: 'Durasi', value: '12 minggu' },
    { label: 'Format', value: 'Hybrid' },
    { label: 'Kuota', value: '24 peserta' },
  ],
  ctaLabel: 'Daftar sekarang',
  ctaHref: '/siap-tembus-scopus',
  secondaryLabel: 'Unduh silabus',
  secondaryHref: '/siap-tembus-scopus',
};

// ResearchMarquee.tsx: cards come from Publikasi Anggota marked for the homepage.
const research = {
  visible: true,
  tag: 'Riset terkini',
  heading: 'Publikasi',
  headingAccent: 'anggota komunitas.',
  linkLabel: 'Lihat semua',
  linkHref: '/research',
  maxItems: 11,
  autofill: true,
};

// EventsList.tsx: cards come from Agenda Event.
const events = {
  visible: true,
  tag: 'Agenda',
  heading: 'Acara',
  headingAccent: 'mendatang.',
  linkLabel: 'Lihat semua',
  linkHref: '/event',
  maxItems: 4,
};

// BlogFeatured.tsx: slider of featured posts, then a marquee of recent posts.
const blog = {
  visible: true,
  tag: 'Tulisan terbaru',
  heading: 'Dari editor',
  headingAccent: '& mentor.',
  linkLabel: 'Lihat semua',
  linkHref: '/blog',
  featuredCount: 4,
  cardCount: 10,
};

// AlumniMarquee.tsx.
const testimonials = {
  visible: true,
  tag: 'Suara komunitas',
  heading: 'Cerita dari',
  headingAccent: 'komunitas.',
  rowA: HOME_TESTIMONIAL_ROWS.a,
  rowB: HOME_TESTIMONIAL_ROWS.b,
};

// FAQ.tsx.
const faq = {
  visible: true,
  tag: 'Pertanyaan umum',
  heading: 'Yang sering',
  headingAccent: 'ditanyakan.',
  subheading: 'Belum menemukan jawabannya? Tim kami siap membantu.',
  linkLabel: 'Hubungi kami',
  linkHref: '/contact',
  items: LANDING_FAQ_IDS,
};

// FinalCTA.tsx.
const cta = {
  visible: true,
  kicker: 'Batch 7 dibuka',
  heading: 'Saatnya menulis',
  headingAccent: 'paragraf pertama',
  text: 'Bergabunglah dengan ratusan akademisi yang sedang membangun rekam jejak publikasi mereka, bersama. Tidak perlu menunggu siap.',
  primaryLabel: 'Gabung komunitas',
  primaryHref: '/daftar?program=member&paket=gratis',
  secondaryLabel: 'Hubungi kami',
  secondaryHref: '/contact',
  trust: [
    { value: '1.240', accent: '+', label: 'Anggota' },
    { value: '318', accent: '', label: 'Publikasi' },
    { value: '47', accent: '', label: 'Mentor' },
    { value: '76', accent: '%', label: 'Tingkat akseptasi' },
  ],
};

export const seed: SeedPart = {
  collections: { heroSlides },
  sections: {
    'home.hero': hero,
    'home.stats': stats,
    'home.why': why,
    'home.program': program,
    'home.research': research,
    'home.events': events,
    'home.blog': blog,
    'home.testimonials': testimonials,
    'home.faq': faq,
    'home.cta': cta,
  },
};
