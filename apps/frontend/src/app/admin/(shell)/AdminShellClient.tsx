'use client';

import React, { useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';

export default function AdminShellClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const activePage = pathname?.split('/admin/')[1]?.split('/')[0] || 'dashboard';
  const handleMenuToggle = useCallback(() => setSidebarOpen((prev) => !prev), []);
  const handleOverlayClick = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="cp-admin-body">
      <div className="cp-admin">
        <AdminSidebar activePage={activePage} isOpen={sidebarOpen} />
        {sidebarOpen && (
          <div className="cp-sidebar-overlay" role="button" tabIndex={0} aria-label="Close sidebar" onClick={handleOverlayClick} onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleOverlayClick();
            }
          }} />
        )}
        <div className="cp-main">
          <AdminTopbar onMenuToggle={handleMenuToggle} />
          <main className="cp-content">{children}</main>
        </div>
      </div>
    </div>
  );
}
