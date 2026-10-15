// Content for the About section (/about, /about/team, /about/mentors).
// People come from the shared people library (lib/cms/seed/people.ts) so the public pages and
// the admin "Tim & Mentor" menu describe the same people; the backend phase swaps both for the DB.

import { PEOPLE, type Person } from '@/lib/cms/seed/people';
import type { IconName } from '@/components/about/IconBadge';

export const ABOUT_LINKS = [
  { href: '/about', label: 'About Us', sub: 'Siapa kami, nilai, visi-misi, dan perjalanan.' },
  { href: '/about/team', label: 'Our Team', sub: 'Pengurus yang menjalankan CoPublika.' },
  { href: '/about/mentors', label: 'Our Mentors', sub: 'Peneliti aktif yang mendampingi anggota.' },
] as const;

export const ABOUT_HERO = {
  eyebrow: 'Tentang CoPublika · Sejak 2026',
  line1: 'Bukan platform.',
  accent: 'Sebuah komunitas',
  line2: 'untuk akademisi pemula.',
  lead: 'Tempat dosen muda, peneliti, dan mahasiswa S2/S3 di Indonesia menemukan rekan riset, mentor yang sabar, dan ritme kerja yang konsisten sampai naskah benar-benar terbit.',
  primary: { label: 'Kenali tim kami', href: '/about/team' },
  secondary: { label: 'Temui para mentor', href: '/about/mentors' },
  /**
   * YouTube link for the hero video. PLACEHOLDER: a public sample video (Blender's "Big Buck
   * Bunny") so the player can be tried; replace with CoPublika's own video.
   */
  video: {
    url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    poster: '',
    title: 'Kenali CoPublika dalam satu video',
    caption: 'Cerita anggota, mentor, dan perjalanan naskah sampai terbit',
  },
};

export const ABOUT_STATS = [
  { value: '1.240', accent: '+', label: 'Anggota aktif' },
  { value: '318', accent: '', label: 'Publikasi terindeks' },
  { value: '47', accent: '', label: 'Mentor' },
  { value: '76', accent: '%', label: 'Tingkat akseptasi' },
];

export const ABOUT_FACTS: { icon: IconName; label: string; value: string }[] = [
  { icon: 'flag', label: 'Berdiri', value: 'Juni 2026' },
  { icon: 'pin', label: 'Markas', value: 'Bandung, Jawa Barat' },
  { icon: 'calendar', label: 'Batch berjalan', value: 'Batch #07' },
  { icon: 'award', label: 'Tingkat akseptasi', value: '76%' },
];

export const ABOUT_INTRO = {
  lead: 'CoPublika mempertemukan dosen muda, peneliti, dan mahasiswa S2/S3 di Indonesia dengan rekan riset, mentor aktif, dan ritme kerja yang konsisten, sampai naskah benar-benar terbit di jurnal bereputasi.',
};

/** The ecosystem infographic in "Tentang CoPublika": the member in the middle, what surrounds them. */
export const ECOSYSTEM: { key: string; icon: IconName; title: string; stat: string; statLabel: string; text: string }[] = [
  { key: 'community', icon: 'users', title: 'Komunitas terkurasi', stat: '1.240+', statLabel: 'anggota terverifikasi', text: 'Setiap anggota diverifikasi lewat profil Google Scholar, sehingga diskusi tetap berkualitas dan saling menguatkan.' },
  { key: 'clusters', icon: 'layers', title: 'Cluster riset', stat: '24', statLabel: 'cluster lintas disiplin', text: 'Anggota bergabung ke cluster sesuai minat, lalu membentuk tim riset lintas kampus dan bidang ilmu.' },
  { key: 'mentors', icon: 'cap', title: 'Mentor aktif', stat: '47', statLabel: 'peneliti & reviewer', text: 'Mentor yang masih menulis dan mereview di jurnal bereputasi mendampingi dari ide sampai revisi.' },
  { key: 'clinic', icon: 'scan', title: 'Klinik naskah', stat: 'Mingguan', statLabel: 'sesi review naskah', text: 'Naskah dibedah bersama setiap minggu lewat peer-review internal sebelum dikirim ke jurnal.' },
  { key: 'publish', icon: 'trend', title: 'Publikasi', stat: '318', statLabel: 'publikasi terindeks', text: 'Hasil akhirnya: naskah anggota terbit di jurnal bereputasi, dengan tingkat akseptasi 76%.' },
];

