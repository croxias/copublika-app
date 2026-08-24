# PRD — Project Requirements Document

## 1. Overview
Saat ini, belum ada wadah publik yang memadai bagi keilmuan akademis untuk melakukan kolaborasi penelitian secara masif dan terstruktur. Hal ini menyebabkan proses pencarian rekan riset dan ahli menjadi lambat dan terfragmentasi. **"CoPublika"** hadir sebagai aplikasi Web SaaS komunitas akademik eksklusif untuk menyelesaikan masalah ini. 

Secara resmi, CoPublika didefinisikan sebagai **"Digital Research Engine & Exclusive Community"** yang bertujuan secara fundamental untukeliminasikan isolasi akademik, menghubungkan pakar lintas instansi secara instan, dan mengakselerasi pencapaian publikasi berkualitas tinggi (seperti Scopus). Platform ini dibangun di atas sistem pendaftaran berbasis batch dan kurasi ketat guna memastikan kualitas ekosistem tetap terjaga.

Platform ini berfungsi ganda sebagai etalase publik dinamis untuk menarik minat akademisi, serta dashboard privat eksklusif untuk kolaborasi. Seluruh konten di wajah publik dikelola secara tersentralisasi melalui Dashboard Superadmin untuk memastikan data aktual, terkurasi, dan kredibel. Sinergi antara dashboard anggota dan kontrol admin menciptakan siklus publikasi yang aman, terstruktur, dan otomatis.

## 2. Requirements & UI/UX
- **Desain:** Gaya *Clean Monochrome* profesional dengan aksen *Scopus Orange*. Logo kolaborasi ikonik. Tipografi tegas, modern, dan *bold*. Implementasi native Dark/Light mode dan layout responsif premium.
- **Struktur Navigasi (Header - Centered Layout):**
  - **Sticky Header dengan Glassmorphism:** Menu terlihat saat scroll dengan efek blur latar belakang halus.
  - **Menu Utama:**
    - **Home:** Beranda utama dengan fokus konversi dan KPI komunitas.
    - **About:** Visi "Digital Research Engine" dan profil eksklusivitas.
    - **Research Project:** Galeri riset publik dengan *Curiosity Gap* (preview terbatas).
    - **Program:** Dropdown menu berisi **"Siap Tembus Scopus"** (Halaman LMS & Silabus).
    - **Blog:** Daftar artikel, tips akademik, dan insight riset (SEO Magnet).
    - **Event:** Kalender aktivitas, webinar, dan sesi kolaborasi (Status: Upcoming/Live).
    - **Contact:** Halaman kontak dan formulir inisiasi kemitraan.
  - **Tools & Auth (Header):**
    - **Language Switcher:** Dropdown ikon bendera (ID/EN) dengan transisi halus.
    - **Theme Toggle:** Tombol Dark/Light mode (Persist ke Local Storage).
    - **Log In:** Tombol *Ghost Style*.
    - **Register:** Tombol *Solid Scopus Orange* (CTA Utama).
  
- **Halaman Publik Utama:**
  - **Landing Page:** 
    - Hero Section dengan highlight kalimat kunci menggunakan warna Scopus Orange.
    - KPI Card menggunakan *Bento-box layout* (Social Proof: Jumlah Member Aktif, Paper Published, H-Index Rata-rata).
    - Research Gallery dengan *Curiosity Gap*.
    - Section Blog & Event terbaru dalam grid responsif.
  - **Research Project Public Page:** 
    - Menggunakan *Curiosity Gap*. Detail projek di-blur secara estetik. Hover memicu mikro-interaksi "lift-up".
  - **Blog & Event Page:** 
    - Grid SEO-friendly. Event menampilkan badge status `Live` atau `Upcoming` dengan aksen oranye tegas.

- **Struktur Footer:**
  - **Brand Profile:** Logo resolusi tinggi dan deskripsi singkat.
  - **Quick Links:** Navigasi matriks (Home, About, Projects, Blog, Event, etc).
  - **Newsletter:** Input email dengan tombol submit berwarna Scopus Orange untuk notifikasi batch baru.
  - **Legal:** Terms of Service, Privacy Policy, Academic Integrity Policy.
  - **Bottom Bar:** Copyright dengan status batch real-time (Contoh: "Batch #4: Open").

- **Formulir Pendaftaran & Kurasi:**
  - **ID Google Scholar (Wajib & Primer):** Tolok ukur verifikasi kredibilitas, H-Index, dan afiliasi.
  - **Field:** Nama Lengkap, Institusi, Bidang Keparikan, Google Scholar ID, Scopus ID/LinkedIn (Opsional).
  - **Logika Kurasi:** Admin memvalidasi kecocokan data formulir dengan metadata Google Scholar yang ter-link.

