# Design Spec: Superadmin Profile Edit Mode & Email Update

**Date:** 2026-06-14  
**Author:** Gemini  
**Status:** Under Review  
**Topic:** Implementation of Edit/Lock Mode, email update to copublika@gmail.com, and button styling overhaul on Profile Page.

---

## 1. Overview
Rancangan ini menambahkan sistem penguncian input ("Edit Mode") pada halaman Profil Superadmin agar data tidak diubah secara tidak sengaja. Halaman profil secara default akan berada dalam status *Read-Only*. Pengguna harus mengeklik tombol "Edit" terlebih dahulu untuk membuka kunci input dan memunculkan tombol "Simpan" & "Batal". 

Selain itu, email Superadmin akan diubah dari `adi.wijaya@copublika.id` menjadi `copublika@gmail.com` pada halaman Profil dan Dropdown Akun di Header Topbar. Gaya tombol juga dirombak agar lebih minimalis, berkelas, dan profesional (mengikuti gaya shadcn/ui).

---

## 2. Detail Rancangan

### 2.1 Sinkronisasi Email Superadmin
- **File Modifikasi:**
  1. `apps/frontend/src/components/admin/AdminTopbar.tsx`: Mengubah label email dropdown akun menjadi `copublika@gmail.com`.
  2. `apps/frontend/src/app/admin/(shell)/profile/page.tsx`: Mengubah state default email dan profil menjadi `copublika@gmail.com`.

### 2.2 Alur Logika Edit Mode
- **State Tambahan (`profile/page.tsx`):**
  - `isEditingPersonal` (boolean, default: `false`)
  - `isEditingSecurity` (boolean, default: `false`)
  - `tempProfileForm` (object) - Menyimpan salinan sementara form untuk kebutuhan reset saat tombol "Batal" diklik.

- **Tab "Informasi Pribadi":**
  - Jika `isEditingPersonal === false`:
    - Seluruh input field (`Nama Lengkap`, `Email Utama`, `Afiliasi`, `Kategori Kepakaran`) berada dalam status `disabled` atau `readOnly`.
    - Latar belakang input diatur sedikit memudar (`background: '#f8fafc'`) dengan kursor `not-allowed`.
    - Tombol yang aktif: **"Edit Profil"** (Tombol outline minimalis dengan ikon edit/pensil).
  - Jika `isEditingPersonal === true`:
    - Input field aktif (latar belakang putih).
    - Tombol yang aktif: **"Simpan Perubahan"** (Solid dark `#0F172A` dengan ikon ceklis) dan **"Batal"** (Ghost outline button).

- **Tab "Keamanan Akun":**
  - Jika `isEditingSecurity === false`:
    - Seluruh input password dinonaktifkan.
    - Tombol yang aktif: **"Ubah Password"** (Tombol outline minimalis dengan ikon gembok).
  - Jika `isEditingSecurity === true`:
    - Input password aktif.
    - Tombol yang aktif: **"Perbarui Password"** (Solid dark `#0F172A` dengan ikon ceklis) dan **"Batal"** (Ghost outline button).

### 2.3 Perombakan Desain Tombol (Aesthetics Overhaul)
- Menggantikan bayangan glow oranye dengan gaya minimalis kontras tinggi.
- **Tombol Solid Utama (`.cp-btn-primary`):** Latar belakang `#0f172a` (charcoal/dark slate), teks putih tebal, hover transisi redup (`opacity: 0.9`).
- **Tombol Outline / Ghost Sekunder:** Latar belakang transparan, border tipis abu-abu `rgba(15,23,42,0.15)`, hover latar belakang abu-abu terang `#f1f5f9` dengan transisi halus.

---

## 3. Rencana Verifikasi
1. **Pencegahan Edit Tanpa Izin:** Memastikan input benar-benar tidak bisa diketik sebelum tombol "Edit" ditekan.
2. **Kembalikan Data (Reset On Cancel):** Menguji tombol "Batal" untuk memastikan data input kembali ke nilai sebelum diubah.
3. **Penyelarasan Email:** Memastikan email di Topbar dan Profil sama-sama berubah menjadi `copublika@gmail.com`.
4. **Validasi Build:** Menjalankan `npm run build` untuk memvalidasi tidak ada kegagalan tipe data atau linting.
