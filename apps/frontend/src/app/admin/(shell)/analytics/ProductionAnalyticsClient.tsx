'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CpLineChart } from '@/components/admin/charts/CpLineChart';
import { CpDoughnutChart } from '@/components/admin/charts/CpDoughnutChart';
import { CpBarChart } from '@/components/admin/charts/CpBarChart';

const KPI_DATA = {
  totalMembers: { value: 1240, delta: '+48', deltaPercent: '+4.2%', trend: 'up', sparkline: [22, 28, 32, 35, 42, 48] },
  activeProjects: { value: 62, delta: '+8', deltaPercent: '+14.8%', trend: 'up', sparkline: [3, 4, 4, 6, 7, 8] },
  batchRate: { value: 68, delta: '204/300', deltaPercent: '68% filled', trend: 'neutral', sparkline: [50, 54, 58, 60, 64, 68] },
  blogTraffic: { value: 42800, delta: '+12.3K', deltaPercent: '+40.5%', trend: 'up', sparkline: [10, 15, 22, 28, 36, 42.8] },
  pendingVerifications: { value: 14, delta: '-3', deltaPercent: '-17.6%', trend: 'down', sparkline: [22, 20, 18, 17, 16, 14] },
  publishedPapers: { value: 318, delta: '+12', deltaPercent: '+3.9%', trend: 'up', sparkline: [3, 5, 6, 8, 10, 12] }
};

const MEMBER_GROWTH_DATA = [
  { month: 'Jan', members: 890, new: 45 },
  { month: 'Feb', members: 945, new: 55 },
  { month: 'Mar', members: 1000, new: 55 },
  { month: 'Apr', members: 1080, new: 80 },
  { month: 'Mei', members: 1160, new: 80 },
  { month: 'Jun', members: 1240, new: 80 }
];

const PROJECT_STATUS_DATA = [
  { status: 'Published', count: 28, color: '#2f8a40' },
  { status: 'Pending', count: 18, color: '#E9711C' },
  { status: 'Review', count: 12, color: '#1e40af' },
  { status: 'Draft', count: 4, color: '#8f887d' }
];

const BATCH_ANALYTICS = [
  { batch: 'Batch #1', total: 150, verified: 142, rejected: 8, rate: 94.7, year: '2023' },
  { batch: 'Batch #2', total: 210, verified: 198, rejected: 12, rate: 94.3, year: '2023' },
  { batch: 'Batch #3', total: 280, verified: 268, rejected: 12, rate: 95.7, year: '2024' },
  { batch: 'Batch #4', total: 300, verified: 186, pending: 14, rejected: 4, rate: 68.0, year: '2025', active: true }
];

const VERIFICATION_ANALYTICS = [
  { category: 'Auto-matched', count: 186, percentage: 91.2, color: '#2f8a40' },
  { category: 'Manual Review', count: 14, percentage: 6.9, color: '#E9711C' },
  { category: 'Mismatch', count: 4, percentage: 1.9, color: '#c93737' }
];

const CONTENT_ANALYTICS = {
  blogs: { published: 24, drafts: 8, scheduled: 4, totalViews: 42800 },
  events: { upcoming: 3, live: 1, past: 12, totalRegistrants: 1840 },
  templates: { downloads: 342, popular: 'Cover Letter Q1' }
};

const TOP_CONTRIBUTORS = [
  { name: 'Dr. Hadi Suryanto', institution: 'UNS', projects: 5, papers: 3, hIndex: 22, citations: 412, avatar: 'HS', color: 'orange' },
  { name: 'Dr. Nirmala D.', institution: 'ITB', projects: 4, papers: 2, hIndex: 18, citations: 286, avatar: 'ND', color: 'blue' },
  { name: 'Dr. Bayu Hermawan', institution: 'UGM', projects: 4, papers: 4, hIndex: 23, citations: 524, avatar: 'BH', color: 'green' },
  { name: 'Dr. Sari Nurhaliza', institution: 'UPI', projects: 3, papers: 2, hIndex: 15, citations: 198, avatar: 'SN', color: 'purple' },
  { name: 'Dr. Reza Dwianto', institution: 'UNDIP', projects: 3, papers: 1, hIndex: 18, citations: 256, avatar: 'RD', color: 'pink' }
];

const RECENT_ACTIVITIES = [
  { action: 'Verifikasi', target: 'Dr. Wira Pradana', time: '2 menit lalu', type: 'success' },
  { action: 'Proyek Baru', target: 'Doctoral Supervision...', time: '18 menit lalu', type: 'info' },
  { action: 'Publikasi', target: '7 Heuristik Memilih Reviewer', time: '1 jam lalu', type: 'success' },
  { action: 'Event Live', target: 'Strategi Memilih Jurnal Q1', time: '2 jam lalu', type: 'warning' },
  { action: 'Download', target: 'Template Cover Letter', time: '3 jam lalu', type: 'info' }
];

function buildHeatmapData() {
  const days = 84;
  const data: { day: number; count: number; intensity: number }[] = [];
  for (let i = 0; i < days; i++) {
    const dayOfWeek = i % 7;
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseActivity = isWeekend ? 1 : 6;
    const trend = Math.floor(i / 7) * 0.3;
    const noise = Math.floor(Math.sin(i * 1.7) * 3 + Math.cos(i * 0.9) * 2);
    const count = Math.max(0, baseActivity + trend + noise + 2);
    let intensity = 0;
    if (count > 14) intensity = 4;
    else if (count > 10) intensity = 3;
    else if (count > 6) intensity = 2;
    else if (count > 2) intensity = 1;
    data.push({ day: i, count, intensity });
  }
  return data;
}

const HEATMAP_DATA = buildHeatmapData();
const HEATMAP_TOTAL = Math.round(HEATMAP_DATA.reduce((a, b) => a + b.count, 0));

