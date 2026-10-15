'use client';
import Link from "next/link";
import { Fragment, useState, useSyncExternalStore } from "react";
import PaperCurlCarousel, { type PaperCurlItem } from "@/components/ui/paper-curl-carousel";
import type { HeroSlide } from "@/lib/content/hero";

const AUTOPLAY_MS = 7000;
// The paper stock on the back of a turning photo.
const PAPER = "#F1EFE8";

// WebGL can only curl same-origin images. Routing every photo through the
// image optimizer makes admin-entered remote URLs same-origin and right-sized.
const sheetSrc = (src: string) => `/_next/image?url=${encodeURIComponent(src)}&w=2048&q=75`;

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (onChange: () => void) => {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

/** Each word rises out of its own mask; `from` continues the stagger across the accent. */
function Words({ text, from = 0 }: { text: string; from?: number }) {
  // The space stays outside the mask: inside an inline-block it would collapse.
  return text.split(" ").map((word, i) => (
    <Fragment key={i}>
      <span className="cp-hero3__w">
        <span style={{ animationDelay: `${120 + (from + i) * 55}ms` }}>{word}</span>
      </span>{" "}
    </Fragment>
  ));
}

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED_QUERY).matches, () => false);
  const n = slides.length;
  const items: PaperCurlItem[] = slides.map((s) => ({ src: sheetSrc(s.image.src), alt: s.image.alt, title: s.kicker }));
  // The active tab's progress bar is the autoplay clock: when it fills, the sheet turns.
  const autoplay = n > 1 && !reduced;
  // Autoplay pauses where the visitor is about to act (the copy, the tabs),
  // not over the photo, which the pointer is almost always on.
  const hold = { onPointerEnter: () => setPaused(true), onPointerLeave: () => setPaused(false) };

  return (
    <section
      className="cp-hero3"
      aria-labelledby="home-hero-title"
      data-paused={paused}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <PaperCurlCarousel
        className="cp-hero3__photo"
        items={items}
        index={index}
        onIndexChange={setIndex}
        paper={PAPER}
        rail={false}
        height="100%"
        labels={{ region: "Update terbaru CoPublika" }}
      />
      <div className="cp-hero3__shade" aria-hidden="true" />

      <div className="cp-hero3__inner">
        {/* Every slide's copy shares one grid cell so the block keeps the height
            of the longest slide; only the active one is visible and carries the h1. */}
        <div className="cp-hero3__copies" {...hold}>
          {slides.map((s, i) => {
            const active = i === index;
            const Title = active ? "h1" : "p";
            const titleWords = s.title.split(" ").length;
            return (
              <div key={s.id} className="cp-hero3__copy" data-active={active} aria-hidden={!active} inert={!active}>
                <p className="cp-hero3__kicker">
                  <span aria-hidden="true" /> {s.kicker}
                </p>
                <Title id={active ? "home-hero-title" : undefined} className="cp-hero3__title">
                  <Words text={s.title} />
                  {s.titleAccent && (
                    <em>
                      <Words text={s.titleAccent} from={titleWords} />
                    </em>
                  )}
                </Title>
                <p className="cp-hero3__dek">{s.dek}</p>
                <div className="cp-hero3__actions">
                  <Link href={s.cta.href} className="cp-hero3__cta">
                    {s.cta.label} <span aria-hidden="true">→</span>
                  </Link>
                  {s.secondary && (
                    <Link href={s.secondary.href} className="cp-hero3__link">
                      {s.secondary.label}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {n > 1 && (
          <nav className="cp-hero3__nav" aria-label="Pilih update" {...hold}>
            <div className="cp-hero3__tabs">
              {slides.map((s, i) => {
                const active = i === index;
                return (
                  <button
                    key={s.id}
                    type="button"
                    className="cp-hero3__tab"
                    data-active={active}
                    aria-current={active ? "true" : undefined}
                    onClick={() => setIndex(i)}
                  >
                    <span className="cp-hero3__tab-track" aria-hidden="true">
                      {active && (
                        <span
                          key={index}
                          className="cp-hero3__tab-fill"
                          data-autoplay={autoplay}
                          style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                          onAnimationEnd={() => autoplay && setIndex((index + 1) % n)}
                        />
                      )}
                    </span>
                    <span className="cp-hero3__tab-label">{s.kicker}</span>
                    <span className="cp-hero3__tab-title">
                      {s.title} {s.titleAccent}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </section>
  );
}
