/**
 * Curated blog article catalog used as fallback for /blog and shared with
 * landing-page modules. The first item is treated as the featured post.
 */

export type BlogCategory = "guide" | "interview" | "essay" | "news" | "case";

export type BlogArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  categoryLabel: string;
  /** Cover image URL (Unsplash) */
  cover: string;
  author: string;
  authorInitials: string;
  readTime: string;
  /** YYYY-MM — day intentionally omitted to match site convention */
  date: string;
  featured?: boolean;
  /** Shown in the "Pilihan Editor" carousel, with a one-line reason. */
  editorsPick?: boolean;
  editorNote?: string;
  content: string; // Teks lengkap artikel dalam format Markdown/HTML
};

export const BLOG_CATEGORIES: { id: BlogCategory | "all"; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "guide", label: "Panduan" },
  { id: "interview", label: "Interview" },
  { id: "essay", label: "Esai" },
  { id: "news", label: "Berita" },
  { id: "case", label: "Studi Kasus" },
];

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: "anatomi-naskah-q1",
    editorsPick: true,
    editorNote: "Bedah lengkap tiga naskah anggota yang tembus Q1, dari draf sampai acceptance.",
    title:
      "Anatomi Naskah yang Diterima Q1: Membedah Tiga Naskah CoPublika dari Submit hingga Acceptance",
    excerpt:
      "Tiga naskah peserta cohort #05 berhasil diterima di jurnal Q1 dalam 6 bulan terakhir. Kami membedah pola umum, kesalahan yang dihindari, dan kerangka berpikir di balik revisi-revisi penting.",
    category: "guide",
    categoryLabel: "Panduan",
    cover: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1600&q=80&auto=format&fit=crop",
    author: "Dr. Ade Putranto",
    authorInitials: "AP",
    readTime: "12 min",
    date: "2025-05",
    featured: true,
    content: `## Pembedahan Mendalam Tiga Naskah Cohort #05
    
Tiga naskah peserta Cohort #05 berhasil menembus seleksi ketat di jurnal Q1 (terindeks Scopus dengan dampak tinggi) dalam waktu kurang dari 6 bulan. Melalui artikel ini, kami membedah anatomi dari ketiga naskah tersebut untuk menemukan kesamaan pola, strategi revisi, dan kerangka berpikir yang membuat mereka diterima.

### 1. Perumusan State of the Art (SOTA) yang Tajam
Ketiga naskah sukses ini memiliki benang merah yang sama pada bagian pendahuluan (*Introduction*). Mereka tidak hanya menceritakan latar belakang masalah, tetapi secara eksplisit merumuskan kesenjangan penelitian (*research gap*) di paragraf kedua dan ketiga.
*   **Pola Umum**: Penulis menyajikan tabel ringkasan penelitian terdahulu untuk memetakan apa yang sudah diteliti dan di mana letak posisi penelitian mereka saat ini.
*   **Kesalahan yang Dihindari**: Menulis latar belakang yang terlalu umum (seperti sejarah subjek yang terlalu luas) tanpa mengerucut ke masalah spesifik yang ingin diselesaikan.

### 2. Metodologi yang Sangat Reproduksibel
Naskah yang diterima di Q1 selalu menyajikan metodologi secara transparan dan detail. Reviewer di jurnal bereputasi tinggi sangat sensitif terhadap validitas dan reproduksibilitas metode penelitian.
*   **Pola Umum**: Penulis melampirkan diagram alur penelitian (*research flowchart*) dan menyediakan datasets atau instrumen penelitian di repositori publik (seperti OSF atau Zenodo).
*   **Tindakan Revisi Penting**: Saat reviewer meminta klarifikasi mengenai penentuan ukuran sampel, penulis merespons dengan menyajikan analisis kekuatan statistik (*statistical power analysis*) tambahan yang kokoh.

### 3. Diskusi Temuan yang Berorientasi Teoretis (Bukan Sekadar Laporan Data)
Kesalahan fatal sebagian besar penulis pemula adalah menulis bagian *Discussion* seperti rangkuman hasil. Pada ketiga naskah ini, bagian diskusi merupakan porsi terberat dan paling mendalam.
*   **Pola Umum**: Penulis membandingkan temuan mereka dengan setidaknya 10-15 artikel kunci yang relevan dari jurnal internasional bereputasi dalam 3 tahun terakhir.
*   **Kutipan Reviewer**: *"The discussion successfully positions the local empirical findings within the broader global theoretical framework of adaptive policy making."*

> "Reviewer tidak mencari kesempurnaan absolut dalam metodologi Anda, melainkan kejujuran akademik, transparansi langkah, dan kemampuan memetakan kontribusi ilmiah Anda di panggung global." — Dr. Ade Putranto

### Langkah Menuju Naskah Q1 Anda
1.  **Petakan Literatur**: Identifikasi 5-10 artikel utama dari jurnal target Anda sebelum mulai menulis.
2.  **Gunakan IMRaD**: Disiplinkan struktur penulisan Anda sesuai standar internasional.
3.  **Siapkan Repositori Terbuka**: Publikasikan instrumen atau data mentah Anda jika memungkinkan untuk menumbuhkan kepercayaan reviewer.`,
  },
  {
    slug: "7-kesalahan-jurnal-target",
    title: "7 Kesalahan Umum Saat Memilih Jurnal Target",
    excerpt:
      "Daftar kesalahan paling umum di tahap journal selection yang membuat naskah anda di-desk-reject sebelum dibaca reviewer. Tips dari editor jurnal Q1.",
    category: "guide",
    categoryLabel: "Panduan",
    cover: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=900&q=80&auto=format&fit=crop",
    author: "Dr. Maya Rahmawati",
    authorInitials: "MR",
    readTime: "4 min",
    date: "2025-05",
    content: `## Menghindari Penolakan Sebelum Review (Desk Reject)
    
Memilih jurnal target seringkali ditaruh pada urutan terakhir dalam proses menulis. Padahal, ini adalah keputusan strategis yang menentukan apakah naskah Anda akan langsung ditolak oleh editor (*desk reject*) atau dikirimkan ke reviewer untuk ditelaah lebih lanjut.

Berikut adalah 7 kesalahan paling umum saat memilih jurnal target berdasarkan catatan editor jurnal Q1:

### 1. Tidak Membaca Scope (Cakupan) Jurnal secara Detail
Banyak penulis hanya mengandalkan judul jurnal. Misalnya, mengirimkan naskah tentang pendidikan dasar ke jurnal bernama *"Educational Policy"* yang ternyata hanya menerima kajian kebijakan makro tingkat nasional, bukan penelitian empiris tindakan kelas.

### 2. Mengabaikan Metrik "Time to First Decision"
Mengirimkan naskah ke jurnal dengan *turnaround time* sangat lambat tanpa persiapan waktu yang cukup bisa sangat merugikan bagi akademisi yang sedang mengejar kelulusan atau kenaikan pangkat.

### 3. Terkecoh Jurnal Predator (Hijacked Journals)
Kurangnya kehati-hatian dalam memeriksa keaslian alamat web jurnal. Pastikan memeriksa keaslian jurnal lewat Scopus Sources, SCImago, atau Beall's List secara berkala.

### 4. Tidak Menyesuaikan Daftar Referensi
Jika Anda menargetkan Jurnal X, namun di daftar pustaka Anda tidak ada satu pun kutipan dari Jurnal X, editor akan berasumsi bahwa penelitian Anda tidak relevan dengan diskursus ilmiah yang terjadi di dalam komunitas jurnal mereka.

### 5. Mengabaikan Faktor Keterbukaan Akses (Open Access vs Hybrid)
Banyak penulis terkejut saat naskah mereka diterima namun diminta membayar biaya publikasi (*Article Processing Charge* / APC) yang bernilai ribuan dolar karena salah memilih tipe lisensi jurnal.

### 6. Overconfidence pada Kuartil Jurnal
Mengirim naskah draf awal langsung ke jurnal Q1 top-tier tanpa melalui proses *peer-review internal* atau mentoring terlebih dahulu seringkali berujung pada kekecewaan instan.

### 7. Format Naskah yang Berantakan
Mengirimkan naskah dengan gaya kutipan (*citation style*) dan layout yang ditujukan untuk Jurnal A ke Jurnal B. Ini adalah sinyal kemalasan di mata Editor.

### Rekomendasi Alur Pemilihan Jurnal
1.  Buat daftar berisi **3-5 kandidat jurnal** sejak awal penulisan draf.
2.  Bandingkan kecocokan naskah Anda dengan artikel-artikel yang diterbitkan jurnal target dalam **1-2 tahun terakhir**.
3.  Periksa apakah jurnal tersebut mengenakan biaya publikasi (APC) atau sepenuhnya gratis (subsidi/non-APC).`,
  },
  {
    slug: "interview-reviewer-comments",
    editorsPick: true,
    editorNote: "Cara membaca komentar reviewer tanpa kehilangan semangat menulis.",
    title: "Wawancara: Membaca Reviewer Comments Tanpa Patah Semangat",
    excerpt:
      "Dr. Ade Putranto — reviewer aktif di 4 jurnal Q1 — berbagi cara membaca komentar reviewer sebagai data, bukan serangan personal.",
    category: "interview",
    categoryLabel: "Interview",
    cover: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&q=80&auto=format&fit=crop",
    author: "Dr. Ade Putranto",
    authorInitials: "AP",
    readTime: "8 min",
    date: "2025-04",
    content: `## Mengelola Kritik Akademik: Wawancara Eksklusif dengan Dr. Ade Putranto
    
Mendapatkan surel balasan dari editor dengan status *"Major Revision"* seringkali memicu kecemasan hebat bagi sebagian besar akademisi. Bagaimana cara menyikapi komentar reviewer yang terkadang terasa pedas dan menjatuhkan? Kami mengundang Dr. Ade Putranto untuk membagikan sudut pandang praktisnya dari kursi reviewer.

### Bagaimana Reviewer Memandang Naskah yang Mereka Ulas?
**T: Selamat siang Dr. Ade. Mengapa komentar reviewer kadang terasa sangat menuntut dan dingin?**
*J: Selamat siang. Kita perlu memahami satu hal: Reviewer melakukan ini secara sukarela tanpa dibayar di sela-sela kesibukan mengajar dan meneliti. Saat mereka menulis komentar kritis, mereka sebenarnya sedang menginvestasikan waktu mereka untuk memperkuat kualitas tulisan Anda. Mereka tidak membenci Anda; mereka hanya peduli pada integritas sains.*

### Mengubah Kritik Menjadi Langkah Aksi
**T: Banyak dosen pemula merasa putus asa saat membaca daftar revisi yang mencapai belasan halaman. Apa tips pertamanya?**
*J: Jangan dibaca semuanya sekaligus dalam satu waktu. Baca sekali untuk mendapatkan gambaran umum, lalu tutup dokumen tersebut. Biarkan emosi Anda mereda selama 1-2 hari. Setelah tenang, buka kembali dokumen tersebut dan ubah setiap kritik menjadi daftar aksi (to-do list).*

### Contoh Menanggapi Reviewer dengan Elegan
Berikut adalah tabel perbandingan cara merespons komentar kritis reviewer:

| Komentar Reviewer | Respons yang Salah | Respons yang Elegan (Disarankan) |
| :--- | :--- | :--- |
| "Metodologi penelitian ini sangat membingungkan dan kurang detail." | "Kami sudah menulisnya dengan jelas di bab 3." | "Kami menerima masukan berharga dari Reviewer. Kami telah menulis ulang sub-bab 3.2 untuk memperjelas alur eksperimen..." |
| "Analisis statistik kurang tepat, uji ANOVA tidak cocok." | "Kami memilih ANOVA karena paling mudah digunakan." | "Kami setuju dengan saran kritis Reviewer. Kami telah mengganti pengujian menggunakan uji non-parametrik Kruskal-Wallis..." |

> "Kunci utama lolos dari meja revisi adalah sikap kooperatif. Jangan berdebat tanpa menyertakan argumen ilmiah dan rujukan artikel terpercaya." — Dr. Ade Putranto`,
  },
  {
    slug: "publikasi-internasional-dosen-pemula",
    title: "Mengapa Publikasi Internasional Penting Bagi Dosen Pemula",
    excerpt:
      "Argumen panjang tentang kapital akademik, transferabilitas reputasi lintas batas, dan kenapa publikasi internasional adalah pintu, bukan piala.",
    category: "essay",
    categoryLabel: "Esai",
    cover: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=900&q=80&auto=format&fit=crop",
    author: "Dr. Lina Kartika",
    authorInitials: "LK",
    readTime: "12 min",
    date: "2025-03",
    content: `## Membangun Reputasi Akademik Global Sejak Dini
    
Bagi dosen pemula di Indonesia, tuntutan untuk mempublikasikan penelitian di tingkat internasional seringkali dirasa sebagai beban administrasi semata, seperti pengisian Beban Kerja Dosen (BKD) atau sekadar prasyarat naik jabatan. Namun, esai ini mencoba mengulas perspektif yang lebih luas: mengapa publikasi internasional bereputasi merupakan instrumen terkuat untuk membangun integritas ilmiah jangka panjang.

### 1. Kapital Akademik dan Kredibilitas Lintas Batas
Publikasi ilmiah bukan sekadar piala di atas rak lemari buku Anda. Ini adalah medium komunikasi ilmiah global. Ketika tulisan Anda diterbitkan di jurnal terindeks Scopus atau Web of Science, karya Anda diakui oleh komunitas ilmuwan sejenis di seluruh dunia.
*   **Jangkauan Luas**: Naskah Anda dibaca dan disitasi oleh ilmuwan dari negara lain, memperluas dampak riset lokal Anda ke level global.
*   **Koneksi Riset**: Menjadi titik masuk utama untuk diajak berkolaborasi dalam proyek penelitian hibah internasional (*international research grants*).

### 2. Belajar Menerima Standardisasi Kualitas yang Ketat
Proses penulisan hingga review di level internasional melatih kedisiplinan intelektual kita.
*   Kita belajar menyusun hipotesis yang kokoh.
*   Kita dipaksa menyajikan metodologi yang transparan dan bebas bias.
*   Kita belajar bersikap rendah hati menerima koreksi dari rekan sejawat (*peer reviewer*).

### Kesimpulan: Mengubah Mindset
Publikasi ilmiah adalah gerbang pembuka peluang kolaborasi global, bukan sekadar penutup kewajiban administratif universitas. Mari mulai menulis dengan niat berkontribusi pada pengetahuan dunia.`,
  },
  {
    slug: "imrad-disiplin-reviewer",
    title: "Struktur IMRaD: Mengapa Reviewer Menyukai Naskah yang Disiplin",
    excerpt:
      "IMRaD bukan kerangka kaku — IMRaD adalah perjanjian baca antara penulis dan reviewer. Panduan praktis menyusun naskah dengan ritme yang familiar.",
    category: "guide",
    categoryLabel: "Panduan",
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=900&q=80&auto=format&fit=crop",
    author: "Dr. Bayu Setiawan",
    authorInitials: "BS",
    readTime: "6 min",
    date: "2025-03",
    content: `## Mengenal Alur Logika IMRaD (Introduction, Methods, Results, and Discussion)
    
Struktur IMRaD adalah standar universal penulisan jurnal ilmiah global. Banyak penulis merasa kerangka ini terlalu membatasi kreativitas. Padahal, bagi para reviewer dan editor yang membaca puluhan naskah setiap hari, struktur IMRaD adalah sebuah kenyamanan logis yang mempercepat pemahaman kontribusi ilmiah Anda.

### Pembagian Struktur IMRaD yang Efektif:

#### 1. Introduction (Pendahuluan)
*   **Tujuan**: Mengapa penelitian ini penting?
*   **Formula**: Mulai dari gambaran umum industri/bidang -> ulas penelitian terdahulu -> tunjukkan *gap* riset -> rumuskan tujuan penelitian spesifik Anda di akhir sub-bab.

#### 2. Methods (Metode)
*   **Tujuan**: Bagaimana penelitian ini dilakukan?
*   **Formula**: Harus ditulis dengan tingkat detail sedemikian rupa agar peneliti lain di dunia bisa meniru persis penelitian Anda (reproduksibilitas).

#### 3. Results (Hasil)
*   **Tujuan**: Apa temuan yang diperoleh dari eksperimen/survei?
*   **Formula**: Sajikan data dalam bentuk grafik atau tabel yang informatif. Hindari menulis ulasan interpretatif yang mendalam pada bagian ini — fokuslah menyajikan fakta data.

#### 4. Discussion (Diskusi)
*   **Tujuan**: Apa arti dari temuan tersebut bagi keilmuan saat ini?
*   **Formula**: Hubungkan hasil penelitian Anda dengan teori yang ada dan ulas keterbatasan riset secara jujur.`,
  },
  {
    slug: "case-reject-q3-accept-q2",
    editorsPick: true,
    editorNote: "Satu naskah, tiga kali submit: pelajaran memilih jurnal setelah ditolak.",
    title: "Dari Reject di Q3 ke Accept di Q2: Satu Naskah, Tiga Submission",
    excerpt:
      "Kronologi sembilan bulan satu naskah peserta cohort #04 — dari pertama kali di-desk-reject hingga akhirnya diterima di Q2 dengan strategi pemilihan jurnal yang berbeda.",
    category: "case",
    categoryLabel: "Studi Kasus",
    cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=900&q=80&auto=format&fit=crop",
    author: "Fajar Ramadhan",
    authorInitials: "FR",
    readTime: "15 min",
    date: "2025-02",
    content: `## Perjalanan Panjang Satu Naskah Menuju Publikasi
    
Ini adalah kisah naskah salah satu alumni CoPublika Cohort #04, Pak Fajar (dosen Universitas Diponegoro). Naskahnya berkali-kali ditolak di kuartil rendah (Q3), namun berkat ketekunan merevisi dan mengubah arah target ke jurnal Q2, naskah tersebut akhirnya sukses dipublikasikan.

### Garis Waktu Perjalanan Naskah:

*   **Bulan ke-1**: Mengirimkan naskah pertama kali ke Jurnal A (Q3). Hasil: *Desk Reject* dalam waktu 3 hari karena format sitasi tidak sesuai format spesifik mereka.
*   **Bulan ke-3**: Setelah revisi menyeluruh, naskah dikirim ke Jurnal B (Q3). Hasil: Penolakan setelah 2 bulan proses review dengan komentar reviewer yang sangat skeptis pada kualitas visual data.
*   **Bulan ke-5**: Masuk ke pendampingan khusus CoPublika. Mengubah penyajian metodologi riset, merapikan data statistik, dan mendesain ulang grafik menggunakan visualisasi modern.
*   **Bulan ke-7**: Memutuskan melompat langsung ke Jurnal C (Q2) yang memiliki cakupan yang lebih pas dengan kontribusi teoritis naskah. Hasil: *Major Revision* diminta oleh editor.
*   **Bulan ke-9**: Mengirimkan perbaikan naskah secara kooperatif. Hasil: **Accepted** dan resmi dipublikasikan secara online.

> "Ditolak bukan berarti penelitian Anda buruk. Kadang itu hanya masalah ketidakcocokan sudut pandang pembaca, atau cara penyajian visual data Anda yang kurang meyakinkan." — Fajar Ramadhan`,
  },
  {
    slug: "abstract-yang-membuat-reviewer-membuka",
    editorsPick: true,
    editorNote: "Empat kalimat abstrak yang menentukan naskah Anda dibaca atau dilewati.",
    title: "Cara Menulis Abstract yang Membuat Reviewer Membuka Naskah Anda",
    excerpt:
      "Abstract adalah pintu — bukan ringkasan. Pola 4 kalimat sederhana yang membuat editor melanjutkan membaca naskah anda, lengkap dengan contoh sebelum/sesudah.",
    category: "guide",
    categoryLabel: "Panduan",
    cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=900&q=80&auto=format&fit=crop",
    author: "Dr. Maya Rahmawati",
    authorInitials: "MR",
    readTime: "9 min",
    date: "2025-02",
    content: `## Menulis Abstrak Jurnal Internasional yang Memikat
    
Abstrak adalah hal pertama yang dibaca oleh Editor jurnal saat naskah Anda mendarat di sistem submission mereka. Hanya dalam 150-250 kata, Anda harus meyakinkan editor bahwa penelitian Anda layak masuk ke tahap peer-review.

### Formula 4 Kalimat Emas untuk Abstrak:

1.  **Kalimat Latar Belakang & Masalah**: Apa urgensi utama penelitian ini dilakukan?
2.  **Kalimat Metode**: Metode spesifik apa yang Anda gunakan untuk menjawab masalah tersebut?
3.  **Kalimat Hasil Temuan Utama**: Apa temuan terpenting (bukan semua temuan) yang diperoleh?
4.  **Kalimat Implikasi & Kontribusi**: Apa dampak temuan ini bagi perkembangan keilmuan atau kebijakan masa depan?

#### Contoh Sebelum & Sesudah Revisi Abstrak:
*   **Sebelum**: *"Penelitian ini bertujuan untuk meneliti kepuasan mahasiswa selama pembelajaran jarak jauh di masa pandemi. Kuesioner disebar ke 100 orang. Hasil menunjukkan mahasiswa puas dengan pembelajaran online."* (Terlalu pendek, pasif, dan tidak ada nilai keterbaruan ilmiah).
*   **Sesudah**: *"Meskipun pembelajaran jarak jauh (PJJ) telah diadopsi secara luas di Indonesia, pengaruh asimetris beban kognitif terhadap kepuasan belajar mandiri mahasiswa masih jarang dikaji. Penelitian ini menggunakan pemodelan persamaan struktural (SEM) untuk menganalisis 120 mahasiswa..."*`,
  },
  {
    slug: "kolaborasi-5-universitas-baru",
    title: "CoPublika Berkolaborasi dengan 5 Universitas Baru untuk Beasiswa Cohort 2025",
    excerpt:
      "Pengumuman kemitraan baru dengan UNY, UB, ITS, UNAIR, dan UI untuk menyediakan beasiswa cohort 2025 bagi 50 akademisi pemula terpilih.",
    category: "news",
    categoryLabel: "Berita",
    cover: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=900&q=80&auto=format&fit=crop",
    author: "CoPublika Team",
    authorInitials: "CP",
    readTime: "3 min",
    date: "2025-01",
    content: `## Siaran Pers Kemitraan Strategis Beasiswa CoPublika Cohort 2025
    
CoPublika resmi mengumumkan kolaborasi baru dengan lima perguruan tinggi negeri terkemuka di Indonesia: Universitas Negeri Yogyakarta (UNY), Universitas Brawijaya (UB), Institut Teknologi Sepuluh Nopember (ITS), Universitas Airlangga (UNAIR), dan Universitas Indonesia (UI). Kemitraan ini bertujuan menyalurkan program beasiswa mentoring publikasi ilmiah bagi 50 dosen pemula terpilih dari masing-masing kampus tersebut.

### Program Intensif Selama 6 Bulan
Penerima beasiswa akan didampingi secara komprehensif mulai dari pemetaan data penelitian, penyusunan naskah berstandar internasional, simulasi pengajuan review jurnal, hingga pendampingan merespons komentar kritis reviewer jurnal Q1/Q2 terindeks Scopus.`,
  },
  {
    slug: "slow-scholarship",
    editorsPick: true,
    editorNote: "Pengingat bahwa riset yang baik butuh ritme, bukan sekadar kecepatan.",
    title: "Slow Scholarship: Mengapa Lambat Itu Tidak Apa-Apa",
    excerpt:
      "Esai panjang tentang etos kerja akademik, ritme yang berkelanjutan, dan kenapa kuantitas publikasi tidak selalu berbanding lurus dengan dampak.",
    category: "essay",
    categoryLabel: "Esai",
    cover: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=900&q=80&auto=format&fit=crop",
    author: "Dr. Dewi Nirmala",
    authorInitials: "DN",
    readTime: "10 min",
    date: "2025-01",
    content: `## Melawan Budaya Akademik Serba Cepat dan Instan
    
Di tengah masifnya tuntutan publikasi cepat demi kuantitas, muncul gerakan global yang disebut *"Slow Scholarship"*. Gerakan ini mengajak para akademisi untuk mendefinisikan ulang makna keberhasilan penelitian. Keberhasilan riset tidak semestinya dihitung semata dari jumlah naskah yang terbit setiap tahunnya, melainkan dari kedalaman kontribusi, ketahanan metodologis, dan manfaat nyata bagi peradaban.

### Mengapa Lambat Justru Menghasilkan Kualitas?
*   **Waktu untuk Refleksi**: Menghindari kesimpulan prematur akibat pengolahan data yang terburu-buru.
*   **Membangun Fondasi Kokoh**: Melakukan pengujian ulang instrumen secara teliti untuk meminimalisasi bias metodologi.
*   **Kesehatan Mental Akademik**: Mengurangi stres akademik yang berujung pada kasus pemalsuan data (*data fabrication*).`,
  },
  {
    slug: "ai-asisten-riset-etika",
    title: "Menggunakan AI sebagai Asisten Riset — Tanpa Melanggar Etika Akademik",
    excerpt:
      "Garis tipis antara AI sebagai asisten produktif dan AI sebagai pelanggar integritas. Panduan praktis penggunaan AI dalam siklus riset.",
    category: "guide",
    categoryLabel: "Panduan",
    cover: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=900&q=80&auto=format&fit=crop",
    author: "Fajar Ramadhan",
    authorInitials: "FR",
    readTime: "7 min",
    date: "2024-12",
    content: `## Menjaga Integritas Akademik di Era Artificial Intelligence
    
Kehadiran Large Language Models (LLM) seperti ChatGPT, Claude, dan Gemini menawarkan efisiensi tinggi bagi para akademisi dalam proses riset. Namun, di mana batas etis penggunaannya agar naskah Anda tidak dikategorikan sebagai plagiarisme atau *artificial fabrication*?

### Hal yang Diizinkan (Etis):
*   Membantu merapikan struktur tata bahasa Inggris agar lebih mengalir (*proofreading*).
*   Membantu merangkum poin penting dari draf yang Anda tulis sendiri untuk abstrak.
*   Mencari inspirasi padanan kosakata formal akademik.

### Hal yang Dilarang Keras (Tidak Etis):
*   Menyalin teks hasil generate AI mentah-mentah ke dalam bagian pembahasan atau hasil analisis.
*   Membuat referensi palsu yang di-generate oleh AI (*hallucination*).
*   Memasukkan data mentah responden tanpa persetujuan komite etika ke dalam sistem AI publik.`,
  },
  {
    slug: "interview-co-author-internasional",
    title: "Kolaborasi Internasional: Mencari Co-Author yang Sefrekuensi",
    excerpt:
      "Dr. Lina Kartika berbagi pengalaman membangun jaringan co-author lintas negara — dari kenalan di konferensi hingga submission bersama.",
    category: "interview",
    categoryLabel: "Interview",
    cover: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80&auto=format&fit=crop",
    author: "Dr. Lina Kartika",
    authorInitials: "LK",
    readTime: "6 min",
    date: "2024-12",
    content: `## Membangun Kolaborasi Lintas Batas Negara
    
Bekerja sama dengan peneliti dari luar negeri adalah salah satu cara tercepat meningkatkan reputasi publikasi ilmiah Anda. Namun, bagaimana cara memulainya secara organik tanpa terkesan memaksa? Kami mengulas strategi praktis bersama Dr. Lina Kartika yang berpengalaman mempublikasikan belasan artikel riset kolaborasi internasional.

### Kunci Sukses Kolaborasi:
1.  **Fokus pada Keahlian Komplementer**: Cari mitra peneliti yang memiliki metodologi yang tidak Anda kuasai (misalnya, Anda ahli pengumpulan data empiris lapangan, mereka ahli pemodelan komputasi).
2.  **Manfaatkan Konferensi Ilmiah**: Jangan hanya datang untuk mempresentasikan paper Anda lalu pulang. Gunakan sesi kopi untuk berdiskusi dengan santai mengenai potensi data sharing.`,
  },
  {
    slug: "case-beasiswa-s3-luar-negeri",
    title: "Studi Kasus: Beasiswa S3 Luar Negeri — Sharing Alumni LPDP & Chevening",
    excerpt:
      "4 alumni CoPublika berbagi perjalanan mereka dari publikasi pertama hingga lolos beasiswa S3. Persiapan, timeline, dan kerangka strategis.",
    category: "case",
    categoryLabel: "Studi Kasus",
    cover: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=900&q=80&auto=format&fit=crop",
    author: "Dr. Hadi Suryanto",
    authorInitials: "HS",
    readTime: "11 min",
    date: "2024-11",
    content: `## Dari Publikasi Jurnal ke Lolos Beasiswa S3 Global
    
Empat alumni program intensif CoPublika membagikan pengalaman mereka menggunakan portofolio artikel Scopus mereka sebagai bekal utama menembus beasiswa S3 bergengsi seperti LPDP, Chevening, dan Fulbright.

### Poin-Poin Strategis yang Membantu Mereka Lolos:
*   **Drafting Proposal Riset S3 Terarah**: Proposal riset mereka tidak lagi mengambang karena sudah teruji melalui tulisan jurnal sebelumnya.
*   **Membuktikan Kemandirian Akademik**: Portofolio tulisan membuktikan kepada komite wawancara bahwa mereka siap melakukan riset mandiri tingkat lanjut di luar negeri.`,
  },
  {
    slug: "cover-letter-editor-persona",
    editorsPick: true,
    editorNote: "Menulis cover letter untuk editor yang sibuk, lengkap dengan contoh.",
    title: "Strategi Penulisan Cover Letter Berbasis Editor Persona",
    excerpt:
      "Cover letter yang baik bukan formalitas — itu hadiah untuk editor. Pendekatan persona-based untuk menulis cover letter yang dibaca penuh.",
    category: "guide",
    categoryLabel: "Panduan",
    cover: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&q=80&auto=format&fit=crop",
    author: "Dr. Hadi Suryanto",
    authorInitials: "HS",
    readTime: "8 min",
    date: "2024-11",
    content: `## Menulis Cover Letter Jurnal yang Profesional
    
*Cover Letter* seringkali diabaikan oleh penulis pemula dan diisi sekadar template formalitas saja. Padahal, surat pengantar ini adalah sarana komunikasi personal langsung Anda dengan Editor Jurnal untuk menjelaskan kontribusi riset Anda secara kasual namun meyakinkan.

### Panduan Menulis Cover Letter:
*   **Sapa Editor dengan Nama**: Lakukan riset kecil di jajaran Editorial Board jurnal target Anda.
*   **Jelaskan Kebaruan (Novelty) Secara Singkat**: Jangan mengulang abstrak di surat pengantar. Jelaskan mengapa komunitas pembaca mereka membutuhkan artikel Anda sekarang.
*   **Pernyataan Etika**: Nyatakan bahwa naskah Anda asli, belum pernah diterbitkan di mana pun, dan tidak melanggar kode etik riset mana pun.`,
  },
  {
    slug: "essay-bekerja-saat-revisi-berat",
    title: "Esai: Bertahan di Tahap Revisi yang Terasa Berat",
    excerpt:
      "Refleksi panjang tentang fase paling rapuh dalam proses publikasi — saat reviewer komentar pedas dan motivasi mulai retak. Bagaimana cara bertahan.",
    category: "essay",
    categoryLabel: "Esai",
    cover: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=900&q=80&auto=format&fit=crop",
    author: "Dr. Dewi Nirmala",
    authorInitials: "DN",
    readTime: "9 min",
    date: "2024-10",
    content: `## Ketahanan Mental Menghadapi Kritik Akademik
    
Proses peer review seringkali melelahkan secara emosional. Setelah berbulan-bulan menunggu, Anda menerima surat revisi dengan puluhan catatan perbaikan yang seolah mementahkan seluruh kerja keras Anda. Esai reflektif ini mengulas pentingnya menjaga kesehatan mental akademisi selama fase kritis revisi jurnal internasional.

### Tips Menghadapi Revisi Berat:
1.  **Dekomposisi Masalah**: Pisahkan antara perbaikan teknis penulisan, penambahan analisis data, dan penyesuaian interpretasi.
2.  **Gunakan Sudut Pandang Positif**: Pahami bahwa perbaikan naskah akan membuat kualitas sitasi Anda di masa depan jauh lebih kuat.`,
  },
  {
    slug: "news-batch-07-resmi-dibuka",
    title: "Cohort #07 Resmi Dibuka — 24 Kursi untuk Bootcamp Siap Tembus Scopus",
    excerpt:
      "Pendaftaran Cohort #07 program Siap Tembus Scopus telah dibuka. 24 kursi tersedia, format hybrid (online + 2x luring di Yogyakarta).",
    category: "news",
    categoryLabel: "Berita",
    cover: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=900&q=80&auto=format&fit=crop",
    author: "CoPublika Team",
    authorInitials: "CP",
    readTime: "3 min",
    date: "2024-10",
    content: `## Pendaftaran Terbuka Cohort #07 CoPublika
    
Kami dengan gembira mengumumkan pembukaan kelas pendampingan intensif Cohort #07 untuk program unggulan *"Siap Tembus Scopus"*. Program bootcamp ini dirancang khusus untuk mendampingi para akademisi, dosen, dan peneliti di Indonesia menyelesaikan draf artikel riset siap submit ke jurnal internasional terindeks.

### Detail Program:
*   **Kapasitas**: Dibatasi hanya untuk 24 peserta demi menjaga kualitas mentoring intim.
*   **Format**: Hybrid (mentoring online setiap akhir pekan + 2 kali pertemuan luring intensif di Yogyakarta).
*   **Pendaftaran**: Dibuka hingga akhir bulan ini atau sampai kuota kursi terpenuhi.`,
  },
  {
    slug: "case-naskah-pertama-dosen-baru",
    title: "Studi Kasus: Naskah Pertama Dosen Baru — Dari Tesis ke Q3",
    excerpt:
      "Bagaimana mengubah bab tesis menjadi naskah jurnal yang publication-ready. Langkah by langkah dari seorang dosen UNS yang baru lulus S2.",
    category: "case",
    categoryLabel: "Studi Kasus",
    cover: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=900&q=80&auto=format&fit=crop",
    author: "Rini Puspita",
    authorInitials: "RP",
    readTime: "13 min",
    date: "2024-09",
    content: `## Studi Kasus Sukses: Publikasi Perdana Dosen Baru UNS
    
Mengubah tesis magister yang tebal (berisi puluhan ribu kata) menjadi naskah jurnal ringkas yang hanya berkisar 6000 kata adalah tantangan terbesar bagi dosen pemula. Kasus nyata ini mengulas bagaimana Bu Rini, dosen baru di Universitas Sebelas Maret (UNS), berhasil memadatkan dan mempublikasikan bagian penting tesisnya di jurnal Scopus Q3.

### Alur Kerja Ringkasan Naskah:
*   **Fokus pada Satu Novelty Utama**: Tesis sering memiliki banyak hipotesis. Kami memilih satu hipotesis yang paling menarik dan mendalam untuk dijadikan fokus utama artikel jurnal.
*   **Pembaruan Literatur**: Menambahkan pustaka-pustaka internasional termutakhir dari 2 tahun terakhir untuk menggantikan rujukan teoretis tesis yang sudah berumur.`,
  },
  {
    slug: "interview-editor-tenured",
    title: "Interview: Apa yang Editor Lihat di 60 Detik Pertama",
    excerpt:
      "Wawancara editor tenured: bagaimana mereka memutuskan desk-reject vs send to review dalam waktu kurang dari satu menit. Pola yang sering muncul.",
    category: "interview",
    categoryLabel: "Interview",
    cover: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&q=80&auto=format&fit=crop",
    author: "Dr. Bayu Setiawan",
    authorInitials: "BS",
    readTime: "10 min",
    date: "2024-09",
    content: `## Mengungkap Di Balik Layar Keputusan Editor Jurnal
    
Bagaimana editor jurnal memutuskan nasib naskah Anda hanya dalam waktu satu menit pertama? Wawancara eksklusif kami dengan Dr. Bayu Setiawan mengungkap hal-hal krusial apa saja yang diperiksa editor saat pertama kali membuka file submission Anda.

### Tiga Hal Pertama yang Diperiksa Editor:
1.  **Kesesuaian dengan Scope Jurnal**: Apakah topik ini relevan dengan pembaca kami?
2.  **Format dan Kelengkapan Berkas**: Apakah penulis mematuhi panduan dasar jurnal?
3.  **Kualitas Abstrak dan Judul**: Apakah abstrak menyajikan kebaruan riset secara jelas dan padat?

> "Jika dalam satu menit pertama editor kesulitan menemukan letak kontribusi baru dari penelitian Anda, kemungkinan besar naskah Anda akan mendapat status desk-reject." — Dr. Bayu Setiawan`,
  },
];

export function getFeaturedArticle(): BlogArticle {
  return BLOG_ARTICLES.find((a) => a.featured) ?? BLOG_ARTICLES[0];
}

export function getNonFeaturedArticles(): BlogArticle[] {
  const featured = getFeaturedArticle();
  return BLOG_ARTICLES.filter((a) => a.slug !== featured.slug);
}

export function countByCategory(cat: BlogCategory | "all"): number {
  if (cat === "all") return BLOG_ARTICLES.length;
  return BLOG_ARTICLES.filter((a) => a.category === cat).length;
}
