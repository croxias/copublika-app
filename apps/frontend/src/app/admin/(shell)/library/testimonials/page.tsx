'use client';

import { CollectionManager } from '@/components/admin/cms/CollectionManager';
import { testimonialsConfig } from '@/lib/cms/config/testimonials';

export default function TestimonialsPage() {
  return (
    <CollectionManager
      config={testimonialsConfig}
      crumb={['Pustaka Bersama', 'Testimoni']}
      title="Testimoni"
      description="Cerita anggota dan alumni. Pilih yang tampil lewat editor halamannya (mis. Beranda → Testimoni)."
    />
  );
}
