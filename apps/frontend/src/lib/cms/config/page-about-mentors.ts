import type { PageConfig, Values } from '../types';
import { ABOUT_FAMILY, heroFields, iconField, joinFields, str } from './about-shared';

// /about/mentors (Our Mentors).

export const page: PageConfig = {
  title: 'Our',
  titleAccent: 'Mentors',
  description: 'Keunggulan mentor, direktori mentor dengan detail profil, dan ajakan menjadi mentor.',
  publicHref: '/about/mentors',
  family: ABOUT_FAMILY,
  groupSections: true,
  tabs: [
    {
      key: 'aboutMentors.hero',
      label: 'Hero',
      description: 'Judul halaman. Kotak angka di kanan memakai jumlah mentor dari tab Direktori.',
      fields: heroFields(true),
    },
    {
      key: 'aboutMentors.how',
      label: 'Keunggulan mentor',
      description: 'Tiga kartu di atas direktori.',
      hideable: true,
      fields: [
        { type: 'heading', key: '_cards', label: 'Kartu', icon: 'display' },
        {
          key: 'cards',
          label: 'Kartu',
          type: 'repeater',
          required: true,
          maxItems: 3,
          fixed: true,
          layout: 'cards',
          itemTitle: (c: Values) => str(c.title),
          itemText: (c: Values) => str(c.text),
          itemIcon: (c: Values) => str(c.icon),
          fields: [iconField(), { key: 'title', label: 'Judul', type: 'text', required: true, max: 28 }, { key: 'text', label: 'Deskripsi', type: 'textarea', required: true, max: 120, rows: 2 }],
        },
      ],
    },
    {
      key: 'aboutMentors.directory',
      label: 'Direktori mentor',
      description: 'Kartu mentor dengan filter bidang, pencarian, pagination, dan pop-up detail profil.',
      source: { label: 'Tim & Mentor', href: '/admin/library/people' },
      fields: [
        { type: 'heading', key: '_list', label: 'Isi direktori', short: 'Direktori', icon: 'users', help: 'Berisi semua orang berperan Mentor atau Tim inti & mentor yang berstatus Tampil. Instansi, keahlian, bio, topik, dan tautan sosial diatur di profil masing-masing.' },
        { key: 'total', label: 'Jumlah mentor di komunitas', type: 'number', required: true, min: 1, max: 999, suffix: 'mentor', help: 'Ditampilkan di hero. Bisa lebih besar dari jumlah profil yang sudah dipublikasikan.' },
        { key: 'perPage', label: 'Kartu per halaman', type: 'number', required: true, min: 4, max: 16, suffix: 'kartu' },
      ],
    },
    {
      key: 'aboutMentors.join',
      preview: 'join',
      label: 'Daftar sebagai mentor',
      description: 'Section oranye penutup: kartu keuntungan hitam dan kartu putih berisi syarat.',
      hideable: true,
      fields: joinFields(true),
    },
  ],
};
