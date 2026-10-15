'use client';

import { useState } from 'react';
import { Layers } from 'lucide-react';
import { useCms } from '@/lib/cms/store';
import type { Field, FieldContext, Values } from '@/lib/cms/types';
import { Fields } from './Fields';
import { ConfirmDialog, Drawer } from './ui';
import { validate, type Errors } from './validate';

const KEY = 'research.clusters';

type Cluster = { name?: string };

/** "Kelola cluster": edits the cluster list used by projects and publications. */
export function ClusterManager() {
  const cms = useCms();
  const [draft, setDraft] = useState<Values | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [confirm, setConfirm] = useState<null | 'discard' | string[]>(null);

  const stored = cms.sections[KEY] ?? { items: [] };
  const usage = (name: string) =>
    (cms.collections.projects ?? []).filter((p) => p.cluster === name).length +
    (cms.collections.publications ?? []).filter((p) => p.cluster === name).length;

  const fields: Field[] = [
    {
      key: 'items',
      label: 'Cluster',
      type: 'repeater',
      addLabel: 'Tambah cluster',
      help: 'Urutan di sini menjadi urutan pilihan di form proyek dan publikasi.',
      itemTitle: (c) => {
        const name = String(c.name ?? '').trim();
        if (!name) return '';
        const n = usage(name);
        return n ? `${name}  ·  dipakai ${n} item` : `${name}  ·  belum dipakai`;
      },
      fields: [{ key: 'name', label: 'Nama cluster', type: 'text', required: true, max: 40 }],
    },
  ];
  const ctx: FieldContext = { sections: cms.sections, collections: cms.collections };

  const names = (v: Values) => ((v.items as Cluster[] | undefined) ?? []).map((c) => String(c.name ?? '').trim());
  const dirty = !!draft && JSON.stringify(draft) !== JSON.stringify(stored);

  const close = () => (dirty ? setConfirm('discard') : setDraft(null));

  const commit = (v: Values) => {
    cms.saveSection(KEY, { items: (v.items as Cluster[]).map((c) => ({ name: String(c.name ?? '').trim() })) });
    cms.toast('Daftar cluster disimpan.');
    setDraft(null);
    setConfirm(null);
  };

  const save = () => {
    if (!draft) return;
    const errs = validate(fields, draft);
    const list = names(draft);
    const dup = list.find((n, i) => n && list.indexOf(n) !== i);
    if (dup) errs.items = `Cluster “${dup}” tercantum dua kali.`;
    setErrors(errs);
    if (Object.keys(errs).length) {
      cms.toast('Periksa kembali daftar cluster.', 'error');
      return;
    }
    // Removing a cluster that projects/publications still use leaves them without a valid one.
    const removedInUse = names(stored).filter((n) => n && !list.includes(n) && usage(n) > 0);
    if (removedInUse.length) setConfirm(removedInUse);
    else commit(draft);
  };

  return (
    <>
      <button type="button" className="cms-btn cms-btn--ghost" onClick={() => { setErrors({}); setDraft(JSON.parse(JSON.stringify(stored))); }}>
        <Layers size={15} /> Kelola cluster
      </button>
      <Drawer
        open={!!draft}
        title="Kelola cluster"
        subtitle="Cluster dipakai untuk mengelompokkan proyek dan publikasi, serta filter di halaman Riset."
        onClose={close}
        footer={
          <div className="cms-drawer-foot-right">
            <button type="button" className="cms-btn cms-btn--ghost" onClick={close}>Batal</button>
            <button type="button" className="cms-btn cms-btn--solid" onClick={save} disabled={!dirty}>Simpan</button>
          </div>
        }
      >
        {draft && (
          <>
            {errors.items && <p className="cms-warn">{errors.items}</p>}
            <Fields fields={fields} values={draft} onChange={(v) => { setDraft(v); if (Object.keys(errors).length) setErrors(validate(fields, v)); }} errors={errors} ctx={ctx} />
          </>
        )}
      </Drawer>
      <ConfirmDialog
        open={confirm === 'discard'}
        title="Buang perubahan?"
        confirmLabel="Buang perubahan"
        danger
        body={<p>Perubahan daftar cluster belum disimpan.</p>}
        onConfirm={() => { setConfirm(null); setDraft(null); }}
        onCancel={() => setConfirm(null)}
      />
      <ConfirmDialog
        open={Array.isArray(confirm)}
        title="Hapus cluster yang masih dipakai?"
        confirmLabel="Tetap hapus"
        danger
        body={
          Array.isArray(confirm) && (
            <>
              <p>Cluster berikut masih dipakai: {confirm.map((n) => `${n} (${usage(n)} item)`).join(', ')}.</p>
              <p className="cms-warn">Item tersebut tetap menyimpan nama cluster lama, tetapi cluster itu tidak lagi muncul di pilihan. Sebaiknya pindahkan item ke cluster lain dulu.</p>
            </>
          )
        }
        onConfirm={() => draft && commit(draft)}
        onCancel={() => setConfirm(null)}
      />
    </>
  );
}
