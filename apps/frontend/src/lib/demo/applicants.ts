export type DemoApplicantStatus = 'pending' | 'verified' | 'rejected';

export type DemoApplicant = {
  id: string;
  name: string;
  institution: string;
  expertise: string;
  scholarId: string;
  scholarUrl: string;
  hIndex: number;
  citations: number;
  batch: string;
  submittedAt: string;
  status: DemoApplicantStatus;
  scholarNote: string;
};

/** Synthetic records for the admin preview. Never sent to a server. */
export const DEMO_APPLICANTS: DemoApplicant[] = [
  { id: 'DEMO-APP-001', name: 'Demo Applicant 01', institution: 'Institusi Demo A', expertise: 'Metodologi Riset', scholarId: 'SCHOLAR-DEMO-01', scholarUrl: 'https://scholar.google.com/', hIndex: 12, citations: 486, batch: 'Batch 04 · September', submittedAt: '18 Sep 2025', status: 'pending', scholarNote: 'Metadata ditemukan. Afiliasi perlu dikonfirmasi oleh kurator.' },
  { id: 'DEMO-APP-002', name: 'Demo Applicant 02', institution: 'Institusi Demo B', expertise: 'Kesehatan Masyarakat', scholarId: 'SCHOLAR-DEMO-02', scholarUrl: 'https://scholar.google.com/', hIndex: 8, citations: 214, batch: 'Batch 04 · September', submittedAt: '17 Sep 2025', status: 'pending', scholarNote: 'Metadata cocok dengan bidang yang diajukan.' },
  { id: 'DEMO-APP-003', name: 'Demo Applicant 03', institution: 'Institusi Demo C', expertise: 'Teknologi Pendidikan', scholarId: 'SCHOLAR-DEMO-03', scholarUrl: 'https://scholar.google.com/', hIndex: 19, citations: 1204, batch: 'Batch 04 · September', submittedAt: '16 Sep 2025', status: 'pending', scholarNote: 'Profil Scholar terdeteksi; review manual disarankan.' },
  { id: 'DEMO-APP-004', name: 'Demo Applicant 04', institution: 'Institusi Demo A', expertise: 'Ekonomi Kreatif', scholarId: 'SCHOLAR-DEMO-04', scholarUrl: 'https://scholar.google.com/', hIndex: 5, citations: 91, batch: 'Batch 03 · Agustus', submittedAt: '30 Aug 2025', status: 'verified', scholarNote: 'Terverifikasi pada preview sebelumnya.' },
  { id: 'DEMO-APP-005', name: 'Demo Applicant 05', institution: 'Institusi Demo D', expertise: 'Ilmu Komunikasi', scholarId: 'SCHOLAR-DEMO-05', scholarUrl: 'https://scholar.google.com/', hIndex: 3, citations: 48, batch: 'Batch 03 · Agustus', submittedAt: '28 Aug 2025', status: 'rejected', scholarNote: 'Data contoh: afiliasi tidak cocok.' },
];

export const DEMO_BATCHES = ['Semua batch', 'Batch 04 · September', 'Batch 03 · Agustus'];
export const statusLabel: Record<DemoApplicantStatus, string> = { pending: 'Menunggu review', verified: 'Disetujui', rejected: 'Ditolak' };
