'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { useCms } from '@/lib/cms/store';
import { ConfirmDialog } from './ui';

/** Throws away every local CMS edit and goes back to the content the public site ships with. */
export function CmsResetCard() {
  const cms = useCms();
  const [open, setOpen] = useState(false);
  return (
    <div className="cms-danger-zone">
      <div>
        <h2>Reset data CMS</h2>
        <p>Hapus semua perubahan konten yang tersimpan di browser ini dan kembali ke isi bawaan website. Berguna saat mencoba alur staging dari awal.</p>
      </div>
      <button type="button" className="cms-btn cms-btn--ghost is-danger" onClick={() => setOpen(true)}>
        <RotateCcw size={14} /> Reset semua konten
      </button>
      <ConfirmDialog
        open={open}
        danger
        title="Reset semua konten?"
        confirmLabel="Reset"
        body={<p>Semua artikel, event, halaman, dan pengaturan yang kamu ubah di browser ini akan kembali ke isi awal. Tindakan ini tidak bisa dibatalkan.</p>}
        onConfirm={() => {
          cms.reset();
          setOpen(false);
          cms.toast('Konten dikembalikan ke isi awal.');
        }}
        onCancel={() => setOpen(false)}
      />
    </div>
  );
}
