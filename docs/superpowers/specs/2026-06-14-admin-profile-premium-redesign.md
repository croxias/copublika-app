# Design Spec: Superadmin Profile Premium Redesign

**Date:** 2026-06-14  
**Author:** Gemini  
**Status:** Under Review  
**Topic:** Visual and Interactive Enhancements for Superadmin Profile Page  

---

## 1. Overview
Rancangan ini bertujuan untuk meningkatkan nilai estetika (*design taste*) pada halaman Profil Superadmin (`/admin/profile`). Halaman ini akan dirombak dengan menambahkan efek visual kelas atas seperti tekstur latar belakang mesh grid, dekorasi avatar bercahaya (glow), transisi hover dinamis, tab bergaya sliding-pill, serta ikon minimalis di setiap input field dan daftar statistik.

---

## 2. Detail Komponen & Interaktivitas Premium

### 2.1 Kartu Kiri (Profil Ringkas)
- **Background Texture:** Penambahan pola titik-titik (mesh grid) menggunakan CSS radial-gradient pada area header kartu profil.
- **Avatar Glow Ring:**
  - Avatar lingkaran dibungkus dalam ring border bermotif gradasi (`linear-gradient(to right, var(--accent), var(--foreground))`).
  - Efek Hover: Transisi bayangan glow oranye (`box-shadow: 0 0 25px rgba(233, 113, 28, 0.25)`) dan pembesaran skala tipis (`transform: scale(1.05)`).
- **Statistik dengan Ikon Kontainer:**
  - Setiap statistik dibungkus dalam flex row dengan ikon kontainer bulat berwarna oranye transparan (`background: rgba(233, 113, 28, 0.06)`).
  - Teks metrik dibuat lebih tegas dengan kontras warna tinggi.

### 2.2 Kartu Kanan (Detail Informasi & Form)
- **Sliding-Pill Tab Switcher:**
  - Tombol tab disatukan ke dalam wadah pill abu-abu transparan (`background: rgba(15, 23, 42, 0.03)`).
  - Tab aktif memiliki latar belakang solid gelap (`#0F172A`) dengan teks putih dan sudut membulat.
- **Icon-Enhanced Input Fields:**
  - Setiap form group memiliki input wrapper dengan ikon pemandu di posisi kiri input.
  - Ikon akan disisipkan secara inline SVG (User, Mail, Kampus, Kategori Kepakaran, Password, Lock).
  - Efek Fokus: Ikon berubah warna menjadi Scopus Orange (`var(--accent)`), border input menggelap, dan bayangan oranye transparan memancar di luar input (`box-shadow: 0 0 0 3px rgba(233, 113, 28, 0.12)`).
- **Interactive Button:**
  - Tombol submit mendapat efek transisi hover-lift (`transform: translateY(-2px)`) dan shadow glow.

---

## 3. Rencana Verifikasi
1. **Verifikasi Visual:** Memastikan semua ikon SVG ter-render secara proporsional dan tidak merusak layout forms.
2. **Uji Interaksi (Hover & Focus):** Menguji kehalusan transisi efek glow, focus ring pada input, dan perpindahan tab.
3. **TypeScript & Build:** Menjalankan `npm run build` untuk memvalidasi tidak ada kegagalan kompilasi.
