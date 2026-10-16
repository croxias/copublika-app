"use client";

import { useId, useState } from "react";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { PASSWORD_RULES, passwordStrength } from "@/lib/password";

type Props = {
  password: string;
  confirm: string;
  onPassword: (v: string) => void;
  onConfirm: (v: string) => void;
  errors: { password?: string; confirm?: string };
};

/** Password and confirmation side by side, with a live checklist and strength meter below. */
export function PasswordFields({ password, confirm, onPassword, onConfirm, errors }: Props) {
  const uid = useId();
  const [show, setShow] = useState(false);
  const strength = passwordStrength(password);
  const matches = confirm.length > 0 && confirm === password;

  return (
    <>
      <div className={`cp-reg__field ${errors.password ? "has-error" : ""}`}>
        <label className="cp-reg__label" htmlFor={`${uid}-pw`}>Buat password <span className="cp-reg__req" title="Wajib diisi">*<span className="sr-only"> (wajib)</span></span></label>
        <span className="cp-pw">
          <input
            id={`${uid}-pw`}
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => onPassword(e.target.value)}
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            aria-describedby={`${uid}-rules`}
            placeholder="Buat password yang kuat"
          />
          <button type="button" className="cp-pw__eye" onClick={() => setShow((s) => !s)} aria-label={show ? "Sembunyikan password" : "Tampilkan password"} aria-pressed={show}>
            {show ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </span>
        {errors.password && <span className="cp-reg__err">{errors.password}</span>}
      </div>

      <div className={`cp-reg__field ${errors.confirm ? "has-error" : ""}`}>
        <label className="cp-reg__label" htmlFor={`${uid}-cf`}>Ulangi password <span className="cp-reg__req" title="Wajib diisi">*<span className="sr-only"> (wajib)</span></span></label>
        <span className={`cp-pw ${matches ? "is-match" : ""}`}>
          <input
            id={`${uid}-cf`}
            type={show ? "text" : "password"}
            value={confirm}
            onChange={(e) => onConfirm(e.target.value)}
            autoComplete="new-password"
            aria-invalid={!!errors.confirm}
            placeholder="Tulis ulang password"
          />
          {confirm && <span className={`cp-pw__state ${matches ? "is-ok" : "is-no"}`} aria-hidden="true">{matches ? <Check size={16} /> : <X size={16} />}</span>}
        </span>
        {errors.confirm ? <span className="cp-reg__err">{errors.confirm}</span> : confirm && <span className={matches ? "cp-pw__ok" : "cp-reg__fhint"}>{matches ? "Password sama." : "Belum sama dengan password di sebelah."}</span>}
      </div>

      <div className="cp-pw-rules" id={`${uid}-rules`}>
        <div className="cp-pw-meter" aria-live="polite">
          <span className="cp-pw-meter__bars" aria-hidden="true">
            {[1, 2, 3, 4].map((i) => <i key={i} className={strength.score >= i ? `is-on is-${strength.score}` : ""} />)}
          </span>
          <span className="cp-pw-meter__label">{password ? <>Kekuatan: <b>{strength.label}</b></> : "Password harus memuat:"}</span>
        </div>
        <ul>
          {PASSWORD_RULES.map((r) => {
            const ok = r.test(password);
            return (
              <li key={r.key} className={ok ? "is-ok" : ""}>
                <span aria-hidden="true">{ok ? <Check size={12} strokeWidth={3} /> : null}</span>
                {r.label}
                <span className="sr-only">{ok ? " — terpenuhi" : " — belum"}</span>
              </li>
            );
          })}
        </ul>
        <p>Hindari nama, tanggal lahir, atau password yang sama dengan akun lain.</p>
      </div>
    </>
  );
}
