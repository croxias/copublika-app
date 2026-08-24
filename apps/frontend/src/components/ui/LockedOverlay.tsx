import Link from "next/link";

export function LockedOverlay({
  title = "Locked for curated members",
  description = "Apply to the next batch to unlock methodology, collaborator details, and execution pathways.",
  ctaHref = "/join-batch",
  ctaLabel = "Unlock Research",
}: {
  title?: string;
  description?: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--background)]/75 p-6 text-center backdrop-blur-md">
      <div className="max-w-sm">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
          Curiosity Gap
        </p>
        <h3 className="mt-3 text-xl font-bold text-[var(--foreground)]">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p>
        <Link
          href={ctaHref}
          className="mt-5 inline-flex rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-ink)]"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
