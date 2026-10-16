'use client';

import { useState } from 'react';
import { FileText, Inbox } from 'lucide-react';
import { CollectionManager } from '@/components/admin/cms/CollectionManager';
import { BlogOverview } from '@/components/admin/cms/BlogOverview';
import { BlogPreview } from '@/components/admin/cms/BlogPreview';
import { SubmissionsPanel, submissionsOf } from '@/components/admin/cms/BlogReview';
import { blogConfig } from '@/lib/cms/config/blog';
import { inAdminTable, inQueue } from '@/lib/cms/review';
import { useCms } from '@/lib/cms/store';

export default function BlogPage() {
  const cms = useCms();
  const all = cms.collections.blog ?? [];
  const waiting = all.filter(inQueue).length;
  // Open on the queue when something is waiting, so editors see it first.
  const [tab, setTab] = useState<'articles' | 'submissions'>(() => (waiting ? 'submissions' : 'articles'));

  const tabs = (
    <div className="btabs" role="tablist" aria-label="Tampilan">
      <button type="button" role="tab" aria-selected={tab === 'articles'} onClick={() => setTab('articles')}>
        <FileText size={16} aria-hidden="true" /> Artikel <b>{all.filter(inAdminTable).length}</b>
      </button>
      <button type="button" role="tab" aria-selected={tab === 'submissions'} onClick={() => setTab('submissions')}>
        <Inbox size={16} aria-hidden="true" /> Pengajuan penulis <b className={waiting ? 'is-hot' : ''}>{waiting ? `${waiting} menunggu` : submissionsOf(all).length}</b>
      </button>
    </div>
  );

  return (
    <CollectionManager
      config={blogConfig}
      crumb={['Konten', 'Artikel Blog']}
      title="Artikel"
      accent="Blog"
      publicHref="/blog"
      description="Tinjau naskah dari penulis, lalu tulis, jadwalkan, dan terbitkan artikel. Tandai hingga 6 artikel sebagai Pilihan editor."
      intro={<><BlogOverview />{tabs}</>}
      replaceTable={tab === 'submissions' ? <SubmissionsPanel /> : undefined}
      preview={(values, ctx) => <BlogPreview values={values} ctx={ctx} />}
    />
  );
}
