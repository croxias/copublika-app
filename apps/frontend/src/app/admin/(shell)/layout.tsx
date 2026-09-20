import { requireAdmin } from '@/lib/supabase/require-admin';
import AdminShellClient from './AdminShellClient';

export default async function AdminShellLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const demoEnabled = process.env.NEXT_PUBLIC_COPUBLIKA_DEMO_MODE === 'true';
  return <AdminShellClient demoEnabled={demoEnabled}>{children}</AdminShellClient>;
}
