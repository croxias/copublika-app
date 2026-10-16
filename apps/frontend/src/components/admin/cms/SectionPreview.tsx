'use client';

import type { FieldContext, SectionTab, Values } from '@/lib/cms/types';
import { GroupIconView } from './SectionGroups';
import { EventAgendaPreview, EventDetailPreview, EventHeroPreview, EventNextPreview } from './EventPagePreviews';
import { BlogArchivePreview, BlogDetailPreview, BlogHeroPreview, BlogPicksPreview, BlogWritePreview } from './BlogPagePreviews';
import { AboutHeroPreview, AboutIntroPreview, AboutJourneyPreview, AboutVisionPreview, JoinPreview, TeamOrgPreview } from './AboutPreviews';

const str = (v: unknown) => (v === undefined || v === null ? '' : String(v));
const num = (v: unknown, fallback = 0) => (Number.isFinite(Number(v)) && v !== '' ? Number(v) : fallback);

type Props = { values: Values; active: string; onPick: (group: string) => void; ctx: FieldContext };

/**
 * Small, live schematic of the public section. It mirrors the layout (not the pixels), so the
 * admin sees which card a field lands in; every part is a button that opens its group.
 */
export function SectionPreview({ kind, ...props }: Props & { kind: NonNullable<SectionTab['preview']> }) {
  return (
    <div className="cms-mini">
      <p className="cms-mini-label">Peta section · klik bagian untuk mengedit</p>
      {kind === 'why' && <WhyPreview {...props} />}
      {kind === 'program' && <ProgramPreview {...props} />}
      {kind === 'aboutHero' && <AboutHeroPreview {...props} />}
      {kind === 'aboutIntro' && <AboutIntroPreview {...props} />}
      {kind === 'aboutVision' && <AboutVisionPreview {...props} />}
      {kind === 'aboutJourney' && <AboutJourneyPreview {...props} />}
      {kind === 'teamOrg' && <TeamOrgPreview {...props} />}
      {kind === 'join' && <JoinPreview {...props} />}
      {kind === 'blogHero' && <BlogHeroPreview {...props} />}
      {kind === 'blogPicks' && <BlogPicksPreview {...props} />}
      {kind === 'blogArchive' && <BlogArchivePreview {...props} />}
      {kind === 'blogWrite' && <BlogWritePreview {...props} />}
      {kind === 'blogDetail' && <BlogDetailPreview {...props} />}
      {kind === 'eventHero' && <EventHeroPreview {...props} />}
      {kind === 'eventNext' && <EventNextPreview {...props} />}
      {kind === 'eventAgenda' && <EventAgendaPreview {...props} />}
      {kind === 'eventDetail' && <EventDetailPreview {...props} />}
    </div>
  );
}

function Part({ group, active, onPick, className = '', children, label }: { group: string; active: string; onPick: (g: string) => void; className?: string; children: React.ReactNode; label: string }) {
  return (
    <button type="button" className={`cms-mini-part ${className} ${active === group ? 'is-active' : ''}`} onClick={() => onPick(group)} aria-label={`Edit ${label}`} aria-pressed={active === group}>
      {children}
    </button>
  );
}

function Heading({ values: v, active, onPick }: Props) {
  return (
    <Part group="_head" active={active} onPick={onPick} className="cms-mini-head" label="judul section">
      <span className="cms-mini-tag">{str(v.tag) || 'Label kecil'}</span>
      <span className="cms-mini-title">
        {str(v.heading) || 'Judul'} <em>{str(v.headingAccent)}</em>
      </span>
    </Part>
  );
}

