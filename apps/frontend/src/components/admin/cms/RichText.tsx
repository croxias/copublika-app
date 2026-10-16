'use client';

import { useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor, useEditorState, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Placeholder } from '@tiptap/extensions';
import { Markdown } from '@tiptap/markdown';
import {
  Bold, Heading2, Heading3, ImagePlus, Italic, Link2, List, ListOrdered, Minus, Pilcrow, Quote, Redo2, Undo2, Upload, X,
} from 'lucide-react';
import { encodeImage } from './ImageInput';
import { wordCount } from './validate';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

/**
 * Visual article editor, like writing a post in WordPress: toolbar for headings, emphasis,
 * lists, quotes, links and images, no Markdown syntax on screen. Stored as Markdown so the
 * public renderer and older articles keep working.
 */
export function RichTextInput({ id, value, onChange, invalid, placeholder }: { id: string; value: string; onChange: (v: string) => void; invalid?: boolean; placeholder?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const emitted = useRef(value);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        strike: false,
        underline: false,
        link: { openOnClick: false, autolink: true, defaultProtocol: 'https' },
      }),
      Image.configure({ allowBase64: true }),
      Placeholder.configure({ placeholder: placeholder ?? 'Mulai menulis di sini. Pakai tombol di atas untuk judul bagian, daftar, kutipan, dan gambar.' }),
      Markdown,
    ],
    content: value,
    contentType: 'markdown',
    editorProps: { attributes: { id, class: 'cms-rt-doc', 'aria-label': 'Isi artikel', 'aria-multiline': 'true', role: 'textbox' } },
    onUpdate: ({ editor: e }) => {
      const md = e.getMarkdown();
      emitted.current = md;
      onChange(md);
    },
  });

  // Outside changes (reset, switching records) replace the document; our own edits don't.
  useEffect(() => {
    if (!editor || value === emitted.current) return;
    emitted.current = value;
    editor.commands.setContent(value, { contentType: 'markdown', emitUpdate: false });
  }, [editor, value]);

  // Read-only when the form sits in a disabled fieldset (e.g. a submitted draft in Ruang Penulis).
  useEffect(() => {
    if (!editor) return;
    const locked = !!wrap.current?.closest('fieldset')?.disabled;
    if (editor.isEditable === locked) editor.setEditable(!locked);
  });

  const words = wordCount(value.replace(/!\[[^\]]*\]\([^)]*\)/g, ''));
  return (
    <div ref={wrap} className={`cms-rt ${invalid ? 'is-invalid' : ''}`}>
      {editor ? <Toolbar editor={editor} /> : <div className="cms-rt-bar" aria-hidden="true" />}
      <EditorContent editor={editor} className="cms-rt-body" />
      <div className="cms-rt-foot">
        <span>{words} kata · ±{Math.max(1, Math.round(words / 200))} menit baca</span>
        <span>Tip: seret atau tempel gambar langsung ke dalam teks.</span>
      </div>
      {editor && <DropImages editor={editor} />}
    </div>
  );
}

