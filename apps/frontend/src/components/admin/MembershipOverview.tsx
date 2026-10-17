'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, CalendarClock, CircleAlert, Inbox, UserCheck, Wallet } from 'lucide-react';
import { useCms } from '@/lib/cms/store';
import { EXPIRING_DAYS, memberState } from '@/lib/cms/members';
import { OPEN_STATUSES, inQueue, kindOf, normalizeSignup, signupTiming, type SignupStatus } from '@/lib/cms/signups';
import type { CmsItem } from '@/lib/cms/types';
import { STREAMS, type Stream } from '@/lib/data/disciplines';
import { KpiTile } from './cms/TableKit';
import { StreamBadge } from './cms/Discipline';

// Dashboard → Keanggotaan: live numbers from the Pendaftaran and Anggota collections, the oldest
// registrations that still need the team, and how members split by STEM / Non-STEM and field.

const initials = (name: string) => name.replace(/^(Dr|Prof|Ir)\.?\s+/i, '').split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');

type Basis = 'members' | 'signups';

function spread(items: CmsItem[]) {
  const by = (s: Stream) => items.filter((x) => x.stream === s).length;
  const stem = by('stem');
  const nonstem = by('nonstem');
  const fields = new Map<string, { stream: Stream; count: number }>();
  for (const x of items) {
    const f = String(x.field ?? '').trim();
    if (!f || (x.stream !== 'stem' && x.stream !== 'nonstem')) continue;
    const cur = fields.get(f);
    fields.set(f, { stream: x.stream, count: (cur?.count ?? 0) + 1 });
  }
  const top = [...fields.entries()].map(([label, v]) => ({ label, ...v })).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)).slice(0, 5);
  return { stem, nonstem, none: items.length - stem - nonstem, total: items.length, top };
}

