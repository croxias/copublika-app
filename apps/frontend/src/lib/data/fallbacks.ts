import type { Batch, BlogPost, Event, ResearchProject } from "@/types";

export const fallbackBatches: Batch[] = [
  { id: "batch-4", number: 4, status: "open", seatsTotal: 120, seatsRemaining: 37, openDate: "2026-05-01T00:00:00.000Z", closeDate: "2026-09-30T23:59:59.000Z" },
  { id: "batch-5", number: 5, status: "open", seatsTotal: 60, seatsRemaining: 24, openDate: "2026-09-01T00:00:00.000Z", closeDate: "2026-12-31T23:59:59.000Z" },
  { id: "batch-6", number: 6, status: "closed", seatsTotal: 80, seatsRemaining: 0, openDate: "2026-03-01T00:00:00.000Z", closeDate: "2026-04-30T23:59:59.000Z" },
];

export const fallbackBatch: Batch = fallbackBatches[0];

export const fallbackKpis: { label: string; value: string }[] = [
  { label: "Active Members", value: "1,240+" },
  { label: "Published Papers", value: "386" },
  { label: "Average H-Index", value: "18.4" },
  { label: "Active Projects", value: "72" },
];

export const fallbackResearch: ResearchProject[] = [
  {
    id: "adaptive-ai-rural-health",
    title: "Adaptive AI for Rural Health Decision Support",
    abstract:
      "This collaborative project explores adaptive clinical decision support systems for low-resource rural clinics across Southeast Asia, focusing on triage acceleration and treatment consistency.",
    methodology:
      "Mixed-method multi-site deployment with Bayesian optimization and clinician-in-the-loop evaluation.",
    requiredExpertise: ["AI/ML", "Public Health", "Clinical Informatics"],
    status: "published",
    visibility: "public",
    leadName: "Dr. Nadia F. Rahman",
    leadInstitution: "Universitas Indonesia",
    tags: ["Health AI", "Rural Medicine", "Decision Support"],
    createdAt: "2026-05-18T08:00:00.000Z",
  },
  {
    id: "scopus-policy-citation-dynamics",
    title: "Policy Citation Dynamics in Emerging Economies",
    abstract:
      "A comparative bibliometric analysis on how policy-driven research agendas shape citation growth and journal acceptance in indexed publications.",
    methodology:
      "Longitudinal bibliometric scraping, topic modeling, and regression-based citation trend decomposition.",
    requiredExpertise: ["Bibliometrics", "Economics", "Policy Studies"],
    status: "published",
    visibility: "public",
    leadName: "Prof. Arman Siregar",
    leadInstitution: "Universiti Malaya",
    tags: ["Scopus", "Citation", "Policy Research"],
    createdAt: "2026-05-15T10:20:00.000Z",
  },
  {
    id: "marine-carbon-sequestration-governance",
    title: "Marine Carbon Sequestration and Coastal Governance",
    abstract:
      "Investigating interdisciplinary governance models for blue-carbon projects with measurable publication pathways for environmental policy impact.",
    methodology:
      "Case-comparative coastal governance mapping paired with spatial ecological modeling and qualitative policy coding.",
    requiredExpertise: ["Marine Science", "Environmental Policy", "GIS"],
    status: "published",
    visibility: "public",
    leadName: "Dr. Helena Wijaya",
    leadInstitution: "IPB University",
    tags: ["Blue Carbon", "Governance", "Climate"],
    createdAt: "2026-05-12T13:45:00.000Z",
  },
  {
    id: "computational-linguistics-bilingual-pedagogy",
    title: "Computational Linguistics for Bilingual Pedagogy at Scale",
    abstract:
      "Designing NLP-assisted instructional frameworks for bilingual higher education, with emphasis on reproducible corpus methods and publication outputs.",
    methodology:
      "Corpus curation, transformer-based language analysis, and controlled classroom intervention experiments.",
    requiredExpertise: ["NLP", "Education", "Experimental Design"],
    status: "published",
    visibility: "public",
    leadName: "Dr. Alicia Tan",
    leadInstitution: "National University of Singapore",
    tags: ["NLP", "Bilingual Education", "Learning Science"],
    createdAt: "2026-05-10T06:30:00.000Z",
  },
];

