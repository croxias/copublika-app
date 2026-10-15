'use client';

import { useId, useMemo, useState } from 'react';
import { AlertCircle, ArrowDown, ArrowUp, PencilLine, Plus, Search, Trash2, X } from 'lucide-react';
import { ImageInput } from './ImageInput';
import { IconPicker } from './IconPicker';
import { CmsSelect } from './CmsSelect';
import { YoutubePreview } from './YoutubePreview';
import { IconBadge, type IconName } from '@/components/about/IconBadge';
import { ConfirmDialog, Modal } from './ui';
import { slugify } from '@/lib/cms/slug';
import { statusLabel } from '@/lib/cms/config/status';
import type { CmsItem, Field, FieldContext, Values } from '@/lib/cms/types';
import { renderMarkdown, validate, wordCount, type Errors } from './validate';

type FieldsProps = {
  fields: Field[];
  values: Values;
  onChange: (next: Values) => void;
  errors: Errors;
  ctx: FieldContext;
  /** Error path prefix for repeater rows. */
  prefix?: string;
};

/** Renders a list of field configs as a two-column form grid. */
export function Fields({ fields, values, onChange, errors, ctx, prefix = '' }: FieldsProps) {
  return (
    <div className="cms-grid">
      {fields.map((f) => {
        if (f.visibleIf && !f.visibleIf(values)) return null;
        if (f.type === 'heading') {
          return (
            <div key={f.key} className="cms-grid-heading">
              <h4>{f.label}</h4>
              {f.help && <p>{f.help}</p>}
            </div>
          );
        }
        const wide = f.wide || ['textarea', 'markdown', 'repeater', 'ref', 'tags'].includes(f.type);
        return (
          <FieldInput
            key={f.key}
            field={f}
            value={values[f.key]}
            values={values}
            onChange={(v) => onChange({ ...values, [f.key]: v })}
            error={errors[prefix + f.key]}
            errors={errors}
            path={prefix + f.key}
            ctx={ctx}
            wide={wide}
          />
        );
      })}
    </div>
  );
}

type InputProps = {
  field: Exclude<Field, { type: 'heading' }>;
  value: unknown;
  values: Values;
  onChange: (v: unknown) => void;
  error?: string;
  errors: Errors;
  path: string;
  ctx: FieldContext;
  wide: boolean;
};

