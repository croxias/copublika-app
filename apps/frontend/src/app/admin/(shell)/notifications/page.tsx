import ProductionNotificationsPage from './ProductionNotificationsClient';
import { StagingNotifications } from '@/components/admin/StagingCrudPage';

export default function NotificationsPage() {
  const demoEnabled = process.env.NEXT_PUBLIC_COPUBLIKA_DEMO_MODE === 'true';
  return demoEnabled ? <StagingNotifications /> : <ProductionNotificationsPage />;
}