export const fallbackBlogs: BlogPost[] = [
  {
    id: "editorial-1",
    slug: "how-to-structure-a-scopus-ready-manuscript",
    title: "How to Structure a Scopus-Ready Manuscript",
    excerpt: "A practical blueprint from title framing to discussion depth for higher acceptance probability.",
    content:
      "Building a Scopus-ready manuscript starts with positioning. Define your novelty claim early, anchor methods in reproducibility, and align discussion with disciplinary debates.",
    coverImage: "/images/blog/manuscript-structure.jpg",
    category: "Publishing Strategy",
    author: "CoPublika Editorial",
    publishedAt: "2026-05-20T09:00:00.000Z",
    isPublished: true,
  },
  {
    id: "editorial-2",
    slug: "google-scholar-signals-for-collaboration-quality",
    title: "Google Scholar Signals for Collaboration Quality",
    excerpt: "What profiles reveal about consistency, specialization, and credible collaboration fit.",
    content:
      "Scholar profiles can indicate thematic consistency, citation momentum, and network quality. Use them for informed collaborator matching, not vanity metrics.",
    coverImage: "/images/blog/scholar-signals.jpg",
    category: "Community Curation",
    author: "Rizky Maulana",
    publishedAt: "2026-05-17T09:00:00.000Z",
    isPublished: true,
  },
  {
    id: "editorial-3",
    slug: "from-isolated-research-to-batch-momentum",
    title: "From Isolated Research to Batch Momentum",
    excerpt: "Why batch cadence helps early-career academics sustain execution and output quality.",
    content:
      "A strong batch rhythm reduces dropout, improves peer accountability, and creates a compounding review culture that pushes manuscripts to completion.",
    coverImage: "/images/blog/batch-momentum.jpg",
    category: "Research Workflow",
    author: "Nadia Putri",
    publishedAt: "2026-05-14T09:00:00.000Z",
    isPublished: true,
  },
  {
    id: "editorial-4",
    slug: "reviewer-2-feedback-without-losing-your-core-argument",
    title: "Handling Reviewer #2 Without Losing Your Core Argument",
    excerpt: "Respond firmly, revise precisely, and protect your paper's central contribution.",
    content:
      "Map each reviewer comment into accept, negotiate, or challenge categories, then respond with evidence-backed revisions while retaining your thesis integrity.",
    coverImage: "/images/blog/reviewer-feedback.jpg",
    category: "Peer Review",
    author: "CoPublika Editorial",
    publishedAt: "2026-05-11T09:00:00.000Z",
    isPublished: true,
  },
];

