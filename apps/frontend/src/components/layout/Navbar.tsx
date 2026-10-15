"use client";

import { useEffect, useRef, useState, type SVGProps } from "react";
import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/components/ui/I18nProvider";
import { authClient } from "@/lib/auth-client";
import { BOOTCAMP_BATCHES, batchSeatsLeft, formatDate } from "@/lib/data/programs";

const FlagID = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 18 18" width="18" height="18" {...p}>
    <rect width="18" height="9" fill="#EF3340" />
    <rect y="9" width="18" height="9" fill="#fff" />
  </svg>
);

const FlagEN = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 18 18" width="18" height="18" {...p}>
    <rect width="18" height="18" fill="#012169" />
    <path d="M0 0L18 18M18 0L0 18" stroke="#fff" strokeWidth="2" />
    <path d="M9 0V18M0 9H18" stroke="#fff" strokeWidth="3" />
    <path d="M9 0V18M0 9H18" stroke="#C8102E" strokeWidth="1.6" />
  </svg>
);

const LANGS = [
  { code: "ID", label: "Bahasa Indonesia", Flag: FlagID },
  { code: "EN", label: "English", Flag: FlagEN },
];

type NavChild = { href: string; title: string; sub: string; badge?: string; icon: "star" | "info" | "team" | "mentor" | "pen" };
type NavItem = { id: string; label: string; href: string; children?: NavChild[] };

const NAV: NavItem[] = [
  { id: "home", label: "Home", href: "/" },
  {
    id: "about",
    label: "About",
    href: "/about",
    children: [
      { href: "/about", title: "About Us", sub: "Siapa kami, nilai, visi-misi, dan perjalanan CoPublika.", icon: "info" },
      { href: "/about/team", title: "Our Team", sub: "Sambutan pendiri dan pengurus organisasi.", icon: "team" },
      { href: "/about/mentors", title: "Our Mentors", sub: "Peneliti aktif yang mendampingi anggota.", icon: "mentor" },
    ],
  },
  { id: "research", label: "Research Project", href: "/research" },
  {
    id: "program",
    label: "Program",
    href: "/siap-tembus-scopus",
    children: [
      { href: "/siap-tembus-scopus", title: "Siap Tembus Scopus 1-on-1", sub: "1 sesi online 90 menit + 4 review artikel bersama mentor pilihan.", badge: "Rp. 600rb", icon: "star" },
      { href: "/bootcamp-menulis", title: "Bootcamp 30 Hari Menulis", sub: "Webinar mingguan, tools, pelacak menulis, dan review gratis mentor.", badge: "Rp. 450rb", icon: "pen" },
    ],
  },
  { id: "blog", label: "Blog", href: "/blog" },
  { id: "event", label: "Event", href: "/event" },
  { id: "contact", label: "Contact", href: "/contact" },
];

