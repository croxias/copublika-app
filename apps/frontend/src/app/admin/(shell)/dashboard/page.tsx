'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Types
interface Applicant {
  id: string;
  name: string;
  avatar: string;
  univ: string;
  field: string;
  time: string;
  scholarId: string;
  hIndex: number;
  citations: string;
  affMatch: boolean;
  score: number;
  status: 'pending' | 'matched' | 'review' | 'mismatch';
}

interface Project {
  id: string;
  title: string;
  lead: string;
  coAuthors: number;
  institutions: string;
  field: string;
  status: 'pending' | 'review' | 'published' | 'draft';
}

// Mock Data
const MOCK_APPLICANTS: Applicant[] = [
  {
    id: 'APP-2418',
    name: 'Dr. Reza Dwianto, M.Si.',
    avatar: 'RD',
    univ: 'Universitas Diponegoro',
    field: 'Kebijakan Publik',
    time: '2 jam lalu',
    scholarId: '7XQrK2pAAAAJ',
    hIndex: 18,
    citations: '1.420',
    affMatch: true,
    score: 96,
    status: 'pending'
  },
  {
    id: 'APP-2417',
    name: 'Siti Putri Anggraini, M.Pd.',
    avatar: 'SP',
    univ: 'UPI',
    field: 'Pendidikan & EdTech',
    time: '4 jam lalu',
    scholarId: 'q9KsmW2AAAAJ',
    hIndex: 6,
    citations: '124',
    affMatch: false,
    score: 72,
    status: 'review'
  },
  {
    id: 'APP-2416',
    name: 'Bayu Hermawan, Ph.D.',
    avatar: 'BH',
    univ: 'UGM',
    field: 'AI & Etika',
    time: '9 jam lalu',
    scholarId: 'mNb3HQ8AAAAJ',
    hIndex: 23,
    citations: '2.860',
    affMatch: true,
    score: 98,
    status: 'pending'
  }
];

const MOCK_PROJECTS: Project[] = [
  {
    id: 'RP-052',
    title: 'Doctoral Supervision in the Online Modality: Voices from 60 Indonesian PhD Candidates',
    lead: 'Dr. Hadi Suryanto',
    coAuthors: 3,
    institutions: 'UNS, UGM',
    field: 'Pendidikan & EdTech',
    status: 'pending'
  },
  {
    id: 'RP-051',
    title: 'Industrial Symbiosis in Indonesian Manufacturing Clusters: Barriers and Enablers',
    lead: 'Dr. Nirmala D.',
    coAuthors: 4,
    institutions: 'ITB, UI',
    field: 'Ekonomi Sirkular',
    status: 'review'
  },
  {
    id: 'RP-050',
    title: 'Federated Learning for Clinical NLP in Low-Resource Languages: An Indonesian Case',
    lead: 'Dr. Anastasia L.',
    coAuthors: 5,
    institutions: 'UI, UGM, UNAIR',
    field: 'AI & Etika',
    status: 'pending'
  },
  {
    id: 'RP-049',
    title: 'Translanguaging in EMI Classrooms: A Comparative Study of Engineering & Humanities Faculty',
    lead: 'Dr. Sari Nurhaliza',
    coAuthors: 6,
    institutions: 'UPI, UNS, UNDIP',
    field: 'Linguistik Terapan',
    status: 'draft'
  },
  {
    id: 'RP-048',
    title: 'Vaccine Hesitancy in Indonesian Urban Mothers: A Mixed-Methods Replication',
    lead: 'Dr. Rahmawati M.',
    coAuthors: 3,
    institutions: 'UNAIR, UPN',
    field: 'Kesehatan Masyarakat',
    status: 'pending'
  }
];