## 3. Role-Based Access Control (RBAC) & Security
### 3.1 Matriks Hak Akses
| Fitur / Resource | Guest (Public) | Member (User) | Superadmin |
| :--- | :--- | :--- | :--- |
| **Landing Page & Blog** | View Only | View Only | Full Manage (CRUD) |
| **Project Gallery** | Restricted (Blur) | View Full Details | Full Manage (CRUD/Curation) |
| **LMS Content** | No Access | View & Progress | Full Manage (CRUD) |
| **Project Submission** | No Access | Create & Edit (Own) | Manage All (Approve/Reject) |
| **User & Batch Mgmt** | No Access | No Access | Full Manage (CRUD/Verify) |
| **CMS (Blog/Event)** | No Access | No Access | Full Manage (Schedule/Publish) |

### 3.2 Security Logic
- **Authentication:** Setiap request melalui middleware *Better Auth* dengan sesi yang aman dan proteksi CSRF.
- **Ownership Validation:** Pengecekan kepemilikan data pada setiap aksi Update/Delete oleh Member. Member hanya bisa memanipulasi data yang dimilikinya.
- **Data Scrambling:** Data sensitif pada API publik (untuk Guest) melalui *Data Scrambling Layer* agar konten yang dikunci tidak bisa diambil via inspect element mudah.
- **Rate Limiting:** Proteksi brute-force pada endpoint login dan pendaftaran.

## 4. Core Features
- **Dynamic CMS:** Pengelolaan konten Blog/Event via Dashboard Admin dengan update instan dan scheduled publish.
- **Siklus Proyek:** Workflow Approval dari Member ke Admin. Status transisi: *Draft -> Pending Review -> Published -> Archived*.
- **Linked Data Search:** Pencarian kepakaran lintas member berbasis database JSONB untuk kebutuhan kolaborasi.
- **Curiosity Gap Engine:** Filter CSS Blur dan truncation teks otomatis untuk Guest. Hanya Member yang bisa melihat detail penuh.
- **LMS "Siap Tembus Scopus!":** Sistem pembelajaran *Drip-feed* dengan roadmap visual interaktif untuk meningkatkan literasi publikasi.
- **Template Vault:** PDF Generator dengan watermark dinamis berdasarkan ID Member untuk keamanan dokumen riset dan proposal.
- **Google Scholar Metadata Sync:** Integrasi otomatis untuk menarik data profil (H-Index, Citations, Affiliation) berdasarkan ID yang diinput saat pendaftaran, digunakan sebagai dasar kurasi admin.

## 5. User Journey Map
1. **Fase Guest:** 
   - Eksplorasi Landing Page -> Tertarik KPI dan Visi -> Melihat Research Projects (Tertarik namun Terhalang *Curiosity Gap*) -> Membaca Blog/Event -> Memutuskan untuk **Register Batch**.
2. **Fase Admin:** 
   - Menerima notifikasi pendaftaran -> Akses Dashboard Superadmin -> Verifikasi Google Scholar ID via Metadata Auto-Check -> Approve/Reject -> Notifikasi dikirim ke User.
3. **Fase Member:** 
   - Akun Aktif -> Akses Dashboard & LMS -> Submit Proyek Riset -> Invite Kolaborator -> Riset Published -> Berkolaborasi.

## 6. Technical Database Schema (High-Level)
Struktur tabel utama yang mendukung fitur PRD:

- **`users`**: 
  - `id` (UUID, PK), `email`, `password_hash`, `role` (enum: member, superadmin), `full_name`, `affiliation`, `expertise` (JSONB), `google_scholar_id` (Unique), `scopus_id`, `status` (active, inactive), `batch_id`.
- **`research_projects`**: 
  - `id` (UUID, PK), `creator_id` (FK), `title`, `abstract`, `methodology`, `required_expertise` (JSONB), `status` (draft, pending, published), `visibility` (public, private), `collaborators` (JSONB), `created_at`, `updated_at`.
- **`lms_modules`**: 
  - `id`, `title`, `content_md`, `sort_order`, `is_unlocked`.
- **`lms_progress`**: 
  - `user_id` (FK), `module_id` (FK), `completed` (boolean), `last_accessed_at`, `score`.
- **`applications`**: 
  - `id`, `applicant_data` (JSON: nama, institusi, bidang, scholar_id, doc_upload), `status` (pending, verified, rejected), `admin_notes`, `created_at`.
- **`content_blogs`**: 
  - `id`, `slug`, `title`, `content_md`, `cover_image`, `category`, `is_published`, `publish_date`, `seo_data` (JSON).
- **`content_events`**: 
  - `id`, `slug`, `title`, `date`, `location`, `description`, `status` (upcoming, live, ended), `is_paid`, `capacity`, `registrants` (JSONB).

