"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useI18n } from "@/components/ui/I18nProvider";
import {
  Mail,
  MessageCircle,
  MapPin,
  ArrowRight,
  Send,
  AlertCircle,
  Check,
} from "lucide-react";
import "./contact.css";

const schema = z.object({
  topic: z.string().min(1, "validation.topic"),
  name: z.string().min(1, "validation.name"),
  affiliation: z.string().optional(),
  email: z.string().min(1, "validation.name").email("validation.email"),
  whatsapp: z.string().optional(),
  message: z.string().min(1, "validation.message"),
});
type FormData = z.infer<typeof schema>;

function ThreadsIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10" />
      <path d="M12 8a4 4 0 0 1 4 4c0 2.21-1.79 4-4 4" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

const T = {
  id: {
    title: "Sapa kami.",
    sub: "Pertanyaan, kolaborasi, atau ajakan menulis tamu — kami respons dalam 24 jam kerja.",
    badge: "Contact",
    saluran: "Saluran Langsung",
    form_title: "Kirim Pesan",
    topic_label: "Topik",
    topics: ["Program", "Kolaborasi", "Tulisan Tamu", "Lainnya"],
    name_label: "Nama lengkap",
    name_placeholder: "Dr. Ahmad Rifai",
    affiliation_label: "Afiliasi",
    affiliation_placeholder: "Universitas / Institusi",
    email_label: "Email",
    email_placeholder: "nama@kampus.ac.id",
    phone_label: "WhatsApp",
    phone_placeholder: "+62 ___ ____ ____",
    message_label: "Pesan",
    message_placeholder: "Ceritakan kebutuhan anda...",
    consent_note: "Dengan mengirim, anda setuju kami menyimpan email untuk merespons.",
    submit_btn: "Kirim",
    submitting_btn: "Mengirim...",
    success_title: "Pesan terkirim!",
    success_desc: "Tim kami akan merespons dalam 24 jam kerja.",
    lokasi_label: "Lokasi",
    lokasi_address: "Jl. Cik Di Tiro No. 24, Bandung, Indonesia",
    validation: {
      topic: "Pilih topik terlebih dahulu",
      name: "Nama wajib diisi",
      email: "Email tidak valid",
      message: "Pesan wajib diisi",
    },
  },
  en: {
    title: "Say hello.",
    sub: "Questions, collaboration, or guest-writing pitches — we respond within 24 work hours.",
    badge: "Contact",
    saluran: "Direct Channels",
    form_title: "Send Message",
    topic_label: "Topic",
    topics: ["Program", "Collaboration", "Guest Writing", "Other"],
    name_label: "Full name",
    name_placeholder: "Dr. Ahmad Rifai",
    affiliation_label: "Affiliation",
    affiliation_placeholder: "University / Institution",
    email_label: "Email",
    email_placeholder: "name@campus.edu",
    phone_label: "WhatsApp",
    phone_placeholder: "+62 ___ ____ ____",
    message_label: "Message",
    message_placeholder: "Tell us what you need...",
    consent_note: "By sending, you agree we may store your email to respond.",
    submit_btn: "Send",
    submitting_btn: "Sending...",
    success_title: "Message sent!",
    success_desc: "Our team will respond within 24 work hours.",
    lokasi_label: "Location",
    lokasi_address: "Jl. Cik Di Tiro No. 24, Bandung, Indonesia",
    validation: {
      topic: "Please select a topic first",
      name: "Full name is required",
      email: "Invalid email address",
      message: "Message is required",
    },
  },
};

const getChannels = () => [
  {
    icon: <Mail size={18} />,
    label: "Email",
    value: "halo@copublika.id",
    href: "mailto:halo@copublika.id",
    color: "#E9711C",
  },
  {
    icon: <MessageCircle size={18} />,
    label: "WhatsApp",
    value: "+62 813 2025 0707",
    href: "https://wa.me/6281320250707",
    color: "#25D366",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    ),
    label: "Instagram",
    value: "@copublika.id",
    href: "https://instagram.com/copublika.id",
    color: "#E4405F",
  },
  {
    icon: <ThreadsIcon size={18} />,
    label: "Threads",
    value: "@copublika.id",
    href: "https://threads.net/@copublika.id",
    color: "#000000",
  },
];

function ContactCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;
    let particles: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    const PARTICLE_COUNT = 40;
    const CONNECTION_DIST = 120;
    const mouse = { x: -9999, y: -9999 };
    let rafId = 0;

    function resize() {
      if (!canvas || !ctx) return;
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 0.6,
      }));
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(233,113,28,0.9)";
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(233,113,28,${(1 - dist / CONNECTION_DIST) * 0.35})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < 140) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(233,113,28,${(1 - md / 140) * 0.2})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      rafId = requestAnimationFrame(draw);
    }

    function onMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
    function onLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    resize();
    rafId = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="cp-contact-canvas" />;
}

function MapEmbed({ locale }: { locale: "id" | "en" }) {
  return (
    <div className="cp-contact-map">
      <iframe
        title={locale === "id" ? "Lokasi CoPublika" : "CoPublika Location"}
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.8!2d107.6098!3d-6.9147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e64c5e5e5e5e%3A0x5e5e5e5e5e5e5e5e!2sJl.%20Cik%20Di%20Tiro%20No.24%2C%20Bandung!5e0!3m2!1sid!2sid!4v1234567890"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

export default function ContactPage() {
  const { locale } = useI18n();
  const currentLocale = (locale === "en" ? "en" : "id") as "id" | "en";
  const dict = T[currentLocale];
  const channels = getChannels();

  const [activeTopic, setActiveTopic] = useState(dict.topics[0]);
  const [customTopic, setCustomTopic] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { topic: dict.topics[0] },
  });

  // Keep active topic synced if user toggles language switcher
  useEffect(() => {
    const newTopic = dict.topics[0];
    setActiveTopic(newTopic);
    setValue("topic", newTopic);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dict.topics]);

  const selectTopic = useCallback(
    (t: string) => {
      setActiveTopic(t);
      if (t !== "Lainnya" && t !== "Other") {
        setCustomTopic("");
      }
      setValue("topic", t);
    },
    [setValue, setCustomTopic]
  );

  const onSubmit = async (data: FormData) => {
    setSubmitError("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, sourcePage: "contact" }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || "Submission failed");
      setSubmitted(true);
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : "Terjadi kesalahan.");
    }
  };

  const getValidationError = (fieldErrorKey: string | undefined) => {
    if (!fieldErrorKey) return null;
    if (fieldErrorKey === "validation.topic") return dict.validation.topic;
    if (fieldErrorKey === "validation.name") return dict.validation.name;
    if (fieldErrorKey === "validation.email") return dict.validation.email;
    if (fieldErrorKey === "validation.message") return dict.validation.message;
    return fieldErrorKey;
  };

  return (
    <div className="cp-contact-wrap">
      <div className="cp-contact-layout">
        {/* ─── LEFT COLUMN: Dark Premium ─── */}
        <div className="cp-contact-left">
          <ContactCanvas />

          <div className="cp-contact-hero">
            <span className="cp-contact-hero__badge">{dict.badge}</span>
            <h1 className="cp-contact-hero__title">
              {currentLocale === "id" ? (
                <>
                  Sapa <em>kami.</em>
                </>
              ) : (
                <>
                  Say <em>hello.</em>
                </>
              )}
            </h1>
            <p className="cp-contact-hero__sub">{dict.sub}</p>
          </div>

          <div className="cp-contact-lokasi">
            <div className="cp-contact-lokasi__header">
              <span className="cp-contact-lokasi__label">{dict.lokasi_label}</span>
              <span className="cp-contact-lokasi__badge">HQ</span>
            </div>
            <span className="cp-contact-lokasi__addr">
              <MapPin size={14} />
              {dict.lokasi_address}
            </span>
            <MapEmbed locale={currentLocale} />
          </div>
        </div>

        {/* ─── RIGHT COLUMN: Light Premium ─── */}
        <div className="cp-contact-right">
          {/* Channels info cards */}
          <div className="cp-contact-channels">
            <div className="cp-contact-channels__header">
              <span className="cp-contact-channels__label">{dict.saluran}</span>
            </div>
            <div className="cp-contact-channels__grid">
              {channels.map((ch, i) => (
                <a
                  key={ch.label}
                  className="cp-contact-channel-card"
                  href={ch.href}
                  target={ch.href.startsWith("http") ? "_blank" : undefined}
                  rel={ch.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  style={
                    {
                      "--ch-color": ch.color,
                      animationDelay: `${i * 80}ms`,
                    } as React.CSSProperties
                  }
                >
                  <span className="cp-contact-channel-card__icon">{ch.icon}</span>
                  <div className="cp-contact-channel-card__body">
                    <span className="cp-contact-channel-card__label">{ch.label}</span>
                    <span className="cp-contact-channel-card__value">{ch.value}</span>
                  </div>
                  <ArrowRight size={16} className="cp-contact-channel-card__arrow" />
                </a>
              ))}
            </div>
          </div>

          {/* Form card */}
          <div className="cp-contact-form-card">
            <h2 className="cp-contact-form-card__title">{dict.form_title}</h2>

            {!submitted ? (
              <form onSubmit={handleSubmit(onSubmit)} className="cp-contact-form">
                <div className="cp-contact-form__section">
                  <label className="cp-contact-form__label">
                    {dict.topic_label} <span>*</span>
                  </label>
                  <div className="cp-contact-form__chips">
                    {dict.topics.map((t) => (
                      <button
                        key={t}
                        type="button"
                        className={`cp-contact-chip ${activeTopic === t ? "is-active" : ""}`}
                        onClick={() => selectTopic(t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  {(activeTopic === "Lainnya" || activeTopic === "Other") && (
                    <input
                      type="text"
                      className="cp-contact-form__custom-topic"
                      placeholder="Topik lainnya..."
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                    />
                  )}
                  <input type="hidden" {...register("topic")} />
                  {errors.topic && (
                    <p className="cp-contact-form__error">
                      {getValidationError(errors.topic.message)}
                    </p>
                  )}
                </div>

                <div className="cp-contact-form__grid cp-contact-form__grid--2">
                  <div className="cp-contact-form__field">
                    <label>
                      {dict.name_label} <span>*</span>
                    </label>
                    <input {...register("name")} placeholder={dict.name_placeholder} />
                    {errors.name && (
                      <span className="cp-contact-form__error">
                        {getValidationError(errors.name.message)}
                      </span>
                    )}
                  </div>
                  <div className="cp-contact-form__field">
                    <label>{dict.affiliation_label}</label>
                    <input
                      {...register("affiliation")}
                      placeholder={dict.affiliation_placeholder}
                    />
                  </div>
                </div>

                <div className="cp-contact-form__grid cp-contact-form__grid--2">
                  <div className="cp-contact-form__field">
                    <label>
                      {dict.email_label} <span>*</span>
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder={dict.email_placeholder}
                    />
                    {errors.email && (
                      <span className="cp-contact-form__error">
                        {getValidationError(errors.email.message)}
                      </span>
                    )}
                  </div>
                  <div className="cp-contact-form__field">
                    <label>{dict.phone_label}</label>
                    <input
                      {...register("whatsapp")}
                      type="tel"
                      placeholder={dict.phone_placeholder}
                    />
                  </div>
                </div>

                <div className="cp-contact-form__field cp-contact-form__field--full">
                  <label>
                    {dict.message_label} <span>*</span>
                  </label>
                  <textarea
                    {...register("message")}
                    placeholder={dict.message_placeholder}
                  />
                  {errors.message && (
                    <span className="cp-contact-form__error">
                      {getValidationError(errors.message.message)}
                    </span>
                  )}
                </div>

                {submitError && (
                  <div className="cp-contact-form__alert">
                    <AlertCircle size={16} />
                    {submitError}
                  </div>
                )}

                <div className="cp-contact-form__footer">
                  <span className="cp-contact-form__note">{dict.consent_note}</span>
                  <button
                    type="submit"
                    className="cp-contact-form__btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? dict.submitting_btn : dict.submit_btn}
                    <Send size={16} />
                  </button>
                </div>
              </form>
            ) : (
              <div className="cp-contact-success">
                <div className="cp-contact-success__icon">
                  <Check size={28} />
                </div>
                <h3>{dict.success_title}</h3>
                <p>{dict.success_desc}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
