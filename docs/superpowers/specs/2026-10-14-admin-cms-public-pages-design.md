# Admin CMS untuk Halaman Publik — Desain Menu & CRUD

Tanggal: 2026-10-14
Status: Disetujui, UI admin selesai di mode staging (2026-10-14)
Fase: semua yang tampil di website publik bisa diubah dari dashboard admin.
Di luar fase: kurasi pendaftar, anggota, LMS untuk member, template vault, Better Auth.

## 1. Prinsip

1. **Satu data, satu tempat.** Konten yang muncul di beberapa halaman disimpan
   sekali, lalu halaman-halaman itu mengambilnya dari sana. Contohnya mentor
   yang muncul di landing, halaman About, dan halaman Siap Tembus Scopus.
   Tidak ada copy-paste antar menu.
2. **Form admin mengikuti bentuk halaman publik.** Setiap section yang terlihat
   di web punya padanan di form. Admin tidak perlu menebak teks mana yang
   muncul di mana.
3. **Desain landing tidak berubah.** Data hardcode yang sekarang dipindahkan
   menjadi isi awal (seed). Setelah disambungkan, tampilan web harus sama persis.
4. **Selalu ada fallback.** Kalau DB kosong atau error, halaman publik memakai
   konten default. Pola ini sama dengan `lib/content/hero.ts`.
5. **Batas panjang teks dijaga.** Setiap field punya batas karakter (zod) yang
   sama antara form admin dan render publik, supaya teks dari admin tidak
   merusak layout.

## 2. Tiga pola CRUD

| Pola | Dipakai untuk | Bentuk UI |
|---|---|---|
| **A. Koleksi** | Blog, Event, Riset, Publikasi, Hero Slide, Tim & Mentor, Testimoni, FAQ | Tabel daftar (cari, filter status, urutkan) → halaman edit penuh (Blog, Event, Riset) atau drawer samping (item pendek) |
| **B. Editor halaman** | Beranda, About, Halaman Riset, Siap Tembus Scopus, Proses Kurasi, Kontak | Satu halaman dengan tab per section, mengikuti urutan section di web. Tiap tab berisi field teks dan list item yang bisa diurutkan. |
| **C. Pengaturan** | Pengaturan Situs | Satu form dengan grup field |

Perilaku yang sama di semua pola:
- **Status**: `Draft` / `Published` (+ `Terjadwal` dan `Arsip` untuk Blog & Event).
  Halaman publik hanya menampilkan yang Published.
- **Simpan → web langsung terupdate.** Server action menyimpan data lalu
  memanggil `revalidateTag`.
- **"Lihat di web"** membuka halaman publik terkait di tab baru.
- **Peringatan perubahan belum disimpan** muncul kalau admin meninggalkan form.
- **Urutan** diatur dengan tombol naik/turun (sama seperti Hero Slider sekarang).
- **Hapus** selalu minta konfirmasi. Item yang sedang dipakai halaman lain
  (misalnya mentor) menampilkan peringatan "dipakai di: …".
- **Gambar** sementara diisi URL saja. Upload ditunda.

## 3. Struktur sidebar fase ini

```
RINGKASAN
  Dasbor

KONTEN
  Artikel Blog            (A)
  Agenda Event            (A)

RISET
  Riset & Proyek          (A)
  Publikasi Anggota       (A)

HALAMAN WEBSITE
  Beranda                 (B)
  About                   (B)
  Halaman Riset           (B)
  Siap Tembus Scopus      (B)
  Proses Kurasi           (B)
  Kontak                  (B)

PUSTAKA BERSAMA
  Tim & Mentor            (A)
  Testimoni               (A)
  FAQ                     (A)

KURASI
  Manajemen Batch         (A)  ← masuk fase ini karena memengaruhi /join-batch & footer
  Verifikasi Pendaftar         [Segera]
  Anggota                      [Segera]

PROGRAM
  Modul LMS                    [Segera]
  Template Vault               [Segera]

SISTEM
  Pengaturan Situs        (C)
  Audit & Keamanan             [Segera]
```

Menu bertanda `[Segera]` tetap terlihat tapi non-aktif (abu-abu, tidak bisa
diklik, ada label "Segera"). Tidak ada lagi menu yang mengarah ke `#`.
Badge angka hanya muncul kalau datanya asli dari DB.

Menu lama yang dihapus atau digabung:
- *Hero Slider* → masuk ke tab di **Beranda**.
- *Research Project — Landing* → diganti toggle "Tampil di beranda" di **Riset & Proyek**.
- *Konfigurasi Website* → digabung ke **Pengaturan Situs**.
- *Cluster Riset* → menjadi daftar pilihan bidang yang dikelola dari dalam
  **Riset & Proyek** (tombol "Kelola cluster"). Bukan menu sendiri.

## 4. Rincian per menu

### 4.1 Artikel Blog (A) → `/blog`, `/blog/[slug]`, landing BlogFeatured