function fmtNum(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const TOP_INSTITUTIONS = [
  { name: 'Universitas Gadjah Mada', short: 'UGM', count: 186, percent: 15.0, color: '#2f8a40' },
  { name: 'Institut Teknologi Bandung', short: 'ITB', count: 164, percent: 13.2, color: '#1e40af' },
  { name: 'Universitas Indonesia', short: 'UI', count: 142, percent: 11.5, color: '#E9711C' },
  { name: 'Universitas Sebelas Maret', short: 'UNS', count: 118, percent: 9.5, color: '#7c3aed' },
  { name: 'Universitas Diponegoro', short: 'UNDIP', count: 96, percent: 7.7, color: '#db2777' },
  { name: 'Universitas Pendidikan Indonesia', short: 'UPI', count: 82, percent: 6.6, color: '#0891b2' }
];

const QUICK_STATS = [
  { label: 'Total Member', value: '1,240', icon: '👥' },
  { label: 'Proyek Aktif', value: '62', icon: '📄' },
  { label: 'Completion Rate', value: '68%', icon: '🎯' },
  { label: 'Blog Views', value: '42.8K', icon: '📊' },
  { label: 'Publikasi', value: '318', icon: '📚' },
];

export default function AnalyticsPage() {
  const [reveal, setReveal] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [contentTab, setContentTab] = useState<'blog' | 'event' | 'template'>('blog');

  useEffect(() => {
    document.title = 'Analytics — CoPublika Admin';
    const timer = setTimeout(() => setReveal(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="cp-analytics-mesh" />
      <div className="cp-analytics-accent-stripe" />

      {/* Page Header */}
      <div className="cp-pg-head cp-analytics-header">
        <div className="cp-greet">
          <div className="cp-crumb">
            <Link href="/admin/dashboard">Overview</Link>
            <span className="cp-sep">/</span>
            <span>Analytics</span>
          </div>
          <h1>
            <span className="cp-pg-eyebrow">COMMAND CENTER</span>
            ANALYTICS <em>DASHBOARD</em>
          </h1>
          <p>Insight komprehensif performa komunitas, proyek, dan konten dalam satu tampilan presisi.</p>
          <div className="cp-analytics-live-indicator">
            <span className="cp-analytics-live-dot" />
            <span>Live</span>
            <span className="cp-analytics-live-sep">·</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            <span>Terakhir diperbarui: 15 Jun 2026, 14:32 WIB</span>
          </div>
        </div>
        <div className="cp-seg">
          <button className={timeRange === '7d' ? 'active' : ''} onClick={() => setTimeRange('7d')}>7 Hari</button>
          <button className={timeRange === '30d' ? 'active' : ''} onClick={() => setTimeRange('30d')}>30 Hari</button>
          <button className={timeRange === '90d' ? 'active' : ''} onClick={() => setTimeRange('90d')}>90 Hari</button>
          <button className={timeRange === '1y' ? 'active' : ''} onClick={() => setTimeRange('1y')}>1 Tahun</button>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <section className="cp-kpis cp-analytics-kpis-v2">
        {/* Featured KPI — Total Member (Horizontal 2-col layout) */}
        <div className={`cp-kpi cp-kpi-feat cp-reveal ${reveal ? 'cp-in' : ''}`}>
          <div className="cp-kpi-glow" />
          <div className="cp-kpi-dots" />
          <div className="cp-kpi-orb" />

          <div className="cp-kpi-feat-body">
            <div className="cp-kpi-feat-left">
              <div className="cp-ktop">
                <div className="cp-klabel">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Total Member
                </div>
                <div className="cp-kico">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
              </div>

              <div className="cp-kbig">
                {fmtNum(KPI_DATA.totalMembers.value)}
                <span className="cp-kdelta cp-kdelta-up-green">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                  {KPI_DATA.totalMembers.delta}
                </span>
              </div>

              <div className="cp-ksub">
                <strong>{KPI_DATA.totalMembers.deltaPercent}</strong> growth
              </div>

              <div className="cp-kpi-feat-foot">
                <div className="cp-kpi-feat-foot-item">
                  <span className="cp-kpi-feat-foot-label">ACTIVE</span>
                  <span className="cp-kpi-feat-foot-value">1,184</span>
                </div>
                <div className="cp-kpi-feat-foot-divider" />
                <div className="cp-kpi-feat-foot-item">
                  <span className="cp-kpi-feat-foot-label">PENDING</span>
                  <span className="cp-kpi-feat-foot-value">14</span>
                </div>
                <div className="cp-kpi-feat-foot-divider" />
                <div className="cp-kpi-feat-foot-item">
                  <span className="cp-kpi-feat-foot-label">ALUMNI</span>
                  <span className="cp-kpi-feat-foot-value">42</span>
                </div>
              </div>
            </div>

            <div className="cp-kpi-feat-right">
              <div className="cp-kpi-feat-chart-label">6-MONTH TREND</div>
              <div className="cp-sparkline-chart">
                <CpLineChart
                  labels={['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun']}
                  datasets={[{ label: 'Members', data: KPI_DATA.totalMembers.sparkline, color: '#E9711C', fill: true }]}
                  height={120}
                  showGrid={true}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Proyek Aktif */}
        <div className={`cp-kpi cp-reveal ${reveal ? 'cp-in' : ''}`}>
          <div className="cp-kpi-glow cp-kpi-glow-orange" />
          <div className="cp-kpi-dots cp-kpi-dots-subtle" />
          <div className="cp-ktop">
            <div className="cp-klabel">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <line x1="9" y1="13" x2="15" y2="13" />
                <line x1="9" y1="17" x2="15" y2="17" />
              </svg>
              Proyek Aktif
            </div>
          </div>
          <div className="cp-kbig cp-sm">
            {KPI_DATA.activeProjects.value}
            <span className="cp-kdelta cp-kdelta-up">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15" />
              </svg>
              {KPI_DATA.activeProjects.delta}
            </span>
          </div>
          <div className="cp-ksub">
            <strong>{KPI_DATA.activeProjects.deltaPercent}</strong> from last period
          </div>
          <div className="cp-kpi-bars">
            <CpBarChart
              labels={PROJECT_STATUS_DATA.map(s => s.status.slice(0, 3))}
              data={PROJECT_STATUS_DATA.map(s => s.count)}
              color="#E9711C"
              height={42}
              showValues={true}
            />
          </div>
          <div className="cp-kpi-bars-labels">
            {PROJECT_STATUS_DATA.map((s) => (
              <span key={s.status} className="cp-kpi-bar-label">{s.status.slice(0, 3)}</span>
            ))}
          </div>
        </div>

        {/* Batch #4 Rate */}
        <div className={`cp-kpi cp-reveal ${reveal ? 'cp-in' : ''}`}>
          <div className="cp-kpi-glow cp-kpi-glow-orange" />
          <div className="cp-kpi-dots cp-kpi-dots-subtle" />
          <div className="cp-ktop">
            <div className="cp-klabel">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4l2.5 2.5" />
              </svg>
              Batch #4 Rate
            </div>
          </div>
          <div className="cp-kbig cp-sm">
            {KPI_DATA.batchRate.value}
            <span className="cp-kpi-unit">%</span>
            <span className="cp-kdelta cp-kdelta-neutral">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              {KPI_DATA.batchRate.delta}
            </span>
          </div>
          <div className="cp-ksub">
            <strong>{KPI_DATA.batchRate.deltaPercent}</strong> · 96 slots remaining
          </div>
          <div className="cp-kpi-progress-row">
            <div className="cp-kpi-progress-ring">
              <svg viewBox="0 0 36 36" width="44" height="44">
                <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15" fill="none" stroke="#E9711C" strokeWidth="3"
                  strokeDasharray={`${(KPI_DATA.batchRate.value / 100) * 94.2} 94.2`}
                  strokeLinecap="round" transform="rotate(-90 18 18)" className="cp-kpi-progress-circle"
                />
              </svg>
              <div className="cp-kpi-progress-num">{KPI_DATA.batchRate.value}</div>
            </div>
            <div className="cp-kpi-segments">
              {[...Array(20)].map((_, i) => (
                <span key={i} className={`cp-kpi-segment ${i < Math.floor(KPI_DATA.batchRate.value / 5) ? 'cp-kpi-segment-filled' : ''}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Blog Traffic */}
        <div className={`cp-kpi cp-reveal ${reveal ? 'cp-in' : ''}`}>
          <div className="cp-kpi-glow cp-kpi-glow-blue" />
          <div className="cp-kpi-dots cp-kpi-dots-subtle" />
          <div className="cp-ktop">
            <div className="cp-klabel">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="m7 14 4-4 4 4 5-5" />
              </svg>
              Blog Traffic
            </div>
          </div>
          <div className="cp-kbig cp-sm">
            {(KPI_DATA.blogTraffic.value / 1000).toFixed(1)}
            <span className="cp-kpi-unit">K</span>
            <span className="cp-kdelta cp-kdelta-up">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15" />
              </svg>
              {KPI_DATA.blogTraffic.delta}
            </span>
          </div>
          <div className="cp-ksub">
            <strong>{KPI_DATA.blogTraffic.deltaPercent}</strong> · {fmtNum(KPI_DATA.blogTraffic.value)} views
          </div>
          <div className="cp-kpi-sparkline">
            <div className="cp-sparkline-chart">
              <CpLineChart
                labels={['W1', 'W2', 'W3', 'W4', 'W5', 'W6']}
                datasets={[{ label: 'Traffic', data: KPI_DATA.blogTraffic.sparkline, color: '#1e40af', fill: true }]}
                height={40}
                showGrid={false}
                className="cp-sparkline-mini"
              />
            </div>
          </div>
        </div>

        {/* Pending Verifications */}
        <div className={`cp-kpi cp-reveal ${reveal ? 'cp-in' : ''}`}>
          <div className="cp-kpi-glow cp-kpi-glow-red" />
          <div className="cp-kpi-dots cp-kpi-dots-subtle" />
          <div className="cp-ktop">
            <div className="cp-klabel">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4l2.5 2.5" />
              </svg>
              Pending Verify
            </div>
          </div>
          <div className="cp-kbig cp-sm">
            {KPI_DATA.pendingVerifications.value}
            <span className="cp-kpi-unit">ppl</span>
            <span className="cp-kdelta cp-kdelta-down">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
              {KPI_DATA.pendingVerifications.delta}
            </span>
          </div>
          <div className="cp-ksub">
            <strong>{KPI_DATA.pendingVerifications.deltaPercent}</strong> from yesterday
          </div>
          <div className="cp-kpi-heatmap">
            {[...Array(28)].map((_, i) => {
              const intensity = (i * 7 + 3) % 5;
              return (
                <span key={i} className={`cp-kpi-heatmap-dot cp-kpi-heatmap-dot-${intensity > 2 ? 'high' : intensity > 1 ? 'med' : 'low'}`} />
              );
            })}
          </div>
          <div className="cp-kpi-heatmap-labels">
            <span>Last 28 days</span>
            <span className="cp-kpi-heatmap-legend">
              <span className="cp-kpi-heatmap-dot cp-kpi-heatmap-dot-low" /> Low
              <span className="cp-kpi-heatmap-dot cp-kpi-heatmap-dot-med" /> Med
              <span className="cp-kpi-heatmap-dot cp-kpi-heatmap-dot-high" /> High
            </span>
          </div>
        </div>

        {/* Published Papers */}
        <div className={`cp-kpi cp-reveal ${reveal ? 'cp-in' : ''}`}>
          <div className="cp-kpi-glow cp-kpi-glow-green" />
          <div className="cp-kpi-dots cp-kpi-dots-subtle" />
          <div className="cp-ktop">
            <div className="cp-klabel">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              Publikasi Alumni
            </div>
          </div>
          <div className="cp-kbig cp-sm">
            {KPI_DATA.publishedPapers.value}
            <span className="cp-kdelta cp-kdelta-up">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15" />
              </svg>
              {KPI_DATA.publishedPapers.delta}
            </span>
          </div>
          <div className="cp-ksub">
            <strong>{KPI_DATA.publishedPapers.deltaPercent}</strong> · 42 active researchers
          </div>
          <div className="cp-kpi-donut-row">
            <div className="cp-kpi-donut-chart-wrap">
              <CpDoughnutChart
                labels={['Q1', 'Q2', 'Q3']}
                data={[62, 22, 16]}
                colors={['#2f8a40', '#E9711C', '#1e40af']}
                height={44}
                cutout="65%"
              />
            </div>
            <div className="cp-kpi-donut-legend">
              <div className="cp-kpi-donut-item">
                <span className="cp-kpi-donut-dot cp-donut-green" />
                <span className="cp-kpi-donut-label">Q1</span>
                <span className="cp-kpi-donut-value">62%</span>
              </div>
              <div className="cp-kpi-donut-item">
                <span className="cp-kpi-donut-dot cp-donut-orange" />
                <span className="cp-kpi-donut-label">Q2</span>
                <span className="cp-kpi-donut-value">22%</span>
              </div>
              <div className="cp-kpi-donut-item">
                <span className="cp-kpi-donut-dot cp-donut-blue" />
                <span className="cp-kpi-donut-label">Q3</span>
                <span className="cp-kpi-donut-value">16%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Strip */}
      <div className={`cp-quick-stats-strip cp-reveal ${reveal ? 'cp-in' : ''}`}>
        {QUICK_STATS.map((stat, i) => (
          <div key={stat.label} className={`cp-quick-stat ${i === QUICK_STATS.length - 1 ? 'cp-quick-stat-last' : ''}`}>
            <span className="cp-quick-stat-icon">{stat.icon}</span>
            <div className="cp-quick-stat-text">
              <span className="cp-quick-stat-label">{stat.label}</span>
              <span className="cp-quick-stat-value">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <section className="cp-grid-2">
        {/* Member Growth Chart */}
        <div className={`cp-card cp-reveal ${reveal ? 'cp-in' : ''} cp-chart-card`}>
          <div className="cp-card-ornament">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="50" cy="10" r="3" fill="#E9711C" opacity="0.18" />
              <circle cx="38" cy="10" r="2" fill="#E9711C" opacity="0.10" />
              <circle cx="50" cy="22" r="2" fill="#E9711C" opacity="0.10" />
            </svg>
          </div>
          <div className="cp-card-head">
            <div className="cp-card-title-wrap">
              <div className="cp-card-title-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </div>
              <div>
                <span className="cp-card-eyebrow">GROWTH</span>
                <h3>Pertumbuhan Member</h3>
                <p className="cp-card-sub">Tren akumulasi member 6 bulan terakhir</p>
              </div>
            </div>
            <div className="cp-card-head-right">
              <span className="cp-kmeta">
                <span className="cp-kmeta-dot" />
                +350 member baru
              </span>
            </div>
          </div>
          <div className="cp-chart-container cp-analytics-chart">
            <div className="cp-chart-wrapper">
              <CpLineChart
                labels={MEMBER_GROWTH_DATA.map(d => d.month)}
                datasets={[{ label: 'Total Member', data: MEMBER_GROWTH_DATA.map(d => d.members), color: '#E9711C', fill: true }]}
                height={240}
                showGrid={true}
                yMin={800}
                yMax={1300}
              />
            </div>
          </div>
        </div>

        {/* Project Status Distribution */}
        <div className={`cp-card cp-reveal ${reveal ? 'cp-in' : ''} cp-chart-card`}>
          <div className="cp-card-ornament">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="50" cy="10" r="3" fill="#E9711C" opacity="0.18" />
              <circle cx="38" cy="10" r="2" fill="#E9711C" opacity="0.10" />
              <circle cx="50" cy="22" r="2" fill="#E9711C" opacity="0.10" />
            </svg>
          </div>
          <div className="cp-card-head">
            <div className="cp-card-title-wrap">
              <div className="cp-card-title-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                  <path d="M22 12A10 10 0 0 0 12 2v10z" />
                </svg>
              </div>
              <div>
                <span className="cp-card-eyebrow">DISTRIBUTION</span>
                <h3>Status Proyek</h3>
                <p className="cp-card-sub">62 proyek aktif berdasarkan status</p>
              </div>
            </div>
            <div className="cp-card-head-right">
              <span className="cp-kmeta">Total: 62</span>
            </div>
          </div>
          <div className="cp-chart-container cp-donut-container">
            <div className="cp-chart-wrapper cp-donut-wrapper">
              <CpDoughnutChart
                labels={PROJECT_STATUS_DATA.map(d => d.status)}
                data={PROJECT_STATUS_DATA.map(d => d.count)}
                colors={PROJECT_STATUS_DATA.map(d => d.color)}
                centerLabel={{ value: '62', subtext: 'PROYEK' }}
                height={220}
                cutout="62%"
              />
            </div>
            <div className="cp-donut-legend">
              {PROJECT_STATUS_DATA.map((item) => (
                <div key={item.status} className="cp-legend-item">
                  <span className="cp-legend-dot" data-color={item.status.toLowerCase()} />
                  <span className="cp-legend-label">{item.status}</span>
                  <span className="cp-legend-value">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Activity Heatmap + Top Institutions */}
      <section className="cp-grid-analytics-wide">
        <div className={`cp-card cp-reveal ${reveal ? 'cp-in' : ''} cp-chart-card cp-heatmap-card`}>
          <div className="cp-card-ornament">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="50" cy="10" r="3" fill="#E9711C" opacity="0.18" />
              <circle cx="38" cy="10" r="2" fill="#E9711C" opacity="0.10" />
              <circle cx="50" cy="22" r="2" fill="#E9711C" opacity="0.10" />
            </svg>
          </div>
          <div className="cp-card-head">
            <div className="cp-card-title-wrap">
              <div className="cp-card-title-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </div>
              <div>
                <span className="cp-card-eyebrow">ENGAGEMENT MAP</span>
                <h3>Member Activity Heatmap</h3>
                <p className="cp-card-sub">12 minggu terakhir aktivitas platform</p>
              </div>
            </div>
            <div className="cp-card-head-right">
              <div className="cp-heatmap-summary">
                <div className="cp-heatmap-summary-item">
                  <span className="cp-heatmap-summary-value">{fmtNum(HEATMAP_TOTAL)}</span>
                  <span className="cp-heatmap-summary-label">TOTAL ACTIONS</span>
                </div>
                <div className="cp-heatmap-summary-divider" />
                <div className="cp-heatmap-summary-item">
                  <span className="cp-heatmap-summary-value">14.2K</span>
                  <span className="cp-heatmap-summary-label">PEAK / WEEK</span>
                </div>
                <div className="cp-heatmap-summary-divider" />
                <div className="cp-heatmap-summary-item">
                  <span className="cp-heatmap-summary-value cp-heatmap-summary-trend">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                    +28.4%
                  </span>
                  <span className="cp-heatmap-summary-label">vs PREV</span>
                </div>
              </div>
            </div>
          </div>
          <div className="cp-heatmap-body">
            <div className="cp-heatmap-days">
              <span>Min</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span>
            </div>
            <div className="cp-heatmap-grid">
              <div className="cp-heatmap-months">
                {['Apr', 'Mei', 'Jun'].map((m, i) => (
                  <span key={i} className="cp-heatmap-month-label">{m}</span>
                ))}
              </div>
              <div className="cp-heatmap-cells">
                {HEATMAP_DATA.map((d) => (
                  <div key={d.day} className={`cp-heatmap-cell cp-heatmap-cell-${d.intensity}`} title={`${d.count} actions`} />
                ))}
              </div>
            </div>
            <div className="cp-heatmap-legend">
              <span className="cp-heatmap-legend-label">Less</span>
              <span className="cp-heatmap-cell cp-heatmap-cell-0" />
              <span className="cp-heatmap-cell cp-heatmap-cell-1" />
              <span className="cp-heatmap-cell cp-heatmap-cell-2" />
              <span className="cp-heatmap-cell cp-heatmap-cell-3" />
              <span className="cp-heatmap-cell cp-heatmap-cell-4" />
              <span className="cp-heatmap-legend-label">More</span>
            </div>
          </div>
          <div className="cp-heatmap-breakdown">
            <div className="cp-heatmap-breakdown-item">
              <div className="cp-heatmap-breakdown-icon cp-breakdown-green">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div>
                <span className="cp-heatmap-breakdown-value">486</span>
                <span className="cp-heatmap-breakdown-label">Verifikasi</span>
              </div>
            </div>
            <div className="cp-heatmap-breakdown-item">
              <div className="cp-heatmap-breakdown-icon cp-breakdown-orange">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div>
                <span className="cp-heatmap-breakdown-value">312</span>
                <span className="cp-heatmap-breakdown-label">Publikasi</span>
              </div>
            </div>
            <div className="cp-heatmap-breakdown-item">
              <div className="cp-heatmap-breakdown-icon cp-breakdown-blue">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <span className="cp-heatmap-breakdown-value">198</span>
                <span className="cp-heatmap-breakdown-label">Member Baru</span>
              </div>
            </div>
            <div className="cp-heatmap-breakdown-item">
              <div className="cp-heatmap-breakdown-icon cp-breakdown-purple">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <span className="cp-heatmap-breakdown-value">124</span>
                <span className="cp-heatmap-breakdown-label">Diskusi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Institutions */}
        <div className={`cp-card cp-reveal ${reveal ? 'cp-in' : ''} cp-chart-card cp-institutions-card`}>
          <div className="cp-card-ornament">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="50" cy="10" r="3" fill="#E9711C" opacity="0.18" />
              <circle cx="38" cy="10" r="2" fill="#E9711C" opacity="0.10" />
              <circle cx="50" cy="22" r="2" fill="#E9711C" opacity="0.10" />
            </svg>
          </div>
          <div className="cp-card-head">
            <div className="cp-card-title-wrap">
              <div className="cp-card-title-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
              <div>
                <span className="cp-card-eyebrow">TOP INSTITUTIONS</span>
                <h3>Distribusi Member</h3>
                <p className="cp-card-sub">Top 6 institusi berdasarkan jumlah member</p>
              </div>
            </div>
          </div>
          <div className="cp-institutions-list">
            {TOP_INSTITUTIONS.map((inst, idx) => (
              <div key={inst.short} className="cp-institution-row" data-color={inst.short.toLowerCase()}>
                <div className="cp-institution-rank">{idx + 1}</div>
                <div className="cp-institution-badge">{inst.short}</div>
                <div className="cp-institution-info">
                  <div className="cp-institution-info-head">
                    <span className="cp-institution-name">{inst.name}</span>
                    <span className="cp-institution-count">{inst.count} <span className="cp-institution-percent">({inst.percent}%)</span></span>
                  </div>
                  <div className="cp-institution-bar-bg">
                    <div
                      className="cp-institution-bar-fill"
                      style={{
                        width: `${(inst.count / TOP_INSTITUTIONS[0].count) * 100}%`,
                        background: `linear-gradient(90deg, ${inst.color}, ${inst.color}dd)`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="cp-institutions-footer">
            <div className="cp-institutions-footer-stat">
              <span className="cp-institutions-footer-value">6</span>
              <span className="cp-institutions-footer-label">TOP INSTITUSI</span>
            </div>
            <div className="cp-institutions-footer-divider" />
            <div className="cp-institutions-footer-stat">
              <span className="cp-institutions-footer-value">62.5%</span>
              <span className="cp-institutions-footer-label">DARI TOTAL</span>
            </div>
            <div className="cp-institutions-footer-divider" />
            <div className="cp-institutions-footer-stat">
              <span className="cp-institutions-footer-value">38</span>
              <span className="cp-institutions-footer-label">INSTITUSI LAIN</span>
            </div>
          </div>
        </div>
      </section>

      {/* Batch Analytics */}
      <section className={`cp-card cp-reveal ${reveal ? 'cp-in' : ''} cp-analytics-card cp-chart-card`}>
        <div className="cp-card-ornament">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <circle cx="50" cy="10" r="3" fill="#E9711C" opacity="0.18" />
            <circle cx="38" cy="10" r="2" fill="#E9711C" opacity="0.10" />
            <circle cx="50" cy="22" r="2" fill="#E9711C" opacity="0.10" />
          </svg>
        </div>
        <div className="cp-card-head">
          <div className="cp-card-title-wrap">
            <div className="cp-card-title-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3h18v4H3z" />
                <path d="M3 11h18v4H3z" />
                <path d="M3 19h18v2H3z" />
              </svg>
            </div>
            <div>
              <span className="cp-card-eyebrow">PERFORMANCE</span>
              <h3>Batch Analytics</h3>
              <p className="cp-card-sub">Performa pendaftaran dan verifikasi per batch</p>
            </div>
          </div>
          <Link href="#" className="cp-link-mono">
            Detail
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
        <div className="cp-batch-table">
          <div className="cp-batch-table-head">
            <div>Batch</div>
            <div>Pendaftar</div>
            <div>Terverifikasi</div>
            <div>Ditolak</div>
            <div>Menunggu</div>
            <div>Rate</div>
          </div>
          {BATCH_ANALYTICS.map((batch) => {
            const ringSize = 32;
            const stroke = 3;
            const radius = (ringSize - stroke) / 2;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (batch.rate / 100) * circumference;
            const rateColor = batch.rate > 90 ? '#2f8a40' : batch.rate > 70 ? '#E9711C' : '#c93737';
            return (
              <div key={batch.batch} className={`cp-batch-table-row ${batch.active ? 'cp-batch-table-row-active' : ''}`}>
                <div className="cp-batch-cell-batch">
                  <div className="cp-batch-cell-batch-info">
                    <span className="cp-batch-cell-batch-name">{batch.batch}</span>
                    <span className="cp-batch-cell-batch-year">{batch.year}</span>
                  </div>
                  {batch.active && <span className="cp-batch-active-tag">ACTIVE</span>}
                </div>
                <div className="cp-batch-cell-num">
                  <span className="cp-batch-cell-num-value">{batch.total}</span>
                </div>
                <div className="cp-batch-cell-num">
                  <span className="cp-batch-cell-num-value cp-batch-cell-verified">{batch.verified}</span>
                </div>
                <div className="cp-batch-cell-num">
                  <span className="cp-batch-cell-num-value cp-batch-cell-rejected">{batch.rejected || '—'}</span>
                </div>
                <div className="cp-batch-cell-num">
                  <span className="cp-batch-cell-num-value cp-batch-cell-pending">{batch.pending || '—'}</span>
                </div>
                <div className="cp-batch-cell-rate">
                  <svg width={ringSize} height={ringSize} className="cp-batch-rate-ring">
                    <circle cx={ringSize / 2} cy={ringSize / 2} r={radius} fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth={stroke} />
                    <circle cx={ringSize / 2} cy={ringSize / 2} r={radius} fill="none" stroke={rateColor} strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`} />
                  </svg>
                  <span className="cp-batch-cell-rate-value" data-rate={batch.rate > 90 ? 'high' : batch.rate > 70 ? 'mid' : 'low'}>
                    {batch.rate.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Verification Analytics + Top Contributors */}
      <section className="cp-grid-2">
        <div className={`cp-card cp-reveal ${reveal ? 'cp-in' : ''} cp-chart-card`}>
          <div className="cp-card-ornament">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="50" cy="10" r="3" fill="#E9711C" opacity="0.18" />
              <circle cx="38" cy="10" r="2" fill="#E9711C" opacity="0.10" />
              <circle cx="50" cy="22" r="2" fill="#E9711C" opacity="0.10" />
            </svg>
          </div>
          <div className="cp-card-head">
            <div className="cp-card-title-wrap">
              <div className="cp-card-title-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div>
                <span className="cp-card-eyebrow">VERIFICATION</span>
                <h3>Verifikasi Analytics</h3>
                <p className="cp-card-sub">Breakdown hasil verifikasi pendaftar</p>
              </div>
            </div>
          </div>
          <div className="cp-verification-chart">
            {VERIFICATION_ANALYTICS.map((item) => (
              <div key={item.category} className="cp-verification-row">
                <div className="cp-verification-info">
                  <div className="cp-verification-indicator" data-vertype={item.category === 'Auto-matched' ? 'auto' : item.category === 'Manual Review' ? 'manual' : 'mismatch'}>
                    {item.category === 'Auto-matched' && (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    )}
                    {item.category === 'Manual Review' && (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                    )}
                    {item.category === 'Mismatch' && (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    )}
                  </div>
                  <div className="cp-verification-text">
                    <span className="cp-verification-label">{item.category}</span>
                    <span className="cp-verification-count">{item.count} pendaftar</span>
                  </div>
                </div>
                <div className="cp-verification-bar-wrapper">
                  <div className="cp-verification-bar-bg">
                    <div className="cp-verification-bar-fill" data-vertype={item.category === 'Auto-matched' ? 'auto' : item.category === 'Manual Review' ? 'manual' : 'mismatch'} data-pct={String(item.percentage)} />
                  </div>
                  <span className="cp-verification-percentage">{item.percentage}%</span>
                </div>
              </div>
            ))}
            <div className="cp-verification-summary">
              <div className="cp-verification-summary-item">
                <span className="cp-verification-summary-label">Total</span>
                <span className="cp-verification-summary-value">204</span>
              </div>
              <div className="cp-verification-summary-divider" />
              <div className="cp-verification-summary-item">
                <span className="cp-verification-summary-label">Success Rate</span>
                <span className="cp-verification-summary-value cp-verification-summary-success">98.0%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Contributors */}
        <div className={`cp-card cp-reveal ${reveal ? 'cp-in' : ''} cp-chart-card`}>
          <div className="cp-card-ornament">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="50" cy="10" r="3" fill="#E9711C" opacity="0.18" />
              <circle cx="38" cy="10" r="2" fill="#E9711C" opacity="0.10" />
              <circle cx="50" cy="22" r="2" fill="#E9711C" opacity="0.10" />
            </svg>
          </div>
          <div className="cp-card-head">
            <div className="cp-card-title-wrap">
              <div className="cp-card-title-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                </svg>
              </div>
              <div>
                <span className="cp-card-eyebrow">LEADERBOARD</span>
                <h3>Top Contributors</h3>
                <p className="cp-card-sub">Member dengan kontribusi tertinggi</p>
              </div>
            </div>
            <Link href="#" className="cp-link-mono">
              Lihat semua
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
          <div className="cp-contrib-hero">
            <div className="cp-contrib-hero-top">
              <div className="cp-contrib-hero-avatar" data-color={TOP_CONTRIBUTORS[0].color}>
                <span>{TOP_CONTRIBUTORS[0].avatar}</span>
                <div className="cp-contrib-hero-crown">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
              </div>
              <div className="cp-contrib-hero-info">
                <span className="cp-contrib-hero-rank">#1 Top Contributor</span>
                <h4>{TOP_CONTRIBUTORS[0].name}</h4>
                <span className="cp-contrib-hero-inst">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {TOP_CONTRIBUTORS[0].institution}
                </span>
              </div>
            </div>
            <div className="cp-contrib-hero-stats">
              <div className="cp-contrib-hero-stat">
                <span className="cp-contrib-hero-stat-value">{TOP_CONTRIBUTORS[0].projects}</span>
                <span className="cp-contrib-hero-stat-label">PROJECTS</span>
              </div>
              <div className="cp-contrib-hero-stat-divider" />
              <div className="cp-contrib-hero-stat">
                <span className="cp-contrib-hero-stat-value">{TOP_CONTRIBUTORS[0].papers}</span>
                <span className="cp-contrib-hero-stat-label">PAPERS</span>
              </div>
              <div className="cp-contrib-hero-stat-divider" />
              <div className="cp-contrib-hero-stat">
                <span className="cp-contrib-hero-stat-value cp-contrib-hero-stat-h">{TOP_CONTRIBUTORS[0].hIndex}</span>
                <span className="cp-contrib-hero-stat-label">H-INDEX</span>
              </div>
              <div className="cp-contrib-hero-stat-divider" />
              <div className="cp-contrib-hero-stat">
                <span className="cp-contrib-hero-stat-value">{TOP_CONTRIBUTORS[0].citations}</span>
                <span className="cp-contrib-hero-stat-label">CITATIONS</span>
              </div>
            </div>
          </div>
          <div className="cp-contrib-list">
            {TOP_CONTRIBUTORS.slice(1).map((c, idx) => (
              <div key={c.name} className="cp-contrib-list-row">
                <div className="cp-contrib-list-rank">#{idx + 2}</div>
                <div className="cp-contrib-list-avatar" data-color={c.color}>{c.avatar}</div>
                <div className="cp-contrib-list-info">
                  <span className="cp-contrib-list-name">{c.name}</span>
                  <span className="cp-contrib-list-inst">{c.institution}</span>
                </div>
                <div className="cp-contrib-list-stats">
                  <div className="cp-contrib-list-stat" title="H-Index">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                      <path d="M4 22h16" />
                    </svg>
                    {c.hIndex}
                  </div>
                  <div className="cp-contrib-list-stat" title="Citations">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L9.91 8.26 2 9.27l5.46 5.46L6.18 22 12 18.56 17.82 22l-1.28-7.27L22 9.27l-7.91-1.01z" />
                    </svg>
                    {c.citations}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Analytics */}
      <section className={`cp-card cp-reveal ${reveal ? 'cp-in' : ''} cp-content-analytics-tabbed`}>
        <div className="cp-card-ornament">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <circle cx="50" cy="10" r="3" fill="#E9711C" opacity="0.18" />
            <circle cx="38" cy="10" r="2" fill="#E9711C" opacity="0.10" />
            <circle cx="50" cy="22" r="2" fill="#E9711C" opacity="0.10" />
          </svg>
        </div>
        <div className="cp-card-head">
          <div className="cp-card-title-wrap">
            <div className="cp-card-title-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div>
              <span className="cp-card-eyebrow">CMS PERFORMANCE</span>
              <h3>Content Analytics</h3>
              <p className="cp-card-sub">Performa konten dan engagement</p>
            </div>
          </div>
          <div className="cp-content-tabs">
            <button className={`cp-content-tab ${contentTab === 'blog' ? 'active' : ''}`} onClick={() => setContentTab('blog')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Blog
              <span className="cp-content-tab-count">{CONTENT_ANALYTICS.blogs.published + CONTENT_ANALYTICS.blogs.drafts + CONTENT_ANALYTICS.blogs.scheduled}</span>
            </button>
            <button className={`cp-content-tab ${contentTab === 'event' ? 'active' : ''}`} onClick={() => setContentTab('event')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Event
              <span className="cp-content-tab-count">{CONTENT_ANALYTICS.events.upcoming + CONTENT_ANALYTICS.events.live + CONTENT_ANALYTICS.events.past}</span>
            </button>
            <button className={`cp-content-tab ${contentTab === 'template' ? 'active' : ''}`} onClick={() => setContentTab('template')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Templates
              <span className="cp-content-tab-count">{CONTENT_ANALYTICS.templates.downloads}</span>
            </button>
          </div>
        </div>

        <div className="cp-content-tab-body">
          {contentTab === 'blog' && (
            <div className="cp-content-tab-panel">
              <div className="cp-content-tab-hero">
                <div className="cp-content-tab-hero-stat">
                  <div className="cp-content-tab-hero-icon cp-content-icon-blog">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path d="M14 2v6h6" />
                      <line x1="8" y1="13" x2="16" y2="13" />
                      <line x1="8" y1="17" x2="16" y2="17" />
                    </svg>
                  </div>
                  <div className="cp-content-tab-hero-text">
                    <span className="cp-content-tab-hero-label">Total Views (30d)</span>
                    <span className="cp-content-tab-hero-value">{fmtNum(CONTENT_ANALYTICS.blogs.totalViews)}</span>
                    <span className="cp-content-tab-hero-trend cp-trend-up">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="18 15 12 9 6 15" />
                      </svg>
                      +40.5% dari bulan lalu
                    </span>
                  </div>
                </div>
                <div className="cp-content-tab-hero-meta">
                  <div className="cp-content-tab-hero-meta-item">
                    <span className="cp-content-tab-hero-meta-label">Status</span>
                    <span className="cp-content-tab-hero-meta-value cp-content-status-active">
                      <span className="cp-status-dot" /> Aktif
                    </span>
                  </div>
                  <div className="cp-content-tab-hero-meta-divider" />
                  <div className="cp-content-tab-hero-meta-item">
                    <span className="cp-content-tab-hero-meta-label">Avg. Read</span>
                    <span className="cp-content-tab-hero-meta-value">4.2 min</span>
                  </div>
                  <div className="cp-content-tab-hero-meta-divider" />
                  <div className="cp-content-tab-hero-meta-item">
                    <span className="cp-content-tab-hero-meta-label">Kategori</span>
                    <span className="cp-content-tab-hero-meta-value">12</span>
                  </div>
                </div>
              </div>
              <div className="cp-content-tab-stats">
                <div className="cp-content-tab-stat">
                  <div className="cp-content-tab-stat-icon cp-content-tab-stat-published">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <div className="cp-content-tab-stat-text">
                    <span className="cp-content-tab-stat-value">{CONTENT_ANALYTICS.blogs.published}</span>
                    <span className="cp-content-tab-stat-label">Published</span>
                  </div>
                </div>
                <div className="cp-content-tab-stat">
                  <div className="cp-content-tab-stat-icon cp-content-tab-stat-draft">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                  </div>
                  <div className="cp-content-tab-stat-text">
                    <span className="cp-content-tab-stat-value">{CONTENT_ANALYTICS.blogs.drafts}</span>
                    <span className="cp-content-tab-stat-label">Drafts</span>
                  </div>
                </div>
                <div className="cp-content-tab-stat">
                  <div className="cp-content-tab-stat-icon cp-content-tab-stat-scheduled">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  </div>
                  <div className="cp-content-tab-stat-text">
                    <span className="cp-content-tab-stat-value">{CONTENT_ANALYTICS.blogs.scheduled}</span>
                    <span className="cp-content-tab-stat-label">Scheduled</span>
                  </div>
                </div>
                <div className="cp-content-tab-stat">
                  <div className="cp-content-tab-stat-icon cp-content-tab-stat-views">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  </div>
                  <div className="cp-content-tab-stat-text">
                    <span className="cp-content-tab-stat-value">4.8K</span>
                    <span className="cp-content-tab-stat-label">Avg. Views/Post</span>
                  </div>
                </div>
              </div>
              <div className="cp-content-tab-section">
                <div className="cp-content-tab-section-head">
                  <h4>Top Performing Posts</h4>
                  <Link href="#" className="cp-link-mono">Semua artikel →</Link>
                </div>
                <div className="cp-content-tab-posts">
                  {[
                    { title: '7 Heuristik Memilih Reviewer yang Tepat', views: '8.2K', date: '12 Jun', cat: 'Methodology' },
                    { title: 'Cara Menulis Abstrak yang Disuka Editor', views: '6.8K', date: '08 Jun', cat: 'Writing' },
                    { title: 'Strategi Submit ke Jurnal Q1', views: '5.4K', date: '02 Jun', cat: 'Strategy' }
                  ].map((p, i) => (
                    <div key={i} className="cp-content-tab-post">
                      <div className="cp-content-tab-post-rank">#{i + 1}</div>
                      <div className="cp-content-tab-post-info">
                        <span className="cp-content-tab-post-title">{p.title}</span>
                        <span className="cp-content-tab-post-meta">
                          <span className="cp-content-tab-post-cat">{p.cat}</span>
                          <span className="cp-content-tab-post-dot" />
                          {p.date}
                        </span>
                      </div>
                      <div className="cp-content-tab-post-views">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                        {p.views}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {contentTab === 'event' && (
            <div className="cp-content-tab-panel">
              <div className="cp-content-tab-hero">
                <div className="cp-content-tab-hero-stat">
                  <div className="cp-content-tab-hero-icon cp-content-icon-event">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div className="cp-content-tab-hero-text">
                    <span className="cp-content-tab-hero-label">Total Registrants</span>
                    <span className="cp-content-tab-hero-value">{fmtNum(CONTENT_ANALYTICS.events.totalRegistrants)}</span>
                    <span className="cp-content-tab-hero-trend cp-trend-up">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
                      +24.2% dari Q1
                    </span>
                  </div>
                </div>
                <div className="cp-content-tab-hero-meta">
                  <div className="cp-content-tab-hero-meta-item">
                    <span className="cp-content-tab-hero-meta-label">Avg. Attendance</span>
                    <span className="cp-content-tab-hero-meta-value">68%</span>
                  </div>
                  <div className="cp-content-tab-hero-meta-divider" />
                  <div className="cp-content-tab-hero-meta-item">
                    <span className="cp-content-tab-hero-meta-label">Satisfaction</span>
                    <span className="cp-content-tab-hero-meta-value">4.7 / 5</span>
                  </div>
                  <div className="cp-content-tab-hero-meta-divider" />
                  <div className="cp-content-tab-hero-meta-item">
                    <span className="cp-content-tab-hero-meta-label">Hours</span>
                    <span className="cp-content-tab-hero-meta-value">96h</span>
                  </div>
                </div>
              </div>
              <div className="cp-content-tab-stats">
                <div className="cp-content-tab-stat">
                  <div className="cp-content-tab-stat-icon cp-content-tab-stat-upcoming">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                  </div>
                  <div className="cp-content-tab-stat-text">
                    <span className="cp-content-tab-stat-value">{CONTENT_ANALYTICS.events.upcoming}</span>
                    <span className="cp-content-tab-stat-label">Upcoming</span>
                  </div>
                </div>
                <div className="cp-content-tab-stat">
                  <div className="cp-content-tab-stat-icon cp-content-tab-stat-live">
                    <span className="cp-content-tab-stat-pulse" />
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" fill="currentColor" /></svg>
                  </div>
                  <div className="cp-content-tab-stat-text">
                    <span className="cp-content-tab-stat-value cp-content-tab-stat-live-text">{CONTENT_ANALYTICS.events.live}</span>
                    <span className="cp-content-tab-stat-label">Live Now</span>
                  </div>
                </div>
                <div className="cp-content-tab-stat">
                  <div className="cp-content-tab-stat-icon cp-content-tab-stat-past">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                  </div>
                  <div className="cp-content-tab-stat-text">
                    <span className="cp-content-tab-stat-value">{CONTENT_ANALYTICS.events.past}</span>
                    <span className="cp-content-tab-stat-label">Completed</span>
                  </div>
                </div>
                <div className="cp-content-tab-stat">
                  <div className="cp-content-tab-stat-icon cp-content-tab-stat-speakers">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /></svg>
                  </div>
                  <div className="cp-content-tab-stat-text">
                    <span className="cp-content-tab-stat-value">28</span>
                    <span className="cp-content-tab-stat-label">Speakers</span>
                  </div>
                </div>
              </div>
              <div className="cp-content-tab-section">
                <div className="cp-content-tab-section-head">
                  <h4>Event Mendatang</h4>
                  <Link href="#" className="cp-link-mono">Lihat kalender →</Link>
                </div>
                <div className="cp-content-tab-events">
                  {[
                    { title: 'Strategi Memilih Jurnal Q1', date: '20 Jun', time: '19:00 WIB', type: 'Webinar', registrants: 248 },
                    { title: 'Writing Bootcamp: Cover Letter', date: '27 Jun', time: '14:00 WIB', type: 'Workshop', registrants: 64 },
                    { title: 'Peer Review Masterclass', date: '05 Jul', time: '10:00 WIB', type: 'Workshop', registrants: 132 }
                  ].map((e, i) => (
                    <div key={i} className="cp-content-tab-event">
                      <div className="cp-content-tab-event-date">
                        <span className="cp-content-tab-event-day">{e.date.split(' ')[0]}</span>
                        <span className="cp-content-tab-event-month">{e.date.split(' ')[1]}</span>
                      </div>
                      <div className="cp-content-tab-event-info">
                        <span className="cp-content-tab-event-title">{e.title}</span>
                        <span className="cp-content-tab-event-meta">
                          <span className="cp-content-tab-event-type">{e.type}</span>
                          <span className="cp-content-tab-post-dot" />
                          {e.time}
                        </span>
                      </div>
                      <div className="cp-content-tab-event-registrants">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                        {e.registrants}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {contentTab === 'template' && (
            <div className="cp-content-tab-panel">
              <div className="cp-content-tab-hero">
                <div className="cp-content-tab-hero-stat">
                  <div className="cp-content-tab-hero-icon cp-content-icon-template">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </div>
                  <div className="cp-content-tab-hero-text">
                    <span className="cp-content-tab-hero-label">Total Downloads</span>
                    <span className="cp-content-tab-hero-value">{fmtNum(CONTENT_ANALYTICS.templates.downloads)}</span>
                    <span className="cp-content-tab-hero-trend cp-trend-up">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
                      +18.7% dari Q1
                    </span>
                  </div>
                </div>
                <div className="cp-content-tab-hero-meta">
                  <div className="cp-content-tab-hero-meta-item">
                    <span className="cp-content-tab-hero-meta-label">Total Templates</span>
                    <span className="cp-content-tab-hero-meta-value">48</span>
                  </div>
                  <div className="cp-content-tab-hero-meta-divider" />
                  <div className="cp-content-tab-hero-meta-item">
                    <span className="cp-content-tab-hero-meta-label">Categories</span>
                    <span className="cp-content-tab-hero-meta-value">8</span>
                  </div>
                  <div className="cp-content-tab-hero-meta-divider" />
                  <div className="cp-content-tab-hero-meta-item">
                    <span className="cp-content-tab-hero-meta-label">Rating</span>
                    <span className="cp-content-tab-hero-meta-value">4.6 / 5</span>
                  </div>
                </div>
              </div>
              <div className="cp-content-tab-stats">
                <div className="cp-content-tab-stat">
                  <div className="cp-content-tab-stat-icon cp-content-tab-stat-downloads">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                  </div>
                  <div className="cp-content-tab-stat-text">
                    <span className="cp-content-tab-stat-value">{CONTENT_ANALYTICS.templates.downloads}</span>
                    <span className="cp-content-tab-stat-label">Downloads</span>
                  </div>
                </div>
                <div className="cp-content-tab-stat">
                  <div className="cp-content-tab-stat-icon cp-content-tab-stat-templates">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                  </div>
                  <div className="cp-content-tab-stat-text">
                    <span className="cp-content-tab-stat-value">48</span>
                    <span className="cp-content-tab-stat-label">Total Files</span>
                  </div>
                </div>
                <div className="cp-content-tab-stat">
                  <div className="cp-content-tab-stat-icon cp-content-tab-stat-categories">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                  </div>
                  <div className="cp-content-tab-stat-text">
                    <span className="cp-content-tab-stat-value">8</span>
                    <span className="cp-content-tab-stat-label">Categories</span>
                  </div>
                </div>
                <div className="cp-content-tab-stat">
                  <div className="cp-content-tab-stat-icon cp-content-tab-stat-rating">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  </div>
                  <div className="cp-content-tab-stat-text">
                    <span className="cp-content-tab-stat-value">4.6</span>
                    <span className="cp-content-tab-stat-label">Avg. Rating</span>
                  </div>
                </div>
              </div>
              <div className="cp-content-tab-section">
                <div className="cp-content-tab-section-head">
                  <h4>Top Templates</h4>
                  <Link href="#" className="cp-link-mono">Browse all →</Link>
                </div>
                <div className="cp-content-tab-templates">
                  {[
                    { title: 'Cover Letter Q1 Journal', cat: 'Submission', downloads: 124, rating: 4.8 },
                    { title: 'Reviewer Response Template', cat: 'Revision', downloads: 98, rating: 4.7 },
                    { title: 'Abstract Writing Framework', cat: 'Writing', downloads: 76, rating: 4.5 }
                  ].map((t, i) => (
                    <div key={i} className="cp-content-tab-template">
                      <div className="cp-content-tab-template-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="15" x2="15" y2="15" /></svg>
                      </div>
                      <div className="cp-content-tab-template-info">
                        <span className="cp-content-tab-template-title">{t.title}</span>
                        <span className="cp-content-tab-template-meta">
                          <span className="cp-content-tab-template-cat">{t.cat}</span>
                        </span>
                      </div>
                      <div className="cp-content-tab-template-stats">
                        <div className="cp-content-tab-template-stat">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                          {t.downloads}
                        </div>
                        <div className="cp-content-tab-template-stat cp-content-tab-template-rating">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                          {t.rating}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Recent Activity */}
      <section className={`cp-card cp-reveal ${reveal ? 'cp-in' : ''} cp-chart-card cp-activity-full`}>
        <div className="cp-card-ornament">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <circle cx="50" cy="10" r="3" fill="#E9711C" opacity="0.18" />
            <circle cx="38" cy="10" r="2" fill="#E9711C" opacity="0.10" />
            <circle cx="50" cy="22" r="2" fill="#E9711C" opacity="0.10" />
          </svg>
        </div>
        <div className="cp-card-head">
          <div className="cp-card-title-wrap">
            <div className="cp-card-title-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <span className="cp-card-eyebrow">LIVE FEED</span>
              <h3>
                Aktivitas Terbaru
                <span className="cp-activity-live-badge">
                  <span className="cp-activity-live-dot" />
                  {RECENT_ACTIVITIES.length} baru
                </span>
              </h3>
              <p className="cp-card-sub">Log aktivitas platform 24 jam terakhir</p>
            </div>
          </div>
          <Link href="#" className="cp-link-mono">
            Audit log
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
        <div className="cp-activity-grid">
          {RECENT_ACTIVITIES.map((activity, i) => (
            <div key={i} className={`cp-activity-item cp-activity-${activity.type}`}>
              <div className="cp-activity-timeline">
                <div className={`cp-activity-icon cp-activity-${activity.type}`}>
                  {activity.type === 'success' && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  )}
                  {activity.type === 'info' && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                  )}
                  {activity.type === 'warning' && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  )}
                </div>
                {i < RECENT_ACTIVITIES.length - 1 && <div className="cp-activity-line" />}
              </div>
              <div className="cp-activity-content">
                <div className="cp-activity-header">
                  <span className="cp-activity-action">{activity.action}</span>
                  <span className="cp-activity-time">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    {activity.time}
                  </span>
                </div>
                <span className="cp-activity-target">{activity.target}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}