'use client';

import { useEffect } from 'react';

export default function AdminBodyClassManager() {
  useEffect(() => {
    document.body.classList.add('cp-admin-mode');
    return () => {
      document.body.classList.remove('cp-admin-mode');
    };
  }, []);

  return null;
}