export const VISION_SHORT = 'Ekosistem riset paling dipercaya';

export const VISION = 'Menjadi ekosistem kolaborasi riset yang paling dipercaya bagi akademisi pemula Indonesia untuk tumbuh dan berkontribusi lewat publikasi bereputasi internasional.';

export const MISSIONS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'handshake', title: 'Mempertemukan', text: 'Menghubungkan akademisi lintas kampus dan disiplin dalam komunitas yang terkurasi dan saling mendukung.' },
  { icon: 'cap', title: 'Mendampingi', text: 'Menyediakan mentor aktif, klinik naskah, dan kurikulum terstruktur dari ide sampai terbit.' },
  { icon: 'shield', title: 'Menjaga mutu', text: 'Menegakkan etika publikasi dan standar akademik: tanpa jalan pintas, tanpa jurnal predator.' },
  { icon: 'globe', title: 'Memperluas akses', text: 'Membuka kesempatan yang setara bagi akademisi dari kampus mana pun, termasuk di luar Jawa.' },
];

export const VALUES: { icon: IconName; title: string; text: string }[] = [
  { icon: 'target', title: 'Proses, bukan janji', text: 'Kami tidak menjual jaminan acceptance. Kami menjamin kerangka kerja, klinik mingguan, dan mentor yang hadir.' },
  { icon: 'users', title: 'Kolaboratif, bukan kompetitif', text: 'Tidak ada ranking peserta. Sesama anggota didorong menjadi co-author dan saling memberi peer-review.' },
  { icon: 'hourglass', title: 'Konsisten, bukan instan', text: 'Publikasi terindeks adalah maraton. Kami merancang ritme yang berkelanjutan, bukan sprint 30 hari yang melelahkan.' },
  { icon: 'book', title: 'Akademik, bukan transaksional', text: 'Mentor kami adalah peneliti aktif. Hubungan dengan peserta adalah hubungan akademik, bukan layanan pelanggan.' },
];

/** Milestones with the figures already stated on the site; drawn as a rising journey infographic. */
export const TIMELINE: { date: string; stage: string; icon: IconName; title: string; text: string; metrics: { value: string; label: string }[] }[] = [
  { date: 'Maret 2026', stage: 'Genesis', icon: 'coffee', title: 'Diskusi informal antar dosen muda', text: 'Lima dosen muda dari lima kampus berkumpul rutin untuk membaca draf naskah satu sama lain.', metrics: [{ value: '5', label: 'dosen muda' }, { value: '5', label: 'kampus' }] },
  { date: 'Juni 2026', stage: 'Berdiri', icon: 'flag', title: 'CoPublika resmi berdiri', text: 'Batch #1 dibuka; 14 dari 18 peserta berhasil publikasi dalam 9 bulan.', metrics: [{ value: '18', label: 'peserta' }, { value: '11', label: 'kampus' }, { value: '14', label: 'terbit' }] },
  { date: 'September 2026', stage: 'Tumbuh', icon: 'network', title: 'Cluster riset diluncurkan', text: 'Forum mingguan, klinik naskah, dan cluster lintas disiplin mulai berjalan.', metrics: [{ value: '12', label: 'cluster' }, { value: '24', label: 'mentor' }] },
  { date: 'Hari ini', stage: 'Sekarang', icon: 'rocket', title: 'Komunitas riset lintas Indonesia', text: 'Kami terus tumbuh bersama kampus dan akademisi dari seluruh Indonesia.', metrics: [{ value: '1.240', label: 'anggota' }, { value: '318', label: 'publikasi' }] },
];

/** "From → to" figures for the journey header: first recorded value and today's. */
export const JOURNEY_KPIS = [
  { from: '18', to: '1.240', accent: '+', label: 'anggota', note: 'dari batch pertama' },
  { from: '24', to: '47', accent: '', label: 'mentor aktif', note: 'sejak cluster diluncurkan' },
  { from: '14', to: '318', accent: '', label: 'publikasi', note: 'dari batch pertama' },
];

// ---------------------------------------------------------------------------
// Our Team
// ---------------------------------------------------------------------------

const byName = (name: string) => PEOPLE.find((p) => p.name === name) as Person;

