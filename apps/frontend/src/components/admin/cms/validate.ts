import type { Field, Values } from '@/lib/cms/types';

export type Errors = Record<string, string>;

const isEmpty = (v: unknown) =>
  v === undefined || v === null || (typeof v === 'string' && !v.trim()) || (Array.isArray(v) && v.length === 0);

/**
 * Checks required fields, length limits and link formats. Repeater rows report
 * errors as "<key>.<index>.<subkey>" so the row can be opened and highlighted.
 */
export function validate(fields: Field[], values: Values, prefix = ''): Errors {
  const errors: Errors = {};
  for (const f of fields) {
    if (f.type === 'heading') continue;
    if (f.visibleIf && !f.visibleIf(values)) continue;
    const path = prefix + f.key;
    const v = values[f.key];

    if (f.required && isEmpty(v)) {
      errors[path] = `${f.label} wajib diisi.`;
      continue;
    }
    if (isEmpty(v)) continue;

    if ((f.type === 'text' || f.type === 'textarea' || f.type === 'url') && f.max && String(v).length > f.max) {
      errors[path] = `Maksimal ${f.max} karakter (sekarang ${String(v).length}).`;
    }
    if (f.type === 'url' && !/^(\/|https?:\/\/|mailto:|tel:|#)/.test(String(v).trim())) {
      errors[path] = 'Harus diawali / (halaman internal) atau https://';
    }
    // Images: an upload (data URL) or a link.
    if (f.type === 'image' && !/^(data:image\/|\/|https?:\/\/)/.test(String(v).trim())) {
      errors[path] = 'Unggah gambar, atau isi link yang diawali / atau https://';
    }
    if (f.type === 'slug' && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(v))) {
      errors[path] = 'Hanya huruf kecil, angka, dan tanda hubung.';
    }
    if (f.type === 'number') {
      const n = Number(v);
      if (Number.isNaN(n)) errors[path] = 'Harus berupa angka.';
      else if (f.min !== undefined && n < f.min) errors[path] = `Minimal ${f.min}.`;
      else if (f.max !== undefined && n > f.max) errors[path] = `Maksimal ${f.max}.`;
    }
    if (f.type === 'repeater' && Array.isArray(v)) {
      if (f.maxItems && v.length > f.maxItems) errors[path] = `Maksimal ${f.maxItems} item.`;
      v.forEach((row, i) => Object.assign(errors, validate(f.fields, (row ?? {}) as Values, `${path}.${i}.`)));
    }
  }
  return errors;
}

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function inline(s: string) {
  return escapeHtml(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*(?!\s)(.+?)\*/g, '$1<em>$2</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[(.+?)\]\(((?:https?:\/\/|\/)[^\s)]*)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

/** Small Markdown preview for the editor: headings, lists, quotes, emphasis, links. */
export function renderMarkdown(md: string): string {
  const out: string[] = [];
  let list: 'ul' | 'ol' | null = null;
  let para: string[] = [];
  const flushPara = () => {
    if (para.length) out.push(`<p>${inline(para.join(' '))}</p>`);
    para = [];
  };
  const closeList = () => {
    if (list) out.push(`</${list}>`);
    list = null;
  };
  for (const raw of md.split(/\r?\n/)) {
    const line = raw.trimEnd();
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    const ul = /^\s*[-*]\s+(.*)$/.exec(line);
    const ol = /^\s*\d+\.\s+(.*)$/.exec(line);
    const quote = /^>\s?(.*)$/.exec(line);
    if (!line.trim()) {
      flushPara();
      closeList();
    } else if (h) {
      flushPara();
      closeList();
      const level = Math.min(h[1].length + 1, 5);
      out.push(`<h${level}>${inline(h[2])}</h${level}>`);
    } else if (ul || ol) {
      flushPara();
      const kind = ul ? 'ul' : 'ol';
      if (list !== kind) {
        closeList();
        out.push(`<${kind}>`);
        list = kind;
      }
      out.push(`<li>${inline((ul ?? ol)![1])}</li>`);
    } else if (quote) {
      flushPara();
      closeList();
      out.push(`<blockquote>${inline(quote[1])}</blockquote>`);
    } else {
      closeList();
      para.push(line.trim());
    }
  }
  flushPara();
  closeList();
  return out.join('\n');
}

export const wordCount = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);