export const fallbackEvents: Event[] = [
  {
    id: "event-1",
    slug: "manuskrip-reviewer-comments",
    title: "Klinik Manuskrip: Membedah Reviewer Comments",
    description:
      "Bersama Dr. Aulia Rahmawati, Editor Asia Pacific Journal of Education. Kami akan membedah 4 reviewer reports asli — kerangka berpikir, pilihan bahasa, dan strategi merespons.",
    date: "2026-10-24T19:30:00+07:00",
    time: "19.30 — 21.00",
    duration: "90 menit",
    location: "Daring · Zoom",
    format: "Daring · Zoom",
    language: "Indonesia",
    status: "upcoming",
    isPaid: false,
    memberOnly: false,
    capacity: 500,
    registrantsCount: 347,
    type: "clinic",
    category: "clinic",
    tags: ["Klinik", "Gratis · Anggota", "90 menit", "Sertifikat tersedia"],
    blocks: [
      {
        heading: "Apa yang akan dibahas",
        paragraphs: [
          "Banyak peneliti pemula merasa kewalahan saat menerima reviewer comments — terutama bila jumlahnya banyak dan nadanya tegas. Pada sesi ini, kami membedah 4 reviewer reports asli dari naskah yang akhirnya diterima di jurnal Scopus Q1 dan Q2.",
          "Sesi ini cocok untuk anda yang sedang menunggu hasil review, atau yang baru saja mendapatkan komentar reviewer dan tidak tahu harus mulai dari mana.",
        ],
      },
      {
        heading: "Yang akan anda dapatkan",
        checkmarks: [
          "Kerangka berpikir untuk membaca reviewer comments sebagai data, bukan serangan personal",
          "Template tabel response letter yang dipakai 3 alumni Q1 — siap pakai",
          "Studi kasus 4 reviewer reports asli (anonim) dari naskah yang akhirnya diterima",
          "Q&A 30 menit langsung dengan Dr. Aulia — editor jurnal Q3 Scopus",
          "Rekaman lengkap sesi yang dapat ditonton ulang seumur hidup di akun anggota",
        ],
      },
    ],
    schedule: [
      {
        time: "19.30 — 19.45",
        title: "Pembukaan & Konteks",
        description: "Mengapa reviewer comments sering jadi titik berhenti — dan kerangka berpikir untuk meresponsnya.",
      },
      {
        time: "19.45 — 20.30",
        title: "Membedah 4 Reviewer Reports",
        description: "Studi kasus dari 4 naskah berbeda — bidang pendidikan, kesehatan, ekonomi, dan teknik. Anatomi setiap komentar dan respons yang dipilih.",
      },
      {
        time: "20.30 — 20.45",
        title: "Template Response Letter",
        description: "Demonstrasi mengisi template tabel — kolom komentar, respons, dan nomor baris naskah yang berubah.",
      },
      {
        time: "20.45 — 21.00",
        title: "Q&A Terbuka",
        description: "Pertanyaan langsung dari peserta. Submit pertanyaan saat registrasi untuk diprioritaskan.",
      },
    ],
    speaker: {
      name: "Dr. Aulia Rahmawati, M.A.",
      role: "Editor di Asia Pacific Journal of Education, reviewer aktif di 5 jurnal Q1–Q3, dengan rekam jejak 18 publikasi Scopus dalam 6 tahun terakhir.",
      avatar: "https://i.pravatar.cc/200?img=44",
      badges: ["h-index 12", "Q1 Editor", "Scopus Author"],
    },
    benefits: [
      "Akses Zoom 24 jam sebelum",
      "Rekaman lengkap pasca acara",
      "Template response letter",
      "Sertifikat kehadiran digital",
    ],
    targetAudience: [
      "Akademisi pemula yang sudah submit naskah dan sedang menunggu hasil review",
      "Mahasiswa S2/S3 yang baru pertama kali mendapat reviewer comments",
      "Dosen yang sering merasa \"stuck\" saat tahap revisi",
      "Anggota cohort Siap Tembus Scopus yang akan submit minggu depan",
    ],
  },
  {
    id: "event-2",
    slug: "editor-roundtable-q1-q2",
    title: "Editor Roundtable: Strategi Memilih Jurnal Q1–Q2",
    description:
      "Diskusi panel dengan 3 editor jurnal Scopus dari Asia Tenggara. Membahas kriteria selection, desk-reject patterns, dan strategi positioning.",
    date: "2026-11-06T19:30:00+07:00",
    time: "19.30 — 21.30",
    duration: "2 jam",
    location: "Daring · Webinar",
    format: "Daring · Webinar",
    language: "Indonesia",
    status: "upcoming",
    isPaid: false,
    memberOnly: false,
    capacity: 400,
    registrantsCount: 218,
    type: "webinar",
    category: "webinar",
    tags: ["Webinar", "Gratis · Anggota", "2 jam", "Sertifikat tersedia"],
    blocks: [
      {
        heading: "Apa yang akan dibahas",
        paragraphs: [
          "Memilih jurnal yang tepat adalah keputusan strategis — bukan sekadar mengikuti impact factor. Pada sesi roundtable ini, 3 editor jurnal Scopus Q1 dan Q2 berbagi perspektif langsung dari sisi editorial.",
        ],
      },
      {
        heading: "Yang akan anda dapatkan",
        checkmarks: [
          "3 perspektif editor tentang apa yang mereka cari di naskah",
          "Panduan menghindari 5 penyebab desk-reject paling umum",
          "Template journal-targeting worksheet",
          "Q&A langsung 45 menit",
        ],
      },
    ],
    schedule: [
      {
        time: "19.30 — 19.45",
        title: "Pembukaan: Mitos dan Fakta Tentang Jurnal Q1–Q2",
        description: "Klarifikasi kriteria yang sering disalahpahami.",
      },
      {
        time: "19.45 — 20.30",
        title: "3 Editor, 3 Perspektif",
        description: "Panel diskusi interaktif dengan 3 editor jurnal berbeda bidang.",
      },
      {
        time: "20.30 — 21.15",
        title: "Template & Praktik",
        description: "Demonstrasi worksheet journal-targeting berbasis evidence.",
      },
      {
        time: "21.15 — 21.30",
        title: "Q&A Terbuka",
        description: "Pertanyaan langsung dari peserta.",
      },
    ],
    speaker: {
      name: "Prof. Hari Susanto, Ph.D.",
      role: "Editor-in-Chief, International Journal of Educational Development (Scopus Q2), dengan 20+ tahun pengalaman di publikasi akademik Asia.",
      avatar: "https://i.pravatar.cc/200?img=33",
      badges: ["h-index 18", "Q2 Editor-in-Chief", "Scopus Author"],
    },
    benefits: ["Akses Webinar", "Rekaman lengkap", "Template journal-targeting", "Sertifikat kehadiran digital"],
    targetAudience: [
      "Peneliti yang bingung memilih jurnal target",
      "Mahasiswa pasca-sarjana yang prepare submission pertama",
      "Dosen yang ingin understand journal editorial process",
    ],
  },
  {
    id: "event-3",
    slug: "workshop-academic-writing-anchor-sentences",
    title: "Workshop Luring: Academic Writing dengan Anchor Sentences",
    description:
      "2 hari intensif di Yogyakarta. Menggunakan anchor sentence technique untuk membangun koherensi argumentasi dalam manuskrip akademik.",
    date: "2026-11-15T09:00:00+07:00",
    time: "09.00 — 17.00",
    duration: "2 hari",
    location: "Yogyakarta",
    format: "Luring",
    language: "Indonesia",
    status: "upcoming",
    isPaid: true,
    memberOnly: true,
    capacity: 40,
    registrantsCount: 38,
    type: "workshop",
    category: "workshop",
    tags: ["Workshop", "Luring", "2 hari", "Termasuk modul cetak"],
    blocks: [
      {
        heading: "Apa yang akan dibahas",
        paragraphs: [
          "Anchor sentences adalah kalimat jangkar yang memastikan setiap paragraf berkontribusi pada argumen utama. Teknik ini membantu penulis menjaga koherensi dari abstrak hingga kesimpulan.",
        ],
      },
      {
        heading: "Yang akan anda dapatkan",
        checkmarks: [
          "Modul cetak 120 halaman tentang anchor sentence technique",
          "2 hari coaching langsung dengan mentor senior",
          "Peer review session dengan 4 sesama peserta",
          "Makan siang dan coffee break setiap hari",
          "Follow-up online session 1 bulan setelah workshop",
        ],
      },
    ],
    schedule: [
      {
        time: "Hari 1 · 09.00 — 12.30",
        title: "Fundamen Anchor Sentence",
        description: "Teori koherensi paragraf dan demonstrasi teknik anchor sentence.",
      },
      {
        time: "Hari 1 · 13.30 — 17.00",
        title: "Praktik: Menulis dari Abstrak",
        description: "Hands-on writing session dengan feedback mentor dan peer.",
      },
      {
        time: "Hari 2 · 09.00 — 12.30",
        title: "Revisi & Refinement",
        description: "Peer review terstruktur dan revision coaching.",
      },
      {
        time: "Hari 2 · 13.30 — 17.00",
        title: "Presentasi & Diskusi",
        description: "Presentasi 5 menit per peserta, diskusi kolaboratif.",
      },
    ],
    speaker: {
      name: "Dr. Suryaakti Nugroho",
      role: "Senior writing coach dengan 15 tahun pengalaman mengajar academic writing di UGM. Telah membimbing 200+ akademisi publish di jurnal terindeks.",
      avatar: "https://i.pravatar.cc/200?img=56",
      badges: ["Writing Coach", "15 Tahun Pengalaman", "200+ Publish"],
    },
    benefits: [
      "Modul cetak 120 halaman",
      "2 hari coaching langsung",
      "Makan siang + coffee break",
      "Follow-up session 1 bulan",
      "Sertifikat workshop",
    ],
    targetAudience: [
      "Peneliti yang manuscritpnya sering dikritik karena argumen tidak koheren",
      "Mahasiswa S2/S3 yang baru mulai menulis tesis atau disertasi",
      "Dosen yang ingin improve teaching materials untuk academic writing",
    ],
  },
  {
    id: "event-4",
    slug: "doctoral-forum-jejaring-internasional",
    title: "Doctoral Forum: Membangun Jejaring Internasional Sejak S3",
    description:
      "Sharing dari 4 alumni S3 ITB, UI, UGM, dan Universitas Indonesia tentang strategi membangun jejaring akademik internasional sejak masa studi.",
    date: "2026-11-27T19:30:00+07:00",
    time: "19.30 — 21.00",
    duration: "90 menit",
    location: "Hybrid · Jakarta",
    format: "Hybrid",
    language: "Indonesia",
    status: "upcoming",
    isPaid: false,
    memberOnly: true,
    capacity: 300,
    registrantsCount: 156,
    type: "forum",
    category: "forum",
    tags: ["Forum", "Hybrid", "90 menit", "Sertifikat tersedia"],
    blocks: [
      {
        heading: "Apa yang akan dibahas",
        paragraphs: [
          "Jejaring akademik bukan hanya tentang conference attendance. 4 alumni S3 berbagi strategi konkret yang mereka gunakan untuk membangun kolaborrasi internasional yang menghasilkan co-authorship di jurnal Q1.",
        ],
      },
      {
        heading: "Yang akan anda dapatkan",
        checkmarks: [
          "4 perspektif berbeda tentang strategi networking berbasis research",
          "Template outreach email untuk prospective collaborators",
          "Panduan mengidentifikasi potential collaborators via bibliometric analysis",
          "Q&A 45 menit",
        ],
      },
    ],
    schedule: [
      {
        time: "19.30 — 19.50",
        title: "Sharing 1: ITB — Strategi Conference Networking",
        description: "Dr. Ferdi dari ITB tentang cara maximize conference untuk building relationships.",
      },
      {
        time: "19.50 — 20.10",
        title: "Sharing 2: UI — Bibliometric Collaboration Mapping",
        description: "Prof. Linda dari UI tentang tools untuk identify international collaborators.",
      },
      {
        time: "20.10 — 20.30",
        title: "Sharing 3 & 4: UGM & Undip — Email Outreach Strategy",
        description: "Praktikal email templates dan follow-up strategies.",
      },
      {
        time: "20.30 — 21.00",
        title: "Q&A & Networking Session",
        description: "Open discussion dan breakout networking untuk peserta.",
      },
    ],
    speaker: {
      name: "Dr. Ferdi Ananto, Ph.D.",
      role: "Alumni S3 ITB, sekarang Associate Professor di Nanyang Technological University, Singapore. 25+ publikasi Scopus Q1 dalam 8 tahun terakhir.",
      avatar: "https://i.pravatar.cc/200?img=60",
      badges: ["Alumni ITB", "NTU Singapore", "Q1 Researcher"],
    },
    benefits: [
      "Sharing dari 4 alumni berbeda institusi",
      "Template outreach email",
      "Panduan bibliometric collaboration mapping",
      "Sertifikat kehadiran digital",
    ],
    targetAudience: [
      "Mahasiswa S3 yang ingin mulai membangun jejaring internasional",
      "Peneliti post-doc yang perlu expand collaboration network",
      "Dosen senior yang ingin explore international joint projects",
    ],
  },
  {
    id: "event-5",
    slug: "riset-kualitatif-pemula",
    title: "Riset Kualitatif untuk Pemula: Dari Wawancara hingga Coding",
    description:
      "Bersama Dr. Dewi Nirmala, spesialis grounded theory. Hands-on session tentang desain interview guide, coding techniques, dan thematic analysis.",
    date: "2026-12-05T19:30:00+07:00",
    time: "19.30 — 21.00",
    duration: "90 menit",
    location: "Daring · Zoom",
    format: "Daring · Zoom",
    language: "Indonesia",
    status: "upcoming",
    isPaid: false,
    memberOnly: false,
    capacity: 500,
    registrantsCount: 289,
    type: "webinar",
    category: "webinar",
    tags: ["Webinar", "Gratis · Anggota", "90 menit", "Sertifikat tersedia"],
    blocks: [
      {
        heading: "Apa yang akan dibahas",
        paragraphs: [
          "Riset kualitatif sering dianggap 'subjektif' oleh reviewer kuantitatif. Sesi ini membahas cara memperkuat validitas qualitative research dengan teknik coding yang rigorous dan dokumentasi transparan.",
        ],
      },
      {
        heading: "Yang akan anda dapatkan",
        checkmarks: [
          "Template interview guide siap pakai",
          "Panduan NVivo/QDA Miner untuk beginner",
          "Coding framework untuk grounded theory approach",
          "Q&A langsung dengan Dr. Dewi",
        ],
      },
    ],
    schedule: [
      {
        time: "19.30 — 19.50",
        title: "Desain Penelitian Kualitatif yang Kredibel",
        description: "Criteria rigor dalam qualitative research dan common pitfalls.",
      },
      {
        time: "19.50 — 20.30",
        title: "Interview Guide & Coding Techniques",
        description: "Hands-on dengan template interview guide dan coding demo live.",
      },
      {
        time: "20.30 — 21.00",
        title: "Q&A & Resources",
        description: "Pertanyaan langsung dan distribusi resource pack.",
      },
    ],
    speaker: {
      name: "Dr. Dewi Nirmala, M.Si.",
      role: "Spesialis grounded theory dengan 12 tahun pengalaman dalam qualitative research methods. Reviewer di 4 jurnal Scopus Q2–Q3.",
      avatar: "https://i.pravatar.cc/200?img=47",
      badges: ["Qualitative Expert", "Grounded Theory", "Q2 Reviewer"],
    },
    benefits: [
      "Template interview guide",
      "Panduan NVivo/QDA Miner",
      "Coding framework",
      "Sertifikat kehadiran digital",
    ],
    targetAudience: [
      "Mahasiswa yang baru pertama kali melakukan riset kualitatif",
      "Peneliti yang ingin refresh qualitative methods knowledge",
      "Reviewer yang perlu evaluate qualitative manuscripts",
    ],
  },
  {
    id: "event-6",
    slug: "workshop-submission-portal-bandung",
    title: "Workshop Bandung: Submission Portal & Cover Letter",
    description:
      "1 hari intensif di ITB. Simulasi submission di portal Elsevier dan Springer — termasuk cover letter, response to reviewers, dan resubmission strategy.",
    date: "2026-12-13T09:00:00+07:00",
    time: "09.00 — 17.00",
    duration: "1 hari",
    location: "Bandung",
    format: "Luring",
    language: "Indonesia",
    status: "upcoming",
    isPaid: true,
    capacity: 50,
    registrantsCount: 50,
    type: "workshop",
    category: "workshop",
    tags: ["Workshop", "Luring", "1 hari", "Termasuk makan siang"],
    blocks: [
      {
        heading: "Apa yang akan dibahas",
        paragraphs: [
          "Submission portal sering menjadi hambatan teknis yang memakan waktu. Workshop ini mensimulasikan proses submission di portal Elsevier dan Springer — dari registrasi hingga first response.",
        ],
      },
      {
        heading: "Yang akan anda dapatkan",
        checkmarks: [
          "Simulasi langsung di portal submission Elsevier dan Springer",
          "Template cover letter yang sudah di-review editor",
          "Template response to reviewers",
          "Makan siang dan modul cetak",
        ],
      },
    ],
    schedule: [
      {
        time: "09.00 — 10.30",
        title: "Cover Letter Writing",
        description: "Template dan evaluasi cover letter yang menarik perhatian editor.",
      },
      {
        time: "10.45 — 12.30",
        title: "Elsevier Submission Simulation",
        description: "Hands-on di portal Elsevier dengan manuskrip sample.",
      },
      {
        time: "13.30 — 15.30",
        title: "Springer Submission Simulation",
        description: "Hands-on di portal Springer dengan manuskrip sample.",
      },
      {
        time: "15.45 — 17.00",
        title: "Cover Letter Revision & Feedback",
        description: "Review langsung cover letter peserta.",
      },
    ],
    speaker: {
      name: "Dr. Rina Kusuma, M.T.",
      role: "Research support specialist dengan pengalaman membantu 150+ akademisi submit di Springer dan Elsevier. Reviewer di IEEE Access.",
      avatar: "https://i.pravatar.cc/200?img=51",
      badges: ["Elsevier Expert", "Springer Certified", "150+ Submissions"],
    },
    benefits: [
      "Simulasi portal Elsevier & Springer",
      "Template cover letter",
      "Template response to reviewers",
      "Makan siang + modul cetak",
    ],
    targetAudience: [
      "Peneliti yang belum pernah submit di Elsevier/Springer",
      "Akademisi yang sering ditolak karena cover letter yang lemah",
      "Post-doc yang ingin accelerate submission timeline",
    ],
  },
];

