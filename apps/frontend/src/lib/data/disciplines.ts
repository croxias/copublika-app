// Fields of study for member profiles, split into STEM and Non-STEM and grouped by rumpun ilmu.
// Based on the Dikti study-program names (Permendikbud 154/2014 and its program-name list: agama,
// humaniora, sosial, alam, formal, terapan) and the STEM / SHARE split LPDP uses. Agriculture,
// health, architecture and computing count as STEM; arts and design, education, economics,
// law and religion count as Non-STEM. "other" lets a member type a field that is not listed.
// Each field may carry search aliases (abbreviations, English names, related programs).

export type Stream = "stem" | "nonstem";

export const STREAMS: Record<Stream, { label: string; hint: string }> = {
  stem: { label: "STEM", hint: "Sains, teknologi, teknik, matematika, pertanian, dan kesehatan" },
  nonstem: { label: "Non-STEM", hint: "Sosial, humaniora, seni & desain, pendidikan, ekonomi, hukum, dan agama" },
};

type Field = { label: string; keys?: string };
export type FieldGroup = { group: string; fields: Field[] };

const f = (label: string, keys?: string): Field => ({ label, keys });

export const FIELD_GROUPS: Record<Stream, FieldGroup[]> = {
  stem: [
    {
      group: "Matematika & Ilmu Alam",
      fields: [
        f("Matematika", "math mathematics matematika terapan"),
        f("Statistika", "statistics statistik"),
        f("Aktuaria", "actuarial asuransi"),
        f("Fisika", "physics fisika medis"),
        f("Kimia", "chemistry kimia terapan analisis kimia"),
        f("Biologi", "biology hayati"),
        f("Biokimia", "biochemistry"),
        f("Mikrobiologi", "microbiology"),
        f("Bioteknologi", "biotechnology rekayasa hayati"),
        f("Astronomi", "astronomy"),
        f("Geofisika", "geophysics"),
        f("Meteorologi & Klimatologi", "meteorology climatology cuaca iklim bmkg"),
        f("Oseanografi & Ilmu Kelautan", "oceanography marine science kelautan laut"),
        f("Ilmu Lingkungan", "environmental science lingkungan hidup"),
        f("Ilmu Material", "materials science bahan sains bahan"),
      ],
    },
    {
      group: "Komputer & Teknologi Informasi",
      fields: [
        f("Ilmu Komputer / Informatika", "computer science informatika it ti teknik informatika"),
        f("Sistem Informasi", "information systems si"),
        f("Teknologi Informasi", "information technology it"),
        f("Rekayasa Perangkat Lunak", "software engineering rpl programming"),
        f("Sains Data", "data science big data analitik"),
        f("Kecerdasan Artifisial", "artificial intelligence ai machine learning kecerdasan buatan"),
        f("Keamanan Siber", "cyber security keamanan informasi"),
        f("Teknik Komputer", "computer engineering sistem komputer"),
      ],
    },
    {
      group: "Teknik & Rekayasa",
      fields: [
        f("Teknik Sipil", "civil engineering konstruksi bangunan jalan jembatan"),
        f("Arsitektur", "architecture"),
        f("Arsitektur Lanskap", "landscape architecture pertamanan"),
        f("Perencanaan Wilayah & Kota", "urban regional planning pwk planologi tata kota"),
        f("Teknik Mesin", "mechanical engineering otomotif"),
        f("Teknik Elektro", "electrical engineering listrik elektronika tenaga listrik"),
        f("Teknik Telekomunikasi", "telecommunication"),
        f("Teknik Fisika", "engineering physics instrumentasi"),
        f("Teknik Industri", "industrial engineering manajemen industri"),
        f("Teknik Kimia", "chemical engineering"),
        f("Teknik Lingkungan", "environmental engineering sanitasi"),
        f("Teknik Geologi", "geological engineering geologi"),
        f("Teknik Geodesi & Geomatika", "geodesy geomatics survei pemetaan penginderaan jauh gis"),
        f("Teknik Pertambangan", "mining engineering tambang"),
        f("Teknik Perminyakan", "petroleum engineering migas minyak gas"),
        f("Teknik Metalurgi & Material", "metallurgy materials engineering"),
        f("Teknik Mekatronika & Otomasi", "mechatronics robotics robotika kontrol"),
        f("Teknik Biomedis", "biomedical engineering elektromedis"),
        f("Teknik Dirgantara", "aerospace aeronautics penerbangan avionik"),
        f("Teknik Perkapalan & Kelautan", "naval ocean engineering kapal"),
        f("Teknik Nuklir", "nuclear engineering"),
        f("Teknik Energi Terbarukan", "renewable energy panas bumi geotermal"),
        f("Teknik Tekstil", "textile engineering"),
      ],
    },
    {
      group: "Pertanian, Peternakan, Perikanan & Kehutanan",
      fields: [
        f("Agroteknologi / Agroekoteknologi", "agriculture agrikultur pertanian agricultural"),
        f("Agronomi & Hortikultura", "agronomy horticulture tanaman budidaya"),
        f("Ilmu Tanah", "soil science"),
        f("Proteksi Tanaman", "plant protection hama penyakit tanaman fitopatologi"),
        f("Pemuliaan Tanaman & Teknologi Benih", "plant breeding seed"),
        f("Agribisnis", "agribusiness sosial ekonomi pertanian ekonomi pertanian agriculture"),
        f("Penyuluhan Pertanian", "agricultural extension"),
        f("Teknik Pertanian & Biosistem", "agricultural engineering biosystem mekanisasi"),
        f("Teknologi Pangan", "food technology food science ilmu pangan"),
        f("Teknologi Hasil Pertanian", "agricultural product technology pasca panen"),
        f("Teknologi Industri Pertanian", "agroindustry agroindustri"),
        f("Peternakan", "animal science husbandry ternak nutrisi pakan"),
        f("Perikanan & Akuakultur", "fisheries aquaculture budidaya ikan perikanan tangkap"),
        f("Teknologi Hasil Perikanan", "fish product technology"),
        f("Kehutanan", "forestry hutan silvikultur hasil hutan"),
        f("Kedokteran Hewan", "veterinary medicine dokter hewan veteriner"),
      ],
    },
    {
      group: "Kedokteran & Ilmu Kesehatan",
      fields: [
        f("Kedokteran", "medicine medical dokter pendidikan dokter fk"),
        f("Kedokteran Spesialis", "spesialis bedah penyakit dalam anak obgyn saraf jantung radiologi anestesi psikiatri"),
        f("Kedokteran Gigi", "dentistry dokter gigi"),
        f("Ilmu Biomedis", "biomedical sciences imunologi"),
        f("Farmasi", "pharmacy apoteker"),
        f("Keperawatan", "nursing ners perawat"),
        f("Kebidanan", "midwifery bidan"),
        f("Kesehatan Masyarakat", "public health kesmas epidemiologi promosi kesehatan"),
        f("Gizi", "nutrition ilmu gizi dietetika"),
        f("Kesehatan Lingkungan", "environmental health"),
        f("Keselamatan & Kesehatan Kerja (K3)", "occupational health safety k3"),
        f("Fisioterapi", "physiotherapy rehabilitasi"),
        f("Teknologi Laboratorium Medis", "medical laboratory analis kesehatan"),
        f("Radiologi & Pencitraan Medis", "radiology radiografi"),
        f("Rekam Medis & Informasi Kesehatan", "medical record health information"),
        f("Administrasi Rumah Sakit", "hospital administration manajemen rumah sakit"),
        f("Optometri", "optometry refraksi"),
        f("Ilmu Keolahragaan", "sport science olahraga"),
        f("Pengobatan Tradisional", "traditional medicine akupuntur jamu herbal"),
      ],
    },
  ],
  nonstem: [
    {
      group: "Seni & Desain",
      fields: [
        f("Desain Komunikasi Visual (DKV)", "dkv visual communication design desain grafis graphic branding"),
        f("Desain Interior", "interior design"),
        f("Desain Produk", "product design desain industri"),
        f("Desain Mode / Fesyen", "fashion design busana tata busana"),
        f("Desain Tekstil", "textile design batik"),
        f("Seni Rupa", "fine arts seni murni seni lukis patung visual arts"),
        f("Kriya", "craft kriya keramik logam kayu"),
        f("Film & Televisi", "film tv sinematografi broadcasting"),
        f("Fotografi", "photography"),
        f("Animasi", "animation multimedia"),
        f("Musik", "music"),
        f("Tari", "dance"),
        f("Seni Teater & Pertunjukan", "theatre performing arts pedalangan"),
        f("Karawitan & Etnomusikologi", "ethnomusicology musik tradisional nusantara"),
        f("Kajian Seni & Budaya", "art studies"),
      ],
    },
    {
      group: "Humaniora & Bahasa",
      fields: [
        f("Bahasa & Sastra Indonesia", "indonesian literature"),
        f("Bahasa & Sastra Inggris", "english literature english"),
        f("Bahasa & Sastra Asia", "jepang korea mandarin tiongkok arab japanese korean chinese arabic"),
        f("Bahasa & Sastra Eropa", "prancis jerman belanda rusia french german dutch russian"),
        f("Sastra Daerah", "jawa sunda bali batak minangkabau melayu"),
        f("Linguistik", "linguistics bahasa terapan"),
        f("Sejarah", "history"),
        f("Filsafat", "philosophy"),
        f("Arkeologi", "archaeology"),
        f("Antropologi", "anthropology"),
        f("Kajian Budaya & Wilayah", "cultural area studies kajian amerika jepang eropa timur tengah"),
        f("Ilmu Perpustakaan & Informasi", "library information science kearsipan arsip"),
      ],
    },
    {
      group: "Ilmu Sosial & Politik",
      fields: [
        f("Ilmu Komunikasi", "communication komunikasi massa"),
        f("Jurnalistik & Penyiaran", "journalism broadcasting media penerbitan"),
        f("Hubungan Masyarakat", "public relations pr humas periklanan advertising"),
        f("Psikologi", "psychology psikolog klinis pendidikan"),
        f("Sosiologi", "sociology"),
        f("Ilmu Politik", "political science politik"),
        f("Hubungan Internasional", "international relations hi"),
        f("Ilmu Pemerintahan", "government studies"),
        f("Administrasi Publik", "public administration administrasi negara"),
        f("Kebijakan Publik", "public policy"),
        f("Kesejahteraan Sosial", "social welfare pekerjaan sosial"),
        f("Kriminologi", "criminology"),
        f("Geografi", "geography"),
        f("Kependudukan & Studi Pembangunan", "demography development studies"),
        f("Kajian Gender", "gender women studies perempuan"),
        f("Studi Pertahanan & Keamanan", "defense security pertahanan militer"),
        f("Ilmu Kepolisian", "police studies"),
      ],
    },
    {
      group: "Ekonomi & Bisnis",
      fields: [
        f("Ilmu Ekonomi / Ekonomi Pembangunan", "economics ekonomi"),
        f("Ekonomi Syariah", "islamic economics ekonomi islam keuangan syariah"),
        f("Manajemen", "management pemasaran marketing sdm"),
        f("Akuntansi", "accounting"),
        f("Keuangan & Perbankan", "finance banking"),
        f("Perpajakan", "taxation pajak"),
        f("Administrasi Bisnis", "business administration niaga"),
        f("Bisnis Digital", "digital business e-commerce"),
        f("Kewirausahaan", "entrepreneurship"),
        f("Logistik & Rantai Pasok", "logistics supply chain"),
        f("Pariwisata & Perhotelan", "tourism hospitality hotel"),
        f("Tata Boga & Kuliner", "culinary arts kuliner patiseri"),
      ],
    },
    {
      group: "Hukum",
      fields: [
        f("Ilmu Hukum", "law hukum pidana perdata tata negara"),
        f("Hukum Bisnis", "business law"),
        f("Hukum Keluarga Islam / Syariah", "islamic law ahwal syakhshiyyah"),
        f("Kenotariatan", "notary notaris"),
      ],
    },
    {
      group: "Pendidikan",
      fields: [
        f("Pendidikan Guru SD (PGSD)", "elementary education sekolah dasar"),
        f("Pendidikan Anak Usia Dini (PAUD)", "early childhood"),
        f("Bimbingan & Konseling", "counseling bk"),
        f("Pendidikan Bahasa Indonesia", "indonesian language education"),
        f("Pendidikan Bahasa Inggris", "english language education tefl"),
        f("Pendidikan Bahasa Asing", "arab jepang jerman prancis mandarin"),
        f("Pendidikan Matematika", "mathematics education"),
        f("Pendidikan IPA", "fisika kimia biologi science education"),
        f("Pendidikan IPS", "sejarah geografi ekonomi sosiologi social studies"),
        f("Pendidikan Pancasila & Kewarganegaraan", "civics ppkn pkn"),
        f("Pendidikan Jasmani & Olahraga", "physical education penjas pjkr kepelatihan"),
        f("Pendidikan Seni", "art education seni rupa musik tari"),
        f("Pendidikan Teknik & Vokasi", "vocational education ptk otomotif elektro informatika"),
        f("Pendidikan Khusus", "special education pendidikan luar biasa plb"),
        f("Teknologi Pendidikan", "educational technology"),
        f("Manajemen Pendidikan", "administrasi pendidikan education management"),
        f("Pendidikan Agama", "pai pendidikan agama islam kristen katolik hindu buddha"),
      ],
    },
    {
      group: "Ilmu Agama",
      fields: [
        f("Studi Islam", "islamic studies pemikiran islam"),
        f("Ilmu Al-Qur'an, Tafsir & Hadis", "quran tafsir hadis"),
        f("Komunikasi & Penyiaran Islam", "dakwah kpi"),
        f("Teologi Kristen & Katolik", "theology kristen katolik"),
        f("Studi Agama Hindu, Buddha & Khonghucu", "hindu buddha konghucu"),
        f("Studi Agama-Agama", "religious studies perbandingan agama"),
      ],
    },
  ],
};

