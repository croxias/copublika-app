import type { StatusOption } from '../types';

/**
 * One status vocabulary for every menu. Only `published` records appear on the public site:
 * Tampil = live, Terjadwal = goes live at its publish time, Draft = still being edited,
 * Arsip = taken down but kept.
 */
const PUBLISHED: StatusOption = { value: 'published', label: 'Tampil', tone: 'ok' };
const SCHEDULED: StatusOption = { value: 'scheduled', label: 'Terjadwal', tone: 'info' };
const DRAFT: StatusOption = { value: 'draft', label: 'Draft', tone: 'pending' };
const ARCHIVED: StatusOption = { value: 'archived', label: 'Arsip', tone: 'muted' };

export const PUBLISH_STATUSES: StatusOption[] = [PUBLISHED, DRAFT];
export const PUBLISH_ARCHIVE_STATUSES: StatusOption[] = [PUBLISHED, DRAFT, ARCHIVED];
export const SCHEDULED_STATUSES: StatusOption[] = [PUBLISHED, SCHEDULED, DRAFT, ARCHIVED];

/** Label for any stored status value, e.g. in pickers that list records from other menus. */
export const statusLabel = (value: string) => [PUBLISHED, SCHEDULED, DRAFT, ARCHIVED].find((s) => s.value === value)?.label ?? value;
