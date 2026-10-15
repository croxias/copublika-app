"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { OrgUnit } from "@/lib/content/about";
import { IconBadge } from "./IconBadge";
import { Pager } from "./Pager";
import { SocialLinks } from "./SocialLinks";

const PER_PAGE = 8;
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Team members filtered by unit, paginated. Cards follow the "team section" pattern: round
 * portrait that gains an orange ring and a rising glow on hover, social links underneath.
 */
export function TeamDirectory({ units }: { units: OrgUnit[] }) {
  const reduce = useReducedMotion();
  const [unit, setUnit] = useState("all");
  const [page, setPage] = useState(0);
  const members = useMemo(
    () => units.filter((u) => unit === "all" || u.key === unit).flatMap((u) => u.members.map((m) => ({ ...m, unit: u.name }))),
    [units, unit],
  );
  const pages = Math.max(1, Math.ceil(members.length / PER_PAGE));
  const shown = members.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  // The org chart links to #unit-<key>; selecting it here filters the grid.
  useEffect(() => {
    const pick = () => {
      const key = window.location.hash.replace("#unit-", "");
      if (units.some((u) => u.key === key)) {
        setUnit(key);
        setPage(0);
      }
    };
    pick();
    window.addEventListener("hashchange", pick);
    return () => window.removeEventListener("hashchange", pick);
  }, [units]);

  const choose = (key: string) => {
    setUnit(key);
    setPage(0);
  };

  return (
    <div className="cp-team" id="pengurus">
      {units.map((u) => <span key={u.key} id={`unit-${u.key}`} className="cp-team__anchor" aria-hidden="true" />)}
      <div className="cp-team__tabs" role="tablist" aria-label="Unit organisasi">
        <button type="button" role="tab" aria-selected={unit === "all"} className={unit === "all" ? "is-active" : ""} onClick={() => choose("all")}>
          Semua <span>{units.reduce((n, u) => n + u.members.length, 0)}</span>
        </button>
        {units.map((u) => (
          <button key={u.key} type="button" role="tab" aria-selected={unit === u.key} className={`cp-ab-hov ${unit === u.key ? "is-active" : ""}`} onClick={() => choose(u.key)}>
            <IconBadge icon={u.icon} tone={unit === u.key ? "solid" : "soft"} size={28} />
            {u.name} <span>{u.members.length}</span>
          </button>
        ))}
      </div>

      <motion.div layout={!reduce} className="cp-team__grid">
        <AnimatePresence mode="popLayout">
          {shown.map((m, i) => (
            <motion.article
              key={`${unit}-${page}-${m.role}`}
              layout={!reduce}
              className={`cp-tm ${m.person ? "" : "cp-tm--open"}`}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.45, delay: i * 0.05, ease: EASE }}
            >
              <span className="cp-tm__glow" aria-hidden="true" />
              <div className="cp-tm__photo">
                {m.person ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.person.photo} alt={`Foto ${m.person.name}`} loading="lazy" />
                ) : (
                  <IconBadge icon="sprout" size={56} />
                )}
              </div>
              <span className="cp-tm__unit">{m.unit}</span>
              <h3>{m.person ? m.person.name : "Posisi terbuka"}</h3>
              <p className="cp-tm__role">{m.role}</p>
              <p className="cp-tm__role-id">{m.roleId}</p>
              {m.person ? (
                <SocialLinks name={m.person.name} linkedin={m.person.linkedinUrl} instagram={m.person.instagramUrl} email={m.person.email} className="cp-tm__social" />
              ) : (
                <Link href="#gabung" className="cp-tm__apply">Lamar posisi ini →</Link>
              )}
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      <Pager page={page} pages={pages} onPage={setPage} label="Halaman pengurus" />
    </div>
  );
}
