/** "Dr. Aulia R." → "dr-aulia-r". Also used to build stable seed ids. */
export const slugify = (s: string) =>
  s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

/** Seed id for a person, so pages can reference people before the store exists. */
export const personId = (name: string) => `person-${slugify(name)}`;
