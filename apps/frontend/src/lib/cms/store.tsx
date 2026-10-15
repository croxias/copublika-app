'use client';

// Browser-local store for the admin CMS (staging phase). It holds the same
// shapes the database will, so the admin pages only swap this provider for
// server actions when the backend lands.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AlertCircle, Check } from 'lucide-react';
import { CMS_SEED } from './seed/index';
import type { CmsItem, CollectionKey, Values } from './types';

const STORAGE_KEY = 'copublika-cms-v1';

export type CmsState = {
  collections: Record<CollectionKey, CmsItem[]>;
  sections: Record<string, Values>;
};

/** What goes to localStorage: only collections/sections the admin has edited. */
type Persisted = { v: 1; collections: Partial<Record<CollectionKey, CmsItem[]>>; sections: Record<string, Values> };

type ToastAction = { label: string; run: () => void };
type Toast = { id: number; message: string; tone: 'ok' | 'error'; action?: ToastAction };

type CmsStore = CmsState & {
  saveItem: (collection: CollectionKey, item: CmsItem) => void;
  /** Replaces a whole collection, for edits that touch several records at once. */
  setCollection: (collection: CollectionKey, items: CmsItem[]) => void;
  removeItem: (collection: CollectionKey, id: string) => void;
  saveSection: (key: string, value: Values) => void;
  reset: () => void;
  toast: (message: string, tone?: Toast['tone'], action?: ToastAction) => void;
};

const Context = createContext<CmsStore | null>(null);

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

/** Edited parts from storage on top of the current seed, so seed updates still show up elsewhere. */
function withSeedDefaults(stored: Persisted): CmsState {
  const seed = clone(CMS_SEED);
  migrate(stored);
  return {
    collections: { ...seed.collections, ...stored.collections },
    sections: { ...seed.sections, ...stored.sections },
  };
}

/** Earlier builds kept hero slides inside the "home.hero" section; they are now their own collection. */
function migrate(stored: Persisted) {
  const hero = stored.sections['home.hero'];
  if (hero && Array.isArray(hero.slides)) {
    if (!stored.collections.heroSlides) {
      stored.collections.heroSlides = (hero.slides as Values[]).map((s, i) => ({
        ...s,
        id: `hero-${i + 1}-${Date.now().toString(36)}`,
        status: String(s.status ?? 'draft'),
        order: i + 1,
        updatedAt: new Date().toISOString(),
      }));
    }
    const rest = { ...hero };
    delete rest.slides;
    stored.sections['home.hero'] = rest;
  }
}

export const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
export const nowIso = () => new Date().toISOString();

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CmsState>(() => clone(CMS_SEED));
  const [hydrated, setHydrated] = useState(false);
  const [edited, setEdited] = useState<{ collections: CollectionKey[]; sections: string[] }>({ collections: [], sections: [] });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [storageFull, setStorageFull] = useState(false);

  // Read localStorage after mount so the server render and first client render match.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const stored = raw ? (JSON.parse(raw) as Persisted) : null;
      if (stored?.v === 1) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState(withSeedDefaults(stored));
        setEdited({ collections: Object.keys(stored.collections) as CollectionKey[], sections: Object.keys(stored.sections) });
      }
    } catch {
      // Corrupt or blocked storage: keep the seed.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const persisted: Persisted = {
      v: 1,
      collections: Object.fromEntries(edited.collections.map((k) => [k, state.collections[k]])),
      sections: Object.fromEntries(edited.sections.map((k) => [k, state.sections[k]])),
    };
    let full = false;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch {
      // Storage full (usually uploaded images) or blocked: edits stay in memory for this tab.
      full = true;
    }
    queueMicrotask(() => setStorageFull(full));
  }, [state, edited, hydrated]);

  const toast = useCallback((message: string, tone: Toast['tone'] = 'ok', action?: ToastAction) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, tone, action }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), action ? 6000 : 3200);
  }, []);
  const dismiss = (id: number) => setToasts((t) => t.filter((x) => x.id !== id));

  const markCollection = useCallback(
    (k: CollectionKey) => setEdited((e) => (e.collections.includes(k) ? e : { ...e, collections: [...e.collections, k] })),
    [],
  );

  const saveItem = useCallback((collection: CollectionKey, item: CmsItem) => {
    markCollection(collection);
    setState((s) => {
      const list = s.collections[collection] ?? [];
      const exists = list.some((x) => x.id === item.id);
      const next = exists ? list.map((x) => (x.id === item.id ? item : x)) : [...list, item];
      return { ...s, collections: { ...s.collections, [collection]: next } };
    });
  }, [markCollection]);

  const setCollection = useCallback((collection: CollectionKey, items: CmsItem[]) => {
    markCollection(collection);
    setState((s) => ({ ...s, collections: { ...s.collections, [collection]: items } }));
  }, [markCollection]);

  const removeItem = useCallback((collection: CollectionKey, id: string) => {
    markCollection(collection);
    setState((s) => ({
      ...s,
      collections: { ...s.collections, [collection]: (s.collections[collection] ?? []).filter((x) => x.id !== id) },
    }));
  }, [markCollection]);

  const saveSection = useCallback((key: string, value: Values) => {
    setEdited((e) => (e.sections.includes(key) ? e : { ...e, sections: [...e.sections, key] }));
    setState((s) => ({ ...s, sections: { ...s.sections, [key]: value } }));
  }, []);

  const reset = useCallback(() => {
    setEdited({ collections: [], sections: [] });
    setState(clone(CMS_SEED));
  }, []);

  const value = useMemo<CmsStore>(
    () => ({ ...state, saveItem, setCollection, removeItem, saveSection, reset, toast }),
    [state, saveItem, setCollection, removeItem, saveSection, reset, toast],
  );

  return (
    <Context.Provider value={value}>
      {hydrated ? children : <div className="cms-loading" aria-busy="true">Memuat konten…</div>}
      <div className="cms-toasts" aria-live="polite">
        {storageFull && (
          <div className="cms-toast cms-toast--error" role="alert">
            Penyimpanan browser penuh. Perubahan terakhir hanya bertahan sampai tab ditutup; kurangi atau perkecil gambar yang diunggah.
          </div>
        )}
        {toasts.map((t) => (
          <div key={t.id} className={`cms-toast cms-toast--${t.tone}`} role="status">
            <span className="cms-toast-icon" aria-hidden="true">{t.tone === 'ok' ? <Check size={14} strokeWidth={2.5} /> : <AlertCircle size={14} strokeWidth={2.5} />}</span>
            <span className="cms-toast-msg">{t.message}</span>
            {t.action && (
              <button type="button" className="cms-toast-action" onClick={() => { t.action!.run(); dismiss(t.id); }}>
                {t.action.label}
              </button>
            )}
          </div>
        ))}
      </div>
    </Context.Provider>
  );
}

export function useCms() {
  const value = useContext(Context);
  if (!value) throw new Error('useCms must be used inside CmsProvider');
  return value;
}

/** Where a record is referenced from page sections, as readable labels. */
export function findUsages(sections: Record<string, Values>, id: string, sectionLabels: Record<string, string>): string[] {
  const contains = (v: unknown): boolean =>
    v === id || (Array.isArray(v) ? v.some(contains) : !!v && typeof v === 'object' && Object.values(v).some(contains));
  return Object.entries(sections)
    .filter(([, value]) => contains(value))
    .map(([key]) => sectionLabels[key] ?? key);
}
