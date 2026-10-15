import type { Field, PageConfig, Values } from '../types';
import { ABOUT_FAMILY, heroFields, joinFields, str, titleFields } from './about-shared';

// /about/team (Our Team).

/** Positions of one unit. A position without a person shows as "Posisi terbuka". */
const positions = (key: string, label: string, max: number, help: string): Field => ({
  key,
  label,
  type: 'repeater',
  required: true,
  maxItems: max,
  addLabel: 'Tambah posisi',
  itemTitle: (p: Values) => `${str(p.roleId)}${p.person ? '' : ' · posisi terbuka'}`,
  itemPerson: (p: Values) => str(p.person),
  help,
  fields: [
    { key: 'roleId', label: 'Jabatan (Indonesia)', type: 'text', required: true, max: 48, placeholder: 'mis. Direktur Akademik' },
    { key: 'role', label: 'Jabatan (Inggris)', type: 'text', required: true, max: 48, placeholder: 'mis. Chief Academic Officer' },
    { key: 'scope', label: 'Lingkup tugas', type: 'textarea', max: 120, rows: 2, help: 'Muncul saat kartu pengurus di-hover.' },
    { key: 'person', label: 'Diisi oleh', type: 'ref', collection: 'people', filter: (x) => x.kind === 'team' || x.kind === 'both', help: 'Dipilih dari Pustaka → Tim & Mentor (peran Tim inti). Kosongkan jika posisi masih terbuka.' },
  ],
});

export const page: PageConfig = {
  title: 'Our',
  titleAccent: 'Team',
  description: 'Sambutan pendiri, struktur pengurus, dan ajakan bergabung sebagai pengurus.',
  publicHref: '/about/team',
  family: ABOUT_FAMILY,
  groupSections: true,
  tabs: [
    {
      key: 'aboutTeam.hero',
      label: 'Hero',
      description: 'Judul halaman. Kotak angka di kanan dihitung otomatis dari Struktur organisasi.',
      fields: heroFields(false),
    },
    {
      key: 'aboutTeam.ceo',
      label: 'Sambutan CEO',
      description: 'Foto besar di kiri, surat sambutan di kanan, lengkap dengan tanda tangan dan tautan sosial.',
      hideable: true,
      source: { label: 'Tim & Mentor', href: '/admin/library/people' },
      fields: [
        { type: 'heading', key: '_who', label: 'Penulis sambutan', short: 'Penulis', icon: 'users', help: 'Foto, nama, dan tautan sosial diambil dari profilnya di Tim & Mentor.' },
        { key: 'person', label: 'Orang', type: 'ref', collection: 'people', required: true, filter: (x) => x.kind === 'team' || x.kind === 'both' },
        { key: 'title', label: 'Jabatan di bawah nama', type: 'text', required: true, max: 48 },
        { type: 'heading', key: '_letter', label: 'Isi sambutan', short: 'Sambutan', icon: 'text' },
        { key: 'heading', label: 'Judul sambutan', type: 'text', required: true, max: 60, wide: true },
        { key: 'body', label: 'Isi', type: 'textarea', required: true, max: 1200, rows: 10, help: 'Pisahkan paragraf dengan satu baris kosong.' },
        { key: 'signoff', label: 'Salam penutup', type: 'text', max: 32 },
      ],
    },
    {
      key: 'aboutTeam.org',
      preview: 'teamOrg',
      label: 'Struktur organisasi',
      description: 'Infografis hierarki dan daftar pengurus berpaginasi. Posisi pertama di Pimpinan Eksekutif tampil paling atas sebagai Ketua Umum.',
      hideable: true,
      source: { label: 'Tim & Mentor', href: '/admin/library/people' },
      fields: [
        ...titleFields(),
        { type: 'heading', key: '_exec', label: 'Pimpinan Eksekutif', short: 'Pimpinan', icon: 'users', help: 'Posisi pertama = Ketua Umum (puncak bagan). Sisanya tampil sebagai baris Direksi.' },
        positions('exec', 'Posisi', 5, 'Urutan menentukan posisi di bagan.'),
        { type: 'heading', key: '_div', label: 'Kepala Divisi', short: 'Divisi', icon: 'display', help: 'Baris dasar bagan.' },
        positions('divisions', 'Posisi', 6, 'Paling pas 4 posisi agar satu baris di desktop.'),
        { type: 'heading', key: '_sec', label: 'Sekretariat', icon: 'text', help: 'Cabang staf di samping Ketua Umum.' },
        positions('secretariat', 'Posisi', 3, 'Mis. Sekretaris Jenderal dan Bendahara.'),
      ],
    },
    {
      key: 'aboutTeam.join',
      preview: 'join',
      label: 'Bergabung',
      description: 'Section oranye penutup: kartu keuntungan hitam dan kartu putih berisi posisi terbuka.',
      hideable: true,
      fields: joinFields(false),
    },
  ],
};
