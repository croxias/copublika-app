'use client';

import { Play } from 'lucide-react';
import { IconBadge, type IconName } from '@/components/about/IconBadge';
import { youtubeId } from '@/components/about/HeroVideo';
import type { FieldContext, Values } from '@/lib/cms/types';

// Live, clickable schematics of the About sections for the admin editor. Each part opens the
// sub-tab (group key) that edits it.

const str = (v: unknown) => (v === undefined || v === null ? '' : String(v));
const list = (v: unknown) => (Array.isArray(v) ? (v as Values[]) : []);

type Props = { values: Values; active: string; onPick: (group: string) => void; ctx: FieldContext };

function Part({ group, active, onPick, className = '', children, label }: { group: string; active: string; onPick: (g: string) => void; className?: string; children: React.ReactNode; label: string }) {
  return (
    <button type="button" className={`cms-mini-part ${className} ${active === group ? 'is-active' : ''}`} onClick={() => onPick(group)} aria-label={`Edit ${label}`} aria-pressed={active === group}>
      {children}
    </button>
  );
}

function Title({ v, active, onPick }: Pick<Props, 'active' | 'onPick'> & { v: Values }) {
  return (
    <Part group="_head" active={active} onPick={onPick} className="cms-mini-head cms-mini-head--center" label="judul section">
      <span className="cms-mini-tag">{str(v.tag || v.eyebrow) || 'Label kecil'}</span>
      <span className="cms-mini-title">
        {str(v.title) || 'Judul'} <em>{str(v.accent)}</em>
      </span>
    </Part>
  );
}

const Ico = ({ name, tone = 'soft', size = 22 }: { name: unknown; tone?: 'solid' | 'soft' | 'dark'; size?: number }) =>
  str(name) ? <IconBadge icon={str(name) as IconName} tone={tone} size={size} /> : null;

export function AboutHeroPreview({ values: v, active, onPick }: Props) {
  const id = youtubeId(str(v.videoUrl));
  const poster = str(v.videoPoster) || (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '');
  return (
    <div className="cms-mini-surface is-ink">
      <div className="cms-mini-hero">
        <div className="cms-mini-hero__copy">
          <Part group="_text" active={active} onPick={onPick} label="teks hero">
            <span className="cms-mini-tag">{str(v.eyebrow)}</span>
            <span className="cms-mini-hero__h">
              {str(v.line1)} <em>{str(v.accent)}</em> {str(v.line2)}
            </span>
          </Part>
          <Part group="_cta" active={active} onPick={onPick} className="cms-mini-ctas cms-mini-ctas--hero" label="tombol">
            <span className="is-primary">{str(v.primaryLabel) || 'Tombol utama'}</span>
            {str(v.secondaryLabel) && <span>{str(v.secondaryLabel)}</span>}
          </Part>
        </div>
        <Part group="_video" active={active} onPick={onPick} className="cms-mini-video" label="video">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {poster && <img src={poster} alt="" />}
          <span className="cms-mini-video__play"><Play size={12} fill="currentColor" strokeWidth={0} /></span>
          <span className="cms-mini-video__cap">{str(v.videoTitle) || (id ? '' : 'Link YouTube belum valid')}</span>
        </Part>
      </div>
      <Part group="_stats" active={active} onPick={onPick} className="cms-mini-stats" label="angka">
        {list(v.stats).map((s, i) => (
          <span key={i}><b>{str(s.value)}<em>{str(s.accent)}</em></b><small>{str(s.label)}</small></span>
        ))}
      </Part>
    </div>
  );
}

export function AboutIntroPreview({ values: v, active, onPick }: Props) {
  const nodes = list(v.nodes);
  return (
    <div className="cms-mini-surface">
      <Title v={v} active={active} onPick={onPick} />
      <Part group="_eco" active={active} onPick={onPick} className="cms-mini-eco" label="infografis ekosistem">
        <span className="cms-mini-eco__core">Anda</span>
        {nodes.map((n, i) => {
          const a = ((-90 + (360 / Math.max(nodes.length, 1)) * i) * Math.PI) / 180;
          return (
            <span key={i} className="cms-mini-eco__node" style={{ left: `${50 + 38 * Math.cos(a)}%`, top: `${50 + 38 * Math.sin(a)}%` }}>
              <Ico name={n.icon} size={22} />
              <small>{str(n.title)}</small>
            </span>
          );
        })}
      </Part>
      <Part group="_facts" active={active} onPick={onPick} className="cms-mini-facts" label="fakta">
        {list(v.facts).map((f, i) => (
          <span key={i}><Ico name={f.icon} size={18} /><b>{str(f.value)}</b></span>
        ))}
      </Part>
    </div>
  );
}