- **Daftar:** judul, kategori, penulis, status, tanggal terbit, tanda ★ (featured).
  Filter: status dan kategori.
- **Edit (halaman penuh):** judul, slug (otomatis dari judul, bisa diubah),
  kategori (Panduan/Interview/Esai/Berita/Studi Kasus), ringkasan (maks. 220),
  cover URL + alt, penulis, isi (editor Markdown dengan pratinjau),
  waktu baca (dihitung otomatis), SEO (meta title, meta description).
- **Terbit:** `Draft` → `Terbit sekarang` atau `Jadwalkan` (tanggal & jam) → `Arsip`.
- **Featured:** satu artikel saja. Memilih artikel baru otomatis melepas yang lama.
  Landing menampilkan artikel featured, lalu artikel terbaru.

### 4.2 Agenda Event (A) → `/event`, `/event/[slug]`, landing EventsBoard

- **Daftar:** judul, tanggal, lokasi/format, status (Upcoming/Live/Selesai),
  dan kuota terisi/total.
- **Edit:** judul, slug, subjudul pendek (untuk kartu landing), deskripsi (Markdown),
  tanggal, jam, durasi, format (Online/Offline/Hybrid), lokasi, bahasa,
  berbayar? + harga, khusus member?, kuota, link pendaftaran.
- **Status otomatis dari tanggal.** Upcoming → Live (saat acara berlangsung)
  → Selesai. Admin bisa menimpanya manual.
- Daftar pendaftar dan registrasi **tidak termasuk fase ini**.

### 4.3 Riset & Proyek (A) → `/research`, `/research-project/[slug]`

- **Daftar:** judul, cluster, status riset (Recruiting/Writing/Review),
  visibilitas, ⭐ tampil di beranda.
- **Edit:** judul, slug, cluster, status riset, abstrak, metodologi,
  target jurnal (list), keahlian yang dicari (list), tag, timeline,
  ketua (nama, peran, afiliasi), kolaborator (list nama + peran), tanggal mulai.
- **Visibilitas:** `Draft` / `Publik` / `Privat`.
- **Curiosity gap:** form diberi penanda field mana yang terlihat oleh tamu
  (judul, cluster, teaser) dan mana yang di-blur (metodologi, kolaborator, dll).
  Di samping form ada pratinjau kartu "seperti dilihat tamu".
- Galeri proyek di `/research` dan halaman `/research-project/[slug]`
  membaca langsung koleksi ini.

### 4.4 Publikasi Anggota (A) → `/research` PublicationsExplorer, landing ResearchMarquee

- Judul paper, jurnal, kuartil (Q1–Q4), cluster, penulis, tahun/bulan terbit,
  DOI/link, status.
- Opsional: ditautkan ke proyek riset asalnya.
- **Tampil di beranda** (⭐ + urutan tabel). Marquee "Riset" di landing
  ternyata menampilkan *paper yang sudah terbit*, jadi toggle ini ada di
  Publikasi, bukan di Proyek. Ini menggantikan menu "Research Project — Landing".

### 4.5 Beranda (B) → `/`

Tab mengikuti urutan section di landing:

| Tab | Isi |
|---|---|
| Hero | Koleksi `heroSlides` yang dikelola langsung di tab (tanpa "Simpan section"): kartu slide dengan tombol **Detail** → drawer + pratinjau, disimpan per slide dengan konfirmasi. Urutan, tampil/sembunyi, duplikat, hapus (dengan Urungkan). Gambar latar bisa diunggah (staging: WebP data URL; backend: object storage). Section hanya menyimpan `visible`. |
| Statistik | Judul section + 3 tahap (label, angka, keterangan) |
| Kenapa Bergabung | Judul, daftar bidang, tahap progres. Mentor dipilih dari **Tim & Mentor** |
| Program | Judul, durasi minggu, detail, kurikulum ringkas, CTA |
| Riset | Judul/subjudul section. Isi kartu otomatis dari proyek ⭐ (link ke Riset & Proyek) |
| Event | Judul section. Isi otomatis dari event mendatang |
| Blog | Judul section. Isi otomatis dari artikel featured + terbaru |
| Testimoni | Judul section + pilih testimoni dari **Testimoni** (urutan, baris A/B) |
| FAQ | Judul section + pilih FAQ dari **FAQ** |
| CTA Akhir | Judul, dek, tombol, poin kepercayaan |

Setiap tab punya toggle **Tampilkan section**, supaya section bisa
disembunyikan tanpa menghapus isinya.

### 4.6 About (B) → `/about`

Tab: Hero & meta · Misi (poin-poin) · Nilai (list) · Timeline (list tahun +
peristiwa) · Tim (pilih dari **Tim & Mentor**).
Model staging lama (`visi/misi/nilai/profil` teks bebas) diganti karena tidak
cocok dengan struktur halaman About yang sebenarnya.

### 4.7 Halaman Riset (B) → `/research`

