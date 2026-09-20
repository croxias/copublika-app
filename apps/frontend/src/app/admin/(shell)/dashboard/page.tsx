import { getAdminDashboardData } from '@/lib/data/admin-dashboard';
import AdminDashboardClient from './DashboardClient';
import { StagingDashboard } from '@/components/admin/AnalyticsVisuals';

export default async function AdminDashboardPage() {
  const demoEnabled = process.env.NEXT_PUBLIC_COPUBLIKA_DEMO_MODE === 'true';

  if (demoEnabled) {
    return <StagingDashboard />;
  }

  const data = await getAdminDashboardData();
  return <AdminDashboardClient data={data} />;
}

export type { AdminDashboardData } from '@/lib/data/admin-dashboard';
