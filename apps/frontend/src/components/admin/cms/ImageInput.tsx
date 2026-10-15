'use client';

import { useRef, useState } from 'react';
import { AlertTriangle, ImageUp, Link2, Loader2, RefreshCw, Trash2 } from 'lucide-react';

const ACCEPT = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_FILE_MB = 8;
/** Uploads are scaled down to this width; enough for a full-bleed hero on a 2560 px screen at q≈0.82. */
const MAX_WIDTH = 2400;

type Meta = { w: number; h: number; bytes?: number; name?: string };

/**
 * Image field: upload (drag & drop or picker) or a URL. In the staging phase an upload is
 * resized and stored as a WebP data URL; the backend phase swaps this for object storage
 * and keeps the same field value contract (a string the <img> can load).
 */
export function ImageInput({
  id,
  value,
  onChange,
  invalid,
  aspect = '16 / 9',
  minWidth,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  invalid: boolean;
  aspect?: string;
  minWidth?: number;
  placeholder?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [problem, setProblem] = useState('');
  const [meta, setMeta] = useState<Meta | null>(null);
  const [urlMode, setUrlMode] = useState(false);
  const isUpload = value.startsWith('data:');
  const showable = isUpload || /^(\/|https?:\/\/)/.test(value);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setProblem('');
    if (!ACCEPT.includes(file.type)) return setProblem('Format belum didukung. Pakai JPG, PNG, WebP, atau AVIF.');
    if (file.size > MAX_FILE_MB * 1024 * 1024) return setProblem(`Ukuran file ${(file.size / 1048576).toFixed(1)} MB, maksimal ${MAX_FILE_MB} MB.`);
    setBusy(true);
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, MAX_WIDTH / bitmap.width);
      const w = Math.round(bitmap.width * scale);
      const h = Math.round(bitmap.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d')!.drawImage(bitmap, 0, 0, w, h);
      bitmap.close();
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/webp', 0.82));
      if (!blob) throw new Error('encode');
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      setMeta({ w, h, bytes: blob.size, name: file.name });
      setUrlMode(false);
      onChange(dataUrl);
    } catch {
      setProblem('Gambar tidak bisa dibaca. Coba file lain.');
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const picker = (
    <input ref={fileRef} type="file" accept={ACCEPT.join(',')} hidden onChange={(e) => handleFile(e.target.files?.[0])} />
  );
  const tooSmall = minWidth && meta && meta.w < minWidth;

  const urlInput = (
    <div className="cms-image-url">
      <Link2 size={14} aria-hidden="true" />
      <input
        id={id}
        type="text"
        inputMode="url"
        value={isUpload ? '' : value}
        placeholder={placeholder ?? 'https://… atau /gambar.jpg'}
        onChange={(e) => {
          setMeta(null);
          setProblem('');
          onChange(e.target.value);
        }}
        aria-invalid={invalid}
      />
    </div>
  );

  if (!showable || busy) {
    return (
      <div className="cms-image">
        {picker}
        <div
          className={`cms-drop ${drag ? 'is-drag' : ''} ${invalid ? 'is-invalid' : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
        >
          {busy ? (
            <span className="cms-drop-busy"><Loader2 size={18} className="cms-spin" /> Memproses gambar…</span>
          ) : (
            <>
              <span className="cms-drop-icon" aria-hidden="true"><ImageUp size={20} /></span>
              <p>
                <strong>Seret gambar ke sini</strong> atau{' '}
                <button type="button" className="cms-link-btn" onClick={() => fileRef.current?.click()}>pilih file</button>
              </p>
              <small>JPG, PNG, WebP · maks {MAX_FILE_MB} MB{minWidth ? ` · min. ${minWidth} px lebar` : ''}</small>
            </>
          )}
        </div>
        {urlMode ? urlInput : (
          <button type="button" className="cms-link-btn cms-image-alt" onClick={() => setUrlMode(true)}>
            <Link2 size={13} /> Pakai URL gambar
          </button>
        )}
        {problem && <p className="cms-error" role="alert">{problem}</p>}
      </div>
    );
  }

  return (
    <div className="cms-image">
      {picker}
      <figure className="cms-image-frame" style={{ aspectRatio: aspect }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={value}
          alt=""
          onLoad={(e) => {
            const img = e.currentTarget;
            setMeta((m) => (m && m.w === img.naturalWidth ? m : { w: img.naturalWidth, h: img.naturalHeight }));
          }}
          onError={() => setProblem('Gambar dari URL ini tidak bisa dimuat.')}
        />
        <figcaption>
          <span className="cms-image-meta">
            {isUpload ? 'Diunggah' : 'URL'}
            {meta && ` · ${meta.w}×${meta.h}`}
            {meta?.bytes ? ` · ${Math.round(meta.bytes / 1024)} KB` : ''}
          </span>
          <span className="cms-image-actions">
            <button type="button" onClick={() => fileRef.current?.click()}><RefreshCw size={13} /> Ganti</button>
            <button type="button" onClick={() => setUrlMode((x) => !x)}><Link2 size={13} /> URL</button>
            <button type="button" className="is-danger" aria-label="Hapus gambar" onClick={() => { setMeta(null); setProblem(''); onChange(''); }}><Trash2 size={13} /></button>
          </span>
        </figcaption>
      </figure>
      {urlMode && urlInput}
      {tooSmall && (
        <p className="cms-image-warn"><AlertTriangle size={13} /> Lebar {meta!.w} px, di bawah {minWidth} px yang disarankan. Gambar bisa terlihat pecah di layar besar.</p>
      )}
      {problem && <p className="cms-error" role="alert">{problem}</p>}
    </div>
  );
}
