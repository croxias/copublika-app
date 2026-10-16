'use client';

import { CheckCircle2, CircleDot, FilePen, MessageSquareWarning, PenLine, Send, Undo2, XCircle } from 'lucide-react';
import { EVENT_LABEL, REVIEW_STATES, historyOf, reviewOf, type ReviewEvent } from '@/lib/cms/review';
import type { Values } from '@/lib/cms/types';
import { formatDate } from './ui';

const ICON: Record<ReviewEvent['action'], typeof Send> = {
  created: FilePen,
  submitted: Send,
  resubmitted: Send,
  withdrawn: Undo2,
  edited: PenLine,
  changes: MessageSquareWarning,
  approved: CheckCircle2,
  scheduled: CheckCircle2,
  rejected: XCircle,
};

export function ReviewBadge({ item }: { item: Values }) {
  const s = REVIEW_STATES.find((x) => x.value === reviewOf(item)) ?? REVIEW_STATES[0];
  return <span className={`cms-badge cms-badge--${s.tone}`}>{s.label}</span>;
}

/** Newest first: who did what, with the editor's notes in full. */
export function ReviewTimeline({ item, limit }: { item: Values; limit?: number }) {
  const events = [...historyOf(item)].reverse().slice(0, limit);
  if (!events.length) return <p className="cms-muted rvt-empty">Belum ada aktivitas.</p>;
  return (
    <ol className="rvt">
      {events.map((e, i) => {
        const Icon = ICON[e.action] ?? CircleDot;
        return (
          <li key={`${e.at}-${i}`} className={`rvt-item is-${e.action} ${e.by === 'editor' ? 'by-editor' : ''}`}>
            <span className="rvt-dot" aria-hidden="true"><Icon size={13} /></span>
            <div>
              <p className="rvt-head">
                <strong>{EVENT_LABEL[e.action]}</strong>
                <small>{e.name} · {formatDate(e.at, true)}</small>
              </p>
              {e.fields?.length ? <p className="rvt-fields">Bagian yang disunting: {e.fields.join(', ')}</p> : null}
              {e.note && <blockquote className="rvt-note">{e.note}</blockquote>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
