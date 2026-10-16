import { personId } from '../slug';
import type { CmsItem } from '../types';
import type { SeedPart } from './types';
import { SEEDED_AT } from './types';

// One record per person across About TEAM, Siap Tembus Scopus MENTORS and the
// landing WhyJoinBento MENTORS. Names are what the public pages show today.
const avatar = (img: number) => `https://i.pravatar.cc/400?img=${img}`;

export type Person = {
  name: string;
  kind: 'mentor' | 'team' | 'both';
  role: string;
  badge: string;
  expertise: string;
  metric?: string;
  bio?: string;
  photo: string;
  /** Institution shown on profiles. Sample values until real profiles are entered in the admin. */
  affiliation?: string;
  topics?: string[];
  linkedinUrl?: string;
  instagramUrl?: string;
  email?: string;
};

export const PEOPLE: Person[] = [
  { name: 'Dr. Ade Putranto', kind: 'both', role: 'Founder', badge: 'Founder', expertise: 'EdTech · h-index 14', metric: 'h-index 14', bio: 'Penulis 28 artikel Scopus, reviewer di 4 jurnal Q1, mentor sejak 2019.', photo: avatar(8), affiliation: 'Universitas Padjadjaran', topics: ['Educational technology', 'Blended learning', 'Strategi publikasi Q1'], linkedinUrl: 'https://www.linkedin.com/in/ade-putranto', instagramUrl: 'https://www.instagram.com/ade_putranto', email: 'ade.putranto@copublika.id' },
  { name: 'Dr. Maya Rahmawati', kind: 'both', role: 'Head of Programs', badge: 'Head of Programs', expertise: 'Public Health · Q2 Editor', metric: 'h-index 11', bio: 'Associate editor di jurnal kesehatan Q2, fokus literasi kesehatan komunitas.', photo: avatar(20), affiliation: 'Universitas Airlangga', topics: ['Literasi kesehatan', 'Kesehatan komunitas', 'Mixed methods'], linkedinUrl: 'https://www.linkedin.com/in/maya-rahmawati', instagramUrl: 'https://www.instagram.com/maya_rahmawati', email: 'maya.rahmawati@copublika.id' },
  { name: 'Dr. Bayu Setiawan', kind: 'both', role: 'Lead Mentor', badge: 'Lead Mentor', expertise: 'Sustainability · Q1 Reviewer', metric: 'h-index 9', bio: 'Reviewer aktif di Sustainability dan Resources, Conservation & Recycling.', photo: avatar(11), affiliation: 'Institut Teknologi Bandung', topics: ['Ekonomi sirkular', 'Life cycle assessment', 'Systematic review'], linkedinUrl: 'https://www.linkedin.com/in/bayu-setiawan', instagramUrl: 'https://www.instagram.com/bayu_setiawan', email: 'bayu.setiawan@copublika.id' },
  { name: 'Dr. Lina Kartika', kind: 'both', role: 'Lead Editor', badge: 'Lead Editor', expertise: 'Linguistics · TEFLIN', metric: 'h-index 8', bio: 'Spesialis academic writing dan editor di TEFLIN Journal.', photo: avatar(44), affiliation: 'Universitas Pendidikan Indonesia', topics: ['Academic writing', 'Applied linguistics', 'Respons reviewer'], linkedinUrl: 'https://www.linkedin.com/in/lina-kartika', instagramUrl: 'https://www.instagram.com/lina_kartika', email: 'lina.kartika@copublika.id' },
  { name: 'Fajar Ramadhan, Ph.D.', kind: 'both', role: 'Mentor', badge: 'Mentor', expertise: 'Engineering · AI', metric: 'h-index 7', bio: 'Penulis 12 paper IEEE, fokus computer vision dan AI etis.', photo: avatar(12), affiliation: 'Universitas Gadjah Mada', topics: ['Computer vision', 'AI etis', 'Penulisan paper IEEE'], linkedinUrl: 'https://www.linkedin.com/in/fajar-ramadhan', instagramUrl: 'https://www.instagram.com/fajar_ramadhan', email: 'fajar.ramadhan@copublika.id' },
  { name: 'Dr. Dewi Nirmala', kind: 'both', role: 'Mentor', badge: 'Mentor', expertise: 'Sociology · Qualitative', metric: 'h-index 10', bio: 'Spesialis riset kualitatif, pendekatan etnografi, dan grounded theory.', photo: avatar(49), affiliation: 'Universitas Indonesia', topics: ['Etnografi', 'Grounded theory', 'Riset kualitatif'], linkedinUrl: 'https://www.linkedin.com/in/dewi-nirmala', instagramUrl: 'https://www.instagram.com/dewi_nirmala', email: 'dewi.nirmala@copublika.id' },
  { name: 'Dr. Hadi Suryanto', kind: 'both', role: 'Mentor', badge: 'Mentor', expertise: 'Economics · Policy', photo: avatar(33), affiliation: 'Universitas Brawijaya', topics: ['Kebijakan publik', 'Ekonometrika', 'Policy brief'], linkedinUrl: 'https://www.linkedin.com/in/hadi-suryanto', instagramUrl: 'https://www.instagram.com/hadi_suryanto', email: 'hadi.suryanto@copublika.id' },
  // Landing "Kenapa bergabung" mentor chips.
  { name: 'Dr. Aulia R.', kind: 'mentor', role: 'Mentor', badge: 'Reviewer Q1', expertise: '', photo: 'https://i.pravatar.cc/100?img=47', affiliation: 'Universitas Diponegoro', topics: ['Peer review', 'Metodologi'], linkedinUrl: 'https://www.linkedin.com/in/aulia-r', instagramUrl: 'https://www.instagram.com/aulia_r', email: 'aulia.r@copublika.id' },
  { name: 'Dr. Bayu S.', kind: 'mentor', role: 'Mentor', badge: 'Editor tamu', expertise: '', photo: 'https://i.pravatar.cc/100?img=15', affiliation: 'Universitas Hasanuddin', topics: ['Editorial', 'Seleksi jurnal'], linkedinUrl: 'https://www.linkedin.com/in/bayu-s', instagramUrl: 'https://www.instagram.com/bayu_s', email: 'bayu.s@copublika.id' },
];


const people: CmsItem[] = PEOPLE.map((p, i) => ({
  id: personId(p.name),
  name: p.name,
  kind: p.kind,
  role: p.role,
  badge: p.badge,
  affiliation: p.affiliation ?? '',
  expertise: p.expertise,
  metric: p.metric ?? '',
  bio: p.bio ?? '',
  photo: p.photo,
  scholarUrl: '',
  linkedinUrl: p.linkedinUrl ?? '',
  instagramUrl: p.instagramUrl ?? '',
  email: p.email ?? '',
  topics: p.topics ?? [],
  // Core mentors already write for the blog; others get access from Tim & Mentor.
  canWrite: p.kind === 'both',
  status: 'published',
  order: i + 1,
  updatedAt: SEEDED_AT,
}));

export const seed: SeedPart = { collections: { people } };
