import type { SeedPart } from './types';
import { STS_MENTOR_IDS } from './people';

// Copy as the public pages show it today: app/(public)/about, siap-tembus-scopus,
// curation-process and contact (Indonesian strings).
const t = (text: string) => ({ text });

export const seed: SeedPart = {
  sections: {
    // ── Siap Tembus Scopus ──
    'sts.hero': {
      titleLine: 'Bootcamp',
      titleAccent: 'Siap Tembus Scopus',
      lead: '12 minggu pendampingan terstruktur — mulai dari pemilihan topik hingga acceptance letter. Mentor 1-on-1 dengan rekam jejak publikasi Q1–Q3.',
      primaryLabel: 'Daftar',
      secondaryLabel: 'Lihat Modul',
      stats: [
        { value: '76%', label: 'Akseptasi' },
        { value: '318', label: 'Publikasi' },
      ],
      meta: [
        { label: 'Durasi', value: '12 Minggu', sub: '' },
        { label: 'Format', value: 'Hybrid', sub: '(Online + 2x Luring)' },
        { label: 'Mulai', value: '15 Sep 2026', sub: '' },
      ],
    },
    'sts.fit': {
      visible: true,
      tag: 'Untuk siapa',
      title: 'Anda akan cocok di sini jika…',
      idealLabel: 'Profil ideal',
      ideal: [
        t('Dosen 1–5 tahun pengalaman yang ingin membangun rekam jejak publikasi internasional.'),
        t('Mahasiswa S2/S3 yang membutuhkan publikasi sebagai syarat lulus atau syarat beasiswa.'),
        t('Peneliti yang sudah pernah submit tapi sering ditolak — atau merasa stuck di tahap revisi.'),
        t('Akademisi yang punya data / ide tapi belum tahu cara mengubahnya menjadi naskah jurnal.'),
      ],
      outputLabel: 'Output anda',
      outputs: [
        t('Satu naskah lengkap (5.000–8.000 kata) siap di-submit ke jurnal target.'),
        t('Daftar jurnal target dengan analisis fit, scope, dan timeline publikasi.'),
        t('Cover letter + response-to-reviewer template yang sudah teruji.'),
        t('Jaringan 24 rekan satu batch + akses alumni network CoPublika seumur hidup.'),
      ],
    },
    'sts.curriculum': {
      visible: true,
      tag: 'Kurikulum 12 minggu',
      title: '12 minggu, 6 fase.',
      sub: 'Setiap fase memiliki output yang konkret. Tidak ada fase yang dilewati — bahkan jika anda sudah pernah submit sebelumnya.',
      phases: [
        { week: 'W 1–2', phase: 'Phase 01 / Discover', title: 'Pemilihan Topik & Jurnal Target', desc: 'Workshop scoping, pemetaan gap riset, dan analisis fit jurnal Scopus.', deliverable: '1-page Concept Note' },
        { week: 'W 3–4', phase: 'Phase 02 / Review', title: 'Tinjauan Pustaka Sistematis', desc: 'Strategi pencarian, sintesis tematik, dan penyusunan argumen literatur.', deliverable: 'Literature Matrix' },
        { week: 'W 5–6', phase: 'Phase 03 / Method', title: 'Metodologi & Analisis Data', desc: 'Justifikasi metode, validitas, dan presentasi hasil yang publikasi-ready.', deliverable: 'Methods + Results Draft' },
        { week: 'W 7–8', phase: 'Phase 04 / Write', title: 'Penulisan Akademik Bahasa Inggris', desc: 'Anchor sentences, kohesi paragraf, dan diksi akademik untuk reviewer internasional.', deliverable: 'Full Manuscript Draft' },
        { week: 'W 9–10', phase: 'Phase 05 / Refine', title: 'Klinik Manuskrip & Peer Review', desc: 'Internal peer review dua putaran, mock reviewer comments, dan revisi terstruktur.', deliverable: 'Revised Manuscript' },
        { week: 'W 11–12', phase: 'Phase 06 / Submit', title: 'Submission & Strategi Revisi', desc: 'Cover letter, response strategy, dan pendampingan submission portal.', deliverable: 'Submitted to Scopus' },
      ],
    },
    'sts.mentors': {
      visible: true,
      tag: 'Dibimbing mentor aktif',
      title: 'Dibimbing peneliti aktif.',
      sub: 'Mentor inti kami punya rekam jejak publikasi di jurnal Q1–Q3 dan pengalaman sebagai reviewer.',
      mentors: STS_MENTOR_IDS,
    },
    'sts.free': {
      visible: true,
      pill: 'Beta · 100% Gratis',
      titleAccent: '100% gratis',
      lead: 'Sebagai bagian dari program beta CoPublika, biaya bootcamp 12 minggu sepenuhnya digratiskan. Yang kami minta hanya komitmen anda untuk hadir sampai akhir.',
      features: [t('Akses semua modul 12 minggu'), t('Mentor 1-on-1 (6 sesi)'), t('Klinik manuskrip mingguan'), t('Sertifikat & alumni network')],
      primaryLabel: 'Klaim Kursi Gratis',
      secondaryLabel: 'Tanya dulu',
      secondaryHref: '/contact',
    },

    // ── Proses Kurasi (the public page is in English today) ──
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
