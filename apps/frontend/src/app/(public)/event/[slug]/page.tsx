import { notFound } from "next/navigation";
import Link from "next/link";
import { getEventBySlug } from "@/lib/data/events";
import type { Event, EventBlock, EventScheduleItem } from "@/types";

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) notFound();

  return (
    <>
      <EventHero event={event} />
      <EventContent event={event} />
      <EventCTA />
    </>
  );
}

function EventHero({ event }: { event: Event }) {
  const date = new Date(event.date);
  const dayName = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][date.getDay()];
  const formattedDate = `${date.getDate()} ${["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"][date.getMonth()]} ${date.getFullYear()}`;

  return (
    <section className="cp-ed-hero-v2">
      <div className="cp-ed-hero-v2__orb" aria-hidden="true" />
      <div className="cp-ed-hero-v2__orb2" aria-hidden="true" />
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8" style={{ position: "relative", zIndex: 1 }}>
        <Link href="/event" className="cp-ed-back">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M10 12L6 8L10 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Kembali ke Agenda
        </Link>

        <div className="cp-ed-pills-v2">
          <span className="cp-ed-pill-v2 accent">{event.type ? event.type.charAt(0).toUpperCase() + event.type.slice(1) : "Event"}</span>
          <span className={`cp-ed-pill-v2 ${event.memberOnly ? "accent" : ""}`}>{event.memberOnly ? "Khusus Member" : event.isPaid ? "Berbayar" : "Gratis"}</span>
          <span className="cp-ed-pill-v2">{event.duration || "90 menit"}</span>
          <span className="cp-ed-pill-v2">Sertifikat tersedia</span>
        </div>

        <h1>
          {event.title}
          {event.title.includes("Reviewer Comments") && <em>Reviewer Comments</em>}
        </h1>

        <p className="cp-ed-hero-v2__dek">{event.description}</p>

        <div className="cp-ed-when-v2">
          <div>
            <span className="l">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Tanggal
            </span>
            <span className="v">
              {formattedDate}
              <span className="sm">{dayName}</span>
            </span>
          </div>
          <div>
            <span className="l">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Waktu
            </span>
            <span className="v">
              {event.time || "19.30 — 21.00"}
              <span className="sm">WIB · {event.duration || "90 menit"}</span>
            </span>
          </div>
          <div>
            <span className="l">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" />
              </svg>
              Format
            </span>
            <span className="v">
              {event.format || event.location}
              <span className="sm">Link 24 jam sebelum</span>
            </span>
          </div>
          <div>
            <span className="l">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
              </svg>
              Bahasa
            </span>
            <span className="v">
              {event.language || "Indonesia"}
              <span className="sm">Slide bilingual</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function EventContent({ event }: { event: Event }) {
  const filled = event.capacity > 0 ? Math.round((event.registrantsCount / event.capacity) * 100) : 0;

  return (
    <section className="cp-ed-section">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="cp-ed-grid">
          <div>
            {event.blocks?.map((block: EventBlock, i: number) => (
              <div className="cp-ed-block-v2" key={i}>
                <h2>{block.heading}</h2>
                {block.paragraphs?.map((p: string, j: number) => (
                  <p key={j}>{p}</p>
                ))}
                {block.checkmarks && (
                  <ul>
                    {block.checkmarks.map((item: string, k: number) => (
                      <li key={k}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {event.schedule && event.schedule.length > 0 && (
              <div className="cp-ed-block-v2">
                <h2>Susunan acara</h2>
                <div className="cp-ed-sched-v2">
                  {event.schedule.map((item: EventScheduleItem, i: number) => (
                    <div className="cp-ed-sched-v2__row" key={i}>
                      <div className="cp-ed-sched-v2__time">{item.time}</div>
                      <div className="cp-ed-sched-v2__item">
                        <h4>{item.title}</h4>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {event.speaker && (
              <div className="cp-ed-block-v2">
                <h2>Pembicara</h2>
                <div className="cp-ed-speaker-v2">
                  <div
                    className="cp-ed-speaker-v2__av"
                    style={{ backgroundImage: `url(${event.speaker.avatar})` }}
                  />
                  <div>
                    <div className="cp-ed-speaker-v2__label">Pembicara Utama</div>
                    <div className="cp-ed-speaker-v2__name">{event.speaker.name}</div>
                    <div className="cp-ed-speaker-v2__role">{event.speaker.role}</div>
                    <div className="cp-ed-speaker-v2__badges">
                      {event.speaker.badges.map((badge: string, i: number) => (
                        <span key={i}>{badge}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {event.targetAudience && event.targetAudience.length > 0 && (
              <div className="cp-ed-block-v2">
                <h2>Untuk siapa</h2>
                <p>Sesi ini paling cocok untuk:</p>
                <ul>
                  {event.targetAudience.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="cp-ed-side">
            <div className="cp-ed-reg-v2">
              <div className="cp-ed-reg-v2__head">
                <div className="cp-ed-reg-v2__price">{event.isPaid ? "Berbayar" : "Gratis"}</div>
                <div className="cp-ed-reg-v2__note">
                  {event.isPaid ? "Rp 75rb non-anggota" : "Anggota · Rp 75rb non-anggota"}
                </div>
              </div>
              <div className="cp-ed-reg-v2__cap">
                <div className="cp-ed-reg-v2__cap-text">
                  <span><strong>{event.registrantsCount}</strong> Terdaftar</span>
                  <span><strong>{event.capacity - event.registrantsCount}</strong> Tersisa</span>
                </div>
                <div className="cp-ed-reg-v2__cap-bar">
                  <div className="cp-ed-reg-v2__cap-bar-fill" style={{ width: `${filled}%` }} />
                </div>
              </div>
              {event.memberOnly ? (
                <>
                  <Link href="/join-batch" className="cp-ed-reg-v2__btn">
                    Masuk sebagai Member untuk Daftar
                    <span style={{ fontFamily: "var(--mono)" }}>→</span>
                  </Link>
                  <div className="mt-2 rounded-lg border border-brand/20 bg-brand-soft/40 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                    Event ini <b className="text-foreground">khusus Member</b>. Daftar hanya via{" "}
                    <Link href="/member/dashboard" className="font-bold text-brand hover:underline">
                      Dashboard Member
                    </Link>{" "}
                    — 1 klik, data prefill otomatis. Belum jadi member?{" "}
                    <Link href="/join-batch" className="font-bold text-brand hover:underline">
                      Join Cohort →
                    </Link>
                  </div>
                </>
              ) : (
                <Link href={`/event/${event.slug}#daftar`} className="cp-ed-reg-v2__btn">
                  Daftarkan Saya — Gratis
                  <span style={{ fontFamily: "var(--mono)" }}>→</span>
                </Link>
              )}
              {event.memberOnly && (
                <Link href="/member/dashboard" className="cp-ed-reg-v2__btn2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Daftar di Dashboard (Member)
                </Link>
              )}
              {!event.memberOnly && (
                <button className="cp-ed-reg-v2__btn2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Tambah ke Kalender
                </button>
              )}
              <div className="cp-ed-reg-v2__features">
                {event.benefits?.map((ft: string, i: number) => (
                  <div className="cp-ed-reg-v2__ft" key={i}>{ft}</div>
                ))}
              </div>
            </div>

            <div className="cp-ed-share-v2">
              <span className="cp-ed-share-v2__lbl">Bagikan</span>
              <div className="cp-ed-share-v2__icons">
                <button aria-label="Twitter">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2H21.5l-7.39 8.443L23 22h-6.797l-5.317-6.91L4.8 22H1.546l7.91-9.029L1 2h6.965l4.806 6.349L18.244 2z" />
                  </svg>
                </button>
                <button aria-label="LinkedIn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                  </svg>
                </button>
                <button aria-label="WhatsApp">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.6 6.32A8 8 0 003.93 14l-1.13 4.13 4.24-1.11A8 8 0 1017.6 6.32zM12 18.53a6.66 6.66 0 01-3.4-.93l-.24-.15-2.51.66.67-2.45-.16-.25A6.65 6.65 0 1118.65 12 6.65 6.65 0 0112 18.53z" />
                  </svg>
                </button>
                <button aria-label="Copy link">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 007.07 0l3-3a5 5 0 00-7.07-7.07L11 5" />
                    <path d="M14 11a5 5 0 00-7.07 0l-3 3a5 5 0 007.07 7.07L13 19" />
                  </svg>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function EventCTA() {
  return (
    <section className="cp-ed-related-v2">
      <div className="cp-ed-related-v2__grid" aria-hidden="true" />
      <div className="cp-ed-related-v2__orbit" aria-hidden="true" />
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="cp-ed-related-v2__inner">
          <div className="cp-ed-related-v2__head">
            <h2>Acara <span>serupa</span>.</h2>
            <Link href="/event" className="cp-cta-final__btn cp-cta-final__btn--line">Semua agenda →</Link>
          </div>
          <div className="cp-ed-related-v2-grid">
            <EventCard slug="editor-roundtable-q1-q2" title="Editor Roundtable: Strategi Memilih Jurnal Q1–Q2" type="Webinar" date="24 Juni 2025 · 19.30 WIB" location="Daring · Webinar" />
            <EventCard slug="workshop-academic-writing-anchor-sentences" title="Workshop Luring: Academic Writing dengan Anchor Sentences" type="Workshop" date="08 Juli 2025 · 09.00 WIB" location="Luring · Yogyakarta" />
            <EventCard slug="doctoral-forum-jejaring-internasional" title="Doctoral Forum: Membangun Jejaring Internasional Sejak S3" type="Forum" date="22 Juli 2025 · 19.30 WIB" location="Hybrid · Jakarta" />
          </div>
        </div>
      </div>
    </section>
  );
}

function EventCard({ slug, title, type, date, location }: { slug: string; title: string; type: string; date: string; location: string }) {
  return (
    <Link href={`/event/${slug}`} className="cp-ed-related-v2-card">
      <div className="cp-ed-related-v2-card__shine" aria-hidden="true" />
      <div className="cp-ed-related-v2-card__top">
        <div className="cp-ed-related-v2-card__dot-row">
          <span className="type">{type}</span>
          <span className="date">{date}</span>
        </div>
        <div className="cp-ed-related-v2-card__bars" aria-hidden="true">
          <div className="cp-ed-related-v2-card__bar" />
          <div className="cp-ed-related-v2-card__bar" />
          <div className="cp-ed-related-v2-card__bar" />
          <div className="cp-ed-related-v2-card__bar" />
          <div className="cp-ed-related-v2-card__bar" />
        </div>
        <h4>{title}</h4>
      </div>
      <div className="cp-ed-related-v2-card__bottom">
        <div className="where">{location}</div>
        <div className="cp-ed-related-v2-card__cta">
          Lihat Detail
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
