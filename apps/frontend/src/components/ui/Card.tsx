import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 transition-all hover:shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}
