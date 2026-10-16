'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CollectionManager } from '@/components/admin/cms/CollectionManager';
import { replyTemplatesConfig } from '@/lib/cms/config/reply-templates';

export default function ReplyTemplatesPage() {
  return (
    <CollectionManager
      config={replyTemplatesConfig}
      crumb={['Konten', 'Kotak Pesan', 'Template balasan']}
      title="Template"
      accent="Balasan"
      description="Balasan siap pakai untuk Kotak Pesan. {nama}, {kode}, {topik}, dan {tim} terisi otomatis. Semua balasan dikirim atas nama Tim Admin CoPublika."
      headerActions={<Link href="/admin/messages" className="cms-btn cms-btn--ghost"><ArrowLeft size={15} /> Kotak Pesan</Link>}
    />
  );
}
