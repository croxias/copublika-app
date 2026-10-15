"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarDays, Info, Sparkles, X } from "lucide-react";
import { SEATS_PER_MENTOR, STS_MENTORS, seatMonths, seatsLeft, type Mentor } from "@/lib/data/programs";

const EASE = [0.22, 1, 0.36, 1] as const;
const registerHref = (mentorId: string, month: string) => `/daftar?program=siap-tembus-scopus&mentor=${mentorId}&bulan=${month}`;

/**
 * Mentor cards for Siap Tembus Scopus 1-on-1. Each mentor takes four participants a month;
 * the bars show how many seats are still open for the chosen month.
 */
export function MentorPicker() {
  const reduce = useReducedMotion();
  const months = useMemo(() => seatMonths(), []);
  const [m, setM] = useState(0);
  const [detail, setDetail] = useState<Mentor | null>(null);

  const open = STS_MENTORS.reduce((n, x) => n + seatsLeft(x.id, m), 0);
  const total = STS_MENTORS.length * SEATS_PER_MENTOR;

  return (
    <div className="cp-pg-mentors">
      <div className="cp-pg-mentors__bar">
        <div className="cp-pg-months" role="group" aria-label="Bulan pendampingan">
          {months.map((month, i) => (
            <button key={month.key} type="button" aria-pressed={m === i} className={m === i ? "is-active" : ""} onClick={() => setM(i)}>
              <CalendarDays size={15} aria-hidden="true" />
              {month.label}
              <small>{i === 0 ? "Bulan ini" : "Bulan depan"}</small>
            </button>
          ))}
        </div>
        <div className="cp-pg-mentors__sum" aria-live="polite">
          <div className="cp-pg-mentors__meter" aria-hidden="true"><i style={{ width: `${(open / total) * 100}%` }} /></div>
          <span><strong>{open}</strong> dari {total} kursi tersedia · {months[m].label}</span>
        </div>
      </div>

      <div className="cp-pg-mentor-grid">
        {STS_MENTORS.map((mentor, idx) => {
          const left = seatsLeft(mentor.id, m);
          const full = left === 0;
          return (
            <motion.article
              key={mentor.id}
              className={`cp-pg-mentor ${full ? "is-full" : ""} ${left === 1 ? "is-last" : ""}`}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: (idx % 3) * 0.08, ease: EASE }}
            >
              {left === 1 && <span className="cp-pg-mentor__flag"><Sparkles size={12} aria-hidden="true" /> Kursi terakhir</span>}
              <div className="cp-pg-mentor__top">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={mentor.photo} alt="" className="cp-pg-mentor__photo" loading="lazy" />
                <div>
                  <h3>{mentor.name}</h3>
                  <p>{mentor.affiliation}</p>
                </div>
              </div>
              <span className="cp-pg-mentor__field">{mentor.expertise}</span>
              {mentor.topics && (
                <ul className="cp-pg-mentor__topics">
                  {mentor.topics.slice(0, 3).map((t) => <li key={t}>{t}</li>)}
                </ul>
              )}
              <div className="cp-pg-seats" aria-label={`${left} dari ${SEATS_PER_MENTOR} kursi tersisa`}>
                <span className="cp-pg-seats__dots" aria-hidden="true">
                  {Array.from({ length: SEATS_PER_MENTOR }, (_, i) => (
                    <i key={i} className={i < SEATS_PER_MENTOR - left ? "is-taken" : ""} />
                  ))}
                </span>
                <span className="cp-pg-seats__text">{full ? "Penuh" : `${left} kursi tersisa`}</span>
              </div>
              <div className="cp-pg-mentor__actions">
                <button type="button" className="cp-pg-mentor__detail" onClick={() => setDetail(mentor)}>
                  <Info size={15} aria-hidden="true" /> Detail mentor
                </button>
                {full ? (
                  m === 0 ? (
                    <button type="button" className="cp-pg-mentor__btn is-ghost" onClick={() => setM(1)}>
                      Lihat {months[1].label.split(" ")[0]}
                    </button>
                  ) : (
                    <span className="cp-pg-mentor__btn is-disabled">Penuh</span>
                  )
                ) : (
                  <Link href={registerHref(mentor.id, months[m].key)} className="cp-pg-mentor__btn">
                    Pilih <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>

      <Dialog.Root open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="cp-md-overlay" />
          <Dialog.Content className="cp-md">
            {detail && (
              <>
                <div className="cp-md__head">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={detail.photo} alt="" />
                  <div>
                    <span className="cp-md__badge">{detail.badge}</span>
                    <Dialog.Title className="cp-md__name">{detail.name}</Dialog.Title>
                    <Dialog.Description className="cp-md__aff">{detail.affiliation}</Dialog.Description>
                  </div>
                  <Dialog.Close className="cp-md__close" aria-label="Tutup"><X size={18} /></Dialog.Close>
                </div>

                <div className="cp-md__body">
                  <div className="cp-md__chips">
                    <span>{detail.expertise}</span>
                    {detail.metric && <span>{detail.metric}</span>}
                  </div>
                  {detail.bio && <p className="cp-md__bio">{detail.bio}</p>}
                  {detail.topics && (
                    <div className="cp-md__block">
                      <h4>Topik pendampingan</h4>
                      <ul className="cp-pg-mentor__topics">{detail.topics.map((t) => <li key={t}>{t}</li>)}</ul>
                    </div>
                  )}
                  <div className="cp-md__block">
                    <h4>Ketersediaan kursi</h4>
                    <div className="cp-md__months">
                      {months.map((month, i) => {
                        const left = seatsLeft(detail.id, i);
                        return (
                          <div key={month.key} className={left === 0 ? "is-full" : ""}>
                            <span>{month.label}</span>
                            <span className="cp-pg-seats__dots" aria-hidden="true">
                              {Array.from({ length: SEATS_PER_MENTOR }, (_, k) => <i key={k} className={k < SEATS_PER_MENTOR - left ? "is-taken" : ""} />)}
                            </span>
                            {left === 0 ? (
                              <em>Penuh</em>
                            ) : (
                              <Link href={registerHref(detail.id, month.key)} className="cp-md__pick">
                                Pilih · {left} kursi <ArrowRight size={14} aria-hidden="true" />
                              </Link>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
