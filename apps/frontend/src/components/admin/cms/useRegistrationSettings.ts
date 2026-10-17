'use client';

import { useMemo } from 'react';
import { useCms } from '@/lib/cms/store';
import { settingsFrom } from '@/lib/cms/registration-settings';

/** Pengaturan pendaftaran for admin pages (from the CMS store, so edits show at once). */
export function useRegistrationSettings() {
  const { sections } = useCms();
  return useMemo(() => settingsFrom(sections), [sections]);
}
