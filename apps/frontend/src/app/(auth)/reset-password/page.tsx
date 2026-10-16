"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, KeyRound, Loader2, TriangleAlert } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { passwordProblem } from "@/lib/password";
import { AuthShell } from "@/components/auth/AuthShell";
import { PasswordFields } from "@/components/program/PasswordFields";

export default function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string; error?: string }> }) {
  const sp = use(searchParams);
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [failure, setFailure] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const invalid = !sp.token || sp.error === "INVALID_TOKEN";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const pw = passwordProblem(password);
    const next = { password: pw ?? undefined, confirm: !confirm ? "Ulangi password baru." : confirm !== password ? "Password tidak sama." : undefined };
    setErrors(next);
    setFailure(null);
    if (next.password || next.confirm || !sp.token) return;
    setLoading(true);
    const { error } = await authClient.resetPassword({ newPassword: password, token: sp.token });
    setLoading(false);
    if (error) {
      setFailure(error.code === "INVALID_TOKEN" || error.status === 400 ? "Link ini sudah kedaluwarsa atau sudah dipakai. Minta link baru." : error.message ?? "Password belum bisa diganti. Coba lagi.");
      return;
    }
    router.push("/login?reset=ok");
  }

  return (
    <AuthShell
      title={invalid ? "Link tidak berlaku" : "Buat password baru"}
      lead={invalid ? "Link atur ulang password sudah kedaluwarsa atau tidak lengkap." : "Gunakan password yang kuat dan belum pernah Anda pakai di akun lain."}
      tagline={<>Mulai lagi, <em>lebih aman.</em></>}
      sub="Password baru langsung berlaku untuk semua perangkat Anda."
    >
      {invalid ? (
        <div className="cp-login__sent is-warn" role="alert">
          <span className="cp-login__sent-ico" aria-hidden="true"><TriangleAlert size={26} /></span>
          <p>Link berlaku 1 jam dan hanya bisa dipakai sekali. Minta link baru untuk melanjutkan.</p>
          <Link href="/lupa-password" className="cp-login__submit">Minta link baru</Link>
        </div>
      ) : (
        <form className="cp-login__form" onSubmit={submit} noValidate>
          <div className="cp-reg__grid cp-login__pw">
            <PasswordFields password={password} confirm={confirm} onPassword={setPassword} onConfirm={setConfirm} errors={errors} />
          </div>
          {failure && <p className="cp-login__notice is-error" role="alert">{failure} <Link href="/lupa-password">Minta link baru</Link></p>}
          <button type="submit" className="cp-login__submit" disabled={loading}>
            {loading ? <><Loader2 size={18} className="cp-login__spin" aria-hidden="true" /> Menyimpan…</> : <>Simpan password baru <KeyRound size={17} aria-hidden="true" /></>}
          </button>
        </form>
      )}
      <Link href="/login" className="cp-login__back"><ArrowLeft size={16} aria-hidden="true" /> Kembali ke halaman masuk</Link>
    </AuthShell>
  );
}
