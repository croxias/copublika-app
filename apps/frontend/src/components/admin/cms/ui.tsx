'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { ExternalLink, X } from 'lucide-react';
import type { StatusOption } from '@/lib/cms/types';

export function PageHeader({
  title,
  accent,
  description,
  publicHref,
  actions,
}: {
  /** Kept for callers; the location is already shown by the sidebar, so it is not rendered. */
  crumb?: string[];
  title: string;
  accent?: string;
  description: string;
  publicHref?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="cms-head">
      <div>
        <h1>
          {title} {accent && <em>{accent}</em>}
        </h1>
        <p>{description}</p>
      </div>
      <div className="cms-head-actions">
        {publicHref && (
          <Link href={publicHref} target="_blank" className="cms-btn cms-btn--ghost">
            <ExternalLink size={14} /> Lihat di web
          </Link>
        )}
        {actions}
      </div>
    </header>
  );
}

export function StatusBadge({ status, options }: { status: string; options: StatusOption[] }) {
  const o = options.find((x) => x.value === status);
  return <span className={`cms-badge cms-badge--${o?.tone ?? 'muted'}`}>{o?.label ?? status}</span>;
}

/** The staging notice: tells the admin edits are local until the backend phase. */
export function StagingNote() {
  return (
    <p className="cms-note" title="Setelah backend tersambung, tombol Simpan yang sama akan langsung memperbarui website publik.">
      <span className="cms-note-dot" aria-hidden="true" />
      <span><strong>Mode staging</strong> · perubahan tersimpan di browser ini dan belum tayang di website publik.</span>
    </p>
  );
}

/** Slide-over panel used for editing a record. Esc and the backdrop call onClose. */
export function Drawer({
  open,
  title,
  subtitle,
  size = 'md',
  onClose,
  footer,
  children,
}: {
  open: boolean;
  title: string;
  subtitle?: React.ReactNode;
  size?: 'md' | 'lg';
  onClose: () => void;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="cms-drawer-root">
      <div className="cms-drawer-backdrop" onClick={onClose} aria-hidden="true" />
      <div ref={panel} tabIndex={-1} className={`cms-drawer cms-drawer--${size}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="cms-drawer-head">
          <div>
            <h2>{title}</h2>
            {subtitle && <div className="cms-drawer-sub">{subtitle}</div>}
          </div>
          <button type="button" className="cms-icon-btn" aria-label="Tutup" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="cms-drawer-body">{children}</div>
        <div className="cms-drawer-foot">{footer}</div>
      </div>
    </div>
  );
}

/** Centered dialog for editing one item (e.g. a repeater row) without leaving the page. */
export function Modal({
  open,
  title,
  subtitle,
  onClose,
  footer,
  children,
}: {
  open: boolean;
  title: string;
  subtitle?: React.ReactNode;
  onClose: () => void;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);
  if (!open) return null;
  // Portaled so it also works from inside a drawer (which may be transformed mid-animation).
  return createPortal(
    <div className="cms-modal-root">
      <div className="cms-drawer-backdrop" onClick={onClose} aria-hidden="true" />
      <div ref={panel} tabIndex={-1} className="cms-modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="cms-drawer-head">
          <div>
            <h2>{title}</h2>
            {subtitle && <div className="cms-drawer-sub">{subtitle}</div>}
          </div>
          <button type="button" className="cms-icon-btn" aria-label="Tutup" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="cms-drawer-body">{children}</div>
        <div className="cms-drawer-foot">{footer}</div>
      </div>
    </div>,
    document.body,
  );
}

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  danger,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  body: React.ReactNode;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);
  if (!open) return null;
  return createPortal(
    <div className="cms-confirm-root">
      <div className="cms-drawer-backdrop" onClick={onCancel} aria-hidden="true" />
      <div className="cms-confirm" role="alertdialog" aria-modal="true" aria-labelledby="cms-confirm-title">
        <button type="button" className="cms-confirm-close" aria-label="Tutup" onClick={onCancel}><X size={16} /></button>
        <h3 id="cms-confirm-title">{title}</h3>
        <div className="cms-confirm-body">{body}</div>
        <div className="cms-confirm-actions">
          <button type="button" className="cms-btn cms-btn--ghost" onClick={onCancel} autoFocus>Batal</button>
          <button type="button" className={`cms-btn ${danger ? 'cms-btn--danger' : 'cms-btn--solid'}`} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** Warns before the tab closes or reloads while a form has unsaved edits. */
export function useUnsavedGuard(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);
}

export const formatDate = (iso: string | undefined, withTime = false) => {
  if (!iso) return '—';
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}) });
};