## 7. Tech Stack
- **Framework:** Next.js 14+ (App Router) untuk performa SSR/CSR hybrid.
- **Styling:** Tailwind CSS + shadcn/ui untuk komponen basis yang konsisten.
- **Database:** PostgreSQL untuk data relasional kritis + JSONB untuk fleksibilitas metadata.
- **ORM:** Drizzle ORM untuk type-safety dan performa query optimal.
- **Auth:** Better Auth untuk manajemen sesi, role, dan keamanan bawaan.
- **Animations:** Framer Motion untuk scroll-triggered animations dan mikro-interaksi.
- **Integrasi:** 
  - *Google Scholar Sync:* Menggunakan modul *scraper* terkontrol atau API pihak ketiga terpercaya untuk pengambilan metadata valid berdasarkan ID.
  - *Storage:* Upload gambar/proposal ke object storage (S3 compatible) dengan tanda tangan URL.

## 8. Dashboard Structure
### 8.1 Dashboard Superadmin
Desain dashboard dengan sidebar navigasi yang bersih (Glass-morphism effect), fokus pada kontrol total:
- **User & Batch Curation:**
  - **Verifikasi One-Click:** Input Google Scholar ID pendaftar -> Sistem otomatis fetch metadata (H-Index, Affiliation, Citation) -> Admin melihat ringkasan verifikasi -> Tombol "Verify & Approve" mengaktifkan akun dan mengunci data validasi.
  - **Batch Management:** Panel kontrol untuk membuka/menutup pendaftaran batch, mengatur kuota, dan melihat deadline. Status batch ditampilkan real-time di footer situs publik.
- **Project Governance:**
  - Antrian persetujuan proyek dari Member. Fitur filter berdasarkan bidang kepakaran dan status.
  - Tombol "Edit Metadata" jika perlu penyesuaian indeksasi.
- **Content Management System (CMS):**
  - CRUD penuh untuk Blog dan Event.
  - Editor Markdown terintegrasi untuk penulisan artikel.
  - Jadwal publikasi otomatis (*Scheduled Publish*).
  - Pengaturan navigasi publik (mengaktifkan/menonaktifkan menu tertentu).
- **Analytics Overview:**
  - Statistik ringkas: Jumlah member baru, batch rate, proyek sedang berjalan, traffic blog.

### 8.2 Dashboard Member (Research Workspace)
Workspace pribadi untuk produktivitas riset:
- **Research Workspace:**
  - **Submit Proyek:** Formulir canggih untuk mengajukan riset baru (Judul, Abstrak, Metodologi, Target Jurnal, Bidang yang Dibutuhkan). Status pelacakan real-time (Review -> Published).
  - **Manajemen Kolaborator:** Fitur invite kolaborator lain di platform via email atau link referral. Chat internal untuk diskusi proyek yang sudah dipublikasikan.
  - **Tracker Riset:** Visualisasi progres riset dalam bentuk checklist atau timeline sederhana agar member tetap on-track.
- **LMS Learning Center:**
  - Akses modul pembelajaran "Siap Tembus Scopus".
  - Progress bar visual dengan aksen Scopus Orange. *Glowing line* menghubungkan modul yang sudah dan belum selesai.
- **Template Vault:**
  - Download template dokumen riset. ID Member tertiah watermark otomatis pada PDF yang diunduh untuk keamanan data.
- **Profile Management:**
  - Update data kepakaran dan afiliasi. Data Google Scholar bersifat read-only setelah verifikasi admin agar kredibilitas terjaga.

## 9. Product Roadmap
| Fase | Fokus | Fitur Utama |
| :--- | :--- | :--- |
| **Fase 1: MVP** | Fondasi & Kurasi | Landing Page, Blog/Event Publik, Sistem Pendaftaran Batch, Google Scholar Verification, Dashboard Superadmin Dasar, RBAC Dasar. |
| **Fase 2: Engagement** | Kolaborasi & Galeri | Research Gallery Publik, Curiosity Gap, Linked Data Search, Member Dashboard (Submit Project), CMS Blog/Event Lengkap. |
| **Fase 3: Scaling** | Pendidikan & Alat | LMS "Siap Tembus Scopus", Template Vault, In-App Inquiry System, Analytics Dashboard Admin, Integrasi Notifikasi Real-time. |
| **Fase 4: Expansion** | Ekosistem Global | Multi-bahasa Full, API Publikasi Eksternal, Premium Batch Features, Mobile Companion App (PWA). |

## 10. Visual & Interactive Style Guide (The "CoPublika Modernity")
Panduan ini mengatur estetika platform agar kredibel, modern, interaktif, dan intuitif, menghindari kesan monoton akademik klasik.

