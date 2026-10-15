import { z } from "zod";

// Hero slider on the landing page. This schema is the contract shared by the
// admin form, the server-side save action and the public render, so the length
// limits here are what keep admin-entered copy from breaking the layout.

const link = z.object({
  label: z.string().trim().min(1).max(32),
  href: z.string().trim().regex(/^(\/|https:\/\/)/, "Link harus diawali / atau https://"),
});

export const heroSlideSchema = z.object({
  id: z.string().min(1),
  /** Short label above the heading and in the slider rail, e.g. "Program". */
  kicker: z.string().trim().min(1).max(24),
  title: z.string().trim().min(1).max(40),
  /** The part of the heading set in Scopus Orange. */
  titleAccent: z.string().trim().max(40).default(""),
  dek: z.string().trim().min(1).max(140),
  cta: link,
  secondary: link.nullable().default(null),
  image: z.object({
    src: z.string().trim().regex(/^(\/|https:\/\/)/, "Gambar harus diawali / atau https://"),
    alt: z.string().trim().min(1).max(140),
  }),
  status: z.enum(["published", "draft"]),
  order: z.number().int().min(0),
});

export type HeroSlide = z.infer<typeof heroSlideSchema>;

// Placeholder photos until CoPublika's own event and community photos are uploaded.
const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?w=1600&q=80&auto=format&fit=crop`;

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: "hero-community",
    kicker: "Komunitas",
    title: "Riset lebih terarah,",
    titleAccent: "kolaborasi lebih berarti.",
    dek: "Komunitas terkurasi untuk akademisi yang ingin menemukan rekan riset dan menulis untuk publikasi bereputasi.",
    cta: { label: "Daftar batch", href: "/join-batch" },
    secondary: { label: "Lihat proyek riset", href: "/research" },
    image: { src: unsplash("1523240795612-9a054b0db644"), alt: "Sekelompok peneliti berdiskusi di depan laptop di sebuah perpustakaan" },
    status: "published",
    order: 1,
  },
  {
    id: "hero-program",
    kicker: "Program",
    title: "Siap Tembus Scopus,",
    titleAccent: "dibimbing sampai terbit.",
    dek: "Program belajar terstruktur dari menyusun naskah sampai memilih jurnal yang tepat.",
    cta: { label: "Lihat program", href: "/siap-tembus-scopus" },
    secondary: null,
    image: { src: unsplash("1434030216411-0b793f4b4173"), alt: "Tangan menulis catatan naskah dengan pena di atas meja kerja" },
    status: "published",
    order: 2,
  },
  {
    id: "hero-event",
    kicker: "Agenda",
    title: "Ruang kecil,",
    titleAccent: "diskusi yang panjang.",
    dek: "Studio metode dan sesi kolaborasi bersama anggota dan reviewer. Lihat jadwal terdekat.",
    cta: { label: "Lihat agenda", href: "/event" },
    secondary: null,
    image: { src: unsplash("1524178232363-1fb2b075b655"), alt: "Peserta mendengarkan pemateri dalam sesi seminar di ruang kelas" },
    status: "published",
    order: 3,
  },
  {
    id: "hero-blog",
    kicker: "Catatan riset",
    title: "Tulisan untuk",
    titleAccent: "peneliti yang serius.",
    dek: "Tips publikasi, kritik metode, dan cerita di balik riset anggota CoPublika.",
    cta: { label: "Baca blog", href: "/blog" },
    secondary: null,
    image: { src: unsplash("1481627834876-b7833e8f5570"), alt: "Lorong perpustakaan dengan rak buku tinggi dan lampu gantung" },
    status: "published",
    order: 4,
  },
];
