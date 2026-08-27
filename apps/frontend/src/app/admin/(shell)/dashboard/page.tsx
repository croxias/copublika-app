import { getAdminDashboardData } from '@/lib/data/admin-dashboard';
import AdminDashboardClient from './DashboardClient';

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData();
  return <AdminDashboardClient data={data} />;
}
