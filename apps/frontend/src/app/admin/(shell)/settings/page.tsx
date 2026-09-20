import ProductionSettingsPage from './ProductionSettingsClient';
import { StagingSettings } from '@/components/admin/StagingCrudPage';

export default function SettingsPage() {
  const demoEnabled = process.env.NEXT_PUBLIC_COPUBLIKA_DEMO_MODE === 'true';
  return demoEnabled ? <StagingSettings /> : <ProductionSettingsPage />;
}
