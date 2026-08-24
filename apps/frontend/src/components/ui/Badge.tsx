import type { ReactNode } from "react";

export function Badge({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "accent" | "success" | "warning";
}) {
  const toneClasses = {
    default: "bg-[var(--surface)] text-[var(--foreground)] border-[var(--line)]",
    accent: "bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/20",
    success: "bg-green-500/10 text-green-600 border-green-500/20",
    warning: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
