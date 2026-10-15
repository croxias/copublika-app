'use client';

import { SectionEditor } from '@/components/admin/cms/SectionEditor';
import { CmsResetCard } from '@/components/admin/cms/CmsResetCard';
import { PAGES } from '@/lib/cms/config/pages';

export default function SettingsPage() {
  const page = PAGES.settings;
  return (
    page && (
      <SectionEditor page={page} crumb={['Sistem', 'Pengaturan Situs']}>
        <CmsResetCard />
      </SectionEditor>
    )
  );
}
