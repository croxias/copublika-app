'use client';

import { CollectionManager } from '@/components/admin/cms/CollectionManager';
import { eventsConfig } from '@/lib/cms/config/events';

export default function EventsPage() {
  return (
    <CollectionManager
      config={eventsConfig}
      crumb={['Konten', 'Agenda Event']}
      title="Agenda"
      accent="Event"
      publicHref="/event"
      description="Webinar, klinik, dan workshop. Fase berganti otomatis dari tanggal; event mendatang juga muncul di agenda Beranda."
    />
  );
}
