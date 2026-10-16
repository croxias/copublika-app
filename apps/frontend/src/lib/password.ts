// Password rules for member accounts. Shared by the registration form now and by the
// server-side check later, so both say the same thing.

export type PasswordRule = { key: string; label: string; test: (v: string) => boolean; required: boolean };

export const PASSWORD_RULES: PasswordRule[] = [
  { key: "length", label: "Minimal 8 karakter", test: (v) => v.length >= 8, required: true },
  { key: "lower", label: "Huruf kecil (a–z)", test: (v) => /[a-z]/.test(v), required: true },
  { key: "upper", label: "Huruf besar (A–Z)", test: (v) => /[A-Z]/.test(v), required: true },
  { key: "digit", label: "Angka (0–9)", test: (v) => /\d/.test(v), required: true },
  { key: "symbol", label: "Simbol, mis. ! @ # ? (disarankan)", test: (v) => /[^A-Za-z0-9\s]/.test(v), required: false },
];

export type Strength = { score: 0 | 1 | 2 | 3 | 4; label: string };

/** 0–4 from the rules met, with a bonus for length and a cap when a required rule is missing. */
export function passwordStrength(v: string): Strength {
  if (!v) return { score: 0, label: "" };
  const met = PASSWORD_RULES.filter((r) => r.test(v)).length + (v.length >= 12 ? 1 : 0);
  const missingRequired = PASSWORD_RULES.some((r) => r.required && !r.test(v));
  const score = (missingRequired ? Math.min(2, Math.max(1, met - 2)) : Math.min(4, met - 2)) as Strength["score"];
  return { score, label: ["", "Lemah", "Cukup", "Kuat", "Sangat kuat"][score] };
}

/** First unmet required rule as a sentence, or null when the password is acceptable. */
export function passwordProblem(v: string): string | null {
  const miss = PASSWORD_RULES.find((r) => r.required && !r.test(v));
  if (!miss) return null;
  return miss.key === "length" ? "Password minimal 8 karakter." : `Password perlu ${miss.label.toLowerCase().replace(/ \(.*\)/, "")}.`;
}
