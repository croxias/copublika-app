import { notFound, redirect } from 'next/navigation';
import PageEditorRoute from './PageEditorRoute';

const KEYS = ['home', 'about', 'about-team', 'about-mentors', 'research', 'blog', 'siap-tembus-scopus', 'bootcamp-menulis', 'curation', 'contact'];

export default async function WebsitePageEditor({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  // The old single program editor became two menus under "Program".
  if (page === 'program') redirect('/admin/website/siap-tembus-scopus');
  if (!KEYS.includes(page)) notFound();
  return <PageEditorRoute pageKey={page} />;
}
