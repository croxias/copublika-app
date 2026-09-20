# Desain Frontend Staging — Dashboard Admin CoPublika

Tanggal: 2026-08-30
Status: Disetujui untuk spesifikasi, menunggu review tertulis

## Tujuan

Meningkatkan `/admin/dashboard` pada mode staging/demo sebagai Pusat Operasional berbahasa Indonesia. Fase ini hanya mengubah pengalaman frontend dan shared store lokal; tidak mengubah backend, database, API production, atau aturan akses production.

Dashboard harus membantu admin memahami prioritas tindakan, kesehatan batch, alur proyek, dan aktivitas terbaru dalam satu tampilan yang mudah dipindai.

## Batasan Fase

- Mode target: `NEXT_PUBLIC_COPUBLIKA_DEMO_MODE=true`.
- Data berasal dari shared staging store dan `localStorage`; perubahan antar-menu dashboard harus terlihat pada record staging yang sama.
- Halaman publik staging membaca data yang sama untuk konten yang memang memiliki status/visibility publik.
- Bahasa default Indonesia; opsi English disiapkan melalui preference lokal dan setting, dengan struktur label yang dapat dilokalkan.
- Production dashboard dan integrasi backend tidak disentuh pada fase ini.

## Arah Visual

Dashboard menggunakan gaya clean monochrome dengan aksen Scopus Orange, tetapi hierarchy diperkuat agar tidak menjadi kumpulan kartu seragam. Tipografi menggunakan Geist melalui `next/font`, dengan ukuran dan weight yang konsisten untuk heading, metadata, angka, dan body.

Token visual mengikuti pola shadcn/ui dan dapat dikalibrasi melalui tweakcn: background, surface, border, foreground, muted, accent, destructive, radius, spacing, focus ring, dan shadow. Komponen dapat diadopsi bertahap dengan pola shadcn/ui tanpa rewrite shell yang sudah berjalan.

Isometric icon digunakan selektif untuk konteks KPI/empty state atau ilustrasi status penting. Ikon navigasi dan aksi tetap menggunakan ikon UI yang sederhana agar fungsi lebih jelas. Tidak ada dekorasi yang tidak menambah makna.

Anti-slop review menjadi quality gate: menghindari grid monoton, nested cards berlebihan, gradient dekoratif, label campuran, angka tanpa konteks, CTA generik, dan motion yang mengganggu pekerjaan admin.

## Struktur Halaman

1. Header halaman: breadcrumb, judul “Pusat Operasional”, ringkasan kondisi, dan aksi “Buka antrian”.
2. Notice staging: penanda data sintetis, localStorage, dan read-only/network boundary yang jelas.
3. KPI prioritas: total pendaftar, antrian kurasi, batch terbuka, dan review proyek. Setiap KPI memiliki konteks singkat dan tautan ke area terkait.
4. Antrian prioritas: gabungan pendaftar dan proyek yang membutuhkan tindakan, dengan status, pemilik, alasan, dan aksi tinjau.
5. Kesehatan batch: occupancy, kuota, deadline, dan severity/risk.
6. Tren pendaftar: visualisasi data sintetis yang memiliki label, legenda, fallback kosong, dan aksesibilitas.
7. Pipeline proyek: distribusi status Draft, Menunggu Review, Terbit, dan Arsip.
8. Risiko deadline: daftar item yang membutuhkan perhatian; empty state jika tidak ada risiko.
9. Aktivitas terbaru: timeline ringkas dari shared store dengan tautan detail.

Urutan dan bobot visual memprioritaskan tindakan di atas analitik. Gantt/timeline hanya ditambahkan bila model staging memiliki rentang tanggal yang bermakna; jika belum, timeline aktivitas digunakan dan tidak dipaksakan menjadi chart palsu.

## Interaksi dan Responsif

- Card, tab, badge, progress, table/list, tooltip, skeleton, alert, dan select mengikuti primitive/token yang konsisten dengan shadcn/ui.
- Motion ringan untuk entrance dan perubahan state; menghormati `prefers-reduced-motion`.
- Focus state, keyboard navigation, semantic landmarks, label chart, dan kontras warna menjadi persyaratan.
- Desktop menggunakan dua kolom untuk konten utama; tablet dan mobile berubah menjadi satu kolom dengan touch target minimum yang nyaman.
- Tidak ada interaksi yang mengubah production. Semua mutation staging melalui shared store lokal.

## Interkoneksi Data

Shared store menjadi sumber kebenaran staging untuk applicants, batches, projects, blogs, events, dan activity. Mutation dari menu staging memperbarui store dan menghasilkan aktivitas. Dashboard menghitung KPI, queue, pipeline, dan risk dari store yang sama. Halaman publik hanya menampilkan konten staging yang memenuhi status publik dan aturan visibility.

Preference bahasa disimpan lokal dan digunakan oleh shell serta halaman staging. Translation keys dipisahkan dari komponen agar penambahan English tidak membutuhkan duplikasi halaman.

## Dependency dan Repository Acuan

Repository dan skill yang diberikan digunakan sebagai acuan/paket hanya setelah verifikasi kompatibilitas dengan Next.js 16 dan React 19:

- shadcn/ui: pola primitive dan aksesibilitas komponen.
- tweakcn: token dan eksplorasi tema.
- anti-slop: checklist/audit kualitas visual.
- ui-skills MCP serta pola emilkowalski/jakubkrehel: referensi motion dan interaction.
- `agentation-mcp`: anotasi/review visual staging jika dapat dijalankan tanpa mengganggu aplikasi.
- Chart/Gantt: hanya library atau implementasi yang sesuai dengan data dan bundle budget.

Instalasi dependency atau konfigurasi MCP dilakukan terpisah dan tidak boleh mengubah production path tanpa persetujuan.

## Verifikasi

- Jalankan lint dan typecheck frontend.
- Jalankan build frontend bila perubahan dependency/config dilakukan.
- Uji staging pada desktop, tablet, dan mobile.
- Verifikasi mutation localStorage antar dashboard, applicants, batches, projects, blog, dan event.
- Verifikasi toggle bahasa dan persistensi preference.
- Verifikasi reduced motion, keyboard focus, empty state, dan data reset.
- Lakukan anti-slop review dan anotasi visual sebelum fase backend.

## Tidak Termasuk

Backend/API, Supabase schema, authentication production, Google Scholar sync nyata, deployment, dan penggabungan ke production dashboard.
