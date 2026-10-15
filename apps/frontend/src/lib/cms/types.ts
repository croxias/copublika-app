// Admin CMS for the public website: field configs and stored shapes.
// These shapes are the contract the Drizzle tables will follow in the backend
// phase; for now the admin edits them in a browser-local store (see store.tsx).

export type CollectionKey =
  | 'blog'
  | 'events'
  | 'projects'
  | 'publications'
  | 'heroSlides'
  | 'people'
  | 'testimonials'
  | 'faqs';

export type Values = Record<string, unknown>;

/** A record in a collection. Every collection has a status and a manual order. */
export type CmsItem = Values & {
  id: string;
  status: string;
  order: number;
  updatedAt: string;
};

type FieldBase = {
  key: string;
  label: string;
  help?: string;
  required?: boolean;
  /** Full row width in the two-column form grid. */
  wide?: boolean;
  /** Hide the field unless this returns true for the current values. */
  visibleIf?: (values: Values) => boolean;
};

export type Option = { value: string; label: string; /** Second line in dropdown menus. */ hint?: string };

export type Field =
  | (FieldBase & { type: 'text' | 'url'; max?: number; placeholder?: string; /** Show a YouTube preview under a url field. */ youtube?: boolean })
  | (FieldBase & { type: 'icon'; options: Option[] })
  | (FieldBase & {
      type: 'image';
      placeholder?: string;
      /** Preview frame ratio, e.g. "16 / 9" for hero backgrounds. */
      aspect?: string;
      /** Uploads narrower than this get a quality warning. */
      minWidth?: number;
    })
  | (FieldBase & { type: 'textarea'; max?: number; rows?: number; placeholder?: string })
  | (FieldBase & { type: 'markdown' })
  | (FieldBase & { type: 'number'; min?: number; max?: number; suffix?: string })
  | (FieldBase & { type: 'date' | 'time' | 'datetime' })
  | (FieldBase & { type: 'select'; options: Option[] | ((ctx: FieldContext) => Option[]) })
  | (FieldBase & { type: 'toggle'; onLabel?: string })
  | (FieldBase & { type: 'tags'; placeholder?: string; max?: number })
  | (FieldBase & { type: 'slug'; from: string })
  | (FieldBase & {
      type: 'repeater';
      fields: Field[];
      /** Row title in the collapsed list. */
      itemTitle: (item: Values, index: number) => string;
      addLabel?: string;
      maxItems?: number;
      /** Fixed set of rows (the public layout depends on the count): no add, delete or reorder. */
      fixed?: boolean;
      /** Show rows as cards in a grid, like the public section, instead of a list. */
      layout?: 'list' | 'cards';
      /** Small label above the card title, and the body text under it (cards layout). */
      itemKicker?: (item: Values) => string;
      itemText?: (item: Values) => string;
      /** Icon name shown on the row/card (see components/about/IconBadge). */
      itemIcon?: (item: Values) => string;
      /** Person id whose photo is shown on the row (people collection). */
      itemPerson?: (item: Values) => string;
    })
  | (FieldBase & {
      type: 'ref';
      collection: CollectionKey;
      multiple?: boolean;
      /** Narrows which records can be picked, e.g. only mentors. */
      filter?: (item: CmsItem) => boolean;
    })
  | {
      type: 'heading';
      key: string;
      label: string;
      help?: string;
      visibleIf?: (values: Values) => boolean;
      /** Icon for the group tab when the section is split into groups. */
      icon?: GroupIcon;
      /** Shorter tab label; defaults to `label`. */
      short?: string;
    };

export type GroupIcon =
  | 'heading' | 'link' | 'display' | 'users' | 'orbit' | 'mentor' | 'shield' | 'progress'
  | 'steps' | 'calendar' | 'ticket' | 'cursor' | 'quote' | 'help' | 'chart' | 'text';

/** Lets option lists and pickers read the rest of the CMS (e.g. clusters). */
export type FieldContext = { sections: Record<string, Values>; collections: Record<CollectionKey, CmsItem[]> };

export type StatusTone = 'ok' | 'pending' | 'muted' | 'info' | 'live';
export type StatusOption = Option & { tone: StatusTone };

export type Column = {
  label: string;
  render: (item: CmsItem, ctx: FieldContext) => React.ReactNode;
  width?: string;
};

export type CollectionConfig = {
  key: CollectionKey;
  /** e.g. "artikel" — used in "+ Artikel baru", "Hapus artikel?" */
  singular: string;
  fields: Field[];
  columns: Column[];
  statuses: StatusOption[];
  /** Status a new record starts in. */
  initialStatus: string;
  titleOf: (item: Values) => string;
  subtitleOf?: (item: Values, ctx: FieldContext) => string;
  /** Extra filter dropdown next to the status filter. */
  filter?: { label: string; options: (ctx: FieldContext) => Option[]; match: (item: CmsItem, value: string) => boolean };
  /** Manual ordering with up/down arrows; otherwise sorted by `sortBy`. */
  sortable?: boolean;
  sortBy?: (a: CmsItem, b: CmsItem) => number;
  /** Public URL of a record, for "Lihat di web". */
  publicHref?: (item: CmsItem) => string | null;
  drawer?: 'md' | 'lg';
  defaults: () => Values;
  /** Hook to adjust a record right before saving (e.g. derive read time). */
  beforeSave?: (values: Values, all: CmsItem[]) => Values;
  /** Side effects on other records when one is saved (e.g. single featured). */
  afterSave?: (saved: CmsItem, all: CmsItem[]) => CmsItem[];
};

export type SectionTab = {
  /** Store key in `sections`, e.g. "home.stats". */
  key: string;
  label: string;
  description?: string;
  fields: Field[];
  /** Adds a "Tampilkan section" switch stored as `visible`. */
  hideable?: boolean;
  /** Section is filled from a collection; points the admin there. */
  source?: { label: string; href: string };
  /**
   * The section's records are managed inline as their own collection (saved one by one),
   * so the tab has no "Simpan section" bar; e.g. hero slides.
   */
  manager?: 'heroSlides';
  /** Live schematic of the public section beside the form; clicking a part opens its group. */
  preview?: 'why' | 'program' | 'aboutHero' | 'aboutIntro' | 'aboutVision' | 'aboutJourney' | 'teamOrg' | 'join';
};

export type PageConfig = {
  /** e.g. "Beranda" */
  title: string;
  titleAccent?: string;
  description: string;
  publicHref: string;
  /** Label above the tab list; defaults to the public-page wording. */
  tabsLabel?: string;
  /** Split each section's form into sub-tabs at its heading fields, instead of one long scroll. */
  groupSections?: boolean;
  /** Sibling editors shown as a switcher under the header (e.g. About Us / Our Team / Our Mentors). */
  family?: { key: string; label: string; href: string; hint?: string }[];
  tabs: SectionTab[];
};
