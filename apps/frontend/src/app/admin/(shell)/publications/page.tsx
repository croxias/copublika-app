'use client';

import { CollectionManager } from '@/components/admin/cms/CollectionManager';
import { publicationsConfig } from '@/lib/cms/config/publications';

export default function PublicationsPage() {
  return (
    <CollectionManager
      config={publicationsConfig}
      crumb={['Riset', 'Publikasi Anggota']}
      title="Publikasi"
      accent="Anggota"
      description="Paper anggota yang sudah terbit. Yang berstatus Tampil muncul di daftar publikasi /research."
      publicHref="/research"
      intro={
        <p className="cms-hint">
          <span aria-hidden="true" className="cms-star">★</span>
          <span>
            Marquee <strong>“Riset terkini”</strong> di Beranda mengambil publikasi bertanda ★ secara otomatis, sesuai urutan di tabel ini.
            Cukup edit di sini dan Beranda ikut berubah, tanpa input ulang.
          </span>
        </p>
      }
    />
  );
}
