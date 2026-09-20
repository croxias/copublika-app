'use client';
import { X, User } from 'lucide-react';
import type { StagingApplicant } from '@/lib/staging';

type ApplicantPreviewDialogProps = {
  applicant: StagingApplicant;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
};

export function ApplicantPreviewDialog({ applicant, onClose, onApprove, onReject }: ApplicantPreviewDialogProps) {
  return <div className="applicant-dialog-backdrop" role="presentation" onClick={onClose}><section className="applicant-dialog" role="dialog" aria-modal="true" aria-labelledby="applicant-dialog-title" onClick={(event) => event.stopPropagation()}><header className="applicant-dialog-header"><div className="applicant-dialog-person"><span className="applicant-dialog-avatar"><User size={28} /></span><div><span className="applicant-dialog-eyebrow">PREVIEW PENDAFTAR</span><h2 id="applicant-dialog-title">{applicant.name}</h2><p>{applicant.institution} · {applicant.expertise}</p></div></div><button type="button" className="applicant-dialog-close" onClick={onClose} aria-label="Tutup preview"><X size={18} /></button></header><div className="applicant-dialog-grid"><div><small>Google Scholar ID</small><strong>{applicant.scholarId}</strong></div><div><small>H-index</small><strong>{applicant.hIndex}</strong></div><div><small>Sitasi</small><strong>{applicant.citations.toLocaleString('id-ID')}</strong></div><div><small>Status</small><strong>{applicant.status}</strong></div></div><div className="applicant-dialog-affiliation"><small>Verifikasi afiliasi</small><strong>{applicant.affiliation}</strong><p>{applicant.verificationNote}</p></div><footer className="applicant-dialog-actions"><button type="button" className="ac-btn ac-btn-reject" onClick={onReject}>Tolak</button><button type="button" className="ac-btn ac-btn-approve" onClick={onApprove}>Setujui</button></footer></section></div>;
}