const NAV_ICON: Record<NavChild["icon"], React.ReactNode> = {
  star: <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" />,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
  team: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><path d="M15 14.6c.6-.3 1.3-.4 2-.4 2.5 0 4.5 2 4.5 4.5" /></>,
  mentor: <><path d="M22 10L12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" /></>,
  pen: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" /></>,
};

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Navbar() {
  const { locale, setLocale } = useI18n();
  const { data: authSession } = authClient.useSession();
  const user = authSession?.user;
  const signOut = () => authClient.signOut({ fetchOptions: { onSuccess: () => window.location.assign("/") } });
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [drop, setDrop] = useState<string | null>(null);
  const [lang, setLang] = useState(false);
  const [annHide, setAnnHide] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const dropTimer = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setDrop(null);
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLang(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);


  const itemActive = (item: NavItem) => (item.children ? item.children.some((c) => isActive(pathname, c.href)) : isActive(pathname, item.href));
  const current = LANGS.find((l) => l.code === locale.toUpperCase()) || LANGS[0];

  const openDrop = (id: string) => {
    if (dropTimer.current) window.clearTimeout(dropTimer.current);
    setDrop(id);
  };
  const closeDrop = () => {
    if (dropTimer.current) window.clearTimeout(dropTimer.current);
    dropTimer.current = window.setTimeout(() => setDrop(null), 220);
  };

  return (
    <>
      {/* Announcement bar */}
      {!annHide && (
        <div className="cp-announce">
          <div className="cp-announce__inner">
            <span className="cp-announce__pulse" />
            <span className="cp-announce__text">
              <strong>Bootcamp 30 Hari Menulis</strong>{" "}
              <span className="cp-announce__long">— {BOOTCAMP_BATCHES[0].name} mulai {formatDate(BOOTCAMP_BATCHES[0].start)}, sisa {batchSeatsLeft(BOOTCAMP_BATCHES[0])} kursi.</span>
            </span>
            <Link href="/bootcamp-menulis" className="cp-announce__cta">
              Daftar sekarang
            </Link>
            <button
              className="cp-announce__close"
              onClick={() => setAnnHide(true)}
              aria-label="Tutup pengumuman"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <header className={`cp-navx ${scrolled ? "is-scrolled" : ""} ${annHide ? "no-ann" : ""}`}>
        <div className="cp-navx__inner">
          {/* Logo */}
          <Link href="/" className="cp-navx__logo" aria-label="CoPublika">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-black.png" alt="CoPublika" className="cp-navx__logo-img" />
          </Link>

          {/* Center menu */}
          <nav className="cp-navx__menu" aria-label="Primary" ref={menuRef}>
            {NAV.map((item) =>
              item.children ? (
                <div
                  key={item.id}
                  className={`cp-navx__dd ${drop === item.id ? "is-open" : ""}`}
                  onMouseEnter={() => openDrop(item.id)}
                  onMouseLeave={closeDrop}
                >
                  <button
                    type="button"
                    className={`cp-navx__link ${itemActive(item) ? "is-active" : ""}`}
                    onClick={() => setDrop(drop === item.id ? null : item.id)}
                    aria-expanded={drop === item.id}
                  >
                    <span>{item.label}</span>
                    <span className="cp-navx__caret" aria-hidden="true" />
                  </button>
                  <div className="cp-navx__dd-menu">
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className={`cp-navx__dd-item ${pathname === c.href ? "is-current" : ""}`}
                        onClick={() => setDrop(null)}
                      >
                        <span className="cp-navx__dd-icon" aria-hidden="true">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            {NAV_ICON[c.icon]}
                          </svg>
                        </span>
                        <span className="cp-navx__dd-content">
                          <span className="cp-navx__dd-title">
                            {c.title}
                            {c.badge && <span className="cp-navx__dd-badge">{c.badge}</span>}
                          </span>
                          <span className="cp-navx__dd-sub">{c.sub}</span>
                        </span>
                        <span className="cp-navx__dd-arr" aria-hidden="true">
                          →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`cp-navx__link ${isActive(pathname, item.href) ? "is-active" : ""}`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Right rail */}
          <div className="cp-navx__right">
            <div
              ref={langRef}
              className={`cp-navx__lang ${lang ? "is-open" : ""}`}
            >
              <button
                type="button"
                className="cp-navx__lang-btn"
                onClick={() => setLang(!lang)}
                aria-label="Pilih bahasa"
                aria-expanded={lang}
              >
                <span className="cp-navx__lang-flag">
                  <current.Flag />
                </span>
                <span className="cp-navx__lang-code">{current.code}</span>
                <span className="cp-navx__lang-caret" aria-hidden="true" />
              </button>
              <div className="cp-navx__lang-menu">
                {LANGS.map(({ code, label, Flag }) => (
                  <button
                    type="button"
                    key={code}
                    className={`cp-navx__lang-opt ${current.code === code ? "is-active" : ""}`}
                    onClick={() => {
                      setLocale(code.toLowerCase() as "id" | "en");
                      setLang(false);
                    }}
                  >
                    <span className="cp-navx__lang-flag">
                      <Flag />
                    </span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium hidden lg:block">{user.email}</span>
                <button
                  onClick={() => signOut()}
                  className="cp-navx__btn cp-navx__btn--ghost"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="cp-navx__btn cp-navx__btn--ghost">
                  Log In
                </Link>
                <Link href="/daftar" className="cp-navx__btn cp-navx__btn--solid">
                  <span>Daftar<span className="cp-navx__btn-extra"> Program</span></span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </>
            )}

            <button
              type="button"
              className="cp-navx__burger"
              onClick={() => setMobile(!mobile)}
              aria-label="Menu"
            >
              <span />
            </button>
          </div>
        </div>

        {mobile && (
          <div className="cp-navx__sheet">
            {NAV.map((item) =>
              item.children && item.children.length > 1 ? (
                <div key={item.id} className="cp-navx__sheet-group">
                  <span className="cp-navx__sheet-label">{item.label}</span>
                  {item.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      onClick={() => setMobile(false)}
                      className={`cp-navx__sheet-link cp-navx__sheet-link--sub ${pathname === c.href ? "is-active" : ""}`}
                    >
                      {c.title}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.id}
                  href={item.children ? item.children[0].href : item.href}
                  onClick={() => setMobile(false)}
                  className={`cp-navx__sheet-link ${itemActive(item) ? "is-active" : ""}`}
                >
                  {item.label}
                  {item.children?.[0].badge ? <span className="cp-navx__sheet-tag">{item.children[0].badge}</span> : null}
                </Link>
              )
            )}
            <div className="cp-navx__sheet-cta">
              {user ? (
                <>
                  <span className="text-sm text-[var(--mute)]">{user.email}</span>
                  <button
                    onClick={() => { signOut(); setMobile(false); }}
                    className="cp-navx__btn cp-navx__btn--ghost w-full justify-center"
                  >
                    Keluar
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobile(false)} className="cp-navx__btn cp-navx__btn--ghost">
                    Log In
                  </Link>
                  <Link href="/daftar" onClick={() => setMobile(false)} className="cp-navx__btn cp-navx__btn--solid">
                    Daftar Program →
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