function FieldInput({ field: f, value, values, onChange, error, errors, path, ctx, wide }: InputProps) {
  const id = useId();
  const str = value === undefined || value === null ? '' : String(value);
  const max = 'max' in f && f.type !== 'number' ? f.max : undefined;
  // Toggles carry their label inline; everything else gets a label row above.
  const labelRow = f.type !== 'toggle' && f.type !== 'repeater' && (
    <div className="cms-label-row">
      <label htmlFor={id}>
        {f.label}
        {f.required && <span className="cms-req" aria-hidden="true"> *</span>}
      </label>
      {max ? <span className={`cms-count ${str.length > max ? 'is-over' : ''}`}>{str.length}/{max}</span> : null}
    </div>
  );

  let control: React.ReactNode;
  switch (f.type) {
    case 'text':
    case 'url':
      control = (
        <>
          <input id={id} type="text" inputMode={f.type === 'text' ? undefined : 'url'} value={str} placeholder={f.placeholder ?? (f.type === 'text' ? '' : '/halaman atau https://…')} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} />
          {f.type === 'url' && f.youtube && <YoutubePreview url={str} />}
        </>
      );
      break;
    case 'icon':
      control = <IconPicker id={id} value={str} options={f.options} onChange={onChange} />;
      break;
    case 'image':
      control = <ImageInput id={id} value={str} onChange={onChange} invalid={!!error} aspect={f.aspect} minWidth={f.minWidth} placeholder={f.placeholder} />;
      break;
    case 'textarea':
      control = <textarea id={id} rows={f.rows ?? 3} value={str} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} />;
      break;
    case 'markdown':
      control = <MarkdownInput id={id} value={str} onChange={onChange} invalid={!!error} />;
      break;
    case 'number':
      control = (
        <div className="cms-suffix">
          <input id={id} type="number" min={f.min} max={f.max} value={str} onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))} aria-invalid={!!error} />
          {f.suffix && <span>{f.suffix}</span>}
        </div>
      );
      break;
    case 'date':
    case 'time':
      control = <input id={id} type={f.type} value={str} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} />;
      break;
    case 'datetime':
      control = <input id={id} type="datetime-local" value={str.slice(0, 16)} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} />;
      break;
    case 'select': {
      const options = typeof f.options === 'function' ? f.options(ctx) : f.options;
      control = (
        <CmsSelect id={id} value={str} onChange={onChange} options={options} allowEmpty={!f.required} invalid={!!error} placeholder={`Pilih ${f.label.toLowerCase()}…`} />
      );
      break;
    }
    case 'toggle':
      control = (
        <label className="cms-toggle" htmlFor={id}>
          <input id={id} type="checkbox" role="switch" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
          <span className="cms-toggle-track" aria-hidden="true"><span /></span>
          <span className="cms-toggle-label">{f.label}</span>
        </label>
      );
      break;
    case 'tags':
      control = <TagsInput id={id} value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} placeholder={f.placeholder} />;
      break;
    case 'slug':
      control = (
        <div className="cms-slug">
          <input id={id} type="text" value={str} onChange={(e) => onChange(slugify(e.target.value))} aria-invalid={!!error} />
          <button type="button" className="cms-btn cms-btn--ghost cms-btn--sm" onClick={() => onChange(slugify(String(values[f.from] ?? '')))}>
            Dari judul
          </button>
        </div>
      );
      break;
    case 'repeater':
      control = <Repeater field={f} rows={Array.isArray(value) ? (value as Values[]) : []} onChange={onChange} errors={errors} path={path} ctx={ctx} />;
      break;
    case 'ref':
      control = <RefPicker field={f} value={value} onChange={onChange} ctx={ctx} />;
      break;
  }

  return (
    <div className={`cms-field ${wide ? 'cms-field--wide' : ''} ${error ? 'has-error' : ''}`} data-path={path}>
      {labelRow}
      {control}
      {f.help && !error && <p className="cms-help">{f.help}</p>}
      {error && <p className="cms-error" role="alert">{error}</p>}
    </div>
  );
}

function MarkdownInput({ id, value, onChange, invalid }: { id: string; value: string; onChange: (v: string) => void; invalid: boolean }) {
  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const words = wordCount(value);
  return (
    <div className="cms-md">
      <div className="cms-md-bar" role="tablist" aria-label="Mode editor">
        <button type="button" role="tab" aria-selected={mode === 'write'} onClick={() => setMode('write')}>Tulis</button>
        <button type="button" role="tab" aria-selected={mode === 'preview'} onClick={() => setMode('preview')}>Pratinjau</button>
        <span className="cms-md-hint">**tebal** · *miring* · ## Judul · - daftar · [teks](https://…)</span>
        <span className="cms-md-count">{words} kata · ±{Math.max(1, Math.round(words / 200))} menit baca</span>
      </div>
      {mode === 'write' ? (
        <textarea id={id} rows={16} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={invalid} className="cms-md-input" />
      ) : (
        <div className="cms-md-preview" dangerouslySetInnerHTML={{ __html: renderMarkdown(value) || '<p class="cms-muted">Belum ada isi.</p>' }} />
      )}
    </div>
  );
}