Tab: Hero (judul, dek, statistik) · Proses riset (langkah-langkah) · CTA.
Galeri proyek dan publikasi diambil otomatis dari koleksi masing-masing.

### 4.8 Siap Tembus Scopus (B) → `/siap-tembus-scopus`

Tab: Ringkasan (meta singkat) · Profil ideal · Output · Kurikulum (minggu + topik)
· Mentor (pilih dari **Tim & Mentor**) · Fitur gratis · FAQ (pilih dari **FAQ**).
Batch yang sedang dibuka diambil otomatis dari **Manajemen Batch**.

### 4.9 Proses Kurasi (B) → `/curation-process`

Judul, dek, dan daftar langkah (judul, deskripsi, ikon).

### 4.10 Kontak (B) → `/contact`

Judul, dek, email, telepon, alamat, jam layanan, dan topik pada form kontak.
Data kontak default diambil dari Pengaturan Situs; halaman ini hanya menimpa
kalau diisi.

### 4.11 Tim & Mentor (A) — pustaka bersama

Nama, foto URL, peran/jabatan, afiliasi, bio singkat, link (Scholar/LinkedIn),
dan label "Mentor" / "Tim inti". Dipakai oleh Beranda, About, dan Siap Tembus Scopus.
Daftar menampilkan kolom **Dipakai di**.

### 4.12 Testimoni (A) — pustaka bersama

Nama, peran/afiliasi, kutipan (maks. 220), foto URL, batch/angkatan, status.

### 4.13 FAQ (A) — pustaka bersama

Pertanyaan, jawaban, kategori (Umum/Program/Pendaftaran), status, urutan.

### 4.14 Manajemen Batch (A) → `/join-batch`, `/siap-tembus-scopus`, footer

Nama batch (mis. "Batch #4"), status (Segera/Dibuka/Ditutup), tanggal buka
dan tutup, kuota, harga, catatan. Hanya satu batch boleh berstatus "Dibuka" untuk
label footer. Label "Batch #4: Open" di footer dibuat otomatis, tidak diketik
manual lagi.

### 4.15 Pengaturan Situs (C)

- **Identitas:** nama situs, tagline, logo URL.
- **Kontak & sosial:** email, telepon, Instagram, Threads, LinkedIn.
- **Navigasi publik:** toggle per menu (Research, Blog, Event, Program, Contact).
  Menu yang dimatikan disembunyikan dari header dan footer, dan route-nya
  menampilkan 404.
- **Announcement bar:** toggle + teks + link.
- **Footer:** deskripsi singkat, link legal.

## 5. Model data (ringkas, untuk fase backend)

Koleksi → tabel sendiri: `blog_posts`, `events`, `research_projects`,
`research_clusters`, `publications`, `hero_slides` (sudah ada), `people`,
`testimonials`, `faqs`, `batches`.

Editor halaman → `site_sections` (sudah ada): satu baris per `key`
(`home.stats`, `home.cta`, `about.values`, `sts.curriculum`, `settings`, …).
Isinya JSON yang divalidasi oleh schema zod per key. Relasi ke pustaka
bersama disimpan sebagai daftar id terurut.

## 6. Jawaban: riset terbaru tetap tampil setelah "Research Highlight" dihapus?

Ya, aman, bahkan lebih aman dari sekarang. Kartu riset di beranda tidak lagi
menyimpan salinan judul sendiri. Kartu itu membaca langsung publikasi yang
ditandai ⭐ "Tampilkan di beranda". Akibatnya:

- Edit judul/jurnal/kuartil publikasi → beranda ikut berubah saat disimpan
  (cache di-revalidate).
- Publikasi diubah ke Draft → otomatis hilang dari beranda.
- Opsi **"Isi otomatis dengan terbaru"** di tab Riset Beranda:
  kalau publikasi ⭐ kurang dari jumlah kartu, sisanya diisi publikasi
  terbaru, jadi beranda tidak pernah kosong.

## 7. Urutan pengerjaan

1. Sidebar baru + route + menu "Segera" non-aktif (masih data staging).
2. Komponen admin bersama: tabel koleksi, drawer edit, editor tab halaman,
   pemilih item pustaka, status badge, konfirmasi hapus, peringatan perubahan belum disimpan.
3. Halaman admin per menu, dengan data staging, untuk diuji alurnya.
4. Setelah alur disetujui: schema Drizzle + migrasi (branch Neon dulu) + seed
   dari data hardcode + server action + sambungkan halaman publik.

## 8. Pertanyaan terbuka

1. **Bahasa:** konten dari admin hanya Bahasa Indonesia dulu? (Label UI ID/EN
   tetap dari kamus `i18n.ts`.) Kalau perlu EN, setiap field teks butuh
   versi ID dan EN, dan form jadi dua kali lebih panjang.
2. **Halaman Kontak:** topik form kontak perlu bisa diatur admin, atau cukup statis?
