"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

/**
 * Back to the previous page when the visitor came from this site (keeps their scroll and filters),
 * otherwise to the fallback page (e.g. opened from a shared link).
 */
export function BackButton({ fallback, label }: { fallback: string; label: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="cp-back"
      onClick={() => {
        const sameSite = typeof document !== "undefined" && document.referrer.startsWith(window.location.origin);
        if (sameSite && window.history.length > 1) router.back();
        else router.push(fallback);
      }}
    >
      <span className="cp-back__icon" aria-hidden="true"><ArrowLeft size={16} /></span>
      {label}
    </button>
  );
}
