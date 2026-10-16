// The CoPublika mark as SVG geometry: an open "C" ring broken by a dot on the left, around a
// three-quarter disc with the bottom-right quadrant cut away. Every piece shares one centre.

export const MARK_VIEWBOX = "0 0 560 640";
const C = { x: 345, y: 320 };

const ringPoint = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return `${(C.x + r * Math.cos(a)).toFixed(1)} ${(C.y + r * Math.sin(a)).toFixed(1)}`;
};
const ringSegment = (from: number, to: number, R = 300, r = 244) =>
  `M${ringPoint(R, from)} A${R} ${R} 0 0 0 ${ringPoint(R, to)} L${ringPoint(r, to)} A${r} ${r} 0 0 1 ${ringPoint(r, from)}Z`;

/** Only the open "C" ring (two arcs), without the inner disc. */
export const MARK_RING_PATH = [ringSegment(-90, -166), ringSegment(166, 90)].join(" ");

export const MARK_PATH = [
  ringSegment(-90, -166),
  ringSegment(166, 90),
  `M${C.x} ${C.y} L${C.x + 172} ${C.y} A172 172 0 1 0 ${C.x} ${C.y + 172}Z`,
].join(" ");
export const MARK_DOT = { x: C.x - 272, y: C.y, r: 25 };

/** The mark's pieces, for animating them one by one. All share MARK_CENTER. */
export const MARK_CENTER = C;
export const MARK_PARTS = {
  ringTop: ringSegment(-90, -166),
  ringBottom: ringSegment(166, 90),
  disc: `M${C.x} ${C.y} L${C.x + 172} ${C.y} A172 172 0 1 0 ${C.x} ${C.y + 172}Z`,
};

/** The mark as one shape; colour it with `fill` (currentColor by default). */
export function CopublikaMark({ className }: { className?: string }) {
  return (
    <svg viewBox={MARK_VIEWBOX} className={className} aria-hidden="true" fill="currentColor">
      <path d={MARK_PATH} />
      <circle cx={MARK_DOT.x} cy={MARK_DOT.y} r={MARK_DOT.r} />
    </svg>
  );
}