function TagsInput({ id, value, onChange, placeholder }: { id: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState('');
  const add = () => {
    const t = draft.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setDraft('');
  };
  return (
    <div className="cms-tags">
      {value.map((t) => (
        <span key={t} className="cms-tag">
          {t}
          <button type="button" aria-label={`Hapus ${t}`} onClick={() => onChange(value.filter((x) => x !== t))}><X size={12} /></button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        placeholder={placeholder ?? 'Ketik lalu Enter'}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            add();
          } else if (e.key === 'Backspace' && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={add}
      />
    </div>
  );
}

function move<T>(list: T[], from: number, to: number) {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [x] = next.splice(from, 1);
  next.splice(to, 0, x);
  return next;
}

const blankRow = (fields: Field[]): Values =>
  Object.fromEntries(fields.filter((x) => x.type !== 'heading').map((x) => [x.key, x.type === 'toggle' ? false : x.type === 'tags' || x.type === 'repeater' ? [] : '']));

/**
 * List of rows (steps, cards, stats…). Rows are edited one at a time in a dialog, so the
 * list stays scannable; changes land in the section draft and are saved with the section.
 */
function Repeater({ field: f, rows, onChange, errors, path, ctx }: { field: Extract<Field, { type: 'repeater' }>; rows: Values[]; onChange: (v: Values[]) => void; errors: Errors; path: string; ctx: FieldContext }) {
  // index === rows.length means a new row that is not in the list until applied.
  const [editing, setEditing] = useState<{ index: number; values: Values; initial: string } | null>(null);
  const [rowErrors, setRowErrors] = useState<Errors>({});
  const [confirm, setConfirm] = useState<null | { kind: 'delete'; index: number } | { kind: 'discard' }>(null);
  const rowHasError = (i: number) => Object.keys(errors).some((k) => k.startsWith(`${path}.${i}.`));
  const full = f.maxItems !== undefined && rows.length >= f.maxItems;
  const listError = errors[path];

  const open = (index: number) => {
    const values = index < rows.length ? { ...rows[index] } : blankRow(f.fields);
    setRowErrors(index < rows.length && rowHasError(index) ? validate(f.fields, values) : {});
    setEditing({ index, values, initial: JSON.stringify(values) });
  };
  const dirty = !!editing && JSON.stringify(editing.values) !== editing.initial;
  const isNew = !!editing && editing.index >= rows.length;
  const close = () => (dirty ? setConfirm({ kind: 'discard' }) : setEditing(null));
  const apply = () => {
    if (!editing) return;
    const errs = validate(f.fields, editing.values);
    setRowErrors(errs);
    if (Object.keys(errs).length) return;
    onChange(isNew ? [...rows, editing.values] : rows.map((r, j) => (j === editing.index ? editing.values : r)));
    setEditing(null);
  };
  const noun = (f.addLabel ?? 'Tambah item').replace(/^Tambah\s+/i, '').toLowerCase();

  return (
    <div className="cms-repeater">
      <div className="cms-rep-top">
        <span className="cms-rep-label">
          {f.label}
          {f.required && <span className="cms-req" aria-hidden="true"> *</span>}
          <span className="cms-count">{f.fixed ? `${rows.length} · jumlah tetap` : `${rows.length}${f.maxItems ? `/${f.maxItems}` : ''}`}</span>
        </span>
        {!f.fixed && (
          <button type="button" className="cms-btn cms-btn--ghost cms-btn--sm" disabled={full} title={full ? `Maksimal ${f.maxItems}` : undefined} onClick={() => open(rows.length)}>
            <Plus size={14} /> {f.addLabel ?? 'Tambah item'}
          </button>
        )}
      </div>

      {f.layout === 'cards' && rows.length > 0 ? (
        <ol className="cms-rep-cards">
          {rows.map((row, i) => (
            <li key={i} className={`cms-rep-card ${rowHasError(i) ? 'has-error' : ''}`}>
              <button type="button" className="cms-rep-card-hit" onClick={() => open(i)} aria-label={`Ubah ${f.label.toLowerCase()} ${i + 1}`} />
              <div className="cms-rep-card-top">
                {f.itemIcon?.(row) ? (
                  <IconBadge icon={f.itemIcon(row) as IconName} tone="solid" size={34} />
                ) : (
                  <span className="cms-rep-card-num">{String(i + 1).padStart(2, '0')}</span>
                )}
                {f.itemKicker?.(row) && <span className="cms-rep-card-kicker">{f.itemKicker(row)}</span>}
                {rowHasError(i) && <small className="cms-rep-flag"><AlertCircle size={12} /> Perlu dilengkapi</small>}
              </div>
              <h5>{f.itemTitle(row, i) || <em className="cms-muted">Belum ada judul</em>}</h5>
              {f.itemText?.(row) && <p>{f.itemText(row)}</p>}
              <div className="cms-rep-card-foot">
                <span className="cms-btn cms-btn--ghost cms-btn--sm" aria-hidden="true"><PencilLine size={13} /> Detail</span>
                {!f.fixed && (
                  <div className="cms-rep-actions">
                    <button type="button" className="cms-tip" data-tip="Geser kiri" aria-label="Geser kiri" disabled={i === 0} onClick={() => onChange(move(rows, i, i - 1))}><ArrowUp size={14} /></button>
                    <button type="button" className="cms-tip" data-tip="Geser kanan" aria-label="Geser kanan" disabled={i === rows.length - 1} onClick={() => onChange(move(rows, i, i + 1))}><ArrowDown size={14} /></button>
                    <button type="button" className="cms-tip is-danger" data-tip="Hapus" aria-label="Hapus item" onClick={() => setConfirm({ kind: 'delete', index: i })}><Trash2 size={14} /></button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      ) : rows.length > 0 ? (
        <ol className="cms-rep-list">
          {rows.map((row, i) => (
            <li key={i} className={`cms-rep-row ${rowHasError(i) ? 'has-error' : ''}`}>
              <span className="cms-rep-index">{String(i + 1).padStart(2, '0')}</span>
              {f.itemPerson && <RowAvatar id={f.itemPerson(row)} ctx={ctx} />}
              <button type="button" className="cms-rep-title" onClick={() => open(i)}>
                <span>{f.itemTitle(row, i) || <em className="cms-muted">Item tanpa judul</em>}</span>
                {rowHasError(i) && <small className="cms-rep-flag"><AlertCircle size={12} /> Perlu dilengkapi</small>}
              </button>
              {!f.fixed && <div className="cms-rep-actions">
                <button type="button" className="cms-tip" data-tip="Naikkan" aria-label="Naikkan" disabled={i === 0} onClick={() => onChange(move(rows, i, i - 1))}><ArrowUp size={14} /></button>
                <button type="button" className="cms-tip" data-tip="Turunkan" aria-label="Turunkan" disabled={i === rows.length - 1} onClick={() => onChange(move(rows, i, i + 1))}><ArrowDown size={14} /></button>
                <button type="button" className="cms-tip is-danger" data-tip="Hapus" aria-label="Hapus item" onClick={() => setConfirm({ kind: 'delete', index: i })}><Trash2 size={14} /></button>
              </div>}
              <button type="button" className="cms-btn cms-btn--ghost cms-btn--sm cms-rep-detail" onClick={() => open(i)}>
                <PencilLine size={13} /> Detail
              </button>
            </li>
          ))}
        </ol>
      ) : (
        <p className="cms-empty-inline">Belum ada {noun}.</p>
      )}
      {listError && <p className="cms-error" role="alert">{listError}</p>}

      <Modal
        open={!!editing}
        title={isNew ? (f.addLabel ?? 'Tambah item') : `${f.label} ${String((editing?.index ?? 0) + 1).padStart(2, '0')}`}
        subtitle={isNew ? 'Masuk ke daftar setelah kamu klik Tambahkan.' : 'Perubahan ikut tersimpan saat kamu menyimpan section.'}
        onClose={close}
        footer={
          <div className="cms-drawer-foot-right">
            <button type="button" className="cms-btn cms-btn--ghost" onClick={close}>Batal</button>
            <button type="button" className="cms-btn cms-btn--solid" disabled={!isNew && !dirty} onClick={apply}>{isNew ? 'Tambahkan' : 'Terapkan'}</button>
          </div>
        }
      >
        {editing && (
          <Fields
            fields={f.fields}
            values={editing.values}
            onChange={(v) => {
              setEditing({ ...editing, values: v });
              if (Object.keys(rowErrors).length) setRowErrors(validate(f.fields, v));
            }}
            errors={rowErrors}
            ctx={ctx}
          />
        )}
      </Modal>
      <ConfirmDialog
        open={confirm?.kind === 'delete'}
        danger
        title={`Hapus ${noun}?`}
        confirmLabel="Hapus"
        body={
          <p>
            <strong>{confirm?.kind === 'delete' ? f.itemTitle(rows[confirm.index] ?? {}, confirm.index) || 'Item tanpa judul' : ''}</strong> dihapus dari daftar.
            Belum permanen sampai section disimpan.
          </p>
        }
        onConfirm={() => {
          if (confirm?.kind === 'delete') onChange(rows.filter((_, j) => j !== confirm.index));
          setConfirm(null);
        }}
        onCancel={() => setConfirm(null)}
      />
      <ConfirmDialog
        open={confirm?.kind === 'discard'}
        danger
        title="Buang perubahan item ini?"
        confirmLabel="Buang"
        body={<p>Isian di jendela ini belum diterapkan.</p>}
        onConfirm={() => {
          setConfirm(null);
          setEditing(null);
        }}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}

/** Small round photo of the person linked to a row; a dashed placeholder when nobody is linked. */
function RowAvatar({ id, ctx }: { id: string; ctx: FieldContext }) {
  const person = id ? ctx.collections.people.find((p) => p.id === id) : undefined;
  const photo = person ? String(person.photo ?? '') : '';
  return (
    <span className={`cms-rep-avatar ${person ? '' : 'is-empty'}`} title={person ? String(person.name) : 'Posisi terbuka'}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {photo ? <img src={photo} alt="" /> : null}
    </span>
  );
}

export const itemLabel = (item: Values) => String(item.name ?? item.title ?? item.question ?? item.id ?? '');

function RefPicker({ field: f, value, onChange, ctx }: { field: Extract<Field, { type: 'ref' }>; value: unknown; onChange: (v: unknown) => void; ctx: FieldContext }) {
  const [q, setQ] = useState('');
  const [adding, setAdding] = useState(false);
  const all = useMemo(() => (ctx.collections[f.collection] ?? []).filter((x) => !f.filter || f.filter(x)), [ctx.collections, f]);
  const byId = useMemo(() => new Map(all.map((x) => [x.id, x])), [all]);
  const selected: string[] = f.multiple ? (Array.isArray(value) ? (value as string[]) : []) : value ? [String(value)] : [];
  const candidates = all.filter((x) => !selected.includes(x.id) && (!q || itemLabel(x).toLowerCase().includes(q.toLowerCase())));
  const set = (ids: string[]) => onChange(f.multiple ? ids : ids[0] ?? '');

  return (
    <div className="cms-ref">
      {selected.length > 0 && (
        <ol className="cms-ref-list">
          {selected.map((sid, i) => {
            const item = byId.get(sid) as CmsItem | undefined;
            return (
              <li key={sid} className={!item ? 'is-missing' : item.status !== 'published' && item.status !== 'active' ? 'is-draft' : ''}>
                <span className="cms-rep-index">{String(i + 1).padStart(2, '0')}</span>
                <span className="cms-ref-name">
                  {item ? itemLabel(item) : 'Item sudah dihapus'}
                  {item && item.status !== 'published' && item.status !== 'active' && <small> · tidak tampil (status {statusLabel(item.status)})</small>}
                </span>
                <div className="cms-rep-actions">
                  {f.multiple && (
                    <>
                      <button type="button" aria-label="Naikkan" disabled={i === 0} onClick={() => set(move(selected, i, i - 1))}><ArrowUp size={14} /></button>
                      <button type="button" aria-label="Turunkan" disabled={i === selected.length - 1} onClick={() => set(move(selected, i, i + 1))}><ArrowDown size={14} /></button>
                    </>
                  )}
                  <button type="button" aria-label="Lepas" className="is-danger" onClick={() => set(selected.filter((x) => x !== sid))}><X size={14} /></button>
                </div>
              </li>
            );
          })}
        </ol>
      )}
      {(f.multiple || !selected.length) && !adding && (
        <button type="button" className="cms-btn cms-btn--ghost cms-btn--sm" onClick={() => setAdding(true)}>
          <Plus size={14} /> Pilih dari pustaka
        </button>
      )}
      {adding && (
        <div className="cms-ref-pop">
          <div className="cms-search">
            <Search size={14} aria-hidden="true" />
            <input autoFocus placeholder="Cari…" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Escape' && setAdding(false)} />
            <button type="button" aria-label="Tutup" onClick={() => setAdding(false)}><X size={14} /></button>
          </div>
          <ul>
            {candidates.slice(0, 40).map((x) => (
              <li key={x.id}>
                <button type="button" onClick={() => { set([...selected, x.id]); setQ(''); if (!f.multiple) setAdding(false); }}>
                  {itemLabel(x)}
                  {x.status !== 'published' && x.status !== 'active' && <small className="cms-muted"> · {statusLabel(x.status)}</small>}
                </button>
              </li>
            ))}
            {!candidates.length && <li className="cms-muted cms-ref-none">Tidak ada item lain.</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
