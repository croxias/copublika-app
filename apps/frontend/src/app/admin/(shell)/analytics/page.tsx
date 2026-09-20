import ProductionAnalyticsPage from './ProductionAnalyticsClient';
import { StagingAnalytics } from '@/components/admin/AnalyticsVisuals';

export default function AnalyticsPage() {
  const demoEnabled = process.env.NEXT_PUBLIC_COPUBLIKA_DEMO_MODE === 'true';
  return demoEnabled ? <StagingAnalytics /> : <ProductionAnalyticsPage />;
}
