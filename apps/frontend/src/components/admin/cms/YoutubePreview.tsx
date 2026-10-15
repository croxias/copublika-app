'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Play, X } from 'lucide-react';
import { youtubeId } from '@/components/about/HeroVideo';

/** Under a YouTube url field: recognised video with its thumbnail and a test player, or a warning. */
export function YoutubePreview({ url }: { url: string }) {
  const [playing, setPlaying] = useState(false);
  if (!url.trim()) return null;
  const id = youtubeId(url);
  if (!id) {
    return (
      <p className="cms-yt cms-yt--bad">
        <AlertTriangle size={14} /> Link belum dikenali sebagai video YouTube. Salin link dari tombol Bagikan di YouTube.
      </p>
    );
  }
  return (
    <div className="cms-yt">
      <div className="cms-yt__media">
        {playing ? (
          <>
            <iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title="Pratinjau video" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
            <button type="button" className="cms-yt__close" onClick={() => setPlaying(false)} aria-label="Tutup pratinjau"><X size={14} /></button>
          </>
        ) : (
          <button type="button" className="cms-yt__poster" onClick={() => setPlaying(true)} aria-label="Putar pratinjau">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" />
            <span className="cms-yt__play"><Play size={16} fill="currentColor" strokeWidth={0} /></span>
          </button>
        )}
      </div>
      <div className="cms-yt__meta">
        <span className="cms-yt__ok"><CheckCircle2 size={14} /> Video dikenali</span>
        <code>ID {id}</code>
        <span className="cms-muted">Klik gambar untuk mencoba memutar.</span>
      </div>
    </div>
  );
}
