'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { StagingProvider } from '@/lib/staging';
import { CmsProvider } from '@/lib/cms/store';

export default function AdminShellClient({ children, demoEnabled = false }: { children: React.ReactNode; demoEnabled?: boolean }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // An explicit choice wins; without one, mid-size screens (981-1279px) start with the icon rail
  // so the content keeps enough width.
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = window.localStorage.getItem('copublika-sidebar-collapsed');
    return saved === null ? window.innerWidth > 980 && window.innerWidth < 1280 : saved === 'true';
  });

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  const handleMenuToggle = useCallback(() => setSidebarOpen((prev) => !prev), []);
  const handleOverlayClick = useCallback(() => setSidebarOpen(false), []);
  const handleSidebarCollapse = useCallback(() => {
    setSidebarCollapsed((value) => {
      window.localStorage.setItem('copublika-sidebar-collapsed', String(!value));
      return !value;
    });
  }, []);

  return (
    <StagingProvider enabled={demoEnabled}>
    <CmsProvider>
<div className="cp-admin-body" data-sidebar-collapsed={sidebarCollapsed ? 'true' : 'false'}>
       <div className="cp-admin">
        <AdminSidebar pathname={pathname ?? ''} isOpen={sidebarOpen} demoEnabled={demoEnabled} collapsed={sidebarCollapsed} onCollapse={handleSidebarCollapse} />
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
    </CmsProvider>
    </StagingProvider>
  );
}
