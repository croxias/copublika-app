'use client';

import { useState } from 'react';
import { CalendarDays, Users } from 'lucide-react';
import { CollectionManager } from '@/components/admin/cms/CollectionManager';
import { EventPreview, EventsOverview, RegistrationsPanel } from '@/components/admin/cms/EventsAdmin';
import { eventsConfig } from '@/lib/cms/config/events';
import { HOLDS_SEAT } from '@/lib/cms/registrations';
import { useCms } from '@/lib/cms/store';

export default function EventsPage() {
  const cms = useCms();
  const [tab, setTab] = useState<'events' | 'regs'>('events');
  const regs = cms.collections.registrations ?? [];
  const waiting = regs.filter((r) => r.status === 'waitlist').length;

  const tabs = (
    <div className="btabs" role="tablist" aria-label="Tampilan">
      <button type="button" role="tab" aria-selected={tab === 'events'} onClick={() => setTab('events')}>
        <CalendarDays size={16} aria-hidden="true" /> Event <b>{(cms.collections.events ?? []).length}</b>
      </button>
      <button type="button" role="tab" aria-selected={tab === 'regs'} onClick={() => setTab('regs')}>
        <Users size={16} aria-hidden="true" /> Pendaftar <b className={waiting ? 'is-hot' : ''}>{waiting ? `${waiting} menunggu` : regs.filter((r) => HOLDS_SEAT.includes(r.status as never)).length}</b>
      </button>
    </div>
  );

  return (
    <CollectionManager
      config={eventsConfig}
      crumb={['Konten', 'Agenda Event']}
      title="Agenda"
      accent="Event"
      publicHref="/event"
      description="Webinar, klinik, workshop, dan forum. Fase berganti otomatis dari tanggal; kursi terisi dihitung dari pendaftar."
      intro={<><EventsOverview />{tabs}</>}
      replaceTable={tab === 'regs' ? <RegistrationsPanel /> : undefined}
      preview={(values, ctx) => <EventPreview values={values} ctx={ctx} />}
    />
  );
}
