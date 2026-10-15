"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  page: number;
  perPage: number;
  total: number;
  noun: string;
  onChange: (page: number) => void;
};

/** Page numbers with ellipses: 1 … 4 5 6 … 12. */
function pageList(page: number, pages: number): (number | "gap")[] {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const keep = new Set([1, pages, page - 1, page, page + 1]);
  const out: (number | "gap")[] = [];
  for (let i = 1; i <= pages; i++) {
    if (keep.has(i)) out.push(i);
    else if (out[out.length - 1] !== "gap") out.push("gap");
  }
  return out;
}

export function Pager({ page, perPage, total, noun, onChange }: Props) {
  const pages = Math.max(1, Math.ceil(total / perPage));
  if (!total) return null;
  const start = (page - 1) * perPage;

  return (
    <nav className="cp-rpgr" aria-label={`Halaman ${noun}`}>
      <span className="cp-rpgr__count">
        <strong>{start + 1}–{Math.min(start + perPage, total)}</strong> dari <strong>{total}</strong> {noun}
      </span>
      {pages > 1 && (
        <div className="cp-rpgr__ctrl">
          <button type="button" className="cp-rpgr__btn" onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="Halaman sebelumnya">
            <ChevronLeft size={16} />
          </button>
          {pageList(page, pages).map((n, i) =>
            n === "gap" ? (
              <span key={`gap-${i}`} className="cp-rpgr__gap" aria-hidden="true">…</span>
            ) : (
              <button
                key={n}
                type="button"
                className={`cp-rpgr__num ${n === page ? "is-active" : ""}`}
                onClick={() => onChange(n)}
                aria-label={`Halaman ${n}`}
                aria-current={n === page ? "page" : undefined}
              >
                {n}
              </button>
            ),
          )}
          <button type="button" className="cp-rpgr__btn" onClick={() => onChange(page + 1)} disabled={page === pages} aria-label="Halaman berikutnya">
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </nav>
  );
}