### 10.1 Palette: "Professional Monochrome with Scopus Energy"
Dirancang untuk memberikan kesan otoritas akademis tinggi namun dinamis.
- **Primary Black:** `#0F172A` (Deep Slate Black) - Teks utama, header, dan elemen gelap pada Dark Mode.
- **Clean Gray:** `#F8FAFC` (Background Light) & `#E2E8F0` (Border lembut). Pada Dark Mode: `#020617` sebagai background utama, `#1E293B` sebagai surface kartu.
- **Scopus Orange:** `#E9711C` - **High-contrast accent**.
  - Digunakan strategis pada: Tombol "Register", CTA utama, status aktif, progress bar, border highlight hover, dan badge event.
  - Tidak digunakan sebagai background blok besar untuk mencegah kelelahan visual.

### 10.2 Typography: "Modern Authority"
Menolak kesan klasik/kuno. Menggunakan sans-serif geometris yang kuat dan tegas.
- **Font Family:** `Plus Jakarta Sans` atau `Montserrat`.
- **Headings:** Bold / Extra Bold (Weight 700-800). *Capitalized Case* pada heading utama untuk kesan "Enterprise Ready". Tracking sedikit rapat (*tight*) untuk kesan kompak dan modern.
- **Body:** Regular (Weight 400) dengan line-height lega (1.6) untuk kenyamanan membaca panjang.

### 10.3 Interaction & Intuitiveness
Sistem harus terasa "hidup", responsif, dan tidak kaku.
- **Bento-Box Layout Dinamis:**
  - Komponen KPI, Research Gallery, dan Expert Preview disusun dalam grid asimetris yang seimbang.
  - Variasi ukuran kartu: Ada span-2 kolom untuk data penting (KPI besar) dan span-1 untuk detail pendukung. Sudut membulat (*rounded-lg*).
  - Mencegah kesan monoton dengan pola grid yang tidak selalu seragam.
- **Glow Interaction:**
  - Elemen dengan warna Scopus Orange menerapkan lapisan shadow dinamis.
  - State default: `box-shadow: 0 0 10px 0 rgba(233, 113, 28, 0.2);`
  - State hover/active: Bertransisi halus ke `box-shadow: 0 0 20px 5px rgba(233, 113, 28, 0.6);`. Memberikan efek "bercahaya" energi riset.
- **Micro-interactions:**
  - **Hover-Lift:** Kartu riset akan naik 4px (`translate-y: -4px`) dan mendapatkan *drop-shadow orange* halus saat disentuh kursor.
  - **Magnetic Buttons:** Tombol CTA Register mengikuti arah kursor dalam radius 10px, menciptakan hubungan fisik emosional antara user dan tombol aksi.
  - **Skeleton Loading Shimmer:** Alih-alih spinner putaran, gunakan animasi *shimmering* gradient pada placeholder kartu saat memuat data.
- **Visual Glass-morphism:**
  - Digunakan pada overlay "Curiosity Gap" dan sidebar dashboard.
  - Efek `backdrop-blur` (12px) dengan background semi-transparan untuk kesan modern, ringan, dan futuristik.
- **Scroll-Triggered Animations:**
  - Komponen masuk ke viewport dengan efek `fade-in-up` Framer Motion.
  - Counter angka pada KPI Section bergerak animasi increment saat di-scroll.

### 10.4 Logic Detail: Curiosity Gap Engineering
Implementasi teknis *Curiosity Gap* untuk menjaga privasi member dan mendorong registrasi:
- **Threshold Teks:** Teks preview dibatasi maksimal **150 karakter** atau **20% dari total konten** (menggunakan logic `Math.min(150, content.length * 0.20)`), mana yang lebih kecil dulu diterapkan.
- **Visual Overlay:** Sisa konten ditutup dengan overlay CSS yang memiliki `backdrop-filter: blur(12px)` dan background warna surface transparan.
- **UX:** Guest melihat judul lengkap, abstrak terpotong, dan overlay blur. Ikon gembok dan tombol "Unlock Research" (mengarah ke Register) muncul di tengah overlay.
- **Member:** Overlay tidak muncul. Konten ditampilkan penuh dengan animasi *reveal* saat halaman dimuat.

### 10.5 Finishing Touch: Layout & Responsiveness
- **Spacing:** Penggunaan spasi generosa (whitespace) untuk memberikan kesan premium dan tidak sesak.
- **Dark/Light Consistency:** Transisi tema menggunakan variabel CSS yang terkelola. Semua komponen (termasuk glass-morphism) menyesuaikan opasitas dan border secara otomatis agar tetap kontras dan nyaman di mata pada kedua mode.
- **Mobile First:** Navigasi header berubah menjadi *Hamburger Menu* dengan panel slide-in full-screen. Bento-grid berubah menjadi single-column stack yang rapi. Touch targets dioptimalkan untuk jari.