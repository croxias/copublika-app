import { notFound } from 'next/navigation';
import PageEditorRoute from './PageEditorRoute';

const KEYS = ['home', 'about', 'about-team', 'about-mentors', 'research', 'program', 'curation', 'contact'];

export default async function WebsitePageEditor({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  if (!KEYS.includes(page)) notFound();
  return <PageEditorRoute pageKey={page} />;
}
