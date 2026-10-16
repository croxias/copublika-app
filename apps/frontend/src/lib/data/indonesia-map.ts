import DottedMap from "dotted-map";

// Dotted map of Indonesia for the /contact hero, computed on the server so the browser only
// gets plain coordinates (the country shapes stay out of the client bundle).

import { CITIES, type MapCity } from "./indonesia-cities";

export { CITIES, type MapCity };

export type IndonesiaMap = {
  width: number;
  height: number;
  dots: [number, number][];
  cities: (MapCity & { x: number; y: number })[];
};

let base: { map: DottedMap; width: number; height: number; dots: [number, number][] } | null = null;

/** The dotted country shape is built once; city pins are placed per call. */
function baseMap() {
  if (base) return base;
  const map = new DottedMap({ height: 54, countries: ["IDN"], grid: "diagonal" });
  const dots = map.getPoints().map((p) => [Math.round(p.x * 100) / 100, Math.round(p.y * 100) / 100] as [number, number]);
  base = { map, width: map.image.width, height: map.image.height, dots };
  return base;
}

export function getIndonesiaMap(cities: MapCity[] = CITIES): IndonesiaMap {
  const { map, width, height, dots } = baseMap();
  return {
    width,
    height,
    dots,
    cities: cities.map((c) => {
      const pin = map.getPin({ lat: c.lat, lng: c.lng });
      return { ...c, x: pin?.x ?? 0, y: pin?.y ?? 0 };
    }),
  };
}
