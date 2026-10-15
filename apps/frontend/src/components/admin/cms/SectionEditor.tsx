'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { CmsSelect } from './CmsSelect';
import { useCms } from '@/lib/cms/store';
import { CMS_SEED } from '@/lib/cms/seed/index';
import type { FieldContext, PageConfig, SectionTab, Values } from '@/lib/cms/types';
import { Fields } from './Fields';
import { HeroSlidesPanel } from './HeroSlidesPanel';
import { GroupHeader, GroupPager, GroupTabs, groupHasError, splitGroups } from './SectionGroups';
import { SectionPreview } from './SectionPreview';
import { changedLabels } from './RecordEditor';
import { ConfirmDialog, PageHeader, StagingNote, useUnsavedGuard } from './ui';
import { validate, type Errors } from './validate';

/**
 * Pattern B: one public page, one tab per section in the order they appear on
 * the site. Each tab keeps its own draft and is saved on its own.
 */
export function SectionEditor({ page, crumb, children, switcher }: { page: PageConfig; crumb: string[]; /** Extra cards below the editor, e.g. the reset card. */ children?: React.ReactNode; /** Sibling-page switcher under the header. */ switcher?: React.ReactNode }) {
  const cms = useCms();
  const [active, setActive] = useState(page.tabs[0].key);
  const [drafts, setDrafts] = useState<Record<string, Values>>({});
  const [errors, setErrors] = useState<Errors>({});
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [confirmRevert, setConfirmRevert] = useState(false);
  const [confirmSave, setConfirmSave] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState<boolean | null>(null);
  // Open group (sub-tab) per section, when the page splits sections into groups.
  const [openGroup, setOpenGroup] = useState<Record<string, string>>({});

  const stored = (key: string): Values => cms.sections[key] ?? {};
  const isDirty = (key: string) => key in drafts && JSON.stringify(drafts[key]) !== JSON.stringify(stored(key));
  const anyDirty = page.tabs.some((t) => isDirty(t.key));
  useUnsavedGuard(anyDirty);

  const tab = page.tabs.find((t) => t.key === active) ?? page.tabs[0];
  const values = drafts[tab.key] ?? stored(tab.key);
  const ctx: FieldContext = { sections: cms.sections, collections: cms.collections };
  const hidden = tab.hideable && values.visible === false;

  const groups = page.groupSections && !tab.manager ? splitGroups(tab.fields) : [];
  const grouped = groups.length > 1;
  const groupIndex = grouped ? Math.max(0, groups.findIndex((g) => g.key === openGroup[tab.key])) : 0;
  const group = grouped ? groups[groupIndex] : null;
  const pickGroup = (key: string) => {
    setOpenGroup((o) => ({ ...o, [tab.key]: key }));
    requestAnimationFrame(() => document.querySelector('.cms-groups')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
  };

  const change = (next: Values) => {
    setDrafts((d) => ({ ...d, [tab.key]: next }));
    if (Object.keys(errors).length) setErrors(validate(tab.fields, next));
  };

  const switchTab = (key: string) => {
    if (key === tab.key) return;
    if (isDirty(tab.key)) setPendingTab(key);
    else {
      setErrors({});
      setActive(key);
    }
  };

  const discard = (key: string) =>
    setDrafts((d) => {
      const next = { ...d };
      delete next[key];
      return next;
    });

  const save = () => {
    const errs = validate(tab.fields, values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      cms.toast('Periksa kembali isian yang ditandai merah.', 'error');
      // Open the first group that has a problem, so the red field is on screen.
      const firstBad = groups.find((g) => groupHasError(g, errs));
      if (firstBad) setOpenGroup((o) => ({ ...o, [tab.key]: firstBad.key }));
      requestAnimationFrame(() => document.querySelector('.cms-section-body .has-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
      return;
    }
    setConfirmSave(true);
  };

  const commitSave = () => {
    cms.saveSection(tab.key, values);
    discard(tab.key);
    setConfirmSave(false);
    cms.toast(`Section “${tab.label}” disimpan.`);
  };

  // Manager tabs (hero slides) have no section draft: the switch is saved right after confirming.
  const setVisible = (visible: boolean) => {
    if (tab.manager) setConfirmVisible(visible);
    else change({ ...values, visible });
  };
  const changes = isDirty(tab.key) ? changedLabels(tab.fields, stored(tab.key), values, tab.hideable ? { visible: 'Tampil di web' } : {}) : [];

  const tabIndex = page.tabs.findIndex((t) => t.key === tab.key);

  // When the tab list is a horizontal strip (tablet), keep the active tab in view.
  const tabsRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const nav = tabsRef.current;
    const btn = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!nav || !btn || nav.scrollWidth <= nav.clientWidth) return;
    nav.scrollTo({ left: btn.offsetLeft - nav.clientWidth / 2 + btn.offsetWidth / 2, behavior: 'smooth' });
  }, [tab.key]);

  return (
    <section className="cms-page">
      <PageHeader crumb={crumb} title={page.title} accent={page.titleAccent} description={page.description} publicHref={page.publicHref} />
      {switcher}
      <StagingNote />

      <div className="cms-sections-wrap">
        <div className="cms-sections">
          <nav className="cms-tabs" aria-label="Section halaman" ref={tabsRef}>
            <p className="cms-tabs-label">{page.tabsLabel ?? 'Urutan section di halaman'}</p>
            {page.tabs.map((t, i) => {
              const off = t.hideable && stored(t.key).visible === false;
              return (
                <button
                  type="button"
                  key={t.key}
                  aria-current={t.key === tab.key ? 'page' : undefined}
                  className={off ? 'is-off' : ''}
                  onClick={() => switchTab(t.key)}
                >
                  <span className="cms-rep-index">{String(i + 1).padStart(2, '0')}</span>
                  <span className="cms-tab-text">
                    <span className="cms-tab-name">{t.label}</span>
                    <span className="cms-tab-meta">{off ? 'Disembunyikan' : t.source ? `Data dari ${t.source.label}` : t.manager ? 'Dikelola terpisah' : 'Teks & tampilan'}</span>
                  </span>
                  {isDirty(t.key) && <span className="cms-dot" title="Belum disimpan" aria-label="Belum disimpan" />}
                  {off && <EyeOff size={13} aria-label="Disembunyikan" />}
                </button>
              );
            })}
          </nav>

          {/* Phones: the tab list becomes a picker so the form gets the full width. */}
          <label className="cms-tabs-select">
            <span>{page.tabsLabel ?? 'Section'} · {tabIndex + 1}/{page.tabs.length}</span>
            <CmsSelect
              aria-label="Pilih section"
              size="lg"
              value={tab.key}
              onChange={switchTab}
              options={page.tabs.map((t, i) => ({
                value: t.key,
                label: `${String(i + 1).padStart(2, '0')} · ${t.label}`,
                hint: [t.hideable && stored(t.key).visible === false ? 'Disembunyikan' : '', isDirty(t.key) ? 'Belum disimpan' : ''].filter(Boolean).join(' · ') || undefined,
              }))}
            />
          </label>

          <div className="cms-section-card">
            <div className="cms-section-layout">
              <div className="cms-section-head">
                <span className="cms-section-kicker">Section {String(tabIndex + 1).padStart(2, '0')} dari {String(page.tabs.length).padStart(2, '0')}</span>
                <h2>
                  <span className="cms-section-num" aria-hidden="true">{String(tabIndex + 1).padStart(2, '0')}</span>
                  {tab.label}
                </h2>
                {tab.description && <p>{tab.description}</p>}
              </div>

              <aside className="cms-section-side" aria-label="Pengaturan section">
                {tab.hideable && (
                  <div className={`cms-side-block cms-side-visibility ${hidden ? 'is-off' : ''}`}>
                    <label className="cms-toggle">
                      <input type="checkbox" role="switch" checked={!hidden} onChange={(e) => setVisible(e.target.checked)} />
                      <span className="cms-toggle-track" aria-hidden="true"><span /></span>
                      <span className="cms-toggle-label">{hidden ? <><EyeOff size={13} /> Disembunyikan</> : <><Eye size={13} /> Tampil di web</>}</span>
                    </label>
                    <p>{hidden ? 'Isinya tetap tersimpan dan bisa ditampilkan lagi kapan saja.' : 'Matikan untuk menyembunyikan section ini tanpa menghapus isinya.'}</p>
                  </div>
                )}
                {tab.source && <SourceNote source={tab.source} />}
                <div className="cms-side-block cms-side-actions">
                  <Link href={page.publicHref} target="_blank" className="cms-btn cms-btn--ghost cms-btn--sm">
                    <ArrowUpRight size={13} /> Lihat halaman
                  </Link>
                  {!tab.manager && (
                    <button type="button" className="cms-btn cms-btn--ghost cms-btn--sm" onClick={() => setConfirmRevert(true)}>
                      <RotateCcw size={13} /> Kembalikan ke isi awal
                    </button>
                  )}
                </div>
              </aside>

              <div className={`cms-section-body ${hidden ? 'is-dimmed' : ''}`}>
                {tab.manager === 'heroSlides' ? (
                  <HeroSlidesPanel />
                ) : group ? (
                  <>
                    {tab.preview && <SectionPreview kind={tab.preview} values={values} active={group.key} onPick={pickGroup} ctx={ctx} />}
                    <GroupTabs groups={groups} active={group.key} onPick={pickGroup} errors={errors} stored={stored(tab.key)} values={values} />
                    <div className="cms-group-panel" role="tabpanel" key={group.key}>
                      <GroupHeader group={group} index={groupIndex} total={groups.length} />
                      <Fields fields={group.fields} values={values} onChange={change} errors={errors} ctx={ctx} />
                      <GroupPager groups={groups} index={groupIndex} onPick={pickGroup} />
                    </div>
                  </>
                ) : (
                  <Fields fields={tab.fields} values={values} onChange={change} errors={errors} ctx={ctx} />
                )}
              </div>
            </div>

            {!tab.manager && <div className="cms-section-foot">
              <span className="cms-foot-step">
                Section {tabIndex + 1} dari {page.tabs.length}
              </span>
              <div className="cms-drawer-foot-right">
                {isDirty(tab.key) && <span className="cms-unsaved">Belum disimpan</span>}
                <button type="button" className="cms-btn cms-btn--ghost" disabled={!isDirty(tab.key)} onClick={() => { discard(tab.key); setErrors({}); }}>
                  Batalkan
                </button>
                <button type="button" className="cms-btn cms-btn--solid" disabled={!isDirty(tab.key)} onClick={save}>
                  Simpan section
                </button>
              </div>
            </div>}
          </div>
        </div>
      </div>

      {children}

      <ConfirmDialog
        open={confirmSave}
        title={`Simpan section “${tab.label}”?`}
        confirmLabel="Ya, simpan"
        body={
          <>
            {changes.length > 0 && (
              <>
                <p className="cms-muted">Yang berubah:</p>
                <ul className="cms-change-list">
                  {changes.map((c) => <li key={c}>{c}</li>)}
                </ul>
              </>
            )}
            <p className="cms-muted">Perubahan langsung terlihat di halaman {page.title} setelah backend tersambung.</p>
          </>
        }
        onConfirm={commitSave}
        onCancel={() => setConfirmSave(false)}
      />
      <ConfirmDialog
        open={confirmVisible !== null}
        danger={confirmVisible === false}
        title={confirmVisible ? `Tampilkan section “${tab.label}”?` : `Sembunyikan section “${tab.label}”?`}
        confirmLabel={confirmVisible ? 'Tampilkan' : 'Sembunyikan'}
        body={<p>{confirmVisible ? 'Section kembali muncul di halaman.' : 'Section tidak muncul di halaman, tetapi isinya tetap tersimpan.'}</p>}
        onConfirm={() => {
          cms.saveSection(tab.key, { ...stored(tab.key), visible: !!confirmVisible });
          cms.toast(confirmVisible ? `Section “${tab.label}” ditampilkan.` : `Section “${tab.label}” disembunyikan.`);
          setConfirmVisible(null);
        }}
        onCancel={() => setConfirmVisible(null)}
      />
      <ConfirmDialog
        open={!!pendingTab}
        title="Pindah tanpa menyimpan?"
        confirmLabel="Buang & pindah"
        danger
        body={<p>Perubahan di section “{tab.label}” belum disimpan.</p>}
        onConfirm={() => {
          discard(tab.key);
          setErrors({});
          setActive(pendingTab!);
          setPendingTab(null);
        }}
        onCancel={() => setPendingTab(null)}
      />
      <ConfirmDialog
        open={confirmRevert}
        title="Kembalikan ke isi awal?"
        confirmLabel="Kembalikan"
        body={<p>Isi section “{tab.label}” akan diganti dengan konten bawaan website. Perubahan baru tersimpan setelah kamu klik Simpan section.</p>}
        onConfirm={() => {
          change(JSON.parse(JSON.stringify(CMS_SEED.sections[tab.key] ?? {})));
          setConfirmRevert(false);
        }}
        onCancel={() => setConfirmRevert(false)}
      />
    </section>
  );
}

function SourceNote({ source }: { source: NonNullable<SectionTab['source']> }) {
  return (
    <div className="cms-side-block cms-source">
      <p>Sebagian isi diambil otomatis dari <strong>{source.label}</strong>. Ubah datanya di sana; di sini kamu mengatur teks dan cara tampilnya.</p>
      <Link href={source.href} className="cms-btn cms-btn--ghost cms-btn--sm">
        Kelola {source.label} <ArrowUpRight size={13} />
      </Link>
    </div>
  );
}