function Btn({ on, label, onClick, disabled, children }: { on?: boolean; label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" className={on ? 'is-on' : ''} aria-label={label} title={label} aria-pressed={on} disabled={disabled} onMouseDown={(e) => e.preventDefault()} onClick={onClick}>
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const [pop, setPop] = useState<null | 'link' | 'image'>(null);
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      editable: e.isEditable,
      p: e.isActive('paragraph'),
      h2: e.isActive('heading', { level: 2 }),
      h3: e.isActive('heading', { level: 3 }),
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      link: e.isActive('link'),
      ul: e.isActive('bulletList'),
      ol: e.isActive('orderedList'),
      quote: e.isActive('blockquote'),
      undo: e.can().undo(),
      redo: e.can().redo(),
    }),
  });
  const c = () => editor.chain().focus();
  const off = !s.editable;

  return (
    <div className="cms-rt-bar" role="toolbar" aria-label="Format teks">
      <div className="cms-rt-group">
        <Btn label="Paragraf" on={s.p} disabled={off} onClick={() => c().setParagraph().run()}><Pilcrow size={16} /></Btn>
        <Btn label="Judul bagian" on={s.h2} disabled={off} onClick={() => c().toggleHeading({ level: 2 }).run()}><Heading2 size={17} /></Btn>
        <Btn label="Sub-judul" on={s.h3} disabled={off} onClick={() => c().toggleHeading({ level: 3 }).run()}><Heading3 size={17} /></Btn>
      </div>
      <div className="cms-rt-group">
        <Btn label="Tebal" on={s.bold} disabled={off} onClick={() => c().toggleBold().run()}><Bold size={16} /></Btn>
        <Btn label="Miring" on={s.italic} disabled={off} onClick={() => c().toggleItalic().run()}><Italic size={16} /></Btn>
        <Btn label="Tautan" on={s.link || pop === 'link'} disabled={off} onClick={() => setPop(pop === 'link' ? null : 'link')}><Link2 size={16} /></Btn>
      </div>
      <div className="cms-rt-group">
        <Btn label="Daftar berpoin" on={s.ul} disabled={off} onClick={() => c().toggleBulletList().run()}><List size={17} /></Btn>
        <Btn label="Daftar bernomor" on={s.ol} disabled={off} onClick={() => c().toggleOrderedList().run()}><ListOrdered size={17} /></Btn>
        <Btn label="Kutipan" on={s.quote} disabled={off} onClick={() => c().toggleBlockquote().run()}><Quote size={16} /></Btn>
        <Btn label="Garis pemisah" disabled={off} onClick={() => c().setHorizontalRule().run()}><Minus size={16} /></Btn>
      </div>
      <div className="cms-rt-group">
        <button type="button" className={`cms-rt-image ${pop === 'image' ? 'is-on' : ''}`} disabled={off} onMouseDown={(e) => e.preventDefault()} onClick={() => setPop(pop === 'image' ? null : 'image')}>
          <ImagePlus size={16} /> Gambar
        </button>
      </div>
      <div className="cms-rt-group cms-rt-group--end">
        <Btn label="Urungkan" disabled={off || !s.undo} onClick={() => c().undo().run()}><Undo2 size={16} /></Btn>
        <Btn label="Ulangi" disabled={off || !s.redo} onClick={() => c().redo().run()}><Redo2 size={16} /></Btn>
      </div>
      {pop === 'link' && <LinkPop editor={editor} onClose={() => setPop(null)} />}
      {pop === 'image' && <ImagePop editor={editor} onClose={() => setPop(null)} />}
    </div>
  );
}

function LinkPop({ editor, onClose }: { editor: Editor; onClose: () => void }) {
  const [href, setHref] = useState(() => String(editor.getAttributes('link').href ?? ''));
  const apply = () => {
    const url = href.trim();
    const chain = editor.chain().focus().extendMarkRange('link');
    if (!url) chain.unsetLink().run();
    else chain.setLink({ href: /^(https?:|mailto:|\/)/.test(url) ? url : `https://${url}` }).run();
    onClose();
  };
  return (
    <div className="cms-rt-pop" role="dialog" aria-label="Tautan" onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); onClose(); } }}>
      <label>
        <span>Alamat tautan</span>
        <input autoFocus value={href} placeholder="https://… atau /halaman" onChange={(e) => setHref(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); apply(); } }} />
      </label>
      <p>Blok teksnya dulu, lalu isi alamat. Kosongkan untuk menghapus tautan.</p>
      <div className="cms-rt-pop__actions">
        <button type="button" className="cms-btn cms-btn--ghost cms-btn--sm" onClick={onClose}>Batal</button>
        <button type="button" className="cms-btn cms-btn--solid cms-btn--sm" onClick={apply}>Pasang</button>
      </div>
    </div>
  );
}