export const fallbackTestimonials: { name: string; role: string; institution: string; quote: string }[] = [
  {
    name: "Dr. Intan Prameswari",
    role: "Lecturer, Public Policy",
    institution: "Universitas Gadjah Mada",
    quote:
      "Within one batch cycle, my manuscript moved from stalled draft to accepted with stronger methods and sharper positioning.",
  },
  {
    name: "Ahmad Naufal, M.Sc.",
    role: "Research Fellow",
    institution: "BRIN",
    quote:
      "The curation process improved collaborator fit. We stopped random teaming and started producing publishable outputs.",
  },
  {
    name: "Dr. Mei Lin Tan",
    role: "Assistant Professor",
    institution: "Universiti Kebangsaan Malaysia",
    quote:
      "CoPublika combines academic rigor and execution discipline. The feedback loops are practical, not just motivational.",
  },
  {
    name: "Prof. Satria Mahendra",
    role: "Senior Researcher",
    institution: "Institut Teknologi Bandung",
    quote:
      "The program helped junior co-authors understand journal expectations and improve response quality to reviewers.",
  },
];

export const fallbackFaqs: { question: string; answer: string }[] = [
  {
    question: "Apakah Google Scholar ID wajib saat mendaftar?",
    answer:
      "Ya. Google Scholar ID adalah komponen utama verifikasi profil akademik dalam proses kurasi batch CoPublika.",
  },
  {
    question: "How long does the curation decision take?",
    answer:
      "The Curation Council typically completes metadata verification and review within ten working days after submission.",
  },
  {
    question: "Apakah semua pelamar otomatis diterima?",
    answer:
      "Tidak. CoPublika menggunakan selective intake berdasarkan kesesuaian riset, rekam jejak, dan kesiapan kolaborasi.",
  },
  {
    question: "Can I join if my paper is still in early draft?",
    answer:
      "Yes, as long as your research intent is clear and you are ready to work through the structured publication process.",
  },
  {
    question: "Apa perbedaan CoPublika dengan komunitas riset umum?",
    answer:
      "CoPublika menerapkan batch cadence, kurasi berbasis data akademik, dan mentoring terarah untuk akselerasi output publikasi.",
  },
];
