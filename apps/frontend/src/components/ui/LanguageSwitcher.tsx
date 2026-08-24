"use client";

import { useI18n } from "./I18nProvider";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const flags: Record<string, string> = {
    id: "🇮🇩",
    en: "🇬🇧",
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-[var(--line)] hover:bg-[var(--surface)] transition-colors text-sm font-medium"
      >
        <span>{flags[locale]}</span>
        <span className="uppercase text-xs">{locale}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-1 bg-[var(--background)] border border-[var(--line)] rounded-lg shadow-lg overflow-hidden min-w-[120px] z-50">
          {(["id", "en"] as const).map((l) => (
            <button
              key={l}
              onClick={() => { setLocale(l); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--surface)] transition-colors ${
                locale === l ? "font-semibold text-[var(--accent)]" : ""
              }`}
            >
              <span>{flags[l]}</span>
              <span className="uppercase">{l}</span>
              {locale === l && <span className="ml-auto text-xs">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
