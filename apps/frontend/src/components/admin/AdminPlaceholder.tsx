import Link from 'next/link';

interface AdminPlaceholderProps {
  title: string;
  description: string;
  eyebrow?: string;
  backHref?: string;
}

/**
 * Honest landing state for admin areas whose data contract is not wired yet.
 * It deliberately renders no sample records, metrics, or mutation claims.
 */
export function AdminPlaceholder({
  title,
  description,
  eyebrow = 'Admin console',
  backHref = '/admin/dashboard',
}: AdminPlaceholderProps) {
  const demoEnabled = process.env.NEXT_PUBLIC_COPUBLIKA_DEMO_MODE === 'true';

  return (
    <section aria-labelledby="admin-placeholder-title">
      <div className="cp-pg-head">
        <div className="cp-greet">
          <div className="cp-crumb">
            <Link href={backHref}>Overview</Link>
            <span className="cp-sep">/</span>
            <span>{eyebrow}</span>
          </div>
          <h1 id="admin-placeholder-title">{title}</h1>
          <p>{description}</p>
        </div>
      </div>

      <div className="cp-card" style={{ maxWidth: '760px' }}>
        <div className="cp-card-head">
          <h3>{demoEnabled ? 'DEMO / DEVELOPMENT ONLY' : 'Development state'}</h3>
          <span className="badge soft">Read-only</span>
        </div>
        <p style={{ color: 'var(--muted)', lineHeight: 1.7, margin: '16px 0 20px' }}>
          {demoEnabled
            ? 'This preview is read-only and contains no production records. Data loading and write actions are intentionally unavailable.'
            : 'This route is ready for its live data contract. No data or write action is available in this development slice.'}
        </p>
        <button type="button" disabled aria-disabled="true" className="cp-btn-primary" style={{ opacity: 0.55, cursor: 'not-allowed' }}>
          Action unavailable
        </button>
      </div>
    </section>
  );
}

export default AdminPlaceholder;
