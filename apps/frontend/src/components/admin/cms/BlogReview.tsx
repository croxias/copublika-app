'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Clock3, FileText, Lock, PenLine, Search } from 'lucide-react';
import { useCms } from '@/lib/cms/store';
import { blogConfig, categoryLabel } from '@/lib/cms/config/blog';
import { EDITOR_CHECKS, EVENT_LABEL, REVIEW_STATES, WRITER_KEYS, historyOf, isWriterArticle, reviewOf, withEvent, type ReviewEvent, type ReviewState } from '@/lib/cms/review';
import type { CmsItem, Field, FieldContext, Values } from '@/lib/cms/types';
import { Fields } from './Fields';
import { changedLabels } from './RecordEditor';
import { ReviewBadge, ReviewTimeline } from './ReviewTimeline';
import { ConfirmDialog, Drawer, formatDate, useUnsavedGuard } from './ui';
import { validate, wordCount, type Errors } from './validate';

const EASE = [0.22, 1, 0.36, 1] as const;
const EDITOR = 'Tim Editor';

/** The writer's fields plus the slug, which the editor settles before publishing. */
const REVIEW_FIELDS: Field[] = blogConfig.fields.filter(
  (f) => f.type !== 'heading' && (f.key === 'slug' || (WRITER_KEYS as readonly string[]).includes(f.key)),
);

const lastSubmit = (x: Values) => [...historyOf(x)].reverse().find((e) => e.action === 'submitted' || e.action === 'resubmitted')?.at ?? String(x.updatedAt ?? '');

function Writer({ item, ctx }: { item: Values; ctx: FieldContext }) {
  const p = ctx.collections.people?.find((x) => x.id === item.writerId);
  const name = String(p?.name ?? item.author ?? 'Penulis');
  return (
    <span className="cms-person">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {p?.photo ? <img src={String(p.photo)} alt="" /> : <i aria-hidden="true">{name.charAt(0)}</i>}
      <span>
        {name}
        {p?.affiliation ? <small>{String(p.affiliation)}</small> : null}
      </span>
    </span>
  );
}

const STATE_TABS: { value: ReviewState; label: string }[] = [
  { value: 'submitted', label: 'Menunggu review' },
  { value: 'changes', label: 'Perlu revisi' },
  { value: 'approved', label: 'Disetujui' },
  { value: 'rejected', label: 'Ditolak' },
];

/** Writer articles that reached an editor at least once (private drafts stay in Ruang Penulis). */
export const submissionsOf = (all: CmsItem[]) => all.filter((x) => isWriterArticle(x) && historyOf(x).some((e) => e.action === 'submitted' || e.action === 'resubmitted'));

/**
 * "Pengajuan penulis" tab: every submission by review state. Waiting ones open the review
 * dialog; decided ones open it read-only with the full history.
 */
