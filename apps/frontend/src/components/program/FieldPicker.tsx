"use client";

import { useMemo, useState, type ReactNode } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Command } from "cmdk";
import { ArrowRightLeft, Check, ChevronDown, PenLine, Search } from "lucide-react";
import "./field-picker.css";
import { FIELD_GROUPS, OTHER_FIELD, STREAMS, searchFields, type Stream } from "@/lib/data/disciplines";

// Searchable field-of-study picker. Lists the chosen stream's fields by group; while searching it
// shows the matches ranked best first, plus matches from the other stream (picking one switches the stream), and offers the typed
// text as a "Lainnya" field when nothing fits. Used by the member form and the admin dialog.

type Props = {
  id?: string;
  stream: Stream;
  value: string;
  /** field is a listed label or OTHER_FIELD; other is the typed name when the search is used as-is. */
  onChange: (field: string, stream: Stream, other?: string) => void;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  /** Admin look (cms-select) instead of the public form look. */
  variant?: "public" | "admin";
  icon?: ReactNode;
  "aria-label"?: string;
};

export function FieldPicker({ id, stream, value, onChange, placeholder = "Pilih bidang ilmu", invalid, disabled, variant = "public", icon, ...rest }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const other: Stream = stream === "stem" ? "nonstem" : "stem";
  const typed = query.trim();
  const hits = useMemo(() => searchFields(stream, typed), [stream, typed]);
  const elsewhere = useMemo(() => searchFields(other, typed), [other, typed]);
  const shown = value === OTHER_FIELD ? "Lainnya" : value;

  const pick = (field: string, s: Stream = stream, typedName?: string) => {
    onChange(field, s, typedName);
    setOpen(false);
    setQuery("");
  };

  const admin = variant === "admin";
  return (
    <Popover.Root open={open} onOpenChange={(o) => { setOpen(o); if (!o) setQuery(""); }}>
      <Popover.Trigger
        id={id}
        type="button"
        disabled={disabled}
        className={admin ? "cms-select cms-select--md cp-fp-trigger is-admin" : "cp-mpf-select is-compact cp-fp-trigger"}
        aria-invalid={invalid || undefined}
        aria-label={rest["aria-label"]}
        data-placeholder={shown ? undefined : ""}
      >
        {!admin && icon && <span className="cp-mpf-select__ico" aria-hidden="true">{icon}</span>}
        <span className={admin ? "cms-select-value" : "cp-mpf-select__value"}>
          {shown || <span className={admin ? "cms-select-placeholder" : "cp-fp-placeholder"}>{placeholder}</span>}
        </span>
        <span className={admin ? "cms-select-chevron" : "cp-mpf-select__chev"} aria-hidden="true"><ChevronDown size={admin ? 15 : 16} /></span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className={`cp-fp ${admin ? "is-admin" : ""}`}
          align="start"
          sideOffset={6}
          collisionPadding={12}
          onEscapeKeyDown={(e) => e.stopPropagation()}
        >
          <Command shouldFilter={false} loop label={`Bidang ilmu ${STREAMS[stream].label}`}>
            <div className="cp-fp__search">
              <Search size={16} aria-hidden="true" />
              <Command.Input value={query} onValueChange={setQuery} placeholder={`Cari bidang ${STREAMS[stream].label}…`} autoFocus />
            </div>
            <Command.List className="cp-fp__list">
              {!typed && FIELD_GROUPS[stream].map((g) => (
                <Command.Group key={g.group} heading={g.group} className="cp-fp__group">
                  {g.fields.map((x) => (
                    <Command.Item key={x.label} value={`${stream}:${x.label}`} onSelect={() => pick(x.label)} className="cp-fp__item">
                      <span>{x.label}</span>
                      {value === x.label && <Check size={15} aria-hidden="true" />}
                    </Command.Item>
                  ))}
                </Command.Group>
              ))}
              {hits.length > 0 && (
                <Command.Group heading={`Hasil di ${STREAMS[stream].label}`} className="cp-fp__group">
                  {hits.map((x) => (
                    <Command.Item key={x.label} value={`${stream}:${x.label}`} onSelect={() => pick(x.label)} className="cp-fp__item">
                      <span>{x.label}</span>
                      {value === x.label ? <Check size={15} aria-hidden="true" /> : <small>{x.group}</small>}
                    </Command.Item>
                  ))}
                </Command.Group>
              )}
              {elsewhere.length > 0 && (
                <Command.Group heading={`Ditemukan di ${STREAMS[other].label}`} className="cp-fp__group is-elsewhere">
                  {elsewhere.map((x) => (
                    <Command.Item key={x.label} value={`${other}:${x.label}`} onSelect={() => pick(x.label, other)} className="cp-fp__item">
                      <span>{x.label}</span>
                      <small><ArrowRightLeft size={12} aria-hidden="true" /> {STREAMS[other].label}</small>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}
              {typed && !hits.length && !elsewhere.length && <div className="cp-fp__empty">Tidak ada bidang yang cocok dengan “{typed}”.</div>}
              <Command.Group className="cp-fp__group is-other">
                {typed && !hits.length && !elsewhere.length ? (
                  <Command.Item value="other:typed" onSelect={() => pick(OTHER_FIELD, stream, typed)} className="cp-fp__item is-other">
                    <PenLine size={15} aria-hidden="true" />
                    <span>Gunakan “{typed}”<small>Masuk sebagai bidang lainnya</small></span>
                  </Command.Item>
                ) : (
                  <Command.Item value="other" onSelect={() => pick(OTHER_FIELD)} className="cp-fp__item is-other">
                    <PenLine size={15} aria-hidden="true" />
                    <span>Lainnya<small>Bidang saya tidak ada di daftar</small></span>
                    {value === OTHER_FIELD && <Check size={15} aria-hidden="true" />}
                  </Command.Item>
                )}
              </Command.Group>
            </Command.List>
          </Command>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
