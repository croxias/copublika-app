import { Metadata } from 'next';
import AdminBodyClassManager from './AdminBodyClassManager';
import './admin.css';

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
    <>
      <AdminBodyClassManager />
      {children}
    </>
  );
}
