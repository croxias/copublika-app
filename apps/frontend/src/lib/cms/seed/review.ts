import { personId } from '../slug';
import type { CmsItem } from '../types';
import type { ReviewEvent } from '../review';
import type { SeedPart } from './types';

// Writer articles from Ruang Penulis, so the review queue and the writer desk have something to
// show in staging: one waiting for review, one sent back for revision, one private draft.

const dewi = personId('Dr. Dewi Nirmala');
const fajar = personId('Fajar Ramadhan, Ph.D.');

const QUALITATIVE = `Bagian metode adalah tempat reviewer memutuskan apakah temuan Anda bisa dipercaya. Untuk riset kualitatif, keputusan itu sering diambil dalam dua paragraf pertama.

## Mulai dari pertanyaan, bukan dari teknik

Banyak naskah dibuka dengan "Penelitian ini menggunakan pendekatan kualitatif." Kalimat itu benar, tetapi tidak menjawab apa yang ingin diketahui reviewer: mengapa pendekatan ini paling tepat untuk pertanyaan Anda. Tuliskan hubungan itu secara eksplisit. Jika Anda ingin memahami makna yang diberikan guru terhadap kebijakan kurikulum baru, jelaskan bahwa makna tidak bisa diukur dengan skala, sehingga wawancara mendalam menjadi pilihan yang masuk akal.

## Jelaskan siapa partisipan dan bagaimana mereka dipilih

Reviewer akan bertanya apakah partisipan Anda mewakili fenomena yang diteliti. Sebutkan kriteria inklusi, cara Anda menghubungi mereka, jumlah partisipan, dan kapan Anda berhenti merekrut. Jika Anda memakai saturasi data, jelaskan bagaimana Anda menilainya, misalnya tidak ada kode baru setelah wawancara ke-14.

## Tunjukkan jejak analisis

Kalimat "data dianalisis secara tematik" terlalu tipis. Sebutkan rujukan prosedur yang Anda ikuti, siapa yang melakukan pengodean, bagaimana perbedaan pengodean diselesaikan, dan perangkat lunak yang dipakai. Lampirkan contoh pohon kode atau tabel tema di lampiran agar reviewer bisa menelusuri langkah Anda.

## Bicarakan posisi peneliti

Reviewer jurnal kualitatif yang baik akan mencari refleksivitas. Satu paragraf pendek tentang latar belakang Anda, hubungan Anda dengan partisipan, dan cara Anda menjaga jarak analitis sudah cukup untuk menunjukkan kesadaran metodologis.

## Penutup

Bagian metode yang meyakinkan bukan yang paling panjang, melainkan yang membuat reviewer bisa membayangkan dirinya mengulang penelitian Anda. Gunakan daftar periksa COREQ sebagai pengingat sebelum mengirim naskah.`;

const AI_ETHICS = `Alat bantu berbasis AI kini ada di hampir setiap tahap penulisan. Pertanyaannya bukan lagi boleh atau tidak, tetapi bagaimana memakainya tanpa melanggar kebijakan jurnal.

## Apa kata kebijakan penerbit

Sebagian besar penerbit besar sepakat pada tiga hal: AI tidak boleh dicantumkan sebagai penulis, penggunaan AI harus diungkapkan, dan penulis tetap bertanggung jawab penuh atas isi naskah.

## Area abu-abu

Menyunting tata bahasa umumnya diterima. Membuat ringkasan literatur lalu menyalinnya tanpa verifikasi berisiko tinggi karena rujukan bisa keliru.`;

const ev = (at: string, by: ReviewEvent['by'], name: string, action: ReviewEvent['action'], extra: Partial<ReviewEvent> = {}): ReviewEvent => ({ at, by, name, action, ...extra });

const base = { guestAuthor: false, authorAffiliation: '', editorsPick: false, editorNote: '', metaTitle: '', metaDescription: '', publishAt: '', status: 'draft' };

const items: CmsItem[] = [
  {
    ...base,
    id: 'blog-w-metode-kualitatif',
    title: 'Menulis Bagian Metode Kualitatif yang Meyakinkan Reviewer',
    slug: 'metode-kualitatif-meyakinkan-reviewer',
    category: 'guide',
    excerpt: 'Reviewer memutuskan apakah temuan kualitatif Anda bisa dipercaya dari bagian metode. Empat hal yang harus terlihat jelas di sana.',
    cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1600&q=80&auto=format&fit=crop',
    coverAlt: 'Buku catatan dan pena di atas meja kerja',
    content: QUALITATIVE,
    writerId: dewi,
    authorId: dewi,
    author: 'Dr. Dewi Nirmala',
    readTime: '2 menit',
    review: 'submitted',
    round: 1,
    history: [
      ev('2026-10-09T03:20:00.000Z', 'writer', 'Dr. Dewi Nirmala', 'created'),
      ev('2026-10-13T02:05:00.000Z', 'writer', 'Dr. Dewi Nirmala', 'submitted'),
    ],
    order: 101,
    updatedAt: '2026-10-13T02:05:00.000Z',
  },
  {
    ...base,
    id: 'blog-w-etika-ai',
    title: 'Etika AI dalam Penulisan Paper: Apa yang Boleh dan Tidak',
    slug: 'etika-ai-penulisan-paper',
    category: 'essay',
    excerpt: 'Kebijakan penerbit soal AI makin seragam. Di mana batas aman memakai alat bantu AI saat menulis naskah jurnal?',
    cover: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=1600&q=80&auto=format&fit=crop',
    coverAlt: 'Laptop dengan kode di layar',
    content: AI_ETHICS,
    writerId: fajar,
    authorId: fajar,
    author: 'Fajar Ramadhan, Ph.D.',
    readTime: '1 menit',
    review: 'changes',
    round: 1,
    history: [
      ev('2026-10-06T07:40:00.000Z', 'writer', 'Fajar Ramadhan, Ph.D.', 'created'),
      ev('2026-10-08T01:10:00.000Z', 'writer', 'Fajar Ramadhan, Ph.D.', 'submitted'),
      ev('2026-10-10T04:30:00.000Z', 'editor', 'Tim Editor', 'edited', { fields: ['Judul'] }),
      ev('2026-10-10T04:31:00.000Z', 'editor', 'Tim Editor', 'changes', {
        note: 'Topiknya bagus dan tepat waktu. Isi masih terlalu pendek (sekitar 120 kata): tambahkan contoh kebijakan dari 2–3 penerbit (Elsevier, Springer, Taylor & Francis) dengan tautan, lalu satu bagian praktis "cara menuliskan pernyataan penggunaan AI". Target 600–900 kata.',
      }),
    ],
    order: 102,
    updatedAt: '2026-10-10T04:31:00.000Z',
  },
  {
    ...base,
    id: 'blog-w-catatan-konferensi',
    title: 'Catatan dari Konferensi: Yang Dicari Editor Jurnal Sosial',
    slug: 'catatan-konferensi-editor-jurnal-sosial',
    category: 'news',
    excerpt: '',
    cover: '',
    coverAlt: '',
    content: 'Minggu lalu saya mengikuti sesi "Meet the Editors"…',
    writerId: dewi,
    authorId: dewi,
    author: 'Dr. Dewi Nirmala',
    readTime: '1 menit',
    review: 'draft',
    round: 0,
    history: [ev('2026-10-14T06:00:00.000Z', 'writer', 'Dr. Dewi Nirmala', 'created')],
    order: 103,
    updatedAt: '2026-10-14T06:00:00.000Z',
  },
];

export const seed: SeedPart = { collections: { blog: items } };
