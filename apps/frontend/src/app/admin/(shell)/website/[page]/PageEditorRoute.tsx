'use client';

import Link from 'next/link';
import { PAGES } from '@/lib/cms/config/pages';
import { SectionEditor } from '@/components/admin/cms/SectionEditor';
import { ComingSoon } from '@/components/admin/cms/ComingSoon';

/** Page configs hold functions, so they are resolved on the client by key. */
export default function PageEditorRoute({ pageKey }: { pageKey: string }) {
  const page = PAGES[pageKey];
  if (!page) return <ComingSoon title="Editor halaman" description="Editor untuk halaman ini sedang disiapkan." />;
  const switcher = page.family && (
    <nav className="cms-family" aria-label="Sub-halaman">
      {page.family.map((f) => (
        <Link key={f.key} href={f.href} className={f.key === pageKey ? 'is-active' : ''} aria-current={f.key === pageKey ? 'page' : undefined}>
          <strong>{f.label}</strong>
          {f.hint && <small>{f.hint}</small>}
        </Link>
      ))}
    </nav>
  );
  return <SectionEditor key={pageKey} page={page} crumb={['Halaman Website', page.title]} switcher={switcher} />;
}
