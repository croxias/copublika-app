import type { SeedPart } from './types';

// From components/layout/Navbar.tsx, Footer.tsx and the contact page channels.
export const seed: SeedPart = {
  sections: {
    'settings.identity': {
      siteName: 'CoPublika',
      tagline: 'Digital Research Engine & Exclusive Community',
      logoUrl: '/logo-white.png',
    },
    'settings.contact': {
      email: 'copublika@gmail.com',
      whatsapp: '+62 813 2025 0707',
      instagram: 'https://instagram.com/copublika.id',
      threads: 'https://threads.net/@copublika.id',
      linkedin: '',
      youtube: '',
      address: 'Jl. Cik Di Tiro No. 24, Bandung, Indonesia',
    },
    'settings.nav': { research: true, program: true, blog: true, event: true, contact: true },
    'settings.announce': {
      enabled: true,
      text: 'Batch #07 — pendaftaran dibuka, 24 kursi tersisa.',
      ctaLabel: 'Daftar sekarang',
      ctaHref: '/siap-tembus-scopus',
    },
    'settings.footer': {
      description: 'Digital Research Engine & Exclusive Community. Platform kolaborasi akademik terkurasi untuk menerbitkan publikasi berkualitas tinggi.',
      newsletterLabel: 'Dapatkan notifikasi batch terbaru',
      copyright: '© 2026 CoPublika. All rights reserved.',
      legal: [
        { label: 'Terms', href: '/' },
        { label: 'Privacy', href: '/' },
      ],
    },
  },
};
