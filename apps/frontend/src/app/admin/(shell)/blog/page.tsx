'use client';

import { CollectionManager } from '@/components/admin/cms/CollectionManager';
import { blogConfig } from '@/lib/cms/config/blog';

export default function BlogPage() {
  return (
    <CollectionManager
      config={blogConfig}
      crumb={['Konten', 'Artikel Blog']}
      title="Artikel"
      accent="Blog"
      publicHref="/blog"
      description="Tulis, jadwalkan, dan terbitkan artikel. Artikel utama (★) tampil paling depan di Blog dan Beranda."
    />
  );
}
