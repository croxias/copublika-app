'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { StagingProvider } from '@/lib/staging';

export default function AdminShellClient({ children, demoEnabled = false }: { children: React.ReactNode; demoEnabled?: boolean }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => typeof window !== 'undefined' && window.localStorage.getItem('copublika-sidebar-collapsed') === 'true');
  const activePage = pathname?.split('/admin/')[1]?.split('/')[0] || 'dashboard';

  useEffect(() => {
    window.localStorage.setItem('copublika-sidebar-collapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  const handleMenuToggle = useCallback(() => setSidebarOpen((prev) => !prev), []);
  const handleOverlayClick = useCallback(() => setSidebarOpen(false), []);
  const handleSidebarCollapse = useCallback(() => setSidebarCollapsed((value) => !value), []);

  return (
    <StagingProvider enabled={demoEnabled}>
<div className="cp-admin-body" data-sidebar-collapsed={sidebarCollapsed ? 'true' : 'false'}>
       <div className="cp-admin">
        <AdminSidebar activePage={activePage} isOpen={sidebarOpen} demoEnabled={demoEnabled} collapsed={sidebarCollapsed} onCollapse={handleSidebarCollapse} />
        {sidebarOpen && (
          <div className="cp-sidebar-overlay" role="button" tabIndex={0} aria-label="Close sidebar" onClick={handleOverlayClick} onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleOverlayClick();
            }
          }} />
        )}
        <div className="cp-main">
          <AdminTopbar onMenuToggle={handleMenuToggle} demoEnabled={demoEnabled} />

          <main className="cp-content">{children}</main>
        </div>
      </div>
    </div>
    </StagingProvider>
  );
}
