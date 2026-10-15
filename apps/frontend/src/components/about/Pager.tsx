"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

/** Compact pager: previous / page dots / next. Hidden when everything fits on one page. */
export function Pager({ page, pages, onPage, label }: { page: number; pages: number; onPage: (p: number) => void; label: string }) {
  if (pages <= 1) return null;
  return (
    <nav className="cp-pager" aria-label={label}>
      <button type="button" className="cp-pager__arrow" onClick={() => onPage(page - 1)} disabled={page === 0} aria-label="Halaman sebelumnya">
        <ChevronLeft size={18} />
      </button>
      <div className="cp-pager__pages">
        {Array.from({ length: pages }, (_, i) => (
          <button key={i} type="button" className={i === page ? "is-active" : ""} onClick={() => onPage(i)} aria-label={`Halaman ${i + 1}`} aria-current={i === page ? "page" : undefined}>
            {i + 1}
          </button>
        ))}
      </div>
      <span className="cp-pager__count">
        {page + 1} / {pages}
      </span>
      <button type="button" className="cp-pager__arrow" onClick={() => onPage(page + 1)} disabled={page === pages - 1} aria-label="Halaman berikutnya">
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}
