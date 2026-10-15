'use client';

import Link from 'next/link';
import { PAGES } from '@/lib/cms/config/pages';
import { SectionEditor } from '@/components/admin/cms/SectionEditor';
import { ComingSoon } from '@/components/admin/cms/ComingSoon';
import { ProgramOverview } from '@/components/admin/cms/ProgramOverview';

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
  const overview = pageKey === 'siap-tembus-scopus' ? <ProgramOverview kind="sts" /> : pageKey === 'bootcamp-menulis' ? <ProgramOverview kind="btm" /> : null;
  const crumb = overview ? ['Konfigurasi Website Publik', 'Program', page.title] : ['Konfigurasi Website Publik', page.title];
  return <SectionEditor key={pageKey} page={page} crumb={crumb} switcher={overview ?? switcher} />;
}
