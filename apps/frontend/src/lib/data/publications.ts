// Members' published papers shown on /research (publications table and the hero field globe).

export type Quartile = "q1" | "q2" | "q3" | "sinta";

export type Pub = {
  title: string;
  authors: string;
  journal: string;
  quartile: Quartile;
  qLabel: string;
  /** ISO yyyy-mm format — day intentionally omitted */
  date: string;
  cluster: string;
  /** Link to the full-text PDF; empty until the file is uploaded from the admin. */
  pdf?: string;
};

export const PUBS: Pub[] = [
  { title: "Generative AI Adoption in Indonesian Higher Education: A National Survey of 12 Universities", authors: "Putranto, A., Kartika, L., Nugroho, B.", journal: "Journal of Educational Research", quartile: "q1", qLabel: "Scopus Q1", date: "2025-05", cluster: "EdTech" },
  { title: "Digital Health Literacy Among Rural Indonesian Communities Post-COVID", authors: "Rahmawati, M., Hidayat, A., Sari, D.", journal: "Health Promotion International", quartile: "q2", qLabel: "Scopus Q2", date: "2025-04", cluster: "Public Health" },
  { title: "Circular Economy Practices in Central Java's Textile MSMEs: A Multi-Case Analysis", authors: "Setiawan, B., Nirmala, D.", journal: "Sustainability", quartile: "q1", qLabel: "Scopus Q1", date: "2025-03", cluster: "Sustainability" },
  { title: "Anchor Sentences as a Heuristic for L2 Academic Writing: A Quasi-Experimental Study", authors: "Nurhaliza, S., Kartika, L.", journal: "Studies in Higher Education", quartile: "q2", qLabel: "Scopus Q2", date: "2025-02", cluster: "Linguistics" },
  { title: "Reading Comprehension Strategies in English-Medium Instruction: Indonesian Polytechnics", authors: "Puspita, R., Ramadhan, F.", journal: "TEFLIN Journal", quartile: "q3", qLabel: "Scopus Q3", date: "2025-01", cluster: "Linguistics" },
  { title: "Reviewer Comment Framing and Author Response: A Discourse Analysis of 240 Revision Letters", authors: "Suryanto, H., Putranto, A.", journal: "Learned Publishing", quartile: "q3", qLabel: "Scopus Q3", date: "2024-12", cluster: "Publishing" },
  { title: "Pemanfaatan ChatGPT dalam Pembelajaran Sastra Indonesia di SMA: Studi Pendahuluan", authors: "Putri, A. S., Wibowo, T.", journal: "Litera", quartile: "sinta", qLabel: "Sinta 2", date: "2024-11", cluster: "EdTech" },
  { title: "Network Effects in Early-Career Academic Writing Communities: A Social Capital Perspective", authors: "Hidayat, A., Putranto, A., Rahmawati, M.", journal: "Higher Education", quartile: "q2", qLabel: "Scopus Q2", date: "2024-10", cluster: "Sociology" },
  { title: "Microbiome Profiling in Indonesian Fermented Foods: A Multi-Province Survey", authors: "Wijaya, B., Setiawan, R.", journal: "Food Microbiology", quartile: "q1", qLabel: "Scopus Q1", date: "2024-09", cluster: "Biotech" },
  { title: "Flipped Classroom in Engineering Programs: A 3-Year Longitudinal Study", authors: "Ramadhan, F., Kurnia, A.", journal: "IEEE Trans. on Education", quartile: "q2", qLabel: "Scopus Q2", date: "2024-08", cluster: "EdTech" },
  { title: "SME Resilience and Digital Payment Adoption in Post-Pandemic Jakarta", authors: "Lestari, W., Mbete, Y.", journal: "Asian Economic Papers", quartile: "q3", qLabel: "Scopus Q3", date: "2024-07", cluster: "Economics" },
  { title: "Mapping Stakeholder Networks in Indonesian Climate Policy 2018–2024", authors: "Bayu, S., Andika, H.", journal: "Climate Policy", quartile: "q1", qLabel: "Scopus Q1", date: "2024-06", cluster: "Public Policy" },
  { title: "AI Literacy Curriculum Design for Indonesian Polytechnics", authors: "Kartika, L., Putri, A.", journal: "Computers & Education", quartile: "q1", qLabel: "Scopus Q1", date: "2024-05", cluster: "EdTech" },
  { title: "Maternal Health Service Utilization in Eastern Indonesia", authors: "Rahmawati, M., Sari, D.", journal: "BMC Public Health", quartile: "q2", qLabel: "Scopus Q2", date: "2024-04", cluster: "Public Health" },
  { title: "Strategi Penulisan Cover Letter Berbasis Editor Persona", authors: "Suryanto, H., Ramadhan, F.", journal: "Jurnal Komunikasi Ikatan Sarjana", quartile: "sinta", qLabel: "Sinta 1", date: "2024-03", cluster: "Publishing" },
  { title: "Co-Authorship Network Among Indonesian Early-Career Researchers", authors: "Nirmala, D., Putranto, A.", journal: "Scientometrics", quartile: "q1", qLabel: "Scopus Q1", date: "2024-02", cluster: "Sociology" },
  { title: "Plastic Waste Management Behavior in Coastal MSMEs", authors: "Setiawan, B., Bayu, S.", journal: "Resources, Conservation & Recycling", quartile: "q1", qLabel: "Scopus Q1", date: "2024-01", cluster: "Sustainability" },
  { title: "Validasi Skala Self-Regulated Learning untuk Konteks Indonesia", authors: "Lestari, W., Wibowo, T.", journal: "Jurnal Psikologi", quartile: "sinta", qLabel: "Sinta 2", date: "2023-12", cluster: "Education" },
  { title: "Mobile Money Adoption Among Indonesian Rural Households", authors: "Mbete, Y., Lestari, W.", journal: "Telecommunications Policy", quartile: "q2", qLabel: "Scopus Q2", date: "2023-11", cluster: "Economics" },
  { title: "Curriculum Mapping for AI Ethics in Indonesian Universities", authors: "Putranto, A., Ramadhan, F.", journal: "Asia Pacific Journal of Education", quartile: "q3", qLabel: "Scopus Q3", date: "2023-10", cluster: "EdTech" },
];
