"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/components/ui/I18nProvider";

const schema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email"),
  institution: z.string().min(1, "Institution is required"),
  role: z.string().min(1, "Role is required"),
  expertise: z.string().min(1, "Expertise is required"),
  googleScholarId: z.string().min(1, "Google Scholar ID is required"),
  orcid: z.string().optional(),
  scopusOrLinkedIn: z.string().optional(),
  hIndex: z.string().optional(),
  statementOfIntent: z.string().min(1, "Statement of intent is required"),
  targetJournalTier: z.enum(["Q1", "Q2", "Open/Pre-print"]),
  motivation: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const steps = [
  { num: 1, title: "Identity", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { num: 2, title: "Profile", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { num: 3, title: "Intent", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { num: 4, title: "Review", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
];

export function JoinBatchForm() {
  const { t } = useI18n();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [error, setError] = useState("");
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
    trigger,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      const res = await fetch("/api/join-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || "Submission failed");
      setSubmittedName(data.fullName);
      setSubmitted(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  };

  const goNext = async () => {
    const fields = getStepFields(step);
    const valid = await trigger(fields as (keyof FormData)[]);
    if (valid) {
      setDirection("forward");
      setStep((s) => Math.min(s + 1, 4));
    }
  };

  const goBack = () => {
    setDirection("backward");
    setStep((s) => Math.max(s - 1, 1));
  };

  const getStepFields = (s: number) => {
    switch (s) {
      case 1: return ["fullName", "email", "googleScholarId"];
      case 2: return ["institution", "role", "expertise"];
      case 3: return ["statementOfIntent", "targetJournalTier"];
      default: return [];
    }
  };

  if (submitted) {
    return (
      <div className="cp-jb-success">
        <div className="cp-jb-success__icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h2 className="cp-jb-success__title">{t("batch.success.title") || "Application Submitted"}</h2>
        <p className="cp-jb-success__desc">{t("batch.success.desc", { name: submittedName }) || `Thank you, ${submittedName}. We will review your application and get back to you within 10 working days.`}</p>
        <div className="cp-jb-success__meta">
          <span className="cp-jb-success__badge">
            <i />
            Under Review
          </span>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="cp-jb-form">
      {/* Step indicator */}
      <div className="cp-jb-steps">
        {steps.map((s) => (
          <button
            key={s.num}
            type="button"
            onClick={() => s.num < step && setStep(s.num)}
            className={`cp-jb-step ${s.num === step ? "is-active" : ""} ${s.num < step ? "is-done" : ""}`}
            disabled={s.num > step}
          >
            <span className="cp-jb-step__node">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {s.num < step ? (
                  <polyline points="20 6 9 17 4 12" />
                ) : (
                  <path d={s.icon} />
                )}
              </svg>
            </span>
            <span className="cp-jb-step__label">{s.title}</span>
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="cp-jb-progress">
        <div className="cp-jb-progress__track">
          <div
            className="cp-jb-progress__fill"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />
        </div>
        <span className="cp-jb-progress__text">Step {step} of 4</span>
      </div>

      {/* Form steps */}
      <div className={`cp-jb-step-content ${direction === "forward" ? "is-forward" : "is-backward"}`}>
        {step === 1 && (
          <div className="cp-jb-fields cp-jb-fields--enter">
            <div className="cp-jb-field">
              <label className="cp-jb-field__label">
                <span className="cp-jb-field__icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </span>
                {t("batch.field.fullname") || "Full Name"}
                <span className="cp-jb-field__req">*</span>
              </label>
              <input {...register("fullName")} placeholder="Dr. John Doe" className="cp-jb-field__input" />
              {errors.fullName && <p className="cp-jb-field__error">{errors.fullName.message}</p>}
            </div>

            <div className="cp-jb-field">
              <label className="cp-jb-field__label">
                <span className="cp-jb-field__icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </span>
                {t("batch.field.email") || "Email"}
                <span className="cp-jb-field__req">*</span>
              </label>
              <input {...register("email")} type="email" placeholder="john@university.edu" className="cp-jb-field__input" />
              {errors.email && <p className="cp-jb-field__error">{errors.email.message}</p>}
            </div>

            <div className="cp-jb-field">
              <label className="cp-jb-field__label">
                <span className="cp-jb-field__icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                </span>
                {t("batch.field.google_scholar_id") || "Google Scholar ID"}
                <span className="cp-jb-field__req">*</span>
              </label>
              <input {...register("googleScholarId")} placeholder="scholar.google.com/citations?user=XXXX" className="cp-jb-field__input" />
              {errors.googleScholarId && <p className="cp-jb-field__error">{errors.googleScholarId.message}</p>}
            </div>

            <div className="cp-jb-field">
              <label className="cp-jb-field__label">
                <span className="cp-jb-field__icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </span>
                {t("batch.field.orcid") || "ORCID"}
                <span className="cp-jb-field__opt">{t("batch.field.orcid.optional") || "(optional)"}</span>
              </label>
              <input {...register("orcid")} placeholder="0000-0000-0000-0000" className="cp-jb-field__input" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="cp-jb-fields cp-jb-fields--enter">
            <div className="cp-jb-field">
              <label className="cp-jb-field__label">
                <span className="cp-jb-field__icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </span>
                {t("batch.field.institution") || "Institution"}
                <span className="cp-jb-field__req">*</span>
              </label>
              <input {...register("institution")} placeholder="Universitas Indonesia" className="cp-jb-field__input" />
              {errors.institution && <p className="cp-jb-field__error">{errors.institution.message}</p>}
            </div>

            <div className="cp-jb-field">
              <label className="cp-jb-field__label">
                <span className="cp-jb-field__icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 13.255A23.931 23.931 0 0112 10c-3.183 0-6.22.62-9 1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m0 0h.01M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>
                </span>
                {t("batch.field.role") || "Role / Position"}
                <span className="cp-jb-field__req">*</span>
              </label>
              <input {...register("role")} placeholder="Lecturer / Research Fellow / PhD Student" className="cp-jb-field__input" />
              {errors.role && <p className="cp-jb-field__error">{errors.role.message}</p>}
            </div>

            <div className="cp-jb-field">
              <label className="cp-jb-field__label">
                <span className="cp-jb-field__icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M17.636 17.636l-.707-.707M12 21v-1M6.343 17.636l.707-.707M3 12h1M6.343 6.343l.707.707" /></svg>
                </span>
                {t("batch.field.expertise") || "Research Expertise"}
                <span className="cp-jb-field__req">*</span>
              </label>
              <input {...register("expertise")} placeholder="AI/ML, Public Health, Education Policy..." className="cp-jb-field__input" />
              {errors.expertise && <p className="cp-jb-field__error">{errors.expertise.message}</p>}
            </div>

            <div className="cp-jb-row">
              <div className="cp-jb-field">
                <label className="cp-jb-field__label">
                  <span className="cp-jb-field__icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  </span>
                  {t("batch.field.hindex") || "H-Index"}
                  <span className="cp-jb-field__opt">{t("batch.hint.hindex") || "(optional)"}</span>
                </label>
                <input {...register("hIndex")} type="number" placeholder="12" className="cp-jb-field__input" />
              </div>

              <div className="cp-jb-field">
                <label className="cp-jb-field__label">
                  <span className="cp-jb-field__icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                  </span>
                  Scopus ID / LinkedIn
                  <span className="cp-jb-field__opt">(optional)</span>
                </label>
                <input {...register("scopusOrLinkedIn")} placeholder="Profile URL" className="cp-jb-field__input" />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="cp-jb-fields cp-jb-fields--enter">
            <div className="cp-jb-field">
              <label className="cp-jb-field__label">
                <span className="cp-jb-field__icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.414z" /></svg>
                </span>
                {t("batch.field.intent") || "Statement of Intent"}
                <span className="cp-jb-field__req">*</span>
              </label>
              <textarea
                {...register("statementOfIntent")}
                rows={5}
                placeholder={t("batch.field.intent.placeholder") || "Describe your research goals and what you aim to achieve in this batch..."}
                className="cp-jb-field__input cp-jb-field__textarea"
              />
              {errors.statementOfIntent && <p className="cp-jb-field__error">{errors.statementOfIntent.message}</p>}
            </div>

            <div className="cp-jb-field">
              <label className="cp-jb-field__label">
                <span className="cp-jb-field__icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" /></svg>
                </span>
                {t("batch.field.target") || "Target Journal Tier"}
                <span className="cp-jb-field__req">*</span>
              </label>
              <div className="cp-jb-select-wrap">
                <select {...register("targetJournalTier")} className="cp-jb-field__input cp-jb-field__select">
                  <option value="">{t("batch.field.target") || "Select target tier"}</option>
                  <option value="Q1">Q1 — Top tier journals</option>
                  <option value="Q2">Q2 — High quality journals</option>
                  <option value="Open/Pre-print">Open Access / Pre-print</option>
                </select>
                <svg className="cp-jb-select__arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
              </div>
              {errors.targetJournalTier && <p className="cp-jb-field__error">{errors.targetJournalTier.message}</p>}
            </div>

            <div className="cp-jb-field">
              <label className="cp-jb-field__label">
                <span className="cp-jb-field__icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </span>
                {t("batch.field.motivation") || "Motivation"}
                <span className="cp-jb-field__opt">{t("batch.field.motivation.optional") || "(optional)"}</span>
              </label>
              <textarea
                {...register("motivation")}
                rows={3}
                placeholder={t("batch.field.motivation.placeholder") || "What drives you to join this batch?"}
                className="cp-jb-field__input cp-jb-field__textarea"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="cp-jb-fields cp-jb-fields--enter">
            <div className="cp-jb-review">
              <h3 className="cp-jb-review__title">{t("batch.review.title") || "Review Your Application"}</h3>
              <p className="cp-jb-review__desc">{t("batch.review.desc") || "Please review your information before submitting."}</p>
              
              <div className="cp-jb-review__grid">
                <div className="cp-jb-review__card">
                  <span className="cp-jb-review__label">{t("batch.field.fullname") || "Full Name"}</span>
                  <span className="cp-jb-review__value">{getValues("fullName") || "—"}</span>
                </div>
                <div className="cp-jb-review__card">
                  <span className="cp-jb-review__label">{t("batch.field.email") || "Email"}</span>
                  <span className="cp-jb-review__value">{getValues("email") || "—"}</span>
                </div>
                <div className="cp-jb-review__card">
                  <span className="cp-jb-review__label">{t("batch.field.google_scholar_id") || "Google Scholar"}</span>
                  <span className="cp-jb-review__value">{getValues("googleScholarId") || "—"}</span>
                </div>
                <div className="cp-jb-review__card">
                  <span className="cp-jb-review__label">{t("batch.field.institution") || "Institution"}</span>
                  <span className="cp-jb-review__value">{getValues("institution") || "—"}</span>
                </div>
                <div className="cp-jb-review__card">
                  <span className="cp-jb-review__label">{t("batch.field.role") || "Role"}</span>
                  <span className="cp-jb-review__value">{getValues("role") || "—"}</span>
                </div>
                <div className="cp-jb-review__card">
                  <span className="cp-jb-review__label">{t("batch.field.expertise") || "Expertise"}</span>
                  <span className="cp-jb-review__value">{getValues("expertise") || "—"}</span>
                </div>
                <div className="cp-jb-review__card">
                  <span className="cp-jb-review__label">{t("batch.field.target") || "Target"}</span>
                  <span className="cp-jb-review__value">{getValues("targetJournalTier") || "—"}</span>
                </div>
                <div className="cp-jb-review__card cp-jb-review__card--wide">
                  <span className="cp-jb-review__label">{t("batch.field.intent") || "Statement of Intent"}</span>
                  <span className="cp-jb-review__value cp-jb-review__value--long">{getValues("statementOfIntent") || "—"}</span>
                </div>
              </div>
              
              {error && <p className="cp-jb-field__error cp-jb-field__error--center">{error}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="cp-jb-nav">
        {step > 1 ? (
          <Button type="button" variant="outline" onClick={goBack} className="cp-jb-nav__back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5m7 7l-7-7 7-7" /></svg>
            Back
          </Button>
        ) : (
          <div />
        )}
        
        {step < 4 ? (
          <Button type="button" variant="primary" onClick={goNext} className="cp-jb-nav__next">
            Next Step
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-7-7l7 7-7 7" /></svg>
          </Button>
        ) : (
          <Button type="submit" variant="primary" disabled={isSubmitting} className="cp-jb-nav__submit">
            {isSubmitting ? (
              <>
                <span className="cp-jb-spinner" />
                Submitting...
              </>
            ) : (
              <>
                {t("batch.submit") || "Submit Application"}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
              </>
            )}
          </Button>
        )}
      </div>
    </form>
  );
}