export const CEO_WELCOME = {
  person: byName('Dr. Ade Putranto'),
  title: 'Founder & Chief Executive Officer',
  heading: 'Kami membangun tempat yang dulu kami cari.',
  paragraphs: [
    'Saat pertama kali menulis untuk jurnal internasional, saya menulis sendirian: ragu memilih jurnal, bingung membaca komentar reviewer, dan tidak tahu harus bertanya kepada siapa. Pengalaman itu ternyata dialami banyak rekan dosen muda di Indonesia.',
    'CoPublika kami dirikan agar tidak ada lagi akademisi yang harus melewati proses itu sendirian. Di sini, kualitas dijaga bersama: lewat mentor yang hadir, sesama anggota yang saling membaca naskah, dan ritme kerja yang konsisten.',
    'Terima kasih kepada setiap anggota, mentor, dan kampus mitra yang telah tumbuh bersama kami. Mari terus menulis, dan terbit bersama.',
  ],
  signoff: 'Salam kolaborasi,',
};

/**
 * Structure modelled on Indonesian community organisations (dewan penasihat, pimpinan,
 * sekretariat, divisi) with startup-style executive titles, since CoPublika runs a platform.
 */
export type OrgMember = { role: string; roleId: string; scope: string; person?: Person };
export type OrgUnit = { key: string; icon: IconName; name: string; nameId: string; text: string; members: OrgMember[] };

