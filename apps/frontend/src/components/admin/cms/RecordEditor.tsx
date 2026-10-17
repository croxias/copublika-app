'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Check, Eye, EyeOff, Trash2 } from 'lucide-react';
import { CmsSelect } from './CmsSelect';
import { findUsages, newId, nowIso, useCms } from '@/lib/cms/store';
import { SECTION_LABELS } from '@/lib/cms/config/pages';
import type { CmsItem, CollectionConfig, Field, FieldContext, Values } from '@/lib/cms/types';
import { Fields, fieldSections, type FieldSection } from './Fields';
import { GroupIconView } from './SectionGroups';
import { ConfirmDialog, Drawer, formatDate, useUnsavedGuard } from './ui';
import { validate, type Errors } from './validate';

export type Editing = { id: string | null; values: Values };

/** Labels of the fields whose value differs between two snapshots, for the save confirmation. */
export function changedLabels(fields: Field[], before: Values, after: Values, extra: Record<string, string> = {}): string[] {
  const labels: string[] = [];
  for (const f of fields) {
    if (f.type === 'heading') continue;
    if (JSON.stringify(before[f.key] ?? '') !== JSON.stringify(after[f.key] ?? '')) labels.push(f.label);
  }
  for (const [key, label] of Object.entries(extra)) {
    if (JSON.stringify(before[key] ?? '') !== JSON.stringify(after[key] ?? '')) labels.push(label);
  }
  return labels;
}

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Slide-over editor for one record of a collection: validation, a save confirmation that
 * lists what changed, delete with usage warning, and a guard against losing edits.
 */
