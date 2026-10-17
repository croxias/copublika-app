'use client';

import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { ArrowUpRight, BarChart3, CalendarClock, CircleAlert, Clock3, FileCheck2, Layers3, UserCheck } from 'lucide-react';
import { useCms } from '@/lib/cms/store';
import { memberState } from '@/lib/cms/members';
import { OPEN_STATUSES, normalizeSignup, type SignupStatus } from '@/lib/cms/signups';
import { MembershipOverview } from './MembershipOverview';
import { selectAnalytics, useStaging, type AnalyticsReadModel } from '@/lib/staging';

type CardProps = { title: string; meta?: string; children: ReactNode; href?: string; className?: string };

function Card({ title, meta, children, href, className = '' }: CardProps) {
  return <section className={`analytics-card ${className}`}><header><div><span className="analytics-eyebrow">PUSAT OPERASIONAL</span><h2>{title}</h2>{meta && <p>{meta}</p>}</div>{href && <a href={href}>Buka detail <ArrowUpRight size={14} /></a>}</header>{children}</section>;
}

function Bars({ items, color = 'orange' }: { items: { label: string; value: number }[]; color?: string }) {
  const max = Math.max(1, ...items.map((item) => item.value));
  return <div className="analytics-bars" role="img" aria-label={items.map((item) => `${item.label}: ${item.value}`).join(', ')}>{items.map((item) => <div className="analytics-bar-row" key={item.label}><div className="bar-label"><span>{item.label}</span><b>{item.value}</b></div><div className="bar-track"><i style={{ width: `${Math.max(5, item.value / max * 100)}%`, '--bar-color': `var(--${color})` } as React.CSSProperties} /></div></div>)}</div>;
}

function Trend({ data }: { data: AnalyticsReadModel['applicantTrend'] }) {
  const max = Math.max(1, ...data.flatMap((item) => [item.submitted, item.approved]));
  return <div className="trend-chart" role="img" aria-label={`Tren pendaftar mingguan. ${data.map((item) => `${item.week}: ${item.submitted} masuk, ${item.approved} disetujui`).join('; ')}`}><div className="trend-axis"><span>{max}</span><span>{Math.round(max / 2)}</span><span>0</span></div><div className="trend-grid">{data.map((item) => <div className="trend-point" key={item.week} title={`${item.week}: ${item.submitted} masuk, ${item.approved} disetujui`}><div className="trend-bars"><i className="trend-submitted" style={{ height: `${Math.max(12, item.submitted / max * 100)}%` }} /><i className="trend-approved" style={{ height: `${Math.max(8, item.approved / max * 100)}%` }} /></div><small>{item.week.slice(5)}</small></div>)}</div><div className="chart-legend"><span><i className="legend-orange" /> Masuk</span><span><i className="legend-ink" /> Disetujui</span><span className="chart-note">12 minggu terakhir</span></div></div>;
}

function PriorityQueue({ model }: { model: AnalyticsReadModel }) {
  const items = model.deadlineRisks.slice(0, 3);
  return <Card title="Antrian prioritas" meta="Tindakan yang paling membutuhkan perhatian" href="/admin/applicants" className="analytics-card--priority"><div className="priority-list">{items.length ? items.map((item) => <a className="priority-item" href={item.href} key={item.entity}><span className={`priority-icon priority-icon--${item.severity}`}><CircleAlert size={17} /></span><span><b>{item.entity}</b><small>{item.reason}</small></span><strong>{item.deadline}</strong><ArrowUpRight size={15} /></a>) : <p className="cp-muted">Tidak ada antrian prioritas saat ini.</p>}</div></Card>;
}

