import type { SeedPart } from './types';

// Copy as the public pages show it today: app/(public)/curation-process and contact (Indonesian strings).

export const seed: SeedPart = {
  sections: {
    'curation.header': {
      eyebrow: 'Curation Process',
      title: 'How batch admissions work.',
      description: 'Selective intake ensures each batch has strong collaboration fit and publication execution capacity.',
    },
    'curation.steps': {
      steps: [
        { title: 'Apply with Google Scholar ID', desc: 'Submit identity and academic profile. Google Scholar ID is mandatory for baseline credibility verification.' },
        { title: 'Metadata verification', desc: 'Our team validates profile consistency, publication signal, and institutional alignment.' },
        { title: 'Council review', desc: 'Curation Council evaluates fit with batch focus, collaboration potential, and execution readiness.' },
        { title: 'Decision', desc: 'Applicants receive approved or rejected status with onboarding instructions for the selected batch.' },
        { title: 'Member activation', desc: 'Approved members are staged for program onboarding and collaboration sprint kickoff.' },
      ],
    },

    // ── Kontak ──
    'contact.hero': {
      badge: 'Contact',
      title: 'Sapa kami.',
      sub: 'Pertanyaan, kolaborasi, atau ajakan menulis tamu — kami respons dalam 24 jam kerja.',
    },
    'contact.channels': {
      heading: 'Saluran Langsung',
      channels: [
        { label: 'Email', value: 'halo@copublika.id', href: 'mailto:halo@copublika.id' },
        { label: 'WhatsApp', value: '+62 813 2025 0707', href: 'https://wa.me/6281320250707' },
        { label: 'Instagram', value: '@copublika.id', href: 'https://instagram.com/copublika.id' },
        { label: 'Threads', value: '@copublika.id', href: 'https://threads.net/@copublika.id' },
      ],
    },
    'contact.form': {
      title: 'Kirim Pesan',
      topics: [{ label: 'Program' }, { label: 'Kolaborasi' }, { label: 'Tulisan Tamu' }, { label: 'Lainnya' }],
      consent: 'Dengan mengirim, anda setuju kami menyimpan email untuk merespons.',
      successTitle: 'Pesan terkirim!',
      successDesc: 'Tim kami akan merespons dalam 24 jam kerja.',
    },
    'contact.location': {
      visible: true,
      label: 'Lokasi',
      address: 'Jl. Cik Di Tiro No. 24, Bandung, Indonesia',
    },
  },
};