async function insertFile(editor: Editor, file: File, alt = '') {
  if (!IMAGE_TYPES.includes(file.type)) throw new Error('type');
  const { dataUrl } = await encodeImage(file, 1600);
  editor.chain().focus().setImage({ src: dataUrl, alt: alt || file.name.replace(/\.[a-z0-9]+$/i, '') }).run();
}

function ImagePop({ editor, onClose }: { editor: Editor; onClose: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState('');

  const fromFile = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setProblem('');
    try {
      await insertFile(editor, file, alt);
      onClose();
    } catch {
      setProblem('Gambar tidak bisa dibaca. Pakai JPG, PNG, WebP, atau AVIF.');
    } finally {
      setBusy(false);
    }
  };
  const fromUrl = () => {
    if (!/^(https?:\/\/|\/)/.test(url.trim())) return setProblem('Link harus diawali https:// atau /');
    editor.chain().focus().setImage({ src: url.trim(), alt: alt.trim() }).run();
    onClose();
  };

  return (
    <div className="cms-rt-pop cms-rt-pop--image" role="dialog" aria-label="Sisipkan gambar" onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); onClose(); } }}>
      <div className="cms-rt-pop__head">
        <strong>Sisipkan gambar</strong>
        <button type="button" aria-label="Tutup" onClick={onClose}><X size={14} /></button>
      </div>
      <button type="button" className="cms-rt-drop" disabled={busy} onClick={() => fileRef.current?.click()}>
        <Upload size={18} />
        <span>{busy ? 'Memproses gambar…' : 'Unggah dari komputer'}</span>
        <small>JPG, PNG, WebP · dikecilkan otomatis ke lebar 1600 px</small>
      </button>
      <input ref={fileRef} type="file" accept={IMAGE_TYPES.join(',')} hidden onChange={(e) => fromFile(e.target.files?.[0])} />
      <div className="cms-rt-or"><span>atau tempel link</span></div>
      <label>
        <span>Link gambar</span>
        <input value={url} placeholder="https://…" onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); fromUrl(); } }} />
      </label>
      <label>
        <span>Keterangan gambar</span>
        <input value={alt} placeholder="Tampil di bawah gambar dan dibaca pembaca layar" onChange={(e) => setAlt(e.target.value)} />
      </label>
      {problem && <p className="cms-error">{problem}</p>}
      <div className="cms-rt-pop__actions">
        <button type="button" className="cms-btn cms-btn--ghost cms-btn--sm" onClick={onClose}>Batal</button>
        <button type="button" className="cms-btn cms-btn--solid cms-btn--sm" disabled={!url.trim()} onClick={fromUrl}>Sisipkan dari link</button>
      </div>
    </div>
  );
}

/** Drop or paste image files straight into the text. */
function DropImages({ editor }: { editor: Editor }) {
  useEffect(() => {
    const dom = editor.view.dom;
    const pick = (list: FileList | null | undefined) => [...(list ?? [])].filter((f) => IMAGE_TYPES.includes(f.type));
    const onDrop = (e: DragEvent) => {
      const files = pick(e.dataTransfer?.files);
      if (!files.length || !editor.isEditable) return;
      e.preventDefault();
      const at = editor.view.posAtCoords({ left: e.clientX, top: e.clientY });
      if (at) editor.commands.setTextSelection(at.pos);
      files.forEach((f) => insertFile(editor, f).catch(() => undefined));
    };
    const onPaste = (e: ClipboardEvent) => {
      const files = pick(e.clipboardData?.files);
      if (!files.length || !editor.isEditable) return;
      e.preventDefault();
      files.forEach((f) => insertFile(editor, f).catch(() => undefined));
    };
    dom.addEventListener('drop', onDrop);
    dom.addEventListener('paste', onPaste);
    return () => {
      dom.removeEventListener('drop', onDrop);
      dom.removeEventListener('paste', onPaste);
    };
  }, [editor]);
  return null;
}