/** compact (dashboard): batch, deadlines, projects and activity only; registrations live in MembershipOverview. */
function ModelViews({ model, compact = false }: { model: AnalyticsReadModel; compact?: boolean }) {
  const projectLabels: Record<string, string> = { Draft: 'Draf', 'Pending Review': 'Menunggu review', Published: 'Terbit', Archived: 'Arsip' };
  return <div className={`analytics-grid ${compact ? "is-compact" : ""}`}>{!compact && <PriorityQueue model={model} />}<Card title="Kesehatan batch" meta="Kapasitas dan risiko tenggat" href="/admin/batches" className="analytics-card--health"><div className="health-list">{model.batchHealth.map((item) => <a href={item.href} className="health-row" key={item.batch}><span className="health-mark"><CalendarClock size={15} /></span><span><b>{item.batch}</b><small>{item.occupied}/{item.quota} terisi · tenggat {item.deadline} · {item.reason}</small></span><strong className={`risk-${item.risk}`}>{item.risk === 'high' ? 'Tinggi' : item.risk === 'medium' ? 'Sedang' : 'Aman'}</strong></a>)}</div></Card>{!compact && <Card title="Tren pendaftar" meta="Arus pendaftar per minggu" href="/admin/applicants" className="analytics-card--trend"><Trend data={model.applicantTrend} /></Card>}<Card title="Alur proyek" meta="Distribusi status governance" href="/admin/projects" className="analytics-card--pipeline"><Bars items={model.projectPipeline.map((item) => ({ label: projectLabels[item.status] ?? item.status, value: item.count }))} color="ink" /></Card>{!compact && <Card title="Usia antrian" meta="Pendaftar menunggu berdasarkan durasi" className="analytics-card--aging"><Bars items={model.queueAging.map((item) => ({ label: item.bucket, value: item.count }))} /></Card>}<Card title="Risiko tenggat" meta="Item yang perlu perhatian" href="/admin/notifications" className="analytics-card--risk"><div className="health-list">{model.deadlineRisks.map((item) => <a href={item.href} className="health-row" key={item.entity}><span><b>{item.entity}</b><small>{item.reason} · {item.deadline}</small></span><strong className={`risk-${item.severity}`}>{item.severity === 'high' ? 'Tinggi' : 'Sedang'}</strong></a>)}{!model.deadlineRisks.length && <p className="cp-muted">Tidak ada risiko tenggat.</p>}</div></Card><Card title="Aktivitas terbaru" meta="Jejak perubahan dari workspace" href="/admin/notifications" className="analytics-card--activity"><div className="timeline">{model.activityTimeline.slice(0, 8).map((item) => <a href={item.href} key={`${item.timestamp}-${item.entity}`}><i /><span><b>{item.action}</b><small>{item.entity} · {new Date(item.timestamp).toLocaleDateString('id-ID')}</small></span></a>)}</div></Card></div>;
}

export function StagingDashboard() {
  const store = useStaging();
  const model = useMemo(() => selectAnalytics(store), [store]);
  const [activeMetric, setActiveMetric] = useState('semua');
  const cms = useCms();
  const [now] = useState(() => Date.now());
  const pending = (cms.collections.signups ?? []).map(normalizeSignup).filter((x) => OPEN_STATUSES.includes(x.status as SignupStatus)).length;
  const activeMembers = (cms.collections.members ?? []).filter((m) => ['active', 'expiring'].includes(memberState(m, now).state)).length;
  const openBatches = store.batches.filter((batch) => batch.status === 'Open').length;
  const reviewProjects = store.projects.filter((project) => project.status === 'Pending Review').length;
  const metrics = [{ key: 'antrian', label: 'Pendaftaran perlu tindakan', value: pending, detail: 'tinjauan & pembayaran', icon: Clock3, href: '/admin/applicants' }, { key: 'member', label: 'Member aktif', value: activeMembers, detail: 'keanggotaan berjalan', icon: UserCheck, href: '/admin/members' }, { key: 'batch', label: 'Batch terbuka', value: openBatches, detail: 'kuota aktif', icon: Layers3, href: '/admin/batches' }, { key: 'proyek', label: 'Review proyek', value: reviewProjects, detail: 'governance queue', icon: FileCheck2, href: '/admin/projects' }];
  return <main className="staging-page command-center"><div className="command-hero"><div className="cp-greet"><span className="staging-kicker">OPERASI / PRATINJAU LOKAL</span><div className="cp-crumb"><span>Admin</span><span className="cp-sep">/</span><span>Ikhtisar</span></div><h1>Pusat <em>operasional.</em></h1><p>Semua yang membutuhkan perhatian—keanggotaan, batch, dan proyek riset—dalam satu workspace.</p></div><div className="hero-signal"><BarChart3 size={18} /><span><b>Mode staging</b><small>Data sintetis aktif</small></span></div></div><div className="staging-notice"><span className="notice-pulse" />Preview lokal aktif <span>·</span> seluruh angka sintetis <span>·</span> perubahan hanya tersimpan di browser</div><div className="staging-stats">{metrics.map(({ key, label, value, detail, icon: Icon, href }) => <a href={href} className={activeMetric === key ? 'is-active' : ''} key={key} onMouseEnter={() => setActiveMetric(key)} onMouseLeave={() => setActiveMetric('semua')}><span className="stat-icon"><Icon size={18} /></span><span className="stat-copy"><small>{label}</small><b>{value}</b><em>{detail}</em></span><ArrowUpRight size={15} className="stat-arrow" /></a>)}</div><MembershipOverview /><ModelViews model={model} compact /></main>;
}

export function StagingAnalytics() { const store = useStaging(); const model = useMemo(() => selectAnalytics(store), [store]); return <main className="staging-page command-center"><div className="cp-pg-head"><div className="cp-greet"><span className="staging-kicker">ANALITIK / PRATINJAU LOKAL</span><h1>Analitik <em>operasional.</em></h1><p>Read model operasional yang sama dengan Pusat Operasional.</p></div></div><ModelViews model={model} /></main>; }

export default ModelViews;

declare module 'react' { interface CSSProperties { '--bar-color'?: string } }
