'use client';

import { CollectionManager } from '@/components/admin/cms/CollectionManager';
import { peopleConfig } from '@/lib/cms/config/people';

export default function PeoplePage() {
  return (
    <CollectionManager
      config={peopleConfig}
      crumb={['Pustaka Bersama', 'Tim & Mentor']}
      title="Tim &"
      accent="Mentor"
      description="Profil tim inti dan mentor. Diisi sekali, lalu dipilih dari About, Beranda, dan Siap Tembus Scopus."
    />
  );
}
