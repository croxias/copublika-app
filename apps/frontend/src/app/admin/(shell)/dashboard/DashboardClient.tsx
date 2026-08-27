'use client';

import React, { useState, useEffect } from 'react';
import type { AdminDashboardData } from '@/lib/data/admin-dashboard';

type Applicant = {
  id: string;
  name: string;
  avatar: string;
  univ: string;
  field: string;
  time: string;
  scholarId: string;
  hIndex: number | null;
  status: 'pending' | 'verified' | 'rejected';
  batchId: string | null;
};

type Project = {
  id: string;
  title: string;
  lead: string;
  institutions: string;
  field: string;
  status: 'draft' | 'pending' | 'published' | 'archived';
};

export default function AdminDashboardPage({ data }: { data: AdminDashboardData }) {
  const [reveal, setReveal] = useState(false);
  const [verifyTab, setVerifyTab] = useState<'pending' | 'verified' | 'rejected'>('pending');
  const [projectTab, setProjectTab] = useState<'pending' | 'published' | 'archived'>('pending');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const applicants: Applicant[] = data.applications.status === 'ready' ? data.applications.data.map((application) => ({ id: application.id, name: application.name, avatar: application.name.slice(0, 2).toUpperCase(), univ: application.institution, field: application.expertise, time: application.submittedAt, scholarId: application.scholarId, hIndex: application.hIndex, status: application.status, batchId: application.batchId })) : [];
  const projects: Project[] = data.researchProjects.status === 'ready' ? data.researchProjects.data.map((project) => ({ id: project.id, title: project.title, lead: project.leadName, institutions: project.leadInstitution, field: project.tags[0] ?? '', status: project.status })) : [];

  useEffect(() => {
    document.title = 'Dashboard — CoPublika Admin';
    const timer = setTimeout(() => setReveal(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getFilteredApplicants = () => {
    let filtered = applicants;
    if (verifyTab === 'pending') {
      filtered = applicants.filter(a => a.status === 'pending');
    } else if (verifyTab === 'verified') {
      filtered = applicants.filter(a => a.status === 'verified');
    } else if (verifyTab === 'rejected') {
      filtered = applicants.filter(a => a.status === 'rejected');
    }

    return filtered;
  };

  const getFilteredProjects = () => {
    let filtered = projects;
    if (projectTab === 'pending') {
      filtered = projects.filter(p => p.status === 'pending');
    } else if (projectTab === 'published') {
      filtered = projects.filter(p => p.status === 'published');
    } else if (projectTab === 'archived') {
      filtered = projects.filter(p => p.status === 'archived');
    }
    return filtered;
  };

  const dataUnavailable = data.applications.status !== 'ready' || data.researchProjects.status !== 'ready' || data.batches.status !== 'ready';
  const dataMessage = (result: AdminDashboardData[keyof AdminDashboardData]) => result.status === 'error' ? result.message : result.status === 'unavailable' ? result.reason : '';
  const batchesReady = data.batches.status === 'ready';
  const currentBatch = data.batches.status === 'ready' ? (data.batches.data[0] ?? null) : null;
  const currentBatchApplicants = currentBatch && data.applications.status === 'ready'
    ? Math.min(currentBatch.seatsTotal, applicants.filter((applicant) => applicant.batchId === currentBatch.id).length)
    : null;
  const pendingApplications = currentBatchApplicants !== null && currentBatch
    ? Math.min(currentBatchApplicants, applicants.filter((applicant) => applicant.batchId === currentBatch.id && applicant.status === 'pending').length)
    : null;
  const unavailableValue = 'Tidak tersedia';
  const currentBatchFilled = currentBatchApplicants;
  const currentBatchPercent = currentBatch && currentBatchApplicants !== null && currentBatch.seatsTotal > 0
    ? Math.min(100, Math.max(0, Math.round((currentBatchApplicants / currentBatch.seatsTotal) * 100)))
    : null;
  const seatsRemaining = currentBatch && currentBatchApplicants !== null
    ? Math.max(0, Math.min(currentBatch.seatsTotal - currentBatchApplicants, currentBatch.seatsRemaining))
    : null;
  const pendingProjectCount = projects.filter((project) => project.status === 'pending').length;

  return (
    <>
      {dataUnavailable && <div className="cp-card" role="status"><h3>Data dashboard tidak tersedia</h3><p>Dashboard hanya menampilkan data dari Supabase. {dataMessage(data.applications) || dataMessage(data.researchProjects) || dataMessage(data.batches)}</p></div>}
      {/* Page head */}
      <div className="cp-pg-head">
        <div className="cp-greet">
          <div className="cp-crumb">
            <span>Overview</span> <span className="cp-sep">/</span> <span>Dashboard</span>
          </div>
          <h1>
            <em>Dashboard admin</em>
          </h1>
          <p>{data.applications.status === 'ready' ? `${pendingApplications ?? unavailableValue} pendaftar menunggu verifikasi` : 'Pendaftar: tidak tersedia'} · {data.researchProjects.status === 'ready' ? `${pendingProjectCount} proyek menunggu` : 'Proyek: tidak tersedia'} · {currentBatch ? `Batch #${currentBatch.number} aktif` : batchesReady ? 'Batch aktif: belum ada batch terbuka' : 'Batch aktif: tidak tersedia'}.</p>
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
              <div className="cp-klabel">Pendaftar batch aktif</div>
              <div className="cp-kbig">{currentBatchFilled ?? 'Tidak tersedia'}</div>
            </div>
            <div className="cp-kico">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
            </div>
          </div>
          <div className="cp-ksub">
            {currentBatchPercent !== null ? <><strong>{currentBatchPercent}%</strong> kuota terisi · {seatsRemaining} slot tersisa</> : currentBatch ? 'Detail kuota tidak tersedia' : batchesReady ? 'Belum ada batch terbuka' : 'Batch tidak tersedia'}
          </div>
          <div className="cp-trend" aria-label="Tren historis tidak tersedia"><span className="cp-link-mono">Tren historis tidak tersedia</span></div>
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
            {data.applications.status === 'ready' ? (pendingApplications ?? unavailableValue) : unavailableValue}
          </div>
          <div className="cp-ksub">
             SLA rata-rata: tidak tersedia · <span className="cp-link-mono">Antrian detail belum tersedia →</span>
          </div>
        </div>

        <div
          className={`cp-kpi cp-span4 cp-reveal ${reveal ? 'cp-in' : ''}`}
          onMouseEnter={() => setHoveredCard('projects')}
          onMouseLeave={() => setHoveredCard(null)}
          data-hover={hoveredCard === 'projects' ? 'true' : 'false'}
        >
          <div className="cp-ktop">
            <div className="cp-klabel">Proyek pending</div>
            <div className="cp-kico">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
              </svg>
            </div>
          </div>
          <div className="cp-kbig cp-sm">
             {data.researchProjects.status === 'ready' ? pendingProjectCount : 'Tidak tersedia'}
          </div>
          <div className="cp-ksub">
             Proyek aktif: {data.researchProjects.status === 'ready' ? projects.filter((project) => project.status !== 'draft').length : 'tidak tersedia'} · Akseptasi: tidak tersedia
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
            Tidak tersedia
          </div>
          <div className="cp-ksub">
             Data publikasi alumni belum tersedia
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
            Tidak tersedia
          </div>
          <div className="cp-ksub">
             Data member aktif belum tersedia
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
          <div className="cp-kbig cp-sm">Tidak tersedia</div>
          <div className="cp-ksub">
             Data traffic blog belum tersedia · <span className="cp-link-mono">Detail belum tersedia →</span>
          </div>
        </div>
      </section>

      {/* Verification + Batch */}
      <section className="cp-grid-2">
        <div className={`cp-card cp-verify-card cp-reveal ${reveal ? 'cp-in' : ''}`}>
          <div className="cp-card-head">
            <h3>Verifikasi Pendaftar</h3>
            <span className="cp-link-mono">Daftar lengkap belum tersedia →</span>
          </div>
          <div className="cp-tabs">
            <button
              className={`cp-tab ${verifyTab === 'pending' ? 'active' : ''}`}
              onClick={() => setVerifyTab('pending')}
            >
              Menunggu <span className="ct">{applicants.filter((applicant) => applicant.status === 'pending').length}</span>
            </button>
            <button
              className={`cp-tab ${verifyTab === 'verified' ? 'active' : ''}`}
              onClick={() => setVerifyTab('verified')}
            >
              Terverifikasi <span className="ct">{applicants.filter((applicant) => applicant.status === 'verified').length}</span>
            </button>
            <button
              className={`cp-tab ${verifyTab === 'rejected' ? 'active' : ''}`}
              onClick={() => setVerifyTab('rejected')}
            >
              Ditolak <span className="ct">{applicants.filter((applicant) => applicant.status === 'rejected').length}</span>
            </button>
          </div>

          <div className="cp-verify-table-wrapper">
            <table className="cp-verify-table">
              <thead>
                <tr>
                  <th className="col-id">ID</th>
                  <th className="col-name">Nama & Institusi</th>
                  <th className="col-scholar">Scholar</th>
                  <th className="col-score">Skor (tidak tersedia)</th>
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
                         <span className="cp-hindex">H-Index: {applicant.hIndex ?? 'Tidak tersedia'}</span>
                      </div>
                    </td>
                    <td className="col-score">
                      <span className="cp-score-badge">Tidak tersedia</span>
                    </td>
                    <td className="col-status">
                       <span className={`cp-vstatus ${applicant.status}`}>{applicant.status === 'verified' ? 'Terverifikasi' : applicant.status === 'rejected' ? 'Ditolak' : 'Menunggu'}</span>
                    </td>
                    <td className="col-action">
                      <div className="cp-action-btns">
                        <button
                          className="cp-btn-icon cp-btn-approve"
                           disabled
                           aria-label="Verifikasi tidak tersedia"
                           title="Verifikasi tidak tersedia karena mutasi belum tersedia"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </button>
                        <button
                          className="cp-btn-icon cp-btn-reject"
                           disabled
                           aria-label="Penolakan tidak tersedia"
                           title="Penolakan tidak tersedia karena mutasi belum tersedia"
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
                 <h4>{data.applications.status === 'ready' ? 'Tidak ada pendaftar' : 'Data pendaftar tidak tersedia'}</h4>
                 <p>{data.applications.status === 'ready' ? 'Semua pendaftar pada kategori ini telah selesai diproses.' : 'Sumber data pendaftar belum tersedia.'}</p>
              </div>
            )}
          </div>
        </div>

        <div className={`cp-card cp-batch-widget cp-reveal ${reveal ? 'cp-in' : ''}`}>
          <div className="cp-card-head">
            <h3>{currentBatch ? `Batch #${currentBatch.number}` : batchesReady ? 'Belum ada batch terbuka' : 'Batch aktif tidak tersedia'}</h3>
            <span className="cp-link-mono">Pengaturan belum tersedia →</span>
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
                   strokeDasharray={`${currentBatchPercent ?? 0}, 100`}
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
                <span className="num">{currentBatchPercent !== null ? `${currentBatchPercent}%` : unavailableValue}</span>
                <span className="lbl">Kuota</span>
              </div>
            </div>
            <div className="chart-info">
              <div className="leg cp-scopus">
                <div>
                   <span className="num">{currentBatchFilled ?? unavailableValue}</span> <span className="lbl">Terisi</span>
                </div>
              </div>
              <div className="leg cp-empty">
                <div>
                   <span className="num">{seatsRemaining ?? unavailableValue}</span> <span className="lbl">Tersisa</span>
                </div>
              </div>
            </div>
          </div>

          {!currentBatch && <div className="cp-empty-state" role="status"><h4>{batchesReady ? 'Belum ada batch terbuka' : 'Detail batch tidak tersedia'}</h4><p>{batchesReady ? 'Belum ada batch dengan status open.' : 'Sumber data batch belum tersedia.'}</p></div>}
          {currentBatch && <div className="cp-batch-rows">
            <div className="cp-brow">
              <span className="l">Pendaftar</span>
              <span className="v">
                {currentBatchFilled ?? unavailableValue} <span>/ {currentBatch.seatsTotal}</span>
              </span>
            </div>
            <div className="cp-brow">
              <span className="l">Terverifikasi</span>
              <span className="v ok">                Tidak tersedia</span>
            </div>
            <div className="cp-brow">
              <span className="l">Menunggu</span>
              <span className="v">
                <span className="accent">{data.applications.status === 'ready' ? (pendingApplications ?? unavailableValue) : unavailableValue}</span>
              </span>
            </div>
            <div className="cp-brow">
              <span className="l">Ditolak</span>
              <span className="v">                Tidak tersedia</span>
            </div>
            <div className="cp-brow">
              <span className="l">Pendaftaran ditutup</span>
                <span className="v">{currentBatch.closeDate || 'Tidak tersedia'}</span>
            </div>
           </div>}
           {currentBatch && <div className="cp-batch-cta">
            <button className="cp-vbtn cp-ghost" disabled title="Mutasi batch belum tersedia">Pause</button>
            <button className="cp-vbtn cp-approve" disabled title="Pembuatan batch belum tersedia">Buka batch baru</button>
          </div>}
        </div>
      </section>

      {/* Projects / Governance */}
      <section className={`cp-card cp-gov-card cp-reveal ${reveal ? 'cp-in' : ''}`}>
        <div className="cp-card-head">
          <div>
            <h3>Project Governance</h3>
            <p className="cp-card-sub">Antrian persetujuan proyek riset</p>
          </div>
          <span className="cp-link-mono">Modul detail belum tersedia →</span>
        </div>
        <div className="cp-tabs-row">
          <div className="cp-tabs">
            <button
              className={`cp-tab ${projectTab === 'pending' ? 'active' : ''}`}
              onClick={() => setProjectTab('pending')}
            >
              Pending                <span className="ct">{projects.filter((project) => project.status === 'pending').length}</span>
            </button>
            <button
              className={`cp-tab ${projectTab === 'archived' ? 'active' : ''}`}
              onClick={() => setProjectTab('archived')}
            >
              Archived                <span className="ct">{projects.filter((project) => project.status === 'archived').length}</span>
            </button>
            <button
              className={`cp-tab ${projectTab === 'published' ? 'active' : ''}`}
              onClick={() => setProjectTab('published')}
            >
              Published                <span className="ct">{projects.filter((project) => project.status === 'published').length}</span>
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
               <h4>{data.researchProjects.status === 'ready' ? 'Tidak ada proyek dalam antrian' : 'Data proyek tidak tersedia'}</h4>
               <p>{data.researchProjects.status === 'ready' ? 'Semua proyek pada kategori ini telah selesai ditinjau dan disetujui.' : 'Sumber data proyek belum tersedia.'}</p>
          <button className="cp-vbtn cp-ghost" style={{ marginTop: '16px' }} disabled title="Arsip proyek belum tersedia">
                 Arsip proyek belum tersedia
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

                  >
                    <td className="col-pid">
                      <span className="cp-pid-text">{project.id}</span>
                    </td>
                    <td className="col-ptitle">
                      <div className="cp-title-cell">
                        <span className="cp-pt">{project.title}</span>
                        <span className="cp-pmeta">{project.institutions}</span>
                      </div>
                    </td>
                    <td className="col-plead">{project.lead}</td>
                    <td className="col-pfield">{project.field}</td>
                    <td className="col-pstatus">
                      <span className={`cp-pill cp-${project.status}`}>
                         {project.status === 'pending' ? 'Pending' : project.status === 'published' ? 'Published' : project.status === 'archived' ? 'Archived' : 'Draft'}
                      </span>
                    </td>
                    <td className="col-paction">
                      <button className="cp-pcta" aria-label="Open project detail unavailable" disabled>
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

    </>
  );
}
