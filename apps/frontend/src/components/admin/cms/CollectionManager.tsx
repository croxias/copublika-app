'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUp, Copy, ExternalLink, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { CmsSelect } from './CmsSelect';
import { findUsages, useCms } from '@/lib/cms/store';
import { SECTION_LABELS } from '@/lib/cms/config/pages';
import type { CmsItem, CollectionConfig, FieldContext } from '@/lib/cms/types';
import { RecordEditor, capitalize, editingFor, type Editing } from './RecordEditor';
import { ConfirmDialog, PageHeader, StagingNote, StatusBadge, formatDate } from './ui';

type Props = {
  config: CollectionConfig;
  crumb: string[];
  title: string;
  accent?: string;
  description: string;
  publicHref?: string;
  /** Extra buttons in the page header (e.g. "Kelola cluster"). */
  headerActions?: React.ReactNode;
  /** Content between the toolbar and the table (e.g. a hint card). */
  intro?: React.ReactNode;
};


export function CollectionManager({ config, crumb, title, accent, description, publicHref, headerActions, intro }: Props) {
  const cms = useCms();
  const items = cms.collections[config.key];
  const ctx: FieldContext = { sections: cms.sections, collections: cms.collections };

  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [extra, setExtra] = useState('all');
  const [editing, setEditing] = useState<(Editing & { nonce: number }) | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<CmsItem | null>(null);

  const sorted = useMemo(() => {
    const list = [...items];
    if (config.sortable) list.sort((a, b) => a.order - b.order);
    else if (config.sortBy) list.sort(config.sortBy);
    return list;
  }, [items, config]);

  const visible = sorted.filter((x) => {
    if (status !== 'all' && x.status !== status) return false;
    if (extra !== 'all' && config.filter && !config.filter.match(x, extra)) return false;
    if (q) {
      const hay = `${config.titleOf(x)} ${config.subtitleOf?.(x, ctx) ?? ''}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });
  const canReorder = !!config.sortable && status === 'all' && extra === 'all' && !q;

  const open = (item?: CmsItem, duplicate = false) => setEditing({ ...editingFor(config, item, duplicate), nonce: Date.now() });

  const remove = (item: CmsItem) => {
    const before = items;
    cms.removeItem(config.key, item.id);
    cms.toast(`${capitalize(config.singular)} dihapus.`, 'ok', { label: 'Urungkan', run: () => cms.setCollection(config.key, before) });
    setConfirmDelete(null);
  };

  const reorder = (item: CmsItem, dir: -1 | 1) => {
    const idx = sorted.findIndex((x) => x.id === item.id);
    const target = sorted[idx + dir];
    if (!target) return;
    const next = [...sorted];
    next[idx] = target;
    next[idx + dir] = item;
    cms.setCollection(config.key, next.map((x, i) => ({ ...x, order: i + 1 })));
  };

  const counts = Object.fromEntries(config.statuses.map((s) => [s.value, items.filter((x) => x.status === s.value).length]));
  const usages = confirmDelete ? findUsages(cms.sections, confirmDelete.id, SECTION_LABELS) : [];

  return (
    <section className="cms-page">
      <PageHeader
        crumb={crumb}
        title={title}
        accent={accent}
        description={description}
        publicHref={publicHref}
        actions={
          <>
            {headerActions}
            <button type="button" className="cms-btn cms-btn--solid" onClick={() => open()}>
              <Plus size={15} /> {capitalize(config.singular)} baru
            </button>
          </>
        }
      />
      <StagingNote />
      {intro}

      <div className="cms-toolbar">
        <div className="cms-chips" role="tablist" aria-label="Filter status">
          <button type="button" role="tab" aria-selected={status === 'all'} onClick={() => setStatus('all')}>
            Semua <b>{items.length}</b>
          </button>
          {config.statuses.map((s) => (
            <button type="button" role="tab" key={s.value} aria-selected={status === s.value} onClick={() => setStatus(s.value)}>
              {s.label} <b>{counts[s.value]}</b>
            </button>
          ))}
        </div>
        <div className="cms-toolbar-right">
          {config.filter && (
            <CmsSelect
              aria-label={config.filter.label}
              className="cms-toolbar-select"
              prefix={config.filter.label}
              value={extra}
              onChange={setExtra}
              options={[{ value: 'all', label: `Semua ${config.filter.label.toLowerCase()}` }, ...config.filter.options(ctx)]}
            />
          )}
          <div className="cms-search">
            <Search size={14} aria-hidden="true" />
            <input aria-label="Cari" placeholder={`Cari ${config.singular}…`} value={q} onChange={(e) => setQ(e.target.value)} />
            {q && (
              <button type="button" aria-label="Hapus pencarian" onClick={() => setQ('')}><X size={13} /></button>
            )}
          </div>
        </div>
      </div>

      <div className="cms-table-wrap">
        <table className="cms-table">
          <thead>
            <tr>
              {config.sortable && <th className="cms-col-order" aria-label="Urutan">#</th>}
              <th>Judul</th>
              {config.columns.map((c) => (
                <th key={c.label} style={c.width ? { width: c.width } : undefined}>{c.label}</th>
              ))}
              <th style={{ width: 120 }}>Status</th>
              <th className="cms-col-updated" style={{ width: 120 }}>Diubah</th>
              <th className="cms-col-actions" aria-label="Aksi" />
            </tr>
          </thead>
          <tbody>
            {visible.map((item, i) => {
              const href = config.publicHref?.(item);
              return (
                <tr key={item.id} onClick={() => open(item)} className="cms-row">
                  {config.sortable && (
                    <td className="cms-col-order" data-label="Urutan" onClick={(e) => e.stopPropagation()}>
                      {canReorder ? (
                        <div className="cms-order">
                          <button type="button" aria-label="Naikkan" disabled={i === 0} onClick={() => reorder(item, -1)}><ArrowUp size={13} /></button>
                          <button type="button" aria-label="Turunkan" disabled={i === visible.length - 1} onClick={() => reorder(item, 1)}><ArrowDown size={13} /></button>
                        </div>
                      ) : (
                        <span className="cms-muted">{item.order}</span>
                      )}
                    </td>
                  )}
                  <td className="cms-col-title">
                    <div className="cms-cell-title">
                      <strong>{config.titleOf(item) || <em className="cms-muted">Tanpa judul</em>}</strong>
                      {config.subtitleOf && <small>{config.subtitleOf(item, ctx)}</small>}
                    </div>
                  </td>
                  {config.columns.map((c) => (
                    <td key={c.label} className="cms-col-meta" data-label={c.label}>{c.render(item, ctx)}</td>
                  ))}
                  <td className="cms-col-meta" data-label="Status"><StatusBadge status={item.status} options={config.statuses} /></td>
                  <td className="cms-col-meta cms-col-updated cms-muted cms-nowrap" data-label="Diubah">{formatDate(item.updatedAt)}</td>
                  <td className="cms-col-actions" onClick={(e) => e.stopPropagation()}>
                    <div className="cms-row-actions">
                      <button type="button" aria-label="Edit" title="Edit" onClick={() => open(item)}><Pencil size={14} /></button>
                      <button type="button" aria-label="Duplikat" title="Duplikat" onClick={() => open(item, true)}><Copy size={14} /></button>
                      {href && item.status === 'published' ? (
                        <Link href={href} target="_blank" aria-label="Lihat di web" title="Lihat di web"><ExternalLink size={14} /></Link>
                      ) : null}
                      <button type="button" aria-label="Hapus" title="Hapus" className="is-danger" onClick={() => setConfirmDelete(item)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!visible.length && (
          <div className="cms-empty">
            {items.length ? (
              <p>Tidak ada {config.singular} yang cocok dengan filter.</p>
            ) : (
              <>
                <p>Belum ada {config.singular}.</p>
                <button type="button" className="cms-btn cms-btn--solid" onClick={() => open()}><Plus size={15} /> Tambah {config.singular} pertama</button>
              </>
            )}
          </div>
        )}
        {visible.length > 0 && (
          <p className="cms-table-hint">
            <span>Menampilkan {visible.length} dari {items.length} {config.singular}</span>
            {config.sortable && !canReorder && visible.length > 1 && <span>Hapus filter dan pencarian untuk mengubah urutan.</span>}
          </p>
        )}
      </div>

      {editing && <RecordEditor key={editing.nonce} config={config} editing={editing} onClose={() => setEditing(null)} />}

      <ConfirmDialog
        open={!!confirmDelete}
        danger
        title={`Hapus ${config.singular}?`}
        confirmLabel="Hapus"
        body={
          confirmDelete && (
            <>
              <p><strong>{config.titleOf(confirmDelete)}</strong> akan dihapus. Kamu masih bisa mengurungkannya dari notifikasi sesaat setelah menghapus.</p>
              {usages.length > 0 && <p className="cms-warn">Masih dipakai di: {usages.join(', ')}.</p>}
              {confirmDelete.status === 'published' && !usages.length && <p className="cms-muted">Tip: ubah status ke Draft jika hanya ingin menyembunyikannya dari web.</p>}
            </>
          )
        }
        onConfirm={() => confirmDelete && remove(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
      />
    </section>
  );
}


