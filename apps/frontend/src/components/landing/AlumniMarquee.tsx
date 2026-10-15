type Testi = {
  badge: string;
  quote: string;
  avatar: string;
  name: string;
  role: string;
};

const ROW_A: Testi[] = [
  {
    badge: "Q3 · 2024",
    quote:
      "Saya kira mengirim ke jurnal Scopus mustahil di tahun pertama mengajar. Tiga bulan setelah bootcamp, naskah pertama saya diterima di jurnal Q3.",
    avatar: "https://i.pravatar.cc/100?img=44",
    name: "Rini Puspita, M.Pd.",
    role: "Universitas Negeri Semarang",
  },
  {
    badge: "Q2 · 2025",
    quote:
      "Yang paling berharga bukan modulnya — tapi komunitasnya. Saya menemukan co-author yang sefrekuensi di cluster Public Health.",
    avatar: "https://i.pravatar.cc/100?img=33",
    name: "dr. Andika Hidayat",
    role: "Peneliti Kesehatan, Surabaya",
  },
  {
    badge: "Sinta 2",
    quote:
      "Klinik manuskrip mingguan memaksa saya konsisten. Yang dulu saya tunda berbulan-bulan akhirnya saya selesaikan dalam 6 minggu.",
    avatar: "https://i.pravatar.cc/100?img=24",
    name: "Siti Nurhaliza, M.A.",
    role: "Mahasiswa S2 Sosiologi, UI",
  },
  {
    badge: "Q3 · 2024",
    quote:
      "Pertanyaan paling kecil saya pun ditanggapi seperti pertanyaan penting. Itu yang bikin saya bertahan ketika revisi terasa berat.",
    avatar: "https://i.pravatar.cc/100?img=11",
    name: "Reza Maulana",
    role: "Dosen Junior, ITB",
  },
  {
    badge: "Q1 · 2025",
    quote:
      "Mentor saya membaca naskah saya tiga kali sebelum disubmit. Detail itu yang membuat reviewer Q1 saya menulis 'this is well-structured'.",
    avatar: "https://i.pravatar.cc/100?img=68",
    name: "Putri Andini, Ph.D.",
    role: "Peneliti BRIN",
  },
];

const ROW_B: Testi[] = [
  {
    badge: "Q2 · 2024",
    quote:
      "Saya sudah lima tahun jadi dosen tetap dan baru kali ini merasa naskah saya benar-benar ditulis bersama, bukan sendirian.",
    avatar: "https://i.pravatar.cc/100?img=14",
    name: "Dr. Bayu Wijaya",
    role: "Universitas Brawijaya",
  },
  {
    badge: "Sinta 1",
    quote:
      "Komunitas yang sehat ternyata sangat berpengaruh. Saya jadi terbiasa menulis 30 menit setiap hari karena ada teman yang juga menulis.",
    avatar: "https://i.pravatar.cc/100?img=29",
    name: "Anisa Kurnia, M.Si.",
    role: "Mahasiswa S2 Biologi, UGM",
  },
  {
    badge: "Q3 · 2025",
    quote:
      "Saya pikir saya tidak punya cerita untuk ditulis. Workshop CoPublika mengajari saya cara menemukan narasi dari data harian.",
    avatar: "https://i.pravatar.cc/100?img=58",
    name: "Hadi Suryanto",
    role: "Praktisi & Dosen Tamu, Bandung",
  },
  {
    badge: "Q2 · 2024",
    quote:
      "Editor tamu yang dihadirkan benar-benar memberi insight tentang apa yang dilihat reviewer. Ini hal yang tidak saya dapat di kampus.",
    avatar: "https://i.pravatar.cc/100?img=36",
    name: "Dr. Lestari Wahyuni",
    role: "Editor & Pendidik, Yogyakarta",
  },
  {
    badge: "Q1 · 2024",
    quote:
      "Saya bergabung dari Papua dan tidak pernah merasa jauh. Mentor saya selalu hadir untuk review draft saya di Zoom mingguan.",
    avatar: "https://i.pravatar.cc/100?img=42",
    name: "Yohanes Mbete, S.Pd.",
    role: "Dosen STKIP, Jayapura",
  },
];

function Row({ items, reverse }: { items: Testi[]; reverse?: boolean }) {
  const list = [...items, ...items];
  return (
    <div className="cp-marquee" style={{ ["--speed" as never]: "70s" }}>
      <div className={`cp-marquee__track ${reverse ? "cp-marquee__track--reverse" : ""}`}>
        {list.map((t, i) => (
          <div key={`${t.name}-${i}`} className="cp-testi">
            <div className="cp-testi__top">
              <span className="cp-testi__qmark">&ldquo;</span>
              <span className="cp-testi__badge">{t.badge}</span>
            </div>
            <p className="cp-testi__quote">{t.quote}</p>
            <div className="cp-testi__person">
              <span className="cp-testi__avatar" style={{ backgroundImage: `url('${t.avatar}')` }} />
              <div>
                <div className="cp-testi__name">{t.name}</div>
                <div className="cp-testi__role">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AlumniMarquee() {
  return (
    <section className="cp-testi-section">
      <div className="cp-testi-section__wrap">
        <div className="cp-section-head cp-section-head--two" data-reveal>
          <div>
            <div className="cp-sh-tag">
              <span className="cp-sh-tag__bar" />
              <span>Suara komunitas</span>
            </div>
            <h2 className="cp-sh-h">Cerita dari <span className="cp-sh-h-accent">komunitas.</span></h2>
          </div>
        </div>
      </div>
      <div className="cp-testi-stack">
        <Row items={ROW_A} />
        <Row items={ROW_B} reverse />
      </div>
    </section>
  );
}
