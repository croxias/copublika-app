# Dashboard Admin Staging Implementation Plan

> **For agentic workers:** Implement task-by-task with verification checkpoints.

**Goal:** Meningkatkan dashboard staging/demo menjadi Pusat Operasional berbahasa Indonesia dengan visual system konsisten dan data lokal terinterkoneksi.

**Architecture:** Pertahankan `StagingProvider` sebagai sumber data lokal. Refactor hanya presentasi dashboard staging, menambahkan token typography/theme dan komponen visual kecil yang dapat dipakai ulang tanpa mengubah production route.

**Tech Stack:** Next.js 16, React 19, CSS existing tokens, lucide-react, shared localStorage staging store.

---

### Task 1: Audit and baseline staging
**Files:** `apps/frontend/src/components/admin/AnalyticsVisuals.tsx`, `apps/frontend/src/app/admin/staging.css`
- [ ] Jalankan staging dan catat baseline visual/responsive.
- [ ] Pastikan route demo memakai `StagingDashboard` dari `AnalyticsVisuals.tsx`.
- [ ] Pertahankan read-only notice dan seluruh link shared store.

### Task 2: Typography and visual tokens
**Files:** `apps/frontend/src/app/admin/layout.tsx`, `apps/frontend/src/app/admin/admin.css`, `apps/frontend/src/app/admin/staging.css`
- [ ] Integrasikan Geist melalui mekanisme font yang sudah dipakai project atau `next/font` yang kompatibel.
- [ ] Tambahkan token staging untuk foreground, surface, border, accent, radius, focus, typography scale, dan chart colors.
- [ ] Pastikan light/dark mode, reduced motion, dan responsive tetap berjalan.

### Task 3: Refactor command center hierarchy
**Files:** `apps/frontend/src/components/admin/AnalyticsVisuals.tsx`
- [ ] Ubah label utama menjadi Bahasa Indonesia.
- [ ] Susun urutan konten: KPI, antrian prioritas, kesehatan batch, tren pendaftar, pipeline proyek, risiko deadline, aktivitas.
- [ ] Gunakan ikon yang sudah tersedia secara selektif untuk status/konteks, tanpa dekorasi berlebihan.
- [ ] Pertahankan aria-label chart, tautan detail, dan data store yang ada.

### Task 4: Improve staging dashboard surfaces
**Files:** `apps/frontend/src/app/admin/staging.css`
- [ ] Buat hierarchy visual untuk KPI utama, queue, health rows, charts, timeline, empty/error state.
- [ ] Tambahkan hover/focus states, progress treatment, responsive one-column mobile layout, dan keyboard-visible focus.
- [ ] Hindari nested cards, gradient dekoratif, dan repeated visual patterns.

### Task 5: Language preference foundation
**Files:** `apps/frontend/src/lib/staging/**/*`, `apps/frontend/src/components/admin/*`, relevant admin settings page
- [ ] Tambahkan preference bahasa lokal dengan default `id` dan opsi `en`.
- [ ] Pisahkan label dashboard utama dari komponen agar dapat dilokalkan tanpa menggandakan halaman.
- [ ] Pastikan setting tersimpan dan dibaca ulang setelah refresh.

### Task 6: Verification
**Files:** no additional files
- [ ] Jalankan `npm run lint` dan `npm run typecheck` pada `apps/frontend`.
- [ ] Jalankan build bila dependency/config berubah.
- [ ] Uji route demo pada desktop/mobile, navigation, localStorage mutation, reset, language preference, reduced motion, dan empty states.
- [ ] Review anti-slop dan visual staging sebelum backend.
