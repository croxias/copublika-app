import { requireAdmin } from '@/lib/supabase/require-admin';
import AdminShellClient from './AdminShellClient';

export default async function AdminShellLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <AdminShellClient>{children}</AdminShellClient>;
}
