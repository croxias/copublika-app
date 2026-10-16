// Coordinates for Google Maps. Stored as "lat, lng" text so the CMS keeps flat values.
// Embeds use the keyless maps.google.com URLs; no Maps API key is needed.

export type LatLng = { lat: number; lng: number };

const valid = (lat: number, lng: number) => Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
const round = (n: number) => Math.round(n * 1e6) / 1e6;

/**
 * Reads coordinates from "-6.9, 107.6" or from a Google Maps link: the last pin (!3d…!4d…),
 * the view (@lat,lng), or a q=/query=/ll=/destination= parameter.
 */
export function parseCoords(input: unknown): LatLng | null {
  const raw = String(input ?? '').trim();
  let s = raw;
  try {
    s = decodeURIComponent(raw);
  } catch {
    // Malformed %-escapes: read the text as is.
  }
  if (!s) return null;
  const pins = [...s.matchAll(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/g)].filter((m) => valid(Number(m[1]), Number(m[2])));
  const pin = pins.at(-1);
  if (pin) return { lat: round(Number(pin[1])), lng: round(Number(pin[2])) };
  const patterns = [
    /[?&](?:q|query|ll|destination|center)=(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/,
    /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
    /^(-?\d+(?:\.\d+)?)\s*[,;\s]\s*(-?\d+(?:\.\d+)?)$/,
  ];
  for (const re of patterns) {
    const m = re.exec(s);
    if (m && valid(Number(m[1]), Number(m[2]))) return { lat: round(Number(m[1])), lng: round(Number(m[2])) };
  }
  return null;
}

export const formatCoords = (c: LatLng) => `${c.lat}, ${c.lng}`;

/** True for share links (maps.app.goo.gl, goo.gl/maps) that hide the coordinates behind a redirect. */
export const isShortMapsLink = (s: string) => /^(https?:\/\/)?(maps\.app\.goo\.gl|goo\.gl\/maps)\//i.test(s.trim());

const target = (c: LatLng | null, query: string) => (c ? `${c.lat},${c.lng}` : query);

export const mapsEmbedUrl = (c: LatLng | null, query = '', zoom = 17) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(target(c, query))}&z=${zoom}&output=embed`;

export const mapsOpenUrl = (c: LatLng | null, query = '') =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(target(c, query))}`;

export const mapsDirectionsUrl = (c: LatLng | null, query = '') =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(target(c, query))}`;
