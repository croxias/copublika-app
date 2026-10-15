'use client';

import { CollectionManager } from '@/components/admin/cms/CollectionManager';
import { faqsConfig } from '@/lib/cms/config/faqs';

export default function FaqsPage() {
  return (
    <CollectionManager
      config={faqsConfig}
      crumb={['Pustaka Bersama', 'FAQ']}
      title="FAQ"
      description="Pertanyaan yang bisa dipakai di beberapa halaman. Pilih yang tampil lewat editor halamannya (mis. Beranda → FAQ)."
    />
  );
}
