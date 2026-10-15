'use client';

import { Check } from 'lucide-react';
import { IconBadge, type IconName } from '@/components/about/IconBadge';
import type { Option } from '@/lib/cms/types';

/** Visual icon chooser: a grid of the icons the public pages can render, name on hover. */
export function IconPicker({ id, value, options, onChange }: { id: string; value: string; options: Option[]; onChange: (v: string) => void }) {
  const current = options.find((o) => o.value === value);
  return (
    <div className="cms-iconpick" id={id}>
      <div className="cms-iconpick__current">
        {current ? <IconBadge icon={current.value as IconName} tone="solid" size={40} /> : <span className="cms-iconpick__empty" />}
        <span>
          <small>Ikon terpilih</small>
          <strong>{current?.label ?? 'Belum dipilih'}</strong>
        </span>
      </div>
      <div className="cms-iconpick__grid" role="radiogroup" aria-label="Pilih ikon">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={o.value === value}
            className={`cms-tip ${o.value === value ? 'is-active' : ''}`}
            data-tip={o.label}
            onClick={() => onChange(o.value)}
          >
            <IconBadge icon={o.value as IconName} tone={o.value === value ? 'solid' : 'soft'} size={34} />
            {o.value === value && <span className="cms-iconpick__check"><Check size={10} strokeWidth={3.5} /></span>}
          </button>
        ))}
      </div>
    </div>
  );
}
