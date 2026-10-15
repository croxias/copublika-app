"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { OrgMember, OrgUnit } from "@/lib/content/about";
import { IconBadge } from "./IconBadge";

const EASE = [0.22, 1, 0.36, 1] as const;

type Node = OrgMember & { unit: string };

/**
 * Org structure as a top-down hierarchy: Ketua Umum on top, the secretariat as a staff branch
 * beside it, directors below, division heads at the base. Each node jumps to its unit's cards.
 */
export function OrgTree({ units }: { units: OrgUnit[] }) {
  const reduce = useReducedMotion();
  const by = (key: string) => units.find((u) => u.key === key);
  const exec = by("exec");
  const div = by("divisions");
  const sec = by("secretariat");
  if (!exec) return null;
  const [chair, ...directors] = exec.members.map((m) => ({ ...m, unit: exec.key }));
  const heads: Node[] = div ? div.members.map((m) => ({ ...m, unit: div.key })) : [];
  const staff: Node[] = sec ? sec.members.map((m) => ({ ...m, unit: sec.key })) : [];

  const tier = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.7, delay, ease: EASE },
  });
  const line = (delay: number, axis: "x" | "y") => ({
    initial: reduce ? false : axis === "x" ? { scaleX: 0 } : { scaleY: 0 },
    whileInView: axis === "x" ? { scaleX: 1 } : { scaleY: 1 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.6, delay, ease: EASE },
  });

  return (
    <div className="cp-org">
      {/* Tier 1: chair + secretariat staff branch */}
      <div className="cp-org__top">
        <motion.div className="cp-org__staff" {...tier(0.35)}>
          <span className="cp-org__staff-k"><IconBadge icon="file" size={26} /> {sec?.name}</span>
          {staff.map((n) => <OrgNode key={n.role} node={n} small />)}
        </motion.div>
        <motion.span className="cp-org__staff-line" {...line(0.3, "x")} aria-hidden="true" />
        <motion.div {...tier(0)}>
          <OrgNode node={chair} lead />
        </motion.div>
        <span className="cp-org__top-spacer" aria-hidden="true" />
      </div>

      {/* Connector to directors */}
      <motion.span className="cp-org__stem" {...line(0.5, "y")} aria-hidden="true" />
      <div className="cp-org__tier">
        <motion.span className="cp-org__rail" {...line(0.7, "x")} aria-hidden="true" />
        <p className="cp-org__tier-k">Direksi</p>
        <div className="cp-org__row cp-org__row--3">
          {directors.map((n, i) => (
            <motion.div key={n.role} className="cp-org__cell" {...tier(0.85 + i * 0.1)}>
              <OrgNode node={n} />
            </motion.div>
          ))}
        </div>
      </div>

      {heads.length > 0 && (
        <>
          <motion.span className="cp-org__stem" {...line(1.2, "y")} aria-hidden="true" />
          <div className="cp-org__tier">
            <motion.span className="cp-org__rail cp-org__rail--wide" {...line(1.35, "x")} aria-hidden="true" />
            <p className="cp-org__tier-k">{div?.name}</p>
            <div className="cp-org__row cp-org__row--4">
              {heads.map((n, i) => (
                <motion.div key={n.role} className="cp-org__cell" {...tier(1.5 + i * 0.1)}>
                  <OrgNode node={n} />
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function OrgNode({ node, lead = false, small = false }: { node: Node; lead?: boolean; small?: boolean }) {
  const p = node.person;
  return (
    <a href={`#unit-${node.unit}`} className={`cp-org__node cp-ab-hov ${lead ? "is-lead" : ""} ${small ? "is-small" : ""} ${p ? "" : "is-open"}`}>
      <span className="cp-org__avatar">
        {p ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.photo} alt="" loading="lazy" />
        ) : (
          <IconBadge icon="sprout" size={small ? 30 : 36} />
        )}
      </span>
      <span className="cp-org__info">
        <span className="cp-org__role-id">{node.roleId}</span>
        <strong>{p ? p.name : "Posisi terbuka"}</strong>
        {!small && <small>{node.role}</small>}
      </span>
    </a>
  );
}
