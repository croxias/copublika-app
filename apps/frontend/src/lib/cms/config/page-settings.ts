import type { Field, PageConfig, Values } from '../types';

const NAV_HELP = 'Menu yang dimatikan hilang dari header dan footer, dan halamannya menampilkan 404.';

const navToggle = (key: string, label: string): Field => ({ key, label, type: 'toggle', wide: true });

export const page: PageConfig = {
  title: 'Pengaturan',
  titleAccent: 'Situs',
  description: 'Identitas, kontak, menu navigasi, pengumuman, dan footer yang dipakai di semua halaman publik.',
  publicHref: '/',
  tabsLabel: 'Kelompok pengaturan',
  tabs: [
    {
      key: 'settings.identity',
      label: 'Identitas',
      fields: [
        { key: 'siteName', label: 'Nama situs', type: 'text', required: true, max: 32 },
        { key: 'tagline', label: 'Tagline', type: 'text', max: 80 },
        { key: 'logoUrl', label: 'Logo', type: 'image', wide: true, help: 'Versi putih, dipakai di header gelap dan footer.' },
      ],
    },
    {
      key: 'settings.contact',
      label: 'Kontak & sosial',
      description: 'Dipakai di footer dan sebagai isi bawaan halaman Kontak.',
      fields: [
        { key: 'email', label: 'Email', type: 'text', required: true, max: 60 },
        { key: 'whatsapp', label: 'WhatsApp', type: 'text', max: 24, placeholder: '+62 …' },
        { key: 'instagram', label: 'Instagram', type: 'url', placeholder: 'https://instagram.com/…' },
        { key: 'threads', label: 'Threads', type: 'url', placeholder: 'https://threads.net/@…' },
        { key: 'linkedin', label: 'LinkedIn', type: 'url', placeholder: 'https://linkedin.com/company/…' },
        { key: 'youtube', label: 'YouTube', type: 'url', placeholder: 'https://youtube.com/@…' },
        { key: 'address', label: 'Alamat', type: 'textarea', max: 160, rows: 2 },
      ],
    },
    {
      key: 'settings.nav',
      label: 'Navigasi publik',
      description: NAV_HELP,
      fields: [
        { type: 'heading', key: 'h-menu', label: 'Menu yang tampil', help: 'Home dan About selalu tampil.' },
        navToggle('research', 'Research Project'),
        navToggle('program', 'Program (Siap Tembus Scopus)'),
        navToggle('blog', 'Blog'),
        navToggle('event', 'Event'),
        navToggle('contact', 'Contact'),
      ],
    },
    {
      key: 'settings.announce',
      label: 'Pengumuman',
      description: 'Bar tipis di atas header di semua halaman.',
      fields: [
        { key: 'enabled', label: 'Tampilkan bar pengumuman', type: 'toggle', wide: true },
        { key: 'text', label: 'Teks', type: 'text', max: 90, wide: true, required: true, visibleIf: (v: Values) => !!v.enabled },
        { key: 'ctaLabel', label: 'Label tombol', type: 'text', max: 20, visibleIf: (v: Values) => !!v.enabled },
        { key: 'ctaHref', label: 'Link tombol', type: 'url', visibleIf: (v: Values) => !!v.enabled },
      ],
    },
    {
      key: 'settings.footer',
      label: 'Footer',
      description: 'Status batch di bar bawah footer dibuat otomatis dari Manajemen Batch.',
      source: { label: 'Manajemen Batch', href: '/admin/batches' },
      fields: [
        { key: 'description', label: 'Deskripsi singkat', type: 'textarea', max: 200 },
        { key: 'newsletterLabel', label: 'Ajakan newsletter', type: 'text', max: 48, wide: true },
        { key: 'copyright', label: 'Teks hak cipta', type: 'text', max: 60, wide: true },
        {
          key: 'legal',
          label: 'Link legal',
          type: 'repeater',
          maxItems: 5,
          addLabel: 'Tambah link',
          itemTitle: (v) => `${String(v.label ?? '')} → ${String(v.href ?? '')}`,
          fields: [
            { key: 'label', label: 'Label', type: 'text', required: true, max: 32 },
            { key: 'href', label: 'Link', type: 'url', required: true },
          ],
        },
      ],
    },
  ],
};
