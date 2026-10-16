// Cities on the /contact hero map. Bandung is the office; arcs run from it to the others.

export type MapCity = { name: string; lat: number; lng: number; note: string; hq?: boolean };

/** Bandung is the office; the rest are where members and partner campuses are. */
export const CITIES: MapCity[] = [
  { name: "Bandung", lat: -6.9175, lng: 107.6191, note: "Kantor CoPublika", hq: true },
  { name: "Medan", lat: 3.5952, lng: 98.6722, note: "28 anggota · 4 kampus mitra" },
  { name: "Padang", lat: -0.9471, lng: 100.4172, note: "12 anggota · 2 kampus mitra" },
  { name: "Palembang", lat: -2.9761, lng: 104.7754, note: "15 anggota · 2 kampus mitra" },
  { name: "Jakarta", lat: -6.2088, lng: 106.8456, note: "64 anggota · 9 kampus mitra" },
  { name: "Yogyakarta", lat: -7.7956, lng: 110.3695, note: "41 anggota · 6 kampus mitra" },
  { name: "Surabaya", lat: -7.2575, lng: 112.7521, note: "37 anggota · 5 kampus mitra" },
  { name: "Denpasar", lat: -8.6705, lng: 115.2126, note: "9 anggota · 1 kampus mitra" },
  { name: "Pontianak", lat: -0.0263, lng: 109.3425, note: "7 anggota · 1 kampus mitra" },
  { name: "Balikpapan", lat: -1.2379, lng: 116.8529, note: "8 anggota · 1 kampus mitra" },
  { name: "Makassar", lat: -5.1477, lng: 119.4327, note: "23 anggota · 3 kampus mitra" },
  { name: "Manado", lat: 1.4748, lng: 124.8421, note: "6 anggota · 1 kampus mitra" },
  { name: "Ambon", lat: -3.6954, lng: 128.1814, note: "5 anggota · 1 kampus mitra" },
  { name: "Jayapura", lat: -2.5337, lng: 140.7181, note: "4 anggota · 1 kampus mitra" },
];