export const ORG: OrgUnit[] = [
  {
    key: 'exec',
    icon: 'compass',
    name: 'Pimpinan Eksekutif',
    nameId: 'Executive Board',
    text: 'Menetapkan arah organisasi, menjaga mutu akademik, dan memastikan program berjalan.',
    members: [
      { role: 'Founder & Chief Executive Officer', roleId: 'Ketua Umum', scope: 'Arah strategis, kemitraan, dan representasi organisasi.', person: byName('Dr. Ade Putranto') },
      { role: 'Chief Operating Officer', roleId: 'Direktur Operasional', scope: 'Operasional batch, keanggotaan, dan tata kelola harian.', person: byName('Dr. Maya Rahmawati') },
      { role: 'Chief Academic Officer', roleId: 'Direktur Akademik', scope: 'Kurikulum, standar penulisan, dan etika publikasi.', person: byName('Dr. Lina Kartika') },
      { role: 'Chief Technology Officer', roleId: 'Direktur Teknologi', scope: 'Platform digital, data anggota, dan keamanan sistem.', person: byName('Fajar Ramadhan, Ph.D.') },
    ],
  },
  {
    key: 'divisions',
    icon: 'grid',
    name: 'Kepala Divisi',
    nameId: 'Division Leads',
    text: 'Menjalankan program harian bersama koordinator dan relawan di tiap divisi.',
    members: [
      { role: 'Head of Academic Programs', roleId: 'Kepala Divisi Program Akademik', scope: 'Bootcamp, klinik naskah, dan penugasan mentor.', person: byName('Dr. Bayu Setiawan') },
      { role: 'Head of Community & Membership', roleId: 'Kepala Divisi Komunitas & Keanggotaan', scope: 'Kurasi anggota, cluster riset, dan forum.', person: byName('Dr. Dewi Nirmala') },
      { role: 'Head of Partnerships', roleId: 'Kepala Divisi Kemitraan', scope: 'Kerja sama dengan kampus, lembaga riset, dan jurnal.', person: byName('Dr. Hadi Suryanto') },
      { role: 'Head of Media & Communications', roleId: 'Kepala Divisi Media & Komunikasi', scope: 'Blog, media sosial, dan publikasi kegiatan.' },
    ],
  },
  {
    key: 'secretariat',
    icon: 'file',
    name: 'Sekretariat',
    nameId: 'Secretariat',
    text: 'Mengelola administrasi, keuangan, dan dokumen organisasi.',
    members: [
      { role: 'General Secretary', roleId: 'Sekretaris Jenderal', scope: 'Administrasi, persuratan, dan legalitas organisasi.' },
      { role: 'Treasurer', roleId: 'Bendahara', scope: 'Keuangan, beasiswa kursi gratis, dan pelaporan.' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Our Mentors
// ---------------------------------------------------------------------------

export type Mentor = Person & { field: string };

/** Mentors from the people library; the field filter is the first part of "Bidang · detail". */
export const MENTORS: Mentor[] = PEOPLE.filter((p) => p.kind === 'mentor' || p.kind === 'both').map((p) => ({
  ...p,
  field: p.expertise.split('·')[0].trim() || 'Lainnya',
}));

// ---------------------------------------------------------------------------
// Sub-page heroes and closing "join" sections
// ---------------------------------------------------------------------------

export const TEAM_HERO = { eyebrow: 'Our Team', title: 'Orang-orang yang', accent: 'menjalankan CoPublika.' };
export const TEAM_SECTION = { tag: 'Struktur organisasi', title: 'Kenalan dengan', accent: 'CoPublika Superteam.' };

export const MENTORS_HERO = {
  eyebrow: 'Our Mentors',
  title: 'Peneliti aktif yang',
  accent: 'mendampingi sampai terbit.',
  lead: 'Mentor CoPublika menulis, mereview, dan menyunting di jurnal bereputasi. Klik profil untuk melihat keahlian dan topik yang bisa mereka dampingi.',
};

/** Mentors in the whole community; the directory lists the profiles published so far. */
export const TOTAL_MENTORS = 47;
export const MENTORS_PER_PAGE = 8;

export const MENTOR_HOW: { icon: IconName; title: string; text: string }[] = [
  { icon: 'flask', title: 'Peneliti aktif', text: 'Masih menulis dan menerbitkan di jurnal bereputasi, bukan hanya mengajar teori.' },
  { icon: 'scan', title: 'Reviewer & editor', text: 'Banyak yang menjadi reviewer atau editor, jadi paham cara naskah dinilai.' },
  { icon: 'calendarCheck', title: 'Hadir tiap minggu', text: 'Mendampingi klinik naskah, cluster riset, dan sesi 1-on-1 selama program.' },
];

export type JoinContent = {
  eyebrow: string;
  title: string;
  accent: string;
  perks: { icon: IconName; title: string; text: string }[];
  listTitle: string;
  list: string[];
  cta: { label: string; href: string };
  secondary?: { label: string; href: string };
  note?: string;
};

/** "Bergabung sebagai pengurus". The checklist is the open positions of the org structure. */
export const JOIN_TEAM: Omit<JoinContent, 'list' | 'listTitle'> = {
  eyebrow: 'Bergabung sebagai pengurus',
  title: 'Bantu kami',
  accent: 'menumbuhkan komunitas.',
  perks: [
    { icon: 'network', title: 'Jejaring lintas kampus', text: 'Bekerja bersama akademisi dan mentor dari berbagai institusi.' },
    { icon: 'trend', title: 'Dampak yang terlihat', text: 'Program yang Anda kelola langsung membantu naskah anggota terbit.' },
    { icon: 'calendar', title: 'Waktu yang fleksibel', text: 'Rapat koordinasi rutin daring, menyesuaikan jadwal mengajar.' },
  ],
  cta: { label: 'Lamar ke Sekretariat', href: '/contact' },
  secondary: { label: 'Lihat para mentor', href: '/about/mentors' },
  note: 'Kirim CV singkat dan posisi yang diminati. Sekretariat akan menghubungi Anda dalam 7 hari kerja.',
};

export const JOIN_MENTOR: JoinContent = {
  eyebrow: 'Daftar sebagai mentor',
  title: 'Anda peneliti aktif?',
  accent: 'Jadi mentor.',
  perks: [
    { icon: 'users', title: 'Dampak langsung', text: 'Bantu akademisi pemula menembus jurnal bereputasi, satu naskah setiap kali.' },
    { icon: 'calendar', title: 'Jadwal yang ringan', text: 'Sesi daring terjadwal; Anda memilih klinik dan cluster yang sesuai.' },
    { icon: 'network', title: 'Kolaborasi riset', text: 'Peluang menjadi co-author dan membangun tim lintas kampus.' },
  ],
  listTitle: 'Yang kami cari',
  list: [
    'Rekam jejak publikasi di jurnal terindeks Scopus atau Sinta',
    'Pengalaman sebagai reviewer atau editor jurnal (diutamakan)',
    'Bersedia mendampingi minimal 2 jam per minggu',
    'Peduli pada akademisi pemula dan etika publikasi',
  ],
  cta: { label: 'Daftar sebagai mentor', href: '/contact' },
  secondary: { label: 'Lihat pengurus', href: '/about/team' },
  note: 'Tim akademik meninjau setiap pendaftaran dan akan menghubungi Anda untuk sesi perkenalan.',
};