export function MembershipOverview() {
  const cms = useCms();
  const [now] = useState(() => Date.now());
  const [basis, setBasis] = useState<Basis>('members');
  const signups = useMemo(() => (cms.collections.signups ?? []).map(normalizeSignup).filter(inQueue), [cms.collections.signups]);
  const members = useMemo(() => cms.collections.members ?? [], [cms.collections.members]);

  const states = members.map((m) => memberState(m, now).state);
  const active = states.filter((s) => s === 'active' || s === 'expiring').length;
  const expiring = states.filter((s) => s === 'expiring').length;
  const fresh = signups.filter((x) => x.status === 'new');
  const late = fresh.filter((x) => signupTiming(x, now).tone === 'late');
  const waiting = signups.filter((x) => x.status === 'awaiting_payment');
  const queue = signups
    .filter((x) => OPEN_STATUSES.includes(x.status as SignupStatus) || x.status === 'approved')
    .sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)))
    .slice(0, 5);
  const data = spread(basis === 'members' ? members.filter((m) => m.status !== 'inactive') : signups);
  const pct = (n: number) => (data.total ? Math.round((n / data.total) * 100) : 0);
  const max = Math.max(1, ...data.top.map((t) => t.count));

  return (
    <section className="mov" aria-label="Keanggotaan">
      <section className="pov bov">
        <header className="pov-head">
          <div>
            <span className="pov-k">Keanggotaan</span>
            <p>Angka langsung dari Pendaftaran dan Anggota.</p>
          </div>
          <div className="mov-links">
            <Link href="/admin/applicants" className="cms-btn cms-btn--ghost cms-btn--sm">Pendaftaran <ArrowUpRight size={14} /></Link>
            <Link href="/admin/members" className="cms-btn cms-btn--ghost cms-btn--sm">Anggota <ArrowUpRight size={14} /></Link>
          </div>
        </header>
        <div className="pov-kpis bov-kpis evt-kpis">
          <KpiTile icon={<UserCheck size={17} />} label="Member aktif" value={active} share={active / Math.max(1, members.length)} tone="ok" />
          <KpiTile icon={<Inbox size={17} />} label="Menunggu tinjauan" value={fresh.length} share={fresh.length / Math.max(1, signups.length)} delay={0.05} />
          <KpiTile icon={<Wallet size={17} />} label="Menunggu pembayaran" value={waiting.length} share={waiting.length / Math.max(1, signups.length)} tone="ink" delay={0.1} />
          <KpiTile icon={<CalendarClock size={17} />} label={`Akan habis (≤${EXPIRING_DAYS} hari)`} value={expiring} share={expiring / Math.max(1, active)} tone="danger" delay={0.15} />
        </div>
      </section>

      <div className="mov-grid">
        <section className="analytics-card mov-card">
          <header>
            <div>
              <span className="analytics-eyebrow">Keanggotaan</span>
              <h2>Antrean pendaftaran</h2>
              <p>{late.length ? `${late.length} pendaftaran lewat 1×24 jam` : 'Yang paling lama menunggu lebih dulu'}</p>
            </div>
            <Link href="/admin/applicants">Buka detail <ArrowUpRight size={14} /></Link>
          </header>
          <div className="mov-queue">
            {queue.length ? queue.map((x) => {
              const t = signupTiming(x, now);
              const k = kindOf(x.kind);
              return (
                <Link href="/admin/applicants" className="mov-row" key={x.id}>
                  <span className="mov-av" aria-hidden="true">{initials(String(x.name))}</span>
                  <span className="mov-who">
                    <b>{String(x.name)}</b>
                    <small>{k.short} · {String(x.institution || x.email)}</small>
                  </span>
                  <StreamBadge stream={x.stream} />
                  <span className={`mov-sla is-${t.tone}`}>{t.tone === 'late' && <CircleAlert size={13} aria-hidden="true" />}{t.label}</span>
                </Link>
              );
            }) : <p className="mov-empty">Tidak ada pendaftaran yang menunggu.</p>}
          </div>
        </section>

        <section className="analytics-card mov-card">
          <header>
            <div>
              <span className="analytics-eyebrow">Keanggotaan</span>
              <h2>Rumpun &amp; bidang ilmu</h2>
              <p>{basis === 'members' ? `${data.total} member (tanpa yang nonaktif)` : `${data.total} pendaftaran dalam antrean`}</p>
            </div>
            <div className="mov-switch" role="tablist" aria-label="Dasar data">
              <button type="button" role="tab" aria-selected={basis === 'members'} onClick={() => setBasis('members')}>Anggota</button>
              <button type="button" role="tab" aria-selected={basis === 'signups'} onClick={() => setBasis('signups')}>Pendaftaran</button>
            </div>
          </header>
          <div className="mov-spread">
            <div className="mov-split" role="img" aria-label={`STEM ${data.stem}, Non-STEM ${data.nonstem}, belum diisi ${data.none}`}>
              {data.stem > 0 && <i className="is-stem" style={{ flexGrow: data.stem }} />}
              {data.nonstem > 0 && <i className="is-nonstem" style={{ flexGrow: data.nonstem }} />}
              {data.none > 0 && <i className="is-none" style={{ flexGrow: data.none }} />}
            </div>
            <dl className="mov-legend">
              <div><dt><span className="is-stem" />{STREAMS.stem.label}</dt><dd>{data.stem}<small>{pct(data.stem)}%</small></dd></div>
              <div><dt><span className="is-nonstem" />{STREAMS.nonstem.label}</dt><dd>{data.nonstem}<small>{pct(data.nonstem)}%</small></dd></div>
              {data.none > 0 && <div><dt><span className="is-none" />Belum diisi</dt><dd>{data.none}<small>{pct(data.none)}%</small></dd></div>}
            </dl>
            <span className="mov-sub">Bidang ilmu terbanyak</span>
            {data.top.length ? (
              <ol className="mov-top">
                {data.top.map((t) => (
                  <li key={t.label}>
                    <span className="mov-top__label"><b>{t.label}</b><StreamBadge stream={t.stream} /></span>
                    <span className="mov-top__bar"><i className={`is-${t.stream}`} style={{ width: `${(t.count / max) * 100}%` }} /></span>
                    <strong>{t.count}</strong>
                  </li>
                ))}
              </ol>
            ) : <p className="mov-empty">Belum ada data bidang ilmu.</p>}
          </div>
        </section>
      </div>
    </section>
  );
}
