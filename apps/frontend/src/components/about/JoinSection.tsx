import Link from "next/link";
import { Check } from "lucide-react";
import { IconBadge, type IconName } from "./IconBadge";
import { Reveal, Stagger, StaggerItem } from "./motion";

/**
 * Closing "join us" section for Our Team and Our Mentors: the offer on the left, a checklist card
 * with the call to action on the right, on an ink surface with a slow orange glow.
 */
export function JoinSection({
  id,
  eyebrow,
  title,
  accent,
  perks,
  listTitle,
  list,
  cta,
  secondary,
  note,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  accent: string;
  perks: { icon: IconName; title: string; text: string }[];
  listTitle: string;
  list: string[];
  cta: { label: string; href: string };
  secondary?: { label: string; href: string };
  note?: string;
}) {
  return (
    <section className="cp-join" id={id}>
      <div className="cp-join__glow" aria-hidden="true" />
      <svg className="cp-join__art" viewBox="0 0 600 600" aria-hidden="true">
        <g className="cp-join__rings">
          {[90, 150, 210, 270].map((r) => <circle key={r} cx="300" cy="300" r={r} />)}
        </g>
        <g className="cp-join__orbit">
          <circle cx="300" cy="90" r="7" />
          <circle cx="510" cy="300" r="5" />
          <circle cx="152" cy="448" r="6" />
        </g>
        <g className="cp-join__orbit cp-join__orbit--slow">
          <circle cx="300" cy="570" r="5" />
          <circle cx="30" cy="300" r="4" />
        </g>
      </svg>
      <svg className="cp-join__contour" viewBox="0 0 1440 400" preserveAspectRatio="none" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M0 ${300 - i * 34} C 240 ${220 - i * 30}, 480 ${360 - i * 26}, 720 ${280 - i * 30} S 1200 ${200 - i * 28}, 1440 ${260 - i * 32}`} />
        ))}
      </svg>
      <div className="cp-ab-wrap cp-join__grid">
        <div className="cp-join__copy">
          <Reveal>
            <div className="cp-ab-tag cp-ab-tag--ink">
              <span className="cp-ab-tag__bar" aria-hidden="true" />
              <span>{eyebrow}</span>
            </div>
            <h2 className="cp-join__h">
              {title} <span className="cp-ab-accent">{accent}</span>
            </h2>
          </Reveal>
          <Stagger as="ul" className="cp-join__perks">
            {perks.map((p) => (
              <StaggerItem as="li" key={p.title} className="cp-join__perk cp-ab-hov">
                <IconBadge icon={p.icon} tone="dark" size={46} />
                <div>
                  <strong>{p.title}</strong>
                  <span>{p.text}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <Reveal className="cp-join__card" delay={0.15}>
          <p className="cp-join__card-k">{listTitle}</p>
          <ul className="cp-join__list">
            {list.map((item) => (
              <li key={item}>
                <span aria-hidden="true"><Check size={14} strokeWidth={3} /></span>
                {item}
              </li>
            ))}
          </ul>
          <div className="cp-join__ctas">
            <Link href={cta.href} className="cp-ab-btn cp-ab-btn--primary">
              {cta.label} <span className="cp-ab-btn__arr" aria-hidden="true">→</span>
            </Link>
            {secondary && (
              <Link href={secondary.href} className="cp-ab-btn cp-ab-btn--line">
                {secondary.label}
              </Link>
            )}
          </div>
          {note && <p className="cp-join__note">{note}</p>}
        </Reveal>
      </div>
    </section>
  );
}
