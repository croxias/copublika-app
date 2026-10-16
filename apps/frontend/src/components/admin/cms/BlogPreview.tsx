'use client';

import { Clock3 } from 'lucide-react';
import { authorName, categoryLabel } from '@/lib/cms/config/blog';
import type { FieldContext, Values } from '@/lib/cms/types';
import { formatDate } from './ui';
import { wordCount } from './validate';

const initials = (name: string) =>
  name.replace(/^(dr|prof)\.?\s+/i, '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

/** How an article will look in the archive card, the article hero and the editor's pick note. */
export function BlogPreview({ values: v, ctx }: { values: Values; ctx: FieldContext }) {
  const person = !v.guestAuthor ? ctx.collections.people?.find((p) => p.id === v.authorId) : undefined;
  const name = authorName(v, ctx) || 'Nama penulis';
  const affiliation = String((v.guestAuthor ? v.authorAffiliation : person?.affiliation) ?? '');
  const photo = person?.photo ? String(person.photo) : '';
  const minutes = Math.max(1, Math.round(wordCount(String(v.content ?? '')) / 200));
  const cover = String(v.cover ?? '');
  const title = String(v.title ?? '') || 'Judul artikel';
  const excerpt = String(v.excerpt ?? '') || 'Ringkasan artikel tampil di sini.';
  const date = v.publishAt ? formatDate(String(v.publishAt)) : 'Tanggal terbit';
  const avatar = photo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={photo} alt="" />
  ) : (
    <span>{initials(name) || 'CP'}</span>
  );

  return (
    <div className="bpv">
      <section>
        <span className="bpv-k">Kartu di arsip</span>
        <article className="bpv-card">
          <div className="bpv-card__media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {cover ? <img src={cover} alt="" /> : <span>Belum ada sampul</span>}
            <em>{categoryLabel(v.category)}</em>
          </div>
          <div className="bpv-card__body">
            <strong>{title}</strong>
            <p>{excerpt}</p>
            <small>{name} · <Clock3 size={11} aria-hidden="true" /> {minutes} menit</small>
          </div>
        </article>
      </section>

      <section>
        <span className="bpv-k">Hero halaman artikel</span>
        <div className="bpv-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {cover && <img src={cover} alt="" />}
          <i className="bpv-hero__tint" aria-hidden="true" />
          <div className="bpv-hero__body">
            <em>{categoryLabel(v.category)}</em>
            <strong>{title}</strong>
            <p>{excerpt}</p>
            <div className="bpv-by">
              <span className="bpv-avatar">{avatar}</span>
              <span>
                <b>{name}</b>
                <small>{[affiliation, date, `${minutes} menit baca`].filter(Boolean).join(' · ')}</small>
              </span>
            </div>
          </div>
        </div>
        {!v.guestAuthor && !person && <p className="bpv-warn">Pilih penulis supaya foto, afiliasi, dan bio tampil di kartu penulis.</p>}
      </section>

      {!!v.editorsPick && (
        <section>
          <span className="bpv-k">Pilihan editor</span>
          <div className="bpv-pick">
            <small>Kenapa dipilih</small>
            <p>{String(v.editorNote ?? '') || 'Tulis satu kalimat alasan editor memilih artikel ini.'}</p>
          </div>
        </section>
      )}
    </div>
  );
}
