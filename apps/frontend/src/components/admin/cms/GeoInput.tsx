'use client';

import { useState } from 'react';
import { Crosshair, ExternalLink, Link2, MapPin, Navigation, Search } from 'lucide-react';
import { formatCoords, isShortMapsLink, mapsDirectionsUrl, mapsEmbedUrl, mapsOpenUrl, parseCoords } from '@/lib/data/geo';

type Props = {
  id: string;
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
  /** Address text, used to search Google Maps when no coordinates are set yet. */
  query?: string;
};

/** Office coordinates: paste a Google Maps link or type lat/lng; a live map shows the pin. */
export function GeoInput({ id, value, onChange, invalid, query = '' }: Props) {
  const coords = parseCoords(value);
  const [link, setLink] = useState('');
  const [hint, setHint] = useState<{ tone: 'ok' | 'warn'; text: string } | null>(null);
  const [lat, setLat] = useState(coords ? String(coords.lat) : '');
  const [lng, setLng] = useState(coords ? String(coords.lng) : '');

  const apply = (text: string) => {
    setLink(text);
    if (!text.trim()) return setHint(null);
    const c = parseCoords(text);
    if (c) {
      onChange(formatCoords(c));
      setLat(String(c.lat));
      setLng(String(c.lng));
      setHint({ tone: 'ok', text: `Koordinat terbaca: ${formatCoords(c)}` });
    } else if (isShortMapsLink(text)) {
      setHint({ tone: 'warn', text: 'Link pendek (maps.app.goo.gl) tidak memuat koordinat. Buka link itu, lalu salin alamat lengkap dari address bar browser.' });
    } else {
      setHint({ tone: 'warn', text: 'Koordinat tidak ditemukan di teks ini. Tempel link Google Maps yang memuat titik lokasi.' });
    }
  };
  const typed = (nextLat: string, nextLng: string) => {
    setLat(nextLat);
    setLng(nextLng);
    const c = parseCoords(`${nextLat}, ${nextLng}`);
    onChange(c ? formatCoords(c) : nextLat || nextLng ? `${nextLat}, ${nextLng}` : '');
  };

  return (
    <div className="geo">
      <div className="geo-steps">
        <label className="geo-paste">
          <Link2 size={15} aria-hidden="true" />
          <input
            id={id}
            type="text"
            inputMode="url"
            value={link}
            placeholder="Tempel link Google Maps di sini…"
            onChange={(e) => apply(e.target.value)}
            aria-describedby={`${id}-hint`}
          />
          <a className="cms-btn cms-btn--ghost cms-btn--sm" href={mapsOpenUrl(null, query || 'Bandung')} target="_blank" rel="noopener noreferrer">
            <Search size={13} /> Cari di Maps
          </a>
        </label>
        <p id={`${id}-hint`} className={`geo-hint ${hint ? `is-${hint.tone}` : ''}`} role={hint ? 'status' : undefined}>
          {hint?.text ?? 'Cari kantor di Google Maps, klik titiknya, lalu salin link dari address bar dan tempel di atas.'}
        </p>
        <div className="geo-pair">
          <label>
            <span>Lintang</span>
            <input type="text" inputMode="decimal" value={lat} placeholder="-6.9034" onChange={(e) => typed(e.target.value, lng)} aria-invalid={invalid} />
          </label>
          <label>
            <span>Bujur</span>
            <input type="text" inputMode="decimal" value={lng} placeholder="107.6181" onChange={(e) => typed(lat, e.target.value)} aria-invalid={invalid} />
          </label>
        </div>
      </div>

      <figure className={`geo-map ${coords ? '' : 'is-empty'}`}>
        {coords ? (
          <iframe key={formatCoords(coords)} title="Pratinjau lokasi kantor" src={mapsEmbedUrl(coords)} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        ) : (
          <div className="geo-map__empty">
            <MapPin size={22} aria-hidden="true" />
            <strong>Belum ada titik lokasi</strong>
            <span>Peta di halaman publik memakai pencarian alamat sampai koordinat diisi.</span>
          </div>
        )}
        {coords && (
          <figcaption>
            <span><Crosshair size={13} aria-hidden="true" /> {formatCoords(coords)}</span>
            <a href={mapsOpenUrl(coords)} target="_blank" rel="noopener noreferrer"><ExternalLink size={13} /> Buka</a>
            <a href={mapsDirectionsUrl(coords)} target="_blank" rel="noopener noreferrer"><Navigation size={13} /> Rute</a>
          </figcaption>
        )}
      </figure>
    </div>
  );
}
