import { redirect } from 'next/navigation';

// Old menu, merged into the new CMS structure (docs/superpowers/specs/2026-10-14-admin-cms-public-pages-design.md).
export default function Moved() {
  redirect('/admin/publications');
}