export default function AdminDashboardPage() {
  const [reveal, setReveal] = useState(false);
  const [verifyTab, setVerifyTab] = useState<'pending' | 'matched' | 'review' | 'mismatch'>('pending');
  const [projectTab, setProjectTab] = useState<'pending' | 'review' | 'published'>('pending');
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'quarter'>('month');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Dashboard — CoPublika Admin';
    const timer = setTimeout(() => setReveal(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getFilteredApplicants = () => {
    let filtered = MOCK_APPLICANTS;
    if (verifyTab === 'pending') {
      filtered = MOCK_APPLICANTS.filter(a => a.status === 'pending');
    } else if (verifyTab === 'matched') {
      filtered = MOCK_APPLICANTS.filter(a => a.score >= 90);
    } else if (verifyTab === 'review') {
      filtered = MOCK_APPLICANTS.filter(a => a.status === 'review');
    } else if (verifyTab === 'mismatch') {
      filtered = MOCK_APPLICANTS.filter(a => !a.affMatch && a.status !== 'pending');
    }
    
    return filtered;
  };

  const getFilteredProjects = () => {
    let filtered = MOCK_PROJECTS;
    if (projectTab === 'pending') {
      filtered = MOCK_PROJECTS.filter(p => p.status === 'pending');
    } else if (projectTab === 'review') {
      filtered = MOCK_PROJECTS.filter(p => p.status === 'review');
    } else if (projectTab === 'published') {
      filtered = MOCK_PROJECTS.filter(p => p.status === 'published');
    }
    return filtered;
  };

  const handleVerifyAction = (action: string, applicantId: string) => {
    console.log(`Action: ${action} for applicant ${applicantId}`);
    // In real app, this would trigger an API call
  };

  const handleProjectAction = (projectId: string) => {
    console.log(`Opening project ${projectId}`);
    // In real app, this would navigate to project detail
  };

  return (
    <>
      {/* Page head */}
      <div className="cp-pg-head">
        <div className="cp-greet">
          <div className="cp-crumb">
            <span>Overview</span> <span className="cp-sep">/</span> <span>Dashboard</span>
          </div>
          <h1>
            Selamat pagi, <em>Adi.</em>
          </h1>
          <p>14 pendaftar menunggu verifikasi · 8 proyek di antrian review · Batch #4 ditutup dalam 18 hari.</p>
        </div>
        <div className="cp-seg">
          <button 
            className={timeRange === 'today' ? 'active' : ''}
            onClick={() => setTimeRange('today')}
          >
            Hari ini
          </button>
          <button 
            className={timeRange === 'week' ? 'active' : ''}
            onClick={() => setTimeRange('week')}
          >
            Minggu
          </button>
          <button 
            className={timeRange === 'month' ? 'active' : ''}
            onClick={() => setTimeRange('month')}
          >
            Bulan
          </button>
          <button 
            className={timeRange === 'quarter' ? 'active' : ''}
            onClick={() => setTimeRange('quarter')}
          >
            Q2
          </button>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <section className="cp-kpis">
        <div 
          className={`cp-kpi cp-feat cp-reveal ${reveal ? 'cp-in' : ''} cp-span5`}
          onMouseEnter={() => setHoveredCard('feat')}
          onMouseLeave={() => setHoveredCard(null)}
          data-hover={hoveredCard === 'feat' ? 'true' : 'false'}
        >
          <div className="cp-ktop">
            <div>
              <div className="cp-klabel">Pendaftar batch #4</div>
              <div className="cp-kbig">
                204<span className="acc">/300</span>
                <span className="cp-kdelta">↑ 18 minggu ini</span>
              </div>
            </div>
            <div className="cp-kico">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
            </div>
          </div>
          <div className="cp-ksub">
            <strong>68%</strong> kuota terisi · 96 slot tersisa · ditutup 18 hari lagi
          </div>
          <div className="cp-trend">
            <span className="bar" style={{ height: '18%' }}></span>
            <span className="bar" style={{ height: '28%' }}></span>
            <span className="bar" style={{ height: '24%' }}></span>
            <span className="bar" style={{ height: '40%' }}></span>
            <span className="bar" style={{ height: '32%' }}></span>
            <span className="bar" style={{ height: '48%' }}></span>
            <span className="bar cp-hi" style={{ height: '62%' }}></span>
            <span className="bar" style={{ height: '44%' }}></span>
            <span className="bar cp-hi" style={{ height: '70%' }}></span>
            <span className="bar cp-hi" style={{ height: '85%' }}></span>
            <span className="bar cp-hi" style={{ height: '92%' }}></span>
            <span className="bar cp-hi" style={{ height: '100%' }}></span>
          </div>
        </div>

        <div 
          className={`cp-kpi cp-span3 cp-accent cp-reveal ${reveal ? 'cp-in' : ''}`}
          onMouseEnter={() => setHoveredCard('verify')}
          onMouseLeave={() => setHoveredCard(null)}
          data-hover={hoveredCard === 'verify' ? 'true' : 'false'}
        >
          <div className="cp-ktop">
            <div className="cp-klabel">Menunggu verifikasi</div>
            <div className="cp-kico">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4l2.5 2.5" />
              </svg>
            </div>
          </div>
          <div className="cp-kbig cp-sm">
            14 <span className="cp-kdelta">+5</span>
          </div>
          <div className="cp-ksub">
            SLA rata-rata: <strong>1.2 hari</strong> ·{' '}
            <Link href="#" className="cp-link-mono">
              Buka antrian →
            </Link>
          </div>
        </div>

        <div 
          className={`cp-kpi cp-span4 cp-reveal ${reveal ? 'cp-in' : ''}`}
          onMouseEnter={() => setHoveredCard('projects')}
          onMouseLeave={() => setHoveredCard(null)}
          data-hover={hoveredCard === 'projects' ? 'true' : 'false'}
        >
          <div className="cp-ktop">
            <div className="cp-klabel">Proyek di antrian review</div>
            <div className="cp-kico">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
              </svg>
            </div>
          </div>
          <div className="cp-kbig cp-sm">
            8
            <span className="cp-kmeta">3 Q1 · 4 Q2 · 1 Sinta</span>
          </div>
          <div className="cp-ksub">
            <strong>62</strong> proyek aktif · <strong>76%</strong> akseptasi Q1/Q2
          </div>
        </div>

        <div 
          className={`cp-kpi cp-span4 cp-reveal ${reveal ? 'cp-in' : ''}`}
          onMouseEnter={() => setHoveredCard('pubs')}
          onMouseLeave={() => setHoveredCard(null)}
          data-hover={hoveredCard === 'pubs' ? 'true' : 'false'}
        >
          <div className="cp-ktop">
            <div className="cp-klabel">Publikasi alumni</div>
            <div className="cp-kico">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
          </div>
          <div className="cp-kbig cp-sm">
            318<span className="acc">+</span> <span className="cp-kdelta">↑ 12</span>
          </div>
          <div className="cp-ksub">
            <strong>+12</strong> bulan ini · target Q2 2025: <strong>340</strong>
          </div>
        </div>

        <div 
          className={`cp-kpi cp-span4 cp-reveal ${reveal ? 'cp-in' : ''}`}
          onMouseEnter={() => setHoveredCard('members')}
          onMouseLeave={() => setHoveredCard(null)}
          data-hover={hoveredCard === 'members' ? 'true' : 'false'}
        >
          <div className="cp-ktop">
            <div className="cp-klabel">Member aktif</div>
            <div className="cp-kico">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M16 21v-2a4 4 0 0 0-4-4 4 4 0 0 0-4 4v2" />
              </svg>
            </div>
          </div>
          <div className="cp-kbig cp-sm">
            1.240 <span className="cp-kdelta">↑ 4.8%</span>
          </div>
          <div className="cp-ksub">
            H-Index rata-rata: <strong>11.4</strong> · 24 cluster aktif
          </div>
        </div>

        <div 
          className={`cp-kpi cp-span4 cp-reveal ${reveal ? 'cp-in' : ''}`}
          onMouseEnter={() => setHoveredCard('traffic')}
          onMouseLeave={() => setHoveredCard(null)}
          data-hover={hoveredCard === 'traffic' ? 'true' : 'false'}
        >
          <div className="cp-ktop">
            <div className="cp-klabel">Traffic blog (30d)</div>
            <div className="cp-kico">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="m7 14 4-4 4 4 5-5" />
              </svg>
            </div>
          </div>
          <div className="cp-kbig cp-sm">42.8K</div>
          <div className="cp-ksub">
            <strong>23%</strong> registrasi dari blog ·{' '}
            <Link href="#" className="cp-link-mono">
              Lihat detail →
            </Link>
          </div>
        </div>
      </section>

      {/* Verification + Batch */}
      <section className="cp-grid-2">
        <div className={`cp-card cp-verify-card cp-reveal ${reveal ? 'cp-in' : ''}`}>
          <div className="cp-card-head">
            <h3>Verifikasi Pendaftar</h3>
            <Link href="#" className="cp-link-mono">
              Lihat semua →
            </Link>
          </div>
          <div className="cp-tabs">
            <button 
              className={`cp-tab ${verifyTab === 'pending' ? 'active' : ''}`}
              onClick={() => setVerifyTab('pending')}
            >
              Menunggu <span className="ct">14</span>
            </button>
            <button 
              className={`cp-tab ${verifyTab === 'matched' ? 'active' : ''}`}
              onClick={() => setVerifyTab('matched')}
            >
              Auto-matched <span className="ct">9</span>
            </button>
            <button 
              className={`cp-tab ${verifyTab === 'review' ? 'active' : ''}`}
              onClick={() => setVerifyTab('review')}
            >
              Perlu Cek <span className="ct">3</span>
            </button>
            <button 
              className={`cp-tab ${verifyTab === 'mismatch' ? 'active' : ''}`}
              onClick={() => setVerifyTab('mismatch')}
            >
              Mismatch <span className="ct">2</span>
            </button>
          </div>

          <div className="cp-verify-table-wrapper">
            <table className="cp-verify-table">
              <thead>
                <tr>
                  <th className="col-id">ID</th>
                  <th className="col-name">Nama & Institusi</th>
                  <th className="col-scholar">Scholar</th>
                  <th className="col-score">Skor</th>
                  <th className="col-status">Status</th>
                  <th className="col-action">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredApplicants().map((applicant) => (
                  <tr key={applicant.id} className="cp-verify-row">
                    <td className="col-id">
                      <span className="cp-pip">{applicant.id}</span>
                    </td>
                    <td className="col-name">
                      <div className="cp-name-cell">
                        <span className="cp-name">{applicant.name}</span>
                        <span className="cp-inst">{applicant.univ} · {applicant.field}</span>
                      </div>
                    </td>
                    <td className="col-scholar">
                      <div className="cp-scholar-info">
                        <span className="cp-scholar-id">{applicant.scholarId}</span>
                        <span className="cp-hindex">H-Index: {applicant.hIndex}</span>
                      </div>
                    </td>
                    <td className="col-score">
                      <span className={`cp-score-badge ${applicant.score >= 90 ? 'high' : applicant.score >= 70 ? 'medium' : 'low'}`}>
                        {applicant.score}%
                      </span>
                    </td>
                    <td className="col-status">
                      <span className={`cp-vstatus ${applicant.affMatch ? 'match' : 'mismatch'}`}>
                        {applicant.affMatch ? '✓ Match' : 'Mismatch'}
                      </span>
                    </td>
                    <td className="col-action">
                      <div className="cp-action-btns">
                        <button 
                          className="cp-btn-icon cp-btn-approve"
                          onClick={() => handleVerifyAction('approve', applicant.id)}
                          title="Verifikasi"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </button>
                        <button 
                          className="cp-btn-icon cp-btn-reject"
                          onClick={() => handleVerifyAction('reject', applicant.id)}
                          title="Tolak"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {getFilteredApplicants().length === 0 && (
              <div className="cp-empty-state">
                <div className="ico">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 8v4l2.5 2.5" />
                  </svg>
                </div>
                <h4>Tidak ada pendaftar</h4>
                <p>Semua pendaftar pada kategori ini telah selesai diproses.</p>
              </div>
            )}
          </div>
        </div>

        <div className={`cp-card cp-batch-widget cp-reveal ${reveal ? 'cp-in' : ''}`}>
          <div className="cp-card-head">
            <h3>Batch #4 — September 2025</h3>
            <Link href="#" className="cp-link-mono">
              Atur →
            </Link>
          </div>
          
          <div className="chart-area">
            <div className="ring-wrap">
              <svg width="110" height="110" viewBox="0 0 36 36">
                <path
                  className="cp-ring-bg"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e8e6e1"
                  strokeWidth="3"
                />
                <path
                  className="cp-ring-fg"
                  strokeDasharray="68, 100"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E9711C"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
              </svg>
              <div className="val">
                <span className="num">68%</span>
                <span className="lbl">Kuota</span>
              </div>
            </div>
            <div className="chart-info">
              <div className="leg cp-scopus">
                <div>
                  <span className="num">204</span> <span className="lbl">Terisi</span>
                </div>
              </div>
              <div className="leg cp-empty">
                <div>
                  <span className="num">96</span> <span className="lbl">Tersisa</span>
                </div>
              </div>
            </div>
          </div>

          <div className="cp-batch-rows">
            <div className="cp-brow">
              <span className="l">Pendaftar</span>
              <span className="v">
                204 <span>/ 300</span>
              </span>
            </div>
            <div className="cp-brow">
              <span className="l">Terverifikasi</span>
              <span className="v ok">186</span>
            </div>
            <div className="cp-brow">
              <span className="l">Menunggu</span>
              <span className="v">
                <span className="accent">14</span>
              </span>
            </div>
            <div className="cp-brow">
              <span className="l">Ditolak</span>
              <span className="v">4</span>
            </div>
            <div className="cp-brow">
              <span className="l">Pendaftaran ditutup</span>
              <span className="v">14 Juni 2025</span>
            </div>
          </div>
          <div className="cp-batch-cta">
            <button className="cp-vbtn cp-ghost">Pause</button>
            <button className="cp-vbtn cp-approve">Buka Batch #5</button>
          </div>
        </div>
      </section>

      {/* Projects / Governance */}
      <section className={`cp-card cp-gov-card cp-reveal ${reveal ? 'cp-in' : ''}`}>
        <div className="cp-card-head">
          <div>
            <h3>Project Governance</h3>
            <p className="cp-card-sub">Antrian persetujuan proyek riset</p>
          </div>
          <Link href="#" className="cp-link-mono">
            Buka modul →
          </Link>
        </div>
        <div className="cp-tabs-row">
          <div className="cp-tabs">
            <button 
              className={`cp-tab ${projectTab === 'pending' ? 'active' : ''}`}
              onClick={() => setProjectTab('pending')}
            >
              Pending <span className="ct">3</span>
            </button>
            <button 
              className={`cp-tab ${projectTab === 'review' ? 'active' : ''}`}
              onClick={() => setProjectTab('review')}
            >
              Review <span className="ct">1</span>
            </button>
            <button 
              className={`cp-tab ${projectTab === 'published' ? 'active' : ''}`}
              onClick={() => setProjectTab('published')}
            >
              Published <span className="ct">0</span>
            </button>
          </div>
        </div>

        <div className="cp-gov-table-wrapper">
          {getFilteredProjects().length === 0 ? (
            <div className="cp-empty-premium">
              <div className="cp-empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                  <path d="M9 13h6M9 17h6" />
                </svg>
              </div>
              <h4>Tidak ada proyek dalam antrian</h4>
              <p>Semua proyek pada kategori ini telah selesai ditinjau dan disetujui.</p>
              <button className="cp-vbtn cp-ghost" style={{ marginTop: '16px' }}>
                Lihat arsip proyek
              </button>
            </div>
          ) : (
            <table className="cp-gov-table">
              <thead>
                <tr>
                  <th className="col-pid">ID</th>
                  <th className="col-ptitle">Judul Proyek</th>
                  <th className="col-plead">Lead</th>
                  <th className="col-pfield">Bidang</th>
                  <th className="col-pstatus">Status</th>
                  <th className="col-paction"></th>
                </tr>
              </thead>
              <tbody>
                {getFilteredProjects().map((project) => (
                  <tr 
                    key={project.id} 
                    className="cp-gov-row"
                    onClick={() => handleProjectAction(project.id)}
                  >
                    <td className="col-pid">
                      <span className="cp-pid-text">{project.id}</span>
                    </td>
                    <td className="col-ptitle">
                      <div className="cp-title-cell">
                        <span className="cp-pt">{project.title}</span>
                        <span className="cp-pmeta">{project.coAuthors} co-author · {project.institutions}</span>
                      </div>
                    </td>
                    <td className="col-plead">{project.lead}</td>
                    <td className="col-pfield">{project.field}</td>
                    <td className="col-pstatus">
                      <span className={`cp-pill cp-${project.status}`}>
                        {project.status === 'pending' ? 'Pending' : project.status === 'review' ? 'Review' : 'Draft'}
                      </span>
                    </td>
                    <td className="col-paction">
                      <button className="cp-pcta" aria-label="Open">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Scheduled CMS + Activity Feed */}
      <section className="cp-grid-2">
        <div className={`cp-card cp-reveal ${reveal ? 'cp-in' : ''}`}>
          <div className="cp-card-head">
            <h3>Konten terjadwal — 7 hari ke depan</h3>
            <Link href="#" className="cp-link-mono">
              Buka CMS →
            </Link>
          </div>
          <div className="cp-sched-list">
            <Link className="cp-sched-item cp-live" href="#">
              <div className="date-box">
                <div className="mo">Mei</div>
                <div className="day">28</div>
              </div>
              <div className="det">
                <h4>Webinar — Strategi Memilih Jurnal Q1 di Era GenAI</h4>
                <div className="meta">
                  <span className="cp-pill cp-success cp-no-dot">Live Now</span>
                  <span className="dot"></span>
                  <span>480 registran</span>
                </div>
              </div>
              <span className="cp-link-mono">Kelola →</span>
            </Link>

            <Link className="cp-sched-item" href="#">
              <div className="date-box">
                <div className="mo">Mei</div>
                <div className="day">30</div>
              </div>
              <div className="det">
                <h4>Anatomy of an Accepted Paper: 5 Kebiasaan Penulis Q1</h4>
                <div className="meta">
                  <span className="cp-pill cp-plain">Blog</span>
                  <span className="dot"></span>
                  <span>Anwar Putranto</span>
                  <span className="dot"></span>
                  <span>09:00 WIB</span>
                </div>
              </div>
              <span className="cp-link-mono">Edit →</span>
            </Link>

            <Link className="cp-sched-item" href="#">
              <div className="date-box">
                <div className="mo">Jun</div>
                <div className="day">02</div>
              </div>
              <div className="det">
                <h4>Workshop Penulisan Sistematic Review — Cluster Kesehatan</h4>
                <div className="meta">
                  <span className="cp-pill cp-plain">Event</span>
                  <span className="dot"></span>
                  <span>Upcoming</span>
                  <span className="dot"></span>
                  <span>64 / 80 kuota</span>
                </div>
              </div>
              <span className="cp-link-mono">Edit →</span>
            </Link>

            <Link className="cp-sched-item" href="#">
              <div className="date-box">
                <div className="mo">Jun</div>
                <div className="day">04</div>
              </div>
              <div className="det">
                <h4>Mengapa Reviewer 2 Selalu Galak? Membaca Antara Baris Komentar</h4>
                <div className="meta">
                  <span className="cp-pill cp-plain">Blog</span>
                  <span className="dot"></span>
                  <span>Draft 70%</span>
                  <span className="dot"></span>
                  <span>10:00 WIB</span>
                </div>
              </div>
              <span className="cp-link-mono">Edit →</span>
            </Link>
          </div>
        </div>

        <div className={`cp-card cp-reveal ${reveal ? 'cp-in' : ''}`}>
          <div className="cp-card-head">
            <h3>Aktivitas terbaru</h3>
            <Link href="#" className="cp-link-mono">
              Audit log →
            </Link>
          </div>
          <div className="cp-feed-list">
            <div className="cp-feed-row cp-success">
              <div className="ico-c">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="body">
                <strong>Adi Wijaya</strong> menyetujui pendaftar <strong>Dr. Wira Pradana</strong> (Scholar ID terverifikasi otomatis, skor 94%).
              </div>
              <span className="ts">2m</span>
            </div>

            <div className="cp-feed-row cp-accent">
              <div className="ico-c">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                </svg>
              </div>
              <div className="body">
                Proyek baru diajukan: <strong>&quot;Doctoral Supervision in the Online Modality&quot;</strong> oleh Dr. Hadi Suryanto.
              </div>
              <span className="ts">18m</span>
            </div>

            <div className="cp-feed-row">
              <div className="ico-c">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </div>
              <div className="body">
                Event <strong>&quot;Strategi Memilih Jurnal Q1&quot;</strong> dipublikasikan dan tampil di kalender publik.
              </div>
              <span className="ts">1h</span>
            </div>

            <div className="cp-feed-row cp-danger">
              <div className="ico-c">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
              <div className="body">
                Pendaftar <strong>APP-2415</strong> ditolak otomatis — Scholar ID tidak ditemukan.
              </div>
              <span className="ts">3h</span>
            </div>

            <div className="cp-feed-row cp-accent">
              <div className="ico-c">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
              </div>
              <div className="body">
                Template <strong>&quot;Cover Letter — Computers &amp; Education&quot;</strong> diunduh 12 kali dalam 24 jam.
              </div>
              <span className="ts">5h</span>
            </div>

            <div className="cp-feed-row cp-success">
              <div className="ico-c">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16v16H4z" />
                  <path d="M4 9h16M9 4v16" />
                </svg>
              </div>
              <div className="body">
                Artikel <strong>&quot;7 Heuristik Memilih Reviewer&quot;</strong> dipublikasi otomatis. Traffic awal: 1.240 visit.
              </div>
              <span className="ts">8h</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}