export function RecordEditor({
  config,
  editing,
  onClose,
  preview,
  previewOpen = false,
}: {
  config: CollectionConfig;
  editing: Editing;
  onClose: () => void;
  /** Optional live preview shown beside the form (wide drawers only). */
  preview?: (values: Values, ctx: FieldContext) => React.ReactNode;
  /** Show the preview from the start instead of behind the Pratinjau button. */
  previewOpen?: boolean;
}) {
  const cms = useCms();
  const items = cms.collections[config.key];
  const ctx: FieldContext = { sections: cms.sections, collections: cms.collections };
  const [initial] = useState(() => JSON.stringify(editing.values));
  const [values, setValues] = useState<Values>(editing.values);
  const [errors, setErrors] = useState<Errors>({});
  const [confirm, setConfirm] = useState<null | 'save' | 'delete' | 'discard'>(null);
  const [showPreview, setShowPreview] = useState(previewOpen);
  // Centered dialogs with several headings get a section rail on the left.
  const sections = config.drawer === 'center' ? fieldSections(config.fields).filter((x) => x.label) : [];
  const railed = sections.length >= 3;
  const [activeSec, setActiveSec] = useState(sections[0]?.key ?? '');
  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!railed) return;
    const root = bodyRef.current?.closest('.cms-drawer-body') ?? null;
    const io = new IntersectionObserver(
      (entries) => {
        const top = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        const key = top?.target.getAttribute('data-section');
        if (key) setActiveSec(key);
      },
      { root, rootMargin: '0px 0px -65% 0px' },
    );
    root?.querySelectorAll('.cms-fsec').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [railed, showPreview]);

  const dirty = JSON.stringify(values) !== initial;
  useUnsavedGuard(dirty);

  const existing = editing.id ? items.find((x) => x.id === editing.id) : undefined;
  const href = existing && config.publicHref?.(existing);
  const title = config.titleOf(values) || `${config.singular} tanpa judul`;
  const changes = changedLabels(config.fields, JSON.parse(initial) as Values, values, { status: 'Status' });
  const usages = existing ? findUsages(cms.sections, existing.id, SECTION_LABELS) : [];

  const close = () => (dirty ? setConfirm('discard') : onClose());

  const check = (v: Values) => ({ ...validate(config.fields, v), ...(config.validateRecord?.(v, items.filter((x) => x.id !== editing.id)) ?? {}) });

  const requestSave = () => {
    const errs = check(values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      cms.toast('Periksa kembali isian yang ditandai merah.', 'error');
      requestAnimationFrame(() => document.querySelector('.cms-drawer .has-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
      return;
    }
    setConfirm('save');
  };

  const save = () => {
    let next = values;
    if (config.beforeSave) next = config.beforeSave(next, items, ctx);
    const saved: CmsItem = {
      ...next,
      id: editing.id ?? newId(config.key),
      status: String(next.status ?? config.initialStatus),
      order: existing?.order ?? items.reduce((m, x) => Math.max(m, x.order), 0) + 1,
      updatedAt: nowIso(),
    };
    const merged = existing ? items.map((x) => (x.id === saved.id ? saved : x)) : [...items, saved];
    cms.setCollection(config.key, config.afterSave ? config.afterSave(saved, merged) : merged);
    cms.toast(existing ? `Perubahan ${config.singular} disimpan.` : `${capitalize(config.singular)} baru ditambahkan.`);
    setConfirm(null);
    onClose();
  };

  const remove = () => {
    if (!existing) return;
    const before = items;
    cms.removeItem(config.key, existing.id);
    cms.toast(`${capitalize(config.singular)} dihapus.`, 'ok', { label: 'Urungkan', run: () => cms.setCollection(config.key, before) });
    setConfirm(null);
    onClose();
  };

  const willShow = values.status === 'published';

  return (
    <>
      <Drawer
        open
        size={config.drawer ?? 'md'}
        title={existing ? `Edit ${config.singular}` : `${capitalize(config.singular)} baru`}
        subtitle={
          existing ? (
            <>
              Terakhir diubah {formatDate(existing.updatedAt, true)}
              {href && existing.status === 'published' && (
                <> · <Link href={href} target="_blank">Lihat di web ↗</Link></>
              )}
            </>
          ) : (
            'Belum tersimpan'
          )
        }
        onClose={close}
        footer={
          <>
            {existing && (
              <button type="button" className="cms-btn cms-btn--ghost is-danger" aria-label="Hapus" onClick={() => setConfirm('delete')}>
                <Trash2 size={14} /> <span className="cms-hide-sm">Hapus</span>
              </button>
            )}
            <div className="cms-drawer-foot-right">
              {preview && (
                <button type="button" className="cms-btn cms-btn--ghost" aria-pressed={showPreview} onClick={() => setShowPreview((v) => !v)}>
                  {showPreview ? <EyeOff size={14} /> : <Eye size={14} />} <span className="cms-hide-sm">Pratinjau</span>
                </button>
              )}
              {dirty && <span className="cms-unsaved cms-hide-sm">Belum disimpan</span>}
              <label className="cms-status-select">
                <span className="cms-hide-sm">Status</span>
                <CmsSelect
                  aria-label="Status"
                  size="sm"
                  value={String(values.status ?? '')}
                  onChange={(status) => setValues({ ...values, status })}
                  options={config.statuses.map((s) => ({ value: s.value, label: s.label, tone: s.tone }))}
                />
              </label>
              <button type="button" className="cms-btn cms-btn--ghost" onClick={close}>Batal</button>
              <button type="button" className="cms-btn cms-btn--solid" disabled={!!existing && !dirty} onClick={requestSave}>Simpan</button>
            </div>
          </>
        }
      >
        <div ref={bodyRef} className={railed ? 'cms-editor' : undefined}>
          {railed && <SectionRail sections={sections} values={values} errors={errors} active={activeSec} onPick={setActiveSec} />}
          <div className={preview && showPreview ? 'cms-drawer-split' : undefined}>
            <Fields
              fields={config.fields}
              values={values}
              onChange={(next) => {
                setValues(next);
                if (Object.keys(errors).length) setErrors(check(next));
              }}
              errors={errors}
              ctx={ctx}
              sectioned={config.drawer === 'center'}
            />
            {preview && showPreview && <aside className="cms-drawer-preview" aria-label="Pratinjau">{preview(values, ctx)}</aside>}
          </div>
        </div>
      </Drawer>

      <ConfirmDialog
        open={confirm === 'save'}
        title={existing ? `Simpan perubahan ${config.singular}?` : `Tambahkan ${config.singular}?`}
        confirmLabel={existing ? 'Ya, simpan' : 'Ya, tambahkan'}
        body={
          <>
            <p><strong>{title}</strong></p>
            {existing && changes.length > 0 && (
              <>
                <p className="cms-muted">Yang berubah:</p>
                <ul className="cms-change-list">
                  {changes.map((c) => <li key={c}>{c}</li>)}
                </ul>
              </>
            )}
            <p className={willShow ? 'cms-confirm-live' : 'cms-muted'}>
              {willShow ? (config.key === 'events' ? 'Berstatus Tampil, jadi langsung terlihat di Agenda website.' : 'Berstatus Tampil, jadi langsung terlihat di website setelah backend tersambung.') : 'Berstatus ' + (config.statuses.find((s) => s.value === values.status)?.label ?? values.status) + ', jadi belum terlihat di website.'}
            </p>
          </>
        }
        onConfirm={save}
        onCancel={() => setConfirm(null)}
      />
      <ConfirmDialog
        open={confirm === 'delete'}
        danger
        title={`Hapus ${config.singular}?`}
        confirmLabel="Hapus"
        body={
          <>
            <p><strong>{title}</strong> akan dihapus. Kamu masih bisa mengurungkannya dari notifikasi sesaat setelah menghapus.</p>
            {usages.length > 0 && <p className="cms-warn">Masih dipakai di: {usages.join(', ')}.</p>}
            {existing?.status === 'published' && !usages.length && <p className="cms-muted">Tip: ubah status ke Draft jika hanya ingin menyembunyikannya.</p>}
          </>
        }
        onConfirm={remove}
        onCancel={() => setConfirm(null)}
      />
      <ConfirmDialog
        open={confirm === 'discard'}
        danger
        title="Buang perubahan?"
        confirmLabel="Buang perubahan"
        body={<p>Ada perubahan yang belum disimpan. Jika ditutup, perubahan itu hilang.</p>}
        onConfirm={() => {
          setConfirm(null);
          onClose();
        }}
        onCancel={() => setConfirm(null)}
      />
    </>
  );
}

/** Values for a new record, or a copy of an existing one. */
export function editingFor(config: CollectionConfig, item?: CmsItem, duplicate = false): Editing {
  if (!item) return { id: null, values: { ...config.defaults(), status: config.initialStatus } };
  if (!duplicate) return { id: item.id, values: { ...item } };
  const copy: Values = { ...item, id: undefined, status: config.initialStatus };
  if (item.title !== undefined) copy.title = `${String(item.title)} (salinan)`;
  if (item.slug !== undefined) copy.slug = `${String(item.slug)}-salinan`;
  return { id: null, values: copy };
}

const isBlank = (v: unknown) => v === undefined || v === null || (typeof v === 'string' && !v.trim()) || (Array.isArray(v) && !v.length);

/** Jump list of the form's sections: icon, name, and how many required fields are filled. */
function SectionRail({ sections, values, errors, active, onPick }: { sections: FieldSection[]; values: Values; errors: Errors; active: string; onPick: (key: string) => void }) {
  const go = (key: string) => {
    onPick(key);
    document.getElementById(`fsec-${key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <nav className="cms-rail" aria-label="Bagian formulir">
      <p className="cms-rail-k">Bagian</p>
      <ol>
        {sections.map((sec, i) => {
          const shown = sec.fields.filter((f) => f.type !== 'heading' && (!f.visibleIf || f.visibleIf(values)));
          if (!shown.length) return null;
          const required = shown.filter((f) => 'required' in f && f.required);
          const filled = required.filter((f) => !isBlank(values[f.key])).length;
          const bad = shown.some((f) => Object.keys(errors).some((e) => e.split('.')[0] === f.key));
          const done = required.length > 0 && filled === required.length;
          return (
            <li key={sec.key}>
              <button type="button" className={`${active === sec.key ? 'is-active' : ''} ${bad ? 'is-bad' : ''}`} aria-current={active === sec.key ? 'step' : undefined} onClick={() => go(sec.key)}>
                <span className="cms-rail-ico" aria-hidden="true"><GroupIconView icon={sec.icon} size={15} /></span>
                <span className="cms-rail-name">
                  <b>{sec.label}</b>
                  <small>{bad ? 'Perlu diperbaiki' : required.length ? `${filled}/${required.length} wajib terisi` : 'Opsional'}</small>
                </span>
                <span className={`cms-rail-state ${done ? 'is-done' : ''}`} aria-hidden="true">{done ? <Check size={11} strokeWidth={3} /> : String(i + 1).padStart(2, '0')}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
