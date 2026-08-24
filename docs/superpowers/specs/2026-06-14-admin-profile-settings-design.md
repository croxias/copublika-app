# Design Spec: Admin Profile & Settings Pages

**Date:** 2026-06-14  
**Author:** Gemini  
**Status:** Under Review  
**Topic:** Superadmin Profile and System Settings Pages  

---

## 1. Overview
Halaman ini dirancang untuk memenuhi fungsionalitas submenu pada header akun (Dropdown Akun) di Dashboard Superadmin CoPublika:
1. **Profil (`/admin/profile`)**: Halaman untuk mengelola informasi pribadi Superadmin dan keamanan password.
2. **Pengaturan (`/admin/settings`)**: Halaman untuk mengelola konfigurasi batch pendaftaran, sistem kurasi Google Scholar ID, dan preferensi notifikasi sistem.

Desain halaman ini mempertahankan estetika *Clean Monochrome* profesional dengan aksen *Scopus Orange* (`#E9711C`), sudut membulat (`var(--radius-lg)`), dan layout bento-grid yang serasi dengan halaman dashboard utama tanpa mengubah atau merusak struktur topbar dan sidebar yang sudah ada.

---

## 2. Requirements & UI/UX Design

### 2.1 Halaman Profil (`/admin/profile`)
Halaman ini menggunakan grid dua kolom dengan pembagian area `cp-grid-2` (1.6fr : 1fr).

#### Kolom Kiri (Ringkasan Profil Superadmin - Sempit)
Berbentuk card `.cp-card` dengan konten:
- **Profile Avatar:** Bulatan avatar besar (misal `w-24 h-24` atau `w-20 h-20`) dengan inisial "AW" menggunakan gradasi gelap yang elegan (`linear-gradient(135deg, #0f172a, #334155)`) dengan teks putih tebal.
- **Nama & Role:** "Adi Wijaya" (Heading `.h3` atau `.h4`) dan badge "Superadmin" dengan latar oranye muda transparan dan border oranye tegas (`rgba(233, 113, 28, 0.1)`).
- **Email:** `adi.wijaya@copublika.id` dengan warna teks sekunder.
- **Statistik Aktivitas:** List berisi ikon penunjuk kecil dan nilai numerik:
  - Verifikasi Disetujui: **124 pendaftar**
  - Proyek Direview: **42 proyek**
  - Sesi Terakhir: **Hari ini, 16:15 WIB**
  - Status Akun: **Aktif (Superadmin)**

#### Kolom Kanan (Formulir Informasi - Lebar)
Berbentuk card `.cp-card` dengan navigasi tab internal:
1. **Tab "Informasi Pribadi":**
   - Field Input: *Nama Lengkap*, *Email Utama*, *Afiliasi* (default: "Universitas Indonesia"), dan *Bidang Kepakaran* (default: "Informatika / Artificial Intelligence").
   - Tombol: "Simpan Perubahan" (`.cp-btn-primary`).
2. **Tab "Keamanan Akun":**
   - Field Input: *Password Saat Ini*, *Password Baru*, *Konfirmasi Password Baru*.
   - Tombol: "Perbarui Password" (`.cp-btn-primary`).

---

### 2.2 Halaman Pengaturan (`/admin/settings`)
Halaman ini menggunakan grid dua kolom dengan pembagian area `.cp-grid-2` agar fungsionalitas admin terdistribusi secara rapi.

#### Kolom Kiri (Pengaturan Situs & Kurasi - Lebar)
1. **Card 1: Manajemen Batch Pendaftaran**
   - Menampilkan status batch saat ini: "Batch #4 · Open" (Badge hijau).
   - Form input:
     - **Status Batch:** Toggle switch (Buka / Tutup pendaftaran).
     - **Batas Kuota Batch:** Input number (default: 300).
     - **Tanggal Penutupan Batch:** Input date.
   - Tombol: "Simpan Konfigurasi Batch".
2. **Card 2: Integrasi & Kurasi Google Scholar (PRD 8.1)**
   - Form input:
     - **Verifikasi Satu-Klik:** Toggle switch untuk "One-Click Auto-verification". Jika aktif, sistem memicu auto-fetch metadata Scholar ID saat pendaftar masuk.
     - **Batas Minimum H-Index:** Input number untuk auto-approval pendaftar (default: 2). Jika H-Index pendaftar >= 2, sistem menandai sebagai direkomendasikan untuk disetujui otomatis.
   - Tombol: "Simpan Aturan Kurasi".

#### Kolom Kanan (Notifikasi & Sistem - Sempit)
1. **Card 3: Notifikasi Sistem**
   - Toggle switch untuk:
     - Email pendaftaran member baru masuk.
     - Email pengajuan proyek riset baru.
     - Notifikasi kegagalan verifikasi otomatis.
2. **Card 4: Audit & Status Sistem**
   - Menampilkan ringkasan status server dan database.
   - Tombol: "Download Log Audit Keamanan" (`.cp-btn-secondary` atau `.cp-btn-outline`).

---

## 3. Integrasi Navigasi & Sesi
1. **Tautan Dropdown Akun (`AdminTopbar.tsx`):**
   - Link Profil akan diarahkan ke `/admin/profile`.
   - Link Pengaturan akan diarahkan ke `/admin/settings`.
2. **Highlight Sidebar (`AdminSidebar.tsx`):**
   - Sidebar akan mendeteksi path saat ini. Jika berada di `/admin/profile` atau `/admin/settings`, sidebar tidak menyorot "Dashboard" sebagai halaman aktif, melainkan menyorot menu yang sesuai atau memadamkan highlight agar user tahu posisi halaman aktif.
   - Karena "Pengaturan Situs" berada di sidebar bagian *System*, halaman `/admin/settings` akan menyalakan highlight item `settings` di sidebar jika diakses.

---

## 4. Rencana Verifikasi
1. **Tampilan & Kompilasi:** Jalankan build dan pastikan tidak ada error kompilasi Next.js/React.
2. **Responsive Layout:** Uji fungsionalitas grid pada layar desktop maupun mobile (stacking vertikal).
3. **Interaktivitas:** Pastikan tab pada profil dan toggle switch pada pengaturan berfungsi secara interaktif (menggunakan state lokal React).
