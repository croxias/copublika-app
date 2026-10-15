import Link from 'next/link';

/** Honest state for menus that are planned but not part of the current phase. */
export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <section className="cms-page">
      <div className="cms-coming">
        <span className="cms-badge cms-badge--muted">Segera</span>
        <h1>{title}</h1>
        <p>{description}</p>
        <Link href="/admin/dashboard" className="cms-btn cms-btn--ghost">Kembali ke Dasbor</Link>
      </div>
    </section>
  );
}
