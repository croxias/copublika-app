import type { CmsItem, CollectionKey, Values } from '../types';

export type SeedPart = {
  collections?: Partial<Record<CollectionKey, CmsItem[]>>;
  sections?: Record<string, Values>;
};

/** Seed timestamp: fixed so the seed is deterministic. */
export const SEEDED_AT = '2026-10-14T00:00:00.000Z';