export function SubmissionsPanel() {
  const cms = useCms();
  const reduce = useReducedMotion();
  const ctx: FieldContext = { sections: cms.sections, collections: cms.collections };
  const [state, setState] = useState<ReviewState | 'all'>('submitted');
  const [q, setQ] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  // Read the clock once per mount so render stays pure.
  const [now] = useState(() => Date.now());
  const all = submissionsOf(cms.collections.blog ?? []);
  const count = (s: ReviewState) => all.filter((x) => reviewOf(x) === s).length;
  const shown = all
    .filter((x) => (state === 'all' || reviewOf(x) === state) && (!q || `${String(x.title ?? '')} ${String(x.author ?? '')}`.toLowerCase().includes(q.toLowerCase())))
    .sort((a, b) => (state === 'submitted' ? lastSubmit(a).localeCompare(lastSubmit(b)) : String(b.updatedAt).localeCompare(String(a.updatedAt))));
  const days = (iso: string) => Math.max(0, Math.floor((now - new Date(iso).getTime()) / 86_400_000));
  const open = all.find((x) => x.id === openId);
  const lastDecision = (x: Values) => [...historyOf(x)].reverse().find((e) => e.by === 'editor' && e.action !== 'edited');

  return (
    <div className="cms-list">
      <div className="cms-toolbar">
        <div className="cms-chips" role="tablist" aria-label="Status pengajuan">
          {STATE_TABS.map((s) => (
            <button type="button" role="tab" key={s.value} aria-selected={state === s.value} onClick={() => setState(s.value)}>
              {s.label} <b>{count(s.value)}</b>
            </button>
          ))}
          <button type="button" role="tab" aria-selected={state === 'all'} onClick={() => setState('all')}>Semua <b>{all.length}</b></button>
        </div>
        <div className="cms-toolbar-right">
          <div className="cms-search">
            <Search size={14} aria-hidden="true" />
            <input aria-label="Cari pengajuan" placeholder="Cari judul atau penulis…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
      </div>
      <div className="cms-table-wrap">
        <table className="cms-table">
          <thead>
            <tr>
              <th>Naskah</th>
              <th style={{ width: 200 }}>Penulis</th>
              <th style={{ width: 150 }}>Status</th>
              <th style={{ width: 220 }}>{state === 'submitted' ? 'Menunggu' : 'Aktivitas terakhir'}</th>
              <th className="cms-col-actions" style={{ width: 110 }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((x, i) => {
              const waiting = reviewOf(x) === 'submitted';
              const wait = days(lastSubmit(x));
              const d = lastDecision(x);
              return (
                <motion.tr key={x.id} className="cms-row" onClick={() => setOpenId(x.id)} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25, delay: i * 0.03, ease: EASE }}>
                  <td className="cms-col-title">
                    <div className="cms-cell-title has-thumb">
                      <span className="cms-thumb" aria-hidden="true">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {x.cover ? <img src={String(x.cover)} alt="" /> : null}
                      </span>
                      <span>
                        <strong>{String(x.title || 'Tanpa judul')}</strong>
                        <small>{categoryLabel(x.category)} · {wordCount(String(x.content ?? ''))} kata · {Number(x.round ?? 1) > 1 ? `pengajuan ke-${String(x.round)}` : 'pengajuan pertama'}</small>
                      </span>
                    </div>
                  </td>
                  <td className="cms-col-meta" data-label="Penulis"><Writer item={x} ctx={ctx} /></td>
                  <td className="cms-col-meta" data-label="Status"><ReviewBadge item={x} /></td>
                  <td className="cms-col-meta" data-label={waiting ? 'Menunggu' : 'Aktivitas terakhir'}>
                    {waiting ? (
                      <span className={`rvq-wait ${wait >= 3 ? 'is-late' : ''}`}><Clock3 size={13} aria-hidden="true" /> {wait === 0 ? 'Masuk hari ini' : `${wait} hari`} · sejak {formatDate(lastSubmit(x))}</span>
                    ) : (
                      <span className="rvq-last">{d ? `${EVENT_LABEL[d.action]} · ${formatDate(d.at)}` : formatDate(String(x.updatedAt))}</span>
                    )}
                  </td>
                  <td className="cms-col-actions" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className={`cms-btn cms-btn--sm ${waiting ? 'cms-btn--solid' : 'cms-btn--ghost'}`} onClick={() => setOpenId(x.id)}>{waiting ? 'Tinjau' : 'Lihat'}</button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
        {!shown.length && (
          <div className="cms-empty">
            <p>{state === 'submitted' ? 'Tidak ada naskah yang menunggu review. Semua beres.' : 'Belum ada pengajuan dengan status ini.'}</p>
          </div>
        )}
      </div>
      {open && <ReviewDrawer key={open.id} item={open} onClose={() => setOpenId(null)} />}
    </div>
  );
}

type Decision = 'changes' | 'reject' | 'approve';

function ReviewDrawer({ item, onClose }: { item: CmsItem; onClose: () => void }) {
  const cms = useCms();
  const ctx: FieldContext = { sections: cms.sections, collections: cms.collections };
  const [values, setValues] = useState<Values>(item);
  const [errors, setErrors] = useState<Errors>({});
  const [checks, setChecks] = useState<boolean[]>(() => EDITOR_CHECKS.map(() => false));
  const [note, setNote] = useState('');
  const [noteError, setNoteError] = useState('');
  const [decision, setDecision] = useState<Decision | null>(null);
  const [mode, setMode] = useState<'now' | 'schedule'>('now');
  const [when, setWhen] = useState('');
  const [discard, setDiscard] = useState(false);
  // Read the clock once per mount so render stays pure.
  const [now] = useState(() => Date.now());
  const readOnly = reviewOf(item) !== 'submitted';

  const edited = useMemo(() => changedLabels(REVIEW_FIELDS, item, values), [item, values]);
  useUnsavedGuard(edited.length > 0 || !!note);
  const words = wordCount(String(values.content ?? ''));
  const allChecked = checks.every(Boolean);

  const close = () => (edited.length || note ? setDiscard(true) : onClose());

  const ask = (d: Decision) => {
    if (d !== 'approve' && !note.trim()) {
      setNoteError(d === 'reject' ? 'Tulis alasan penolakan untuk penulis.' : 'Tulis apa yang perlu diperbaiki penulis.');
      document.getElementById('rvd-note')?.focus();
      return;
    }
    if (d === 'approve') {
      const errs = validate(REVIEW_FIELDS, values);
      setErrors(errs);
      if (Object.keys(errs).length) {
        cms.toast('Lengkapi isian yang ditandai merah sebelum menyetujui.', 'error');
        return;
      }
      if (!allChecked) {
        cms.toast('Centang semua poin verifikasi sebelum menyetujui.', 'error');
        return;
      }
    }
    setNoteError('');
    setDecision(d);
  };

  const commit = () => {
    if (!decision) return;
    let next: CmsItem = { ...item, ...values } as CmsItem;
    // Small edits are logged first, so the writer sees what the editor changed.
    if (edited.length) next = withEvent(next, { by: 'editor', name: EDITOR, action: 'edited', fields: edited });
    const n = note.trim() || undefined;
    if (decision === 'changes') next = withEvent(next, { by: 'editor', name: EDITOR, action: 'changes', note: n }, { review: 'changes' });
    if (decision === 'reject') next = withEvent(next, { by: 'editor', name: EDITOR, action: 'rejected', note: n }, { review: 'rejected' });
    if (decision === 'approve') {
      const scheduled = mode === 'schedule';
      const publishAt = scheduled ? when : new Date().toISOString().slice(0, 16);
      const action: ReviewEvent['action'] = scheduled ? 'scheduled' : 'approved';
      next = withEvent(next, { by: 'editor', name: EDITOR, action, note: n }, { review: 'approved', status: scheduled ? 'scheduled' : 'published', publishAt, authorId: item.writerId, guestAuthor: false });
      next = { ...next, ...blogConfig.beforeSave!(next, cms.collections.blog, ctx) } as CmsItem;
    }
    cms.saveItem('blog', next);
    cms.toast(
      decision === 'approve' ? (mode === 'schedule' ? 'Artikel disetujui dan dijadwalkan.' : 'Artikel disetujui dan diterbitkan.') : decision === 'changes' ? 'Catatan revisi dikirim ke penulis.' : 'Naskah ditolak. Alasan tersimpan di riwayat.',
    );
    setDecision(null);
    onClose();
  };

  const scheduleInvalid = mode === 'schedule' && (!when || new Date(when).getTime() <= now);

  return (
    <>
      <Drawer
        open
        size="center"
        title={readOnly ? 'Detail naskah' : 'Tinjau naskah'}
        subtitle={<>Diajukan {formatDate(lastSubmit(item), true)} · {Number(item.round ?? 1) > 1 ? `pengajuan ke-${String(item.round)}` : 'pengajuan pertama'}</>}
        onClose={close}
        footer={
          readOnly ? (
            <>
              <span className="rvd-state"><ReviewBadge item={item} /> {REVIEW_STATES.find((s) => s.value === reviewOf(item))?.hint}</span>
              <button type="button" className="cms-btn cms-btn--solid" onClick={onClose}>Tutup</button>
            </>
          ) : <>
            <button type="button" className="cms-btn cms-btn--ghost is-danger" onClick={() => ask('reject')}>Tolak</button>
            <div className="cms-drawer-foot-right">
              {edited.length > 0 && <span className="cms-unsaved cms-hide-sm">{edited.length} bagian disunting</span>}
              <button type="button" className="cms-btn cms-btn--ghost" onClick={() => ask('changes')}>Minta revisi</button>
              <button type="button" className="cms-btn cms-btn--solid" onClick={() => ask('approve')}>Setujui…</button>
            </div>
          </>
        }
      >
        <div className="cms-drawer-split rvd">
          <div className="rvd-main">
            {readOnly ? (
              <p className="rvd-hint"><Lock size={14} aria-hidden="true" /> Naskah ini sudah diputuskan. {reviewOf(item) === 'approved' ? 'Untuk mengubah artikel yang sudah tayang, buka dari tab Artikel.' : 'Penulis bisa merevisi dan mengajukannya lagi dari Ruang Penulis.'}</p>
            ) : (
              <p className="rvd-hint"><PenLine size={14} aria-hidden="true" /> Anda boleh merapikan ejaan, judul, atau ringkasan langsung di sini. Setiap suntingan tercatat dan terlihat oleh penulis. Perbaikan besar sebaiknya diminta lewat catatan revisi.</p>
            )}
            <fieldset disabled={readOnly} className="rvd-fieldset">
              <Fields fields={REVIEW_FIELDS} values={values} onChange={(v) => { setValues(v); if (Object.keys(errors).length) setErrors(validate(REVIEW_FIELDS, v)); }} errors={errors} ctx={ctx} />
            </fieldset>
          </div>
          <aside className="cms-drawer-preview rvd-side" aria-label="Keputusan review">
            <section className="rvd-card">
              <span className="rvd-k">Penulis</span>
              <Writer item={item} ctx={ctx} />
              <dl className="rvd-meta">
                <div><dt>Kategori</dt><dd>{categoryLabel(values.category)}</dd></div>
                <div><dt>Panjang</dt><dd><FileText size={12} aria-hidden="true" /> {words} kata</dd></div>
              </dl>
            </section>

            {!readOnly && <section className="rvd-card">
              <span className="rvd-k">Verifikasi editor</span>
              {EDITOR_CHECKS.map((c, i) => (
                <label key={c} className="rvd-check">
                  <input type="checkbox" checked={checks[i]} onChange={(e) => setChecks((xs) => xs.map((x, j) => (j === i ? e.target.checked : x)))} />
                  <span>{c}</span>
                </label>
              ))}
              <small className="cms-muted">{checks.filter(Boolean).length}/{EDITOR_CHECKS.length} dicek · wajib lengkap untuk menyetujui</small>
            </section>}

            {!readOnly && <section className={`rvd-card ${noteError ? 'has-error' : ''}`}>
              <label className="rvd-k" htmlFor="rvd-note">Catatan untuk penulis</label>
              <textarea id="rvd-note" rows={5} value={note} onChange={(e) => { setNote(e.target.value); if (e.target.value.trim()) setNoteError(''); }} placeholder="Wajib saat meminta revisi atau menolak. Opsional saat menyetujui." />
              {noteError && <p className="cms-error">{noteError}</p>}
            </section>}

            <section className="rvd-card">
              <span className="rvd-k">Riwayat</span>
              <ReviewTimeline item={item} />
            </section>
          </aside>
        </div>
      </Drawer>

      <ConfirmDialog
        open={decision === 'changes'}
        title="Kirim permintaan revisi?"
        confirmLabel="Kirim ke penulis"
        body={<><p>Naskah dikembalikan ke penulis dengan catatan Anda.{edited.length ? ` Suntingan Anda (${edited.join(', ')}) ikut tersimpan.` : ''}</p><blockquote className="rvt-note">{note}</blockquote></>}
        onConfirm={commit}
        onCancel={() => setDecision(null)}
      />
      <ConfirmDialog
        open={decision === 'reject'}
        danger
        title="Tolak naskah ini?"
        confirmLabel="Tolak naskah"
        body={<><p>Naskah tidak akan diterbitkan. Penulis melihat alasan ini di Ruang Penulis.</p><blockquote className="rvt-note">{note}</blockquote></>}
        onConfirm={commit}
        onCancel={() => setDecision(null)}
      />
      <ConfirmDialog
        open={decision === 'approve'}
        title="Setujui & terbitkan?"
        confirmLabel={mode === 'schedule' ? 'Setujui & jadwalkan' : 'Setujui & terbitkan'}
        body={
          <div className="rvd-approve">
            <p><strong>{String(values.title ?? '')}</strong></p>
            <label className="rvd-radio">
              <input type="radio" name="rvd-mode" checked={mode === 'now'} onChange={() => setMode('now')} />
              <span><b>Terbitkan sekarang</b><small>Langsung tampil di Blog setelah backend tersambung.</small></span>
            </label>
            <label className="rvd-radio">
              <input type="radio" name="rvd-mode" checked={mode === 'schedule'} onChange={() => setMode('schedule')} />
              <span><b>Jadwalkan</b><small>Tayang otomatis pada waktu yang dipilih.</small></span>
            </label>
            {mode === 'schedule' && (
              <input type="datetime-local" className="rvd-when" value={when} onChange={(e) => setWhen(e.target.value)} aria-label="Waktu terbit" />
            )}
            {scheduleInvalid && <p className="cms-muted">Pilih waktu di masa depan.</p>}
          </div>
        }
        onConfirm={() => (scheduleInvalid ? cms.toast('Pilih waktu terbit di masa depan.', 'error') : commit())}
        onCancel={() => setDecision(null)}
      />
      <ConfirmDialog
        open={discard}
        danger
        title="Tutup tanpa keputusan?"
        confirmLabel="Buang & tutup"
        body={<p>Suntingan dan catatan yang belum dikirim akan hilang. Naskah tetap di antrian.</p>}
        onConfirm={() => { setDiscard(false); onClose(); }}
        onCancel={() => setDiscard(false)}
      />
    </>
  );
}