function WhyPreview(props: Props) {
  const { values: v, active, onPick, ctx } = props;
  const people = new Map(ctx.collections.people.map((p) => [p.id, str(p.name)]));
  const mentors = (Array.isArray(v.mentors) ? (v.mentors as string[]) : []).map((id) => people.get(id) ?? '—');
  const fields = Array.isArray(v.fields) ? (v.fields as string[]) : [];
  const steps = Array.isArray(v.progressSteps) ? (v.progressSteps as string[]) : [];
  const pct = Math.max(0, Math.min(100, num(v.progressPercent, 50)));
  return (
    <div className="cms-mini-surface is-ink">
      <Heading {...props} />
      <div className="cms-mini-bento">
        <Part group="_community" active={active} onPick={onPick} className="span-4" label="kartu komunitas">
          <span className="cms-mini-kicker"><GroupIconView icon="users" size={11} /> {str(v.communityKicker) || 'Komunitas'}</span>
          <span className="cms-mini-stat">{str(v.communityStat) || '0'}<em>{str(v.communityStatSuffix)}</em></span>
          <span className="cms-mini-text">{str(v.communityTitle)}</span>
        </Part>
        <Part group="_fields" active={active} onPick={onPick} className="span-2" label="kartu lintas disiplin">
          <span className="cms-mini-kicker"><GroupIconView icon="orbit" size={11} /> {str(v.fieldsKicker) || 'Lintas disiplin'}</span>
          <span className="cms-mini-orbit"><span>{str(v.fieldsCore) || 'Inti'}</span></span>
          <span className="cms-mini-text">{fields.length} bidang ilmu</span>
        </Part>
        <Part group="_mentors" active={active} onPick={onPick} className="span-2" label="kartu mentor">
          <span className="cms-mini-kicker"><GroupIconView icon="mentor" size={11} /> Mentor</span>
          <span className="cms-mini-avatars">
            {mentors.slice(0, 3).map((m, i) => <span key={i} title={m}>{m.replace(/^(Dr\.|Prof\.)\s*/, '').charAt(0)}</span>)}
          </span>
          <span className="cms-mini-text">{mentors.length ? `${mentors.length} mentor dipilih` : 'Belum ada mentor'}</span>
        </Part>
        <Part group="_safe" active={active} onPick={onPick} className="span-2" label="kartu ruang aman">
          <span className="cms-mini-kicker"><GroupIconView icon="shield" size={11} /> Ruang aman</span>
          <span className="cms-mini-bubble">{str(v.chatQuestion) || 'Pertanyaan'}</span>
          <span className="cms-mini-bubble is-reply">{str(v.chatAnswer) || 'Jawaban'}</span>
        </Part>
        <Part group="_progress" active={active} onPick={onPick} className="span-2" label="kartu progres">
          <span className="cms-mini-kicker"><GroupIconView icon="progress" size={11} /> Progres</span>
          <span className="cms-mini-bar"><span style={{ width: `${pct}%` }} /></span>
          <span className="cms-mini-text">{steps.join(' · ') || 'Tahapan'}</span>
        </Part>
      </div>
    </div>
  );
}

function ProgramPreview(props: Props) {
  const { values: v, active, onPick } = props;
  const weeks = Math.max(1, num(v.weeks, 12));
  const modules = Array.isArray(v.curriculum) ? (v.curriculum as Values[]) : [];
  const details = Array.isArray(v.details) ? (v.details as Values[]) : [];
  return (
    <div className="cms-mini-surface">
      <Heading {...props} />
      <div className="cms-mini-program">
        <Part group="_plan" active={active} onPick={onPick} className="cms-mini-plan" label="kurikulum">
          <span className="cms-mini-kicker"><GroupIconView icon="calendar" size={11} /> Kurikulum · {weeks} minggu</span>
          {modules.length ? (
            modules.map((m, i) => {
              const from = num(m.from, 1);
              const to = num(m.to, from);
              const bad = from < 1 || to < from || to > weeks;
              const left = ((Math.max(1, from) - 1) / weeks) * 100;
              const width = (Math.max(1, Math.min(weeks, to) - Math.max(1, from) + 1) / weeks) * 100;
              return (
                <span key={i} className={`cms-mini-row ${bad ? 'is-bad' : ''}`} title={bad ? 'Rentang minggu tidak valid' : undefined}>
                  <span className="cms-mini-row-title">{str(m.title) || `Modul ${i + 1}`}</span>
                  <span className="cms-mini-track"><span style={{ left: `${left}%`, width: `${width}%` }} /></span>
                </span>
              );
            })
          ) : (
            <span className="cms-mini-text">Belum ada modul</span>
          )}
        </Part>
        <div className="cms-mini-ticket">
          <Part group="_ticket" active={active} onPick={onPick} className="cms-mini-ticket-body" label="kartu pendaftaran">
            <span className="cms-mini-kicker is-live">{str(v.ticketStatus) || 'Status'}</span>
            <span className="cms-mini-batch">{str(v.ticketBatch)}</span>
            <span className="cms-mini-ticket-title">{str(v.ticketTitle) || 'Nama program'}</span>
            <span className="cms-mini-details">
              {details.slice(0, 4).map((d, i) => (
                <span key={i}><small>{str(d.label)}</small>{str(d.value)}</span>
              ))}
            </span>
          </Part>
          <Part group="_ticketCta" active={active} onPick={onPick} className="cms-mini-ctas" label="tombol kartu">
            <span className="is-primary">{str(v.ctaLabel) || 'Tombol utama'}</span>
            {str(v.secondaryLabel) && <span>{str(v.secondaryLabel)}</span>}
          </Part>
        </div>
      </div>
    </div>
  );
}
