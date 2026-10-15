'use client';

import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import type { Option, StatusTone } from '@/lib/cms/types';

/** Radix Select cannot hold an empty string, so "no value" travels as this sentinel. */
const EMPTY = '__empty__';

export type CmsSelectOption = Option & {
  /** Second line under the label, e.g. what a status means. */
  hint?: string;
  /** Coloured dot before the label (status pickers). */
  tone?: StatusTone;
};

type Props = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: CmsSelectOption[];
  /** Adds a first "—" row that clears the value. */
  allowEmpty?: boolean;
  emptyLabel?: string;
  placeholder?: string;
  invalid?: boolean;
  'aria-label'?: string;
  size?: 'md' | 'sm' | 'lg';
  /** Small caption inside the trigger, before the value (toolbar filters). */
  prefix?: string;
  className?: string;
};

/** The admin's dropdown: Radix Select styled for the CMS (see .cms-select in cms.css). */
export function CmsSelect({ id, value, onChange, options, allowEmpty, emptyLabel = '—', placeholder = 'Pilih…', invalid, size = 'md', prefix, className, ...rest }: Props) {
  // Keep a value whose option was removed visible instead of silently showing another one.
  const missing = value && !options.some((o) => o.value === value) ? [{ value, label: `${value} (tidak tersedia lagi)` }] : [];
  const items: CmsSelectOption[] = [...(allowEmpty ? [{ value: EMPTY, label: emptyLabel }] : []), ...missing, ...options];

  return (
    <SelectPrimitive.Root value={value === '' ? (allowEmpty ? EMPTY : undefined) : value} onValueChange={(v) => onChange(v === EMPTY ? '' : v)}>
      <SelectPrimitive.Trigger id={id} className={`cms-select cms-select--${size} ${className ?? ''}`} aria-invalid={invalid || undefined} aria-label={rest['aria-label']}>
        {prefix && <span className="cms-select-prefix">{prefix}</span>}
        <span className="cms-select-value">
          <SelectPrimitive.Value placeholder={<span className="cms-select-placeholder">{placeholder}</span>} />
        </span>
        <SelectPrimitive.Icon className="cms-select-chevron">
          <ChevronDown size={15} strokeWidth={2.2} />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className="cms-select-menu"
          position="popper"
          sideOffset={6}
          collisionPadding={12}
          // The drawer closes on Escape from the window; keep that key for the menu.
          onEscapeKeyDown={(e) => e.stopPropagation()}
        >
          <SelectPrimitive.ScrollUpButton className="cms-select-scroll"><ChevronUp size={14} /></SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className="cms-select-viewport">
            {items.map((o) => (
              <SelectPrimitive.Item key={o.value} value={o.value} className={`cms-select-item ${o.value === EMPTY ? 'is-empty' : ''}`}>
                {o.tone && <span className={`cms-select-dot cms-select-dot--${o.tone}`} aria-hidden="true" />}
                <span className="cms-select-text">
                  <SelectPrimitive.ItemText>{o.label}</SelectPrimitive.ItemText>
                  {o.hint && <small>{o.hint}</small>}
                </span>
                <SelectPrimitive.ItemIndicator className="cms-select-check">
                  <Check size={14} strokeWidth={2.6} />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton className="cms-select-scroll"><ChevronDown size={14} /></SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
