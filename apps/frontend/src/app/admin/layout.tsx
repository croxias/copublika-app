import { Metadata } from 'next';
import AdminBodyClassManager from './AdminBodyClassManager';
import { fraunces } from '@/lib/fonts';
import './admin.css';
import './website-content.css';
import './staging.css';
import './ui-foundation.css';
import './sidebar.css';
import './batch-management.css';
import './sidebar-interactions.css';
import './cms.css';

export const metadata: Metadata = {
  title: {
    template: '%s — CoPublika Admin',
    default: 'CoPublika Admin',
  },
};

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={fraunces.variable} style={{ display: 'contents' }}>
      <AdminBodyClassManager />
      {children}
    </div>
  );
}