/** Flat field labels per stream. */
export const FIELDS: Record<Stream, string[]> = {
  stem: FIELD_GROUPS.stem.flatMap((g) => g.fields.map((x) => x.label)),
  nonstem: FIELD_GROUPS.nonstem.flatMap((g) => g.fields.map((x) => x.label)),
};

export const OTHER_FIELD = "other";

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();

// Short words (AI, HI, K3) must start a word; longer ones may sit inside one (dokter → kedokteran).
const hasWord = (hay: string, w: string) => hay.includes(w.length <= 3 ? ` ${w}` : w);

export type FieldHit = { label: string; group: string };

/**
 * Fields matching a search, best first. Every word must appear in the label, aliases or group (see hasWord);
 * a label that starts with the query ranks above one that only contains it, which ranks above an
 * alias match, and shorter labels win ties (so "dokter" puts Kedokteran before Kedokteran Hewan).
 */
export function searchFields(stream: Stream, query: string): FieldHit[] {
  const q = norm(query);
  const words = q.split(" ").filter(Boolean);
  if (!words.length) return [];
  const hits: (FieldHit & { score: number })[] = [];
  for (const g of FIELD_GROUPS[stream]) {
    for (const x of g.fields) {
      const label = norm(x.label);
      const hay = ` ${label} ${norm(x.keys ?? "")} ${norm(g.group)}`;
      if (!words.every((w) => hasWord(hay, w))) continue;
      const own = ` ${label} ${norm(x.keys ?? "")}`;
      const score = label.startsWith(q) ? 0 : words.every((w) => hasWord(` ${label}`, w)) ? 1 : words.every((w) => hasWord(own, w)) ? 2 : 3;
      hits.push({ label: x.label, group: g.group, score });
    }
  }
  // Matching only through the group name ("kesehatan") is a fallback when nothing matches directly.
  const direct = hits.filter((h) => h.score < 3);
  return (direct.length ? direct : hits).sort((m, n) => m.score - n.score || m.label.length - n.label.length).map(({ label, group }) => ({ label, group }));
}

/** The field as one readable label: the picked one, or what the member typed for "Lainnya". */
export const fieldLabel = (field: unknown, other: unknown) => (field === OTHER_FIELD ? String(other ?? "").trim() : String(field ?? ""));

/** "STEM" / "Non-STEM", or "" when not set. */
export const streamLabel = (stream: unknown) => (stream === "stem" || stream === "nonstem" ? STREAMS[stream].label : "");

/** "STEM · Fisika", or "—" when nothing is set. */
export const disciplineLabel = (stream: unknown, field: unknown) => {
  const s = stream === "stem" || stream === "nonstem" ? STREAMS[stream].label : "";
  const fld = String(field ?? "").trim();
  return [s, fld].filter(Boolean).join(" · ") || "—";
};