export function AboutVisionPreview({ values: v, active, onPick }: Props) {
  const ms = list(v.missions);
  return (
    <div className="cms-mini-surface is-ink">
      <Title v={v} active={active} onPick={onPick} />
      <Part group="_vision" active={active} onPick={onPick} className="cms-mini-vision" label="visi">
        <span className="cms-mini-kicker">Visi</span>
        <span className="cms-mini-text cms-mini-text--wrap">{str(v.vision)}</span>
      </Part>
      <Part group="_missions" active={active} onPick={onPick} className="cms-mini-wheel" label="misi">
        <span className="cms-mini-wheel__ring" />
        <span className="cms-mini-wheel__hub">{str(v.visionShort)}</span>
        {ms.map((m, i) => {
          const a = ((-45 + 90 * i) * Math.PI) / 180;
          return (
            <span key={i} className="cms-mini-wheel__dot" style={{ left: `${50 + 42 * Math.cos(a)}%`, top: `${50 + 42 * Math.sin(a)}%` }} title={str(m.title)}>
              <Ico name={m.icon} tone="solid" size={22} />
            </span>
          );
        })}
      </Part>
    </div>
  );
}

export function AboutJourneyPreview({ values: v, active, onPick }: Props) {
  const steps = list(v.steps);
  return (
    <div className="cms-mini-surface is-ink">
      <Title v={v} active={active} onPick={onPick} />
      <Part group="_kpis" active={active} onPick={onPick} className="cms-mini-kpis" label="angka pertumbuhan">
        {list(v.kpis).map((k, i) => (
          <span key={i}><s>{str(k.from)}</s> → <b>{str(k.to)}{str(k.accent)}</b> <small>{str(k.label)}</small></span>
        ))}
      </Part>
      <Part group="_steps" active={active} onPick={onPick} className="cms-mini-journey" label="tonggak">
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 38 C 20 36, 30 28, 40 26 S 70 12, 100 2" /></svg>
        {steps.map((t, i) => (
          <span key={i} className="cms-mini-journey__step" style={{ left: `${8 + i * (84 / Math.max(steps.length - 1, 1))}%`, bottom: `${10 + i * 18}%` }}>
            <Ico name={t.icon} tone={i === steps.length - 1 ? 'solid' : 'dark'} size={20} />
            <small>{str(t.date)}</small>
          </span>
        ))}
      </Part>
    </div>
  );
}

export function TeamOrgPreview({ values: v, active, onPick, ctx }: Props) {
  const [chair, ...dirs] = list(v.exec);
  return (
    <div className="cms-mini-surface">
      <Title v={v} active={active} onPick={onPick} />
      <div className="cms-mini-org">
        <div className="cms-mini-org__top">
          <Part group="_sec" active={active} onPick={onPick} className="cms-mini-org__staff" label="sekretariat">
            {list(v.secretariat).map((r, i) => <OrgNode key={i} row={r} ctx={ctx} />)}
          </Part>
          <Part group="_exec" active={active} onPick={onPick} className="cms-mini-org__chair" label="pimpinan">
            {chair && <OrgNode row={chair} ctx={ctx} lead />}
          </Part>
        </div>
        <Part group="_exec" active={active} onPick={onPick} className="cms-mini-org__row" label="direksi">
          {dirs.map((r, i) => <OrgNode key={i} row={r} ctx={ctx} />)}
        </Part>
        <Part group="_div" active={active} onPick={onPick} className="cms-mini-org__row" label="kepala divisi">
          {list(v.divisions).map((r, i) => <OrgNode key={i} row={r} ctx={ctx} />)}
        </Part>
      </div>
    </div>
  );
}

function OrgNode({ row, lead, ctx }: { row: Values; lead?: boolean; ctx: FieldContext }) {
  const p = ctx.collections.people.find((x) => x.id === str(row.person));
  return (
    <span className={`cms-mini-org__node ${lead ? 'is-lead' : ''} ${p ? '' : 'is-open'}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {p && str(p.photo) ? <img src={str(p.photo)} alt="" /> : <i />}
      <small>{str(row.roleId)}</small>
    </span>
  );
}

export function JoinPreview({ values: v, active, onPick, ctx }: Props) {
  // Our Team has no checklist of its own: it lists the open positions of the org structure.
  const org = ctx.sections['aboutTeam.org'] ?? {};
  const open = ['exec', 'divisions', 'secretariat'].flatMap((k) => list(org[k])).filter((r) => !str(r.person));
  const items = v.list !== undefined ? list(v.list) : open.map((r) => ({ text: str(r.roleId) }));
  return (
    <div className="cms-mini-surface is-orange">
      <div className="cms-mini-join">
        <div className="cms-mini-join__copy">
          <Part group="_head" active={active} onPick={onPick} className="cms-mini-head" label="judul">
            <span className="cms-mini-tag">{str(v.eyebrow)}</span>
            <span className="cms-mini-title">{str(v.title)} <em>{str(v.accent)}</em></span>
          </Part>
          <Part group="_perks" active={active} onPick={onPick} className="cms-mini-perks" label="keuntungan">
            {list(v.perks).map((p, i) => (
              <span key={i}><Ico name={p.icon} tone="solid" size={18} />{str(p.title)}</span>
            ))}
          </Part>
        </div>
        <Part group="_card" active={active} onPick={onPick} className="cms-mini-join__card" label="kartu">
          <b>{str(v.listTitle) || `${open.length} posisi sedang dibuka`}</b>
          {(items.length ? items.map((r) => str(r.text)) : ['Belum ada posisi terbuka']).slice(0, 4).map((t, i) => (
            <span key={i}>✓ {t}</span>
          ))}
          <span className="cms-mini-join__btn">{str(v.ctaLabel) || 'Tombol'}</span>
        </Part>
      </div>
    </div>
  );
}
