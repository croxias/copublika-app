export type ActiveProjectStatus = "recruiting" | "writing" | "review" | "submitted";

export type ActiveProject = {
  id: string;
  title: string;
  cluster: string;
  status: ActiveProjectStatus;
  abstract: string;
  /** Full methodology — hidden behind curiosity gap for guests */
  methodology: string;
  /** Target journals being considered */
  targetJournals: string[];
  /** Required expertise / roles being recruited */
  requiredExpertise: string[];
  /** Estimated timeline phase */
  timeline: string;
  tags: string[];
  lead: string;
  leadRole: string;
  affiliation: string;
  collaborators: { name: string; role: string }[];
  /** Project start date as YYYY-MM */
  startedAt: string;
};

export const STATUS_LABEL: Record<ActiveProjectStatus, string> = {
  recruiting: "Recruiting",
  writing: "Writing",
  review: "In Review",
  submitted: "Submitted",
};

export const STATUS_LABEL_ID: Record<ActiveProjectStatus, string> = {
  recruiting: "Mencari kolaborator",
  writing: "Sedang ditulis",
  review: "Review artikel",
  submitted: "Sudah submit",
};

export const ACTIVE_PROJECTS: ActiveProject[] = [
  {
    id: "p01",
    title:
      "Generative AI Adoption in Indonesian Higher Education: A National Survey of 12 Universities",
    cluster: "EdTech",
    status: "writing",
    abstract:
      "Studi survei nasional yang memetakan adopsi alat AI generatif di kalangan dosen dan mahasiswa di 12 PTN. Mencakup tata kelola, kebijakan kelas, dan dampak pada literasi akademik. Output: naskah Q1 dan policy brief untuk Kemendikbudristek.",
    methodology:
      "Mixed-methods sequential explanatory. Fase 1: kuesioner cross-sectional dengan sampel n=2.400 dosen + n=8.000 mahasiswa, instrumen tervalidasi (Cronbach α > 0.85), distribusi via koordinasi LPPM masing-masing kampus. Fase 2: wawancara mendalam dengan 24 informan kunci (3 per institusi). Analisis: SEM-PLS untuk model adopsi + thematic analysis NVivo untuk data kualitatif.",
    targetJournals: ["Journal of Educational Research", "Computers & Education", "Studies in Higher Education"],
    requiredExpertise: ["Quantitative methods (SEM-PLS)", "AI policy", "Indonesian higher education"],
    timeline: "Mei 2025 — Desember 2025 (Fase Writing)",
    tags: ["EdTech", "Policy", "AI"],
    lead: "Dr. Ade Putranto",
    leadRole: "Author",
    affiliation: "Universitas Negeri Yogyakarta",
    collaborators: [
      { name: "Dr. Lina Kartika", role: "Co-author · Linguistics" },
      { name: "Bayu Nugroho, M.Sc.", role: "Co-author · Data Analyst" },
      { name: "Sari Wibowo, S.Pd.", role: "Co-author · Field Coordinator" },
    ],
    startedAt: "2024-11",
  },
  {
    id: "p02",
    title: "Digital Health Literacy Among Rural Indonesian Communities Post-COVID",
    cluster: "Public Health",
    status: "review",
    abstract:
      "Studi mixed-methods literasi kesehatan digital di 4 kabupaten Jawa-Sumatera setelah pandemi. Mengukur akses, perilaku pencarian informasi, dan kesenjangan literasi antar usia & gender.",
    methodology:
      "Concurrent triangulation. Survei rumah tangga (n=1.200) dengan instrumen eHEALS yang diadaptasi konteks lokal. FGD di 8 desa terpilih (4 perwakilan/desa). Analisis: regresi logistik biner untuk identifikasi determinan literasi + framework analysis untuk data FGD. Quality control: double-coding 20% transkrip dengan κ > 0.75.",
    targetJournals: ["Health Promotion International", "BMC Public Health", "Patient Education and Counseling"],
    requiredExpertise: ["Survei lapangan", "Statistik epidemiologi", "Analisis kualitatif FGD"],
    timeline: "Submitted ke Health Promotion International — menunggu reviewer comments",
    tags: ["Health", "Digital", "Rural"],
    lead: "Dr. Maya Rahmawati",
    leadRole: "Author",
    affiliation: "Universitas Gadjah Mada",
    collaborators: [
      { name: "Andika Hidayat, M.Kes.", role: "Co-author · Field Lead" },
      { name: "Dewi Sari, M.Sc.", role: "Co-author · Statistician" },
    ],
    startedAt: "2024-08",
  },
  {
    id: "p03",
    title: "Circular Economy Practices in Central Java's Textile MSMEs",
    cluster: "Sustainability",
    status: "writing",
    abstract:
      "Analisis multi-case 24 UMKM tekstil di Jawa Tengah yang menerapkan praktik ekonomi sirkular. Mengidentifikasi pola pemulihan limbah, model bisnis, dan tantangan rantai pasok.",
    methodology:
      "Multiple case study (Yin, 2018). 24 UMKM dipilih purposive berdasarkan praktik sirkular yang terdokumentasi. Tiap kasus: kunjungan lapangan 2 hari, wawancara semi-terstruktur dengan pemilik dan 2 karyawan, observasi proses produksi. Cross-case analysis dengan replication logic + thematic coding.",
    targetJournals: ["Sustainability", "Journal of Cleaner Production", "Resources, Conservation & Recycling"],
    requiredExpertise: ["Case-study methodology", "Supply chain analysis", "Textile industry"],
    timeline: "Mei 2025 — Agustus 2025 (Draft penuh)",
    tags: ["Sustainability", "MSME", "Textile"],
    lead: "Dr. Bayu Setiawan",
    leadRole: "Author",
    affiliation: "Institut Teknologi Sepuluh Nopember",
    collaborators: [
      { name: "Dr. Dewi Nirmala", role: "Co-author · Sociology" },
      { name: "Rini Puspita, M.Pd.", role: "Co-author · Research Assistant" },
    ],
    startedAt: "2024-09",
  },
  {
    id: "p04",
    title: "Anchor Sentences as a Heuristic for L2 Academic Writing",
    cluster: "Applied Linguistics",
    status: "recruiting",
    abstract:
      "Studi kuasi-eksperimen dengan 120 mahasiswa S1 untuk menguji efektivitas anchor sentences sebagai heuristik penulisan akademik dalam bahasa Inggris. Mencari co-author di bidang linguistik terapan.",
    methodology:
      "Quasi-experimental pre-post test design dengan kelompok kontrol. Intervensi: 8 sesi workshop anchor sentences (modul tervalidasi). Instrumen: rubrik tata-tulis akademik (4 dimensi, IRR > 0.8) + analisis korpus output mahasiswa. Analisis: ANCOVA dengan pre-test sebagai kovariat + effect-size Cohen's d.",
    targetJournals: ["Studies in Higher Education", "TESOL Quarterly", "Journal of Second Language Writing"],
    requiredExpertise: ["Applied linguistics", "Corpus methods", "ANCOVA / mixed-effects modeling"],
    timeline: "Recruiting hingga 30 Jun 2025 — pelaksanaan Sep–Des 2025",
    tags: ["Linguistics", "EAP", "Writing"],
    lead: "Dr. Lina Kartika",
    leadRole: "Author",
    affiliation: "Universitas Pendidikan Indonesia",
    collaborators: [
      { name: "Putri Andini, Ph.D.", role: "Co-author · Methodologist" },
    ],
    startedAt: "2025-02",
  },
  {
    id: "p05",
    title: "Reviewer Comment Framing and Author Response: Discourse Analysis",
    cluster: "Publishing",
    status: "review",
    abstract:
      "Analisis wacana 240 surat revisi naskah dari 6 jurnal Q1–Q3. Memetakan pola framing reviewer dan strategi response yang berkorelasi dengan keputusan accept.",
    methodology:
      "Corpus-based discourse analysis dengan AntConc + framework Hyland (2004). Korpus: 240 revision letters dari arsip alumni CoPublika (2019–2024), anonimized. Coding skema: 12 kategori framing reviewer + 8 strategi response. Quantitative analysis: log-likelihood untuk identifikasi keyness.",
    targetJournals: ["Learned Publishing", "Journal of English for Academic Purposes", "Written Communication"],
    requiredExpertise: ["Discourse analysis", "Corpus linguistics"],
    timeline: "Under review — Learned Publishing, sejak Maret 2025",
    tags: ["Publishing", "Discourse", "Q1"],
    lead: "Dr. Hadi Suryanto",
    leadRole: "Author",
    affiliation: "Universitas Indonesia",
    collaborators: [
      { name: "Dr. Ade Putranto", role: "Co-author · Senior advisor" },
    ],
    startedAt: "2024-06",
  },
  {
    id: "p06",
    title: "Network Effects in Early-Career Academic Writing Communities",
    cluster: "Sociology",
    status: "recruiting",
    abstract:
      "Perspektif modal sosial untuk menjelaskan dampak komunitas terhadap produktivitas publikasi akademisi pemula. Studi network analysis di komunitas CoPublika.",
    methodology:
      "Social network analysis (SNA) dengan UCINET. Data: kolaborasi-publikasi 1.240 anggota CoPublika (2022–2024). Variabel network: density, centrality (betweenness, eigenvector), clustering coefficient. Outcome variable: kontribusi penulis pada publikasi Q1–Q3. Analisis: ERGM (exponential random graph model) dengan kontrol demografis.",
    targetJournals: ["Higher Education", "Social Networks", "Research Policy"],
    requiredExpertise: ["Social network analysis", "ERGM modeling", "Sociology of science"],
    timeline: "Recruiting hingga 31 Juli 2025 — analisis Agu–Nov 2025",
    tags: ["Sociology", "Network", "Capital"],
    lead: "Dr. Andika Hidayat",
    leadRole: "Author",
    affiliation: "Universitas Airlangga",
    collaborators: [
      { name: "Dr. Maya Rahmawati", role: "Co-author · Public Health" },
    ],
    startedAt: "2025-01",
  },
];

export function getActiveProject(id: string): ActiveProject | undefined {
  return ACTIVE_PROJECTS.find((p) => p.id === id);
}
