"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ShieldCheck, X } from "lucide-react";

// Privacy policy and membership terms shown at registration. Draft copy for the front-end
// phase; legal should review it before launch.

export type PolicyTab = "privasi" | "syarat";

const UPDATED = "16 Oktober 2026";
const CONTACT = "copublika@gmail.com";

const PRIVACY: { title: string; body: React.ReactNode }[] = [
  {
    title: "Data yang kami kumpulkan",
    body: (
      <ul>
        <li>Identitas akun: nama lengkap, email, nomor WhatsApp, dan alamat.</li>
        <li>Profil akademik: profesi (dosen, peneliti, mahasiswa S2, umum), institusi atau afiliasi, rumpun dan bidang ilmu, serta tautan Google Scholar bila Anda isi.</li>
        <li>Nomor identitas sesuai profesi: NIDN, NIK (KTP), atau NIM.</li>
        <li>Data penggunaan dasar, seperti waktu masuk dan halaman yang dibuka, untuk menjaga keamanan akun.</li>
      </ul>
    ),
  },
  {
    title: "Cara kami memakai data",
    body: (
      <ul>
        <li>Membuat dan mengelola akun member serta masa aktifnya.</li>
        <li>Memeriksa kelayakan pendaftaran dan mencegah akun ganda atau palsu.</li>
        <li>Menghubungi Anda soal pendaftaran, pembayaran, jadwal program, dan link aktivasi akun.</li>
        <li>Menampilkan profil anggota (nama, afiliasi, Google Scholar) kepada sesama member. Nomor identitas, alamat, dan WhatsApp tidak pernah ditampilkan.</li>
      </ul>
    ),
  },
  {
    title: "Penyimpanan dan keamanan",
    body: <p>Data disimpan di server dengan akses terbatas untuk tim admin yang berwenang. Password disimpan dalam bentuk terenkripsi (hash) dan tidak bisa dibaca siapa pun, termasuk tim kami. Nomor identitas disimpan terenkripsi.</p>,
  },
  {
    title: "Berbagi dengan pihak lain",
    body: <p>Kami tidak menjual data Anda. Data hanya dibagikan kepada penyedia layanan yang membantu operasional (misalnya pengiriman email dan pembayaran) sebatas yang diperlukan, atau bila diwajibkan hukum.</p>,
  },
  {
    title: "Hak Anda",
    body: <p>Anda dapat meminta salinan data, memperbaiki data yang keliru, atau menghapus akun kapan saja dengan menghubungi {CONTACT}. Kami menanggapi permintaan dalam 14 hari kerja.</p>,
  },
  {
    title: "Masa simpan",
    body: <p>Data disimpan selama akun aktif dan hingga 12 bulan setelah keanggotaan berakhir, kecuali Anda meminta penghapusan lebih awal.</p>,
  },
];

const TERMS: { title: string; body: React.ReactNode }[] = [
  { title: "Kelayakan", body: <p>Keanggotaan terbuka untuk dosen, peneliti, mahasiswa S2, dan umum yang mengisi data dengan benar. Satu orang hanya boleh memiliki satu akun.</p> },
  { title: "Persetujuan pendaftaran", body: <p>Setiap pendaftaran ditinjau tim admin. Akun aktif setelah disetujui dan diaktifkan melalui link yang kami kirim ke email Anda dalam 1×24 jam. Kami dapat menolak pendaftaran dengan data yang tidak valid.</p> },
  { title: "Masa aktif", body: <p>Registrasi member gratis untuk bulan pertama. Setelah itu keanggotaan diaktifkan Rp. 75.000 per tahun, atau gratis satu tahun bagi peserta program Siap Tembus Scopus dan Bootcamp 30 Hari Menulis.</p> },
  { title: "Etika komunitas", body: <p>Member menjaga sikap profesional, menghormati karya orang lain, dan tidak melakukan plagiarisme, spam, atau penyalahgunaan data sesama anggota.</p> },
  { title: "Penangguhan", body: <p>Akun yang melanggar ketentuan dapat ditangguhkan atau ditutup. Biaya aktivasi yang sudah dibayarkan tidak dapat dikembalikan untuk pelanggaran ketentuan.</p> },
];

type Props = { open: boolean; tab: PolicyTab; onTab: (t: PolicyTab) => void; onOpenChange: (open: boolean) => void; onAgree: () => void };

export function PolicyDialog({ open, tab, onTab, onOpenChange, onAgree }: Props) {
  const sections = tab === "privasi" ? PRIVACY : TERMS;
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="cp-policy__overlay" />
        <Dialog.Content className="cp-policy" aria-describedby={undefined}>
          <header className="cp-policy__head">
            <span className="cp-policy__ico" aria-hidden="true"><ShieldCheck size={20} /></span>
            <div>
              <Dialog.Title className="cp-policy__title">{tab === "privasi" ? "Kebijakan Privasi" : "Syarat Keanggotaan"}</Dialog.Title>
              <p>Berlaku sejak {UPDATED}</p>
            </div>
            <Dialog.Close className="cp-policy__x" aria-label="Tutup"><X size={18} /></Dialog.Close>
          </header>
          <div className="cp-policy__tabs" role="tablist" aria-label="Dokumen">
            <button type="button" role="tab" aria-selected={tab === "privasi"} onClick={() => onTab("privasi")}>Kebijakan Privasi</button>
            <button type="button" role="tab" aria-selected={tab === "syarat"} onClick={() => onTab("syarat")}>Syarat Keanggotaan</button>
          </div>
          <div className="cp-policy__body" role="tabpanel">
            <ol>
              {sections.map((s) => (
                <li key={s.title}>
                  <h3>{s.title}</h3>
                  {s.body}
                </li>
              ))}
            </ol>
            <p className="cp-policy__contact">Pertanyaan soal data Anda? Hubungi <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.</p>
          </div>
          <footer className="cp-policy__foot">
            <Dialog.Close className="cp-policy__btn is-line">Tutup</Dialog.Close>
            <button type="button" className="cp-policy__btn is-ink" onClick={() => { onAgree(); onOpenChange(false); }}>Saya setuju</button>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
