const PROOF_POINTS = [
  {
    label: "DISCOVER",
    title: "Temukan rekan riset",
    text: "Cari percakapan dan bidang keahlian yang relevan sebelum ide berhenti di catatan pribadi.",
  },
  {
    label: "CONNECT",
    title: "Bangun lintas disiplin",
    text: "Masuk ke komunitas yang memberi konteks, umpan balik, dan teman seperjalanan akademik.",
  },
  {
    label: "BUILD",
    title: "Kembangkan menuju publikasi",
    text: "Susun proyek dengan dukungan mentor, program, dan ritme kerja yang lebih terarah.",
  },
];

export function StatsSection() {
  return (
    <section className="cp-proof" aria-labelledby="cp-proof-title">
      <div className="cp-proof__inner">
        <div className="cp-proof__intro">
          <p className="cp-proof__eyebrow">01 / THE METHOD</p>
          <h2 id="cp-proof-title">Dari pertanyaan, menuju kontribusi.</h2>
          <p>
            CoPublika membantu mengubah isolasi akademik menjadi proses kolaborasi yang terlihat,
            terukur dalam pekerjaan, dan tetap berakar pada kualitas riset.
          </p>
        </div>
        <div className="cp-proof__points">
          {PROOF_POINTS.map((point, index) => (
            <article className="cp-proof__point" key={point.label}>
              <span className="cp-proof__index">0{index + 1}</span>
              <div>
                <p className="cp-proof__label">{point.label}</p>
                <h3>{point.title}</h3>
                <p>{point.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;

/* Keep the proof band self-contained so downstream landing sections retain their contracts. */
