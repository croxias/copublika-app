import Link from "next/link";

type Card = {
  q: "q1" | "q2" | "q3";
  qLabel: string;
  img: string;
  cat: string;
  year: string;
  title: string;
  journal: string;
};

const CARDS: Card[] = [
  {
    q: "q1",
    qLabel: "Scopus Q1",
    img: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=720&q=80&auto=format&fit=crop",
    cat: "Education",
    year: "2025",
    title:
      "Generative AI Adoption in Indonesian Higher Education: A National Survey of 12 Universities",
    journal: "Journal of Educational Research",
  },
  {
    q: "q2",
    qLabel: "Scopus Q2",
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=720&q=80&auto=format&fit=crop",
    cat: "Public Health",
    year: "2025",
    title: "Digital Health Literacy Among Rural Indonesian Communities Post-COVID",
    journal: "Health Promotion Intl.",
  },
  {
    q: "q1",
    qLabel: "Scopus Q1",
    img: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=720&q=80&auto=format&fit=crop",
    cat: "Sustainability",
    year: "2025",
    title: "Circular Economy Practices in Central Java's Textile MSMEs",
    journal: "Sustainability",
  },
  {
    q: "q3",
    qLabel: "Scopus Q3",
    img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=720&q=80&auto=format&fit=crop",
    cat: "Linguistics",
    year: "2024",
    title:
      "Reading Comprehension Strategies in English-Medium Instruction: Indonesian Polytechnics",
    journal: "TEFLIN Journal",
  },
  {
    q: "q2",
    qLabel: "Scopus Q2",
    img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=720&q=80&auto=format&fit=crop",
    cat: "Pedagogy",
    year: "2024",
    title:
      "Anchor Sentences as a Heuristic for L2 Academic Writing: A Quasi-Experimental Study",
    journal: "Studies in Higher Ed.",
  },
  {
    q: "q3",
    qLabel: "Scopus Q3",
    img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=720&q=80&auto=format&fit=crop",
    cat: "Publishing",
    year: "2024",
    title:
      "Reviewer Comment Framing and Author Response: A Discourse Analysis of 240 Revision Letters",
    journal: "Learned Publishing",
  },
  {
    q: "q2",
    qLabel: "Scopus Q2",
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=720&q=80&auto=format&fit=crop",
    cat: "Sociology",
    year: "2024",
    title:
      "Network Effects in Early-Career Academic Writing Communities: A Social Capital Perspective",
    journal: "Higher Education",
  },
  {
    q: "q1",
    qLabel: "Scopus Q1",
    img: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=720&q=80&auto=format&fit=crop",
    cat: "Biotech",
    year: "2024",
    title: "Microbiome Profiling in Indonesian Fermented Foods: A Multi-Province Survey",
    journal: "Food Microbiology",
  },
  {
    q: "q2",
    qLabel: "Scopus Q2",
    img: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=720&q=80&auto=format&fit=crop",
    cat: "Education",
    year: "2024",
    title: "Flipped Classroom in Engineering Programs: A 3-Year Longitudinal Study",
    journal: "IEEE Trans. on Ed.",
  },
  {
    q: "q3",
    qLabel: "Scopus Q3",
    img: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=720&q=80&auto=format&fit=crop",
    cat: "Economics",
    year: "2024",
    title: "SME Resilience and Digital Payment Adoption in Post-Pandemic Jakarta",
    journal: "Asian Econ. Papers",
  },
];

export function ResearchMarquee() {
  // duplicate for seamless loop
  const list = [...CARDS, ...CARDS];
  return (
    <section className="cp-research">
      <div className="cp-research__wrap">
        <div className="cp-section-head cp-section-head--two">
          <div>
            <div className="cp-sh-tag">
              <span className="cp-sh-tag__bar" />
              <span className="cp-sh-tag__num">05</span>
              <span>Riset terkini</span>
            </div>
            <h2 className="cp-sh-h cp-sh-h--nowrap">Publikasi anggota komunitas.</h2>
          </div>
          <div className="cp-blog__head-right">
            <Link href="/research" className="cp-sh-link">
              Lihat semua
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <div className="cp-marquee" style={{ ["--speed" as never]: "60s" }}>
        <div className="cp-marquee__track">
          {list.map((c, i) => (
            <Link key={`${c.title}-${i}`} className="cp-rc" href="/research">
              <div className="cp-rc__thumb">
                <span className={`cp-rc__q cp-rc__q--${c.q}`}>{c.qLabel}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt="" loading="lazy" />
              </div>
              <div className="cp-rc__body">
                <div className="cp-rc__meta">
                  <span>{c.cat}</span>
                  <span className="cp-rc__sep">/</span>
                  <span>{c.year}</span>
                </div>
                <h4 className="cp-rc__title">{c.title}</h4>
                <div className="cp-rc__journal">{c.journal}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
