import type { CollectionConfig } from '../types';
import { PUBLISH_STATUSES } from './status';
import { CONTACT_COPY } from '@/lib/content/contact';
import { TEMPLATE_TOKENS } from '../messages';

const TOPIC_OPTIONS = [{ value: '', label: 'Semua topik' }, ...CONTACT_COPY.topics.map((t) => ({ value: t.label, label: t.label }))];

/** Reply templates for Kotak Pesan: picked in the message dialog, filled with the sender's details. */
export const replyTemplatesConfig: CollectionConfig = {
  key: 'replyTemplates',
  singular: 'template',
  statuses: PUBLISH_STATUSES,
  initialStatus: 'published',
  drawer: 'center',
  sortable: true,
  titleOf: (x) => String(x.title ?? ''),
  subtitleOf: (x) => String(x.subject ?? ''),
  columns: [
    { label: 'Topik', width: '150px', render: (x) => <span className="cms-pill">{x.topic ? String(x.topic) : 'Semua topik'}</span> },
    { label: 'Cuplikan', render: (x) => <span className="cms-muted tpl-snippet">{String(x.body ?? '').replace(/\s+/g, ' ').slice(0, 110)}…</span> },
  ],
  filter: { label: 'Topik', options: () => TOPIC_OPTIONS.filter((o) => o.value), match: (x, v) => x.topic === v },
  defaults: () => ({ title: '', topic: '', subject: 'Re: {topik} — CoPublika ({kode})', body: 'Halo {nama},\n\n\n\nSalam,\n{tim}' }),
  fields: [
    { type: 'heading', key: 'h-info', icon: 'file', label: 'Template', help: `Isian otomatis: ${TEMPLATE_TOKENS.join(', ')}. {tim} selalu "Tim Admin CoPublika".` },
    { key: 'title', icon: 'heading', label: 'Nama template', type: 'text', required: true, max: 60 },
    { key: 'topic', icon: 'tag', label: 'Untuk topik', type: 'select', options: TOPIC_OPTIONS, help: 'Template muncul paling atas untuk pesan dengan topik ini.' },
    { key: 'subject', icon: 'text', label: 'Subjek email', type: 'text', required: true, max: 100, wide: true },
    { key: 'body', icon: 'pen', label: 'Isi balasan', type: 'textarea', required: true, max: 2000, rows: 12, wide: true },
  ],
};
