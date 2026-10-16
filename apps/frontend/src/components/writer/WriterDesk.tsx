"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CircleAlert, Lock, MessageSquareWarning, PenLine, Plus, Send, Undo2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useCms, newId } from "@/lib/cms/store";
import { slugify } from "@/lib/cms/slug";
import { blogConfig, categoryLabel } from "@/lib/cms/config/blog";
import {
  REVIEW_STATES, WRITER_KEYS, historyOf, reviewOf, submitChecks, withEvent, type ReviewState,
} from "@/lib/cms/review";
import type { CmsItem, Field, FieldContext, Values } from "@/lib/cms/types";
import { Fields } from "@/components/admin/cms/Fields";
import { CmsSelect } from "@/components/admin/cms/CmsSelect";
import { ReviewBadge, ReviewTimeline } from "@/components/admin/cms/ReviewTimeline";
import { ConfirmDialog, formatDate, useUnsavedGuard } from "@/components/admin/cms/ui";
import { validate, wordCount, type Errors } from "@/components/admin/cms/validate";
import { CopublikaMark } from "@/components/brand/CopublikaMark";

const EASE = [0.22, 1, 0.36, 1] as const;
const DEMO_KEY = "copublika-writer-demo";

/** What a writer fills in: the article fields without slug, schedule, picks or SEO. */
const WRITER_FIELDS: Field[] = blogConfig.fields.filter((f) => f.type !== "heading" && (WRITER_KEYS as readonly string[]).includes(f.key));

const LOCKED: ReviewState[] = ["submitted", "approved", "rejected"];
const firstName = (name: string) => name.replace(/^(dr|prof)\.?\s+/i, "").split(/[\s,]+/)[0] ?? name;

/** Which writer is at the desk: the signed-in member whose email has writer access, or (staging) a picked demo writer. */
function useWriter(people: CmsItem[], articles: CmsItem[]) {
  const { data: session } = authClient.useSession();
  const writers = people.filter((p) => p.canWrite);
  const email = session?.user?.email?.toLowerCase();
  const signedIn = email ? writers.find((p) => String(p.email ?? "").toLowerCase() === email) : undefined;
  const [demoId, setDemoId] = useState("");
  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDemoId(window.localStorage.getItem(DEMO_KEY) ?? "");
    } catch {
      // Storage blocked: fall back to the first writer.
    }
  }, []);
  const pickDemo = (id: string) => {
    setDemoId(id);
    try {
      window.localStorage.setItem(DEMO_KEY, id);
    } catch {
      // Not persisted; fine for a demo.
    }
  };
  // Without a pick, start with the writer who has the most articles so the demo is not empty.
  const busiest = [...writers].sort((x, y) => articles.filter((a) => a.writerId === y.id).length - articles.filter((a) => a.writerId === x.id).length)[0];
  const demo = writers.find((p) => p.id === demoId) ?? busiest;
  return { writer: signedIn ?? demo, writers, signedIn: !!signedIn, sessionEmail: email, pickDemo };
}

export function WriterDesk() {
  const cms = useCms();
  const reduce = useReducedMotion();
  const people = cms.collections.people ?? [];
  const { writer, writers, signedIn, sessionEmail, pickDemo } = useWriter(people, cms.collections.blog ?? []);
  const [filter, setFilter] = useState<ReviewState | "all">("all");
  const [editing, setEditing] = useState<{ id: string | null; nonce: number } | null>(null);

  const mine = useMemo(
    () => (cms.collections.blog ?? []).filter((x) => writer && x.writerId === writer.id).sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt))),
    [cms.collections.blog, writer],
  );
  const count = (s: ReviewState) => mine.filter((x) => reviewOf(x) === s).length;
  const shown = filter === "all" ? mine : mine.filter((x) => reviewOf(x) === filter);
  const editItem = editing?.id ? mine.find((x) => x.id === editing.id) : undefined;

  const stats: { key: ReviewState; label: string }[] = [
    { key: "draft", label: "Draft" },
    { key: "submitted", label: "Menunggu review" },
    { key: "changes", label: "Perlu revisi" },
    { key: "approved", label: "Disetujui" },
  ];

  return (
    <div className="wr">
      {!signedIn && (
        <div className="wr-staging">
          <span className="wr-staging__dot" aria-hidden="true" />
          <p>
            <strong>Mode staging</strong> · {sessionEmail ? `Akun ${sessionEmail} belum punya akses penulis. ` : ""}Coba sebagai penulis demo:
          </p>
          {writers.length > 0 && (
            <CmsSelect
              aria-label="Penulis demo"
              size="sm"
              value={writer?.id ?? ""}
              onChange={(id) => { pickDemo(id); setEditing(null); }}
              options={writers.map((p) => ({ value: p.id, label: String(p.name ?? "") }))}
            />
          )}
        </div>
      )}

      <header className="wr-hero">
        <CopublikaMark className="wr-hero__mark" />
        <div className="cp-ab-wrap wr-hero__wrap">
          <div className="wr-hero__copy">
            <span className="wr-k"><i aria-hidden="true" /> Ruang Penulis</span>
            <h1>{writer ? <>Halo, {firstName(String(writer.name ?? ""))}.</> : "Ruang Penulis"}</h1>
            <p>Tulis, ajukan, dan pantau naskah blog Anda. Tim editor CoPublika membaca setiap naskah, memberi catatan, lalu menerbitkannya.</p>
          </div>
          {writer && (
            <dl className="wr-stats">
              {stats.map((s) => (
                <div key={s.key} className={s.key === "changes" && count("changes") ? "is-alert" : ""}>
                  <dt>{s.label}</dt>
                  <dd>{count(s.key)}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </header>

      <div className="cp-ab-wrap wr-body">
        {!writer ? (
          <div className="wr-locked">
            <Lock size={22} aria-hidden="true" />
            <h2>Akses menulis belum aktif</h2>
            <p>Ruang Penulis terbuka untuk mentor dan alumni yang diundang tim editor. Punya ide tulisan? Kirim outline Anda lebih dulu.</p>
            <Link href="/blog#tulis" className="cp-ab-btn cp-ab-btn--primary">Kirim outline <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            {editing ? (
              <motion.div key={`edit-${editing.nonce}`} initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: EASE }}>
                <WriterEditor writer={writer} item={editItem} onBack={() => setEditing(null)} onCreated={(id) => setEditing({ id, nonce: editing.nonce })} />
              </motion.div>
            ) : (
              <motion.div key="list" initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: EASE }}>
                <div className="wr-bar">
                  <div className="wr-chips" role="tablist" aria-label="Filter status">
                    <button type="button" role="tab" aria-selected={filter === "all"} onClick={() => setFilter("all")}>Semua <b>{mine.length}</b></button>
                    {REVIEW_STATES.map((s) => (
                      <button type="button" role="tab" key={s.value} aria-selected={filter === s.value} onClick={() => setFilter(s.value)}>
                        {s.label} <b>{count(s.value)}</b>
                      </button>
                    ))}
                  </div>
                  <button type="button" className="cp-ab-btn cp-ab-btn--primary wr-new" onClick={() => setEditing({ id: null, nonce: Date.now() })}>
                    <Plus size={16} aria-hidden="true" /> Tulisan baru
                  </button>
                </div>

                {shown.length ? (
                  <ul className="wr-list">
                    {shown.map((x, i) => (
                      <motion.li key={x.id} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.04, ease: EASE }}>
                        <WriterCard item={x} onOpen={() => setEditing({ id: x.id, nonce: Date.now() })} />
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <div className="wr-empty">
                    <PenLine size={22} aria-hidden="true" />
                    <p>{mine.length ? "Tidak ada tulisan dengan status ini." : "Belum ada tulisan. Mulai dari judul dan tiga poin utama; sisanya bisa menyusul."}</p>
                    {!mine.length && (
                      <button type="button" className="cp-ab-btn cp-ab-btn--primary" onClick={() => setEditing({ id: null, nonce: Date.now() })}>
                        <Plus size={16} aria-hidden="true" /> Mulai menulis
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

const CTA: Record<ReviewState, string> = {
  draft: "Lanjutkan menulis",
  submitted: "Lihat naskah",
  changes: "Baca catatan & revisi",
  approved: "Lihat naskah",
  rejected: "Lihat alasan",
};

function WriterCard({ item, onOpen }: { item: CmsItem; onOpen: () => void }) {
  const state = reviewOf(item);
  const lastNote = [...historyOf(item)].reverse().find((e) => e.by === "editor" && e.note);
  return (
    <article className={`wr-card is-${state}`}>
      <button type="button" className="wr-card__hit" onClick={onOpen} aria-label={`${CTA[state]}: ${String(item.title || "Tanpa judul")}`} />
      <span className="wr-card__thumb" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {item.cover ? <img src={String(item.cover)} alt="" /> : <PenLine size={18} />}
      </span>
      <div className="wr-card__main">
        <span className="wr-card__meta">
          <ReviewBadge item={item} />
          <small>{categoryLabel(item.category)} · {wordCount(String(item.content ?? ""))} kata · diperbarui {formatDate(String(item.updatedAt))}</small>
        </span>
        <strong>{String(item.title || "Tanpa judul")}</strong>
        {state === "changes" && lastNote?.note && (
          <p className="wr-card__note"><MessageSquareWarning size={14} aria-hidden="true" /> {lastNote.note}</p>
        )}
        {state === "rejected" && lastNote?.note && <p className="wr-card__note is-muted">{lastNote.note}</p>}
      </div>
      <span className="wr-card__cta">{CTA[state]} <ArrowRight size={15} aria-hidden="true" /></span>
    </article>
  );
}

function WriterEditor({ writer, item, onBack, onCreated }: { writer: CmsItem; item?: CmsItem; onBack: () => void; onCreated: (id: string) => void }) {
  const cms = useCms();
  const ctx: FieldContext = { sections: cms.sections, collections: cms.collections };
  const blank: Values = { title: "", category: "guide", excerpt: "", cover: "", coverAlt: "", content: "" };
  const [initial, setInitial] = useState(() => JSON.stringify(item ?? blank));
  const [values, setValues] = useState<Values>(() => item ?? blank);
  const [errors, setErrors] = useState<Errors>({});
  const [confirm, setConfirm] = useState<null | "submit" | "withdraw" | "leave">(null);

  const state = item ? reviewOf(item) : "draft";
  const locked = LOCKED.includes(state);
  const dirty = JSON.stringify(values) !== initial;
  useUnsavedGuard(dirty);
  const words = wordCount(String(values.content ?? ""));
  const checks = submitChecks(values, words);
  const ready = checks.every((c) => c.ok);
  const info = REVIEW_STATES.find((s) => s.value === state)!;
  const lastChanges = item ? [...historyOf(item)].reverse().find((e) => e.action === "changes") : undefined;
  const editorEdits = item ? historyOf(item).filter((e) => e.action === "edited") : [];

  /** Writes the current values; creates the article on its first save. */
  const persist = (extra?: (x: CmsItem) => CmsItem): CmsItem => {
    const name = String(writer.name ?? "");
    const base: CmsItem = item
      ? ({ ...item, ...values } as CmsItem)
      : withEvent(
          {
            ...blogConfig.defaults(),
            ...values,
            id: newId("blog"),
            status: "draft",
            order: Date.now(),
            updatedAt: new Date().toISOString(),
            writerId: writer.id,
            authorId: writer.id,
            author: name,
            review: "draft",
            round: 0,
            history: [],
          } as CmsItem,
          { by: "writer", name, action: "created" },
        );
    let next: CmsItem = {
      ...base,
      slug: String(base.slug || slugify(String(values.title ?? ""))),
      readTime: `${Math.max(1, Math.round(words / 200))} menit`,
      updatedAt: new Date().toISOString(),
    };
    if (extra) next = extra(next);
    cms.saveItem("blog", next);
    setInitial(JSON.stringify(values));
    if (!item) onCreated(next.id);
    return next;
  };

  const saveDraft = () => {
    if (!String(values.title ?? "").trim()) {
      setErrors({ title: "Isi judul dulu supaya draft bisa disimpan." });
      return;
    }
    setErrors({});
    persist();
    cms.toast("Draft disimpan.");
  };

  const submit = () => {
    const errs = validate(WRITER_FIELDS, values);
    setErrors(errs);
    if (Object.keys(errs).length || !ready) {
      cms.toast("Lengkapi naskah sebelum diajukan.", "error");
      setConfirm(null);
      return;
    }
    const resubmit = state === "changes";
    persist((x) => withEvent(x, { by: "writer", name: String(writer.name ?? ""), action: resubmit ? "resubmitted" : "submitted" }, { review: "submitted", round: Number(x.round ?? 0) + 1 }));
    setConfirm(null);
    cms.toast(resubmit ? "Revisi diajukan ulang ke editor." : "Naskah diajukan. Tim editor akan meninjaunya.");
  };

  const withdraw = () => {
    if (!item) return;
    cms.saveItem("blog", withEvent(item, { by: "writer", name: String(writer.name ?? ""), action: "withdrawn" }, { review: "draft" }));
    setConfirm(null);
    cms.toast("Pengajuan ditarik. Naskah kembali menjadi draft.");
  };

  const steps: { key: ReviewState; label: string }[] = [
    { key: "draft", label: "Menulis" },
    { key: "submitted", label: "Review editor" },
    { key: "approved", label: "Terbit" },
  ];
  const stepIndex = state === "approved" ? 2 : state === "submitted" ? 1 : state === "changes" ? 1 : state === "rejected" ? 1 : 0;

  return (
    <div className="wr-editor">
      <div className="wr-editor__top">
        <button type="button" className="wr-back" onClick={() => (dirty ? setConfirm("leave") : onBack())}>
          <span aria-hidden="true"><ArrowLeft size={16} /></span>
          Semua tulisan
        </button>
        <span className="wr-editor__status">
          {item ? <ReviewBadge item={item} /> : <span className="cms-badge cms-badge--muted">Belum disimpan</span>}
          {dirty && <small>Perubahan belum disimpan</small>}
        </span>
      </div>

      <div className="wr-editor__grid">
        <div className="wr-editor__form">
          {state === "changes" && lastChanges?.note && (
            <div className="wr-callout">
              <MessageSquareWarning size={18} aria-hidden="true" />
              <div>
                <strong>Catatan editor</strong>
                <p>{lastChanges.note}</p>
                <small>{formatDate(lastChanges.at, true)}</small>
              </div>
            </div>
          )}
          {editorEdits.length > 0 && (
            <p className="wr-edited"><PenLine size={14} aria-hidden="true" /> Editor menyunting: {[...new Set(editorEdits.flatMap((e) => e.fields ?? []))].join(", ")}. Periksa kembali bagian itu.</p>
          )}
          {locked && (
            <p className="wr-lockline"><Lock size={14} aria-hidden="true" /> {info.hint}</p>
          )}
          <fieldset disabled={locked} className="wr-fieldset">
            <Fields fields={WRITER_FIELDS} values={values} onChange={(v) => { setValues(v); if (Object.keys(errors).length) setErrors(validate(WRITER_FIELDS, v)); }} errors={errors} ctx={ctx} />
          </fieldset>
        </div>

        <aside className="wr-side">
          <section className="wr-panel">
            <span className="wr-panel__k">Status naskah</span>
            <ol className="wr-steps" aria-label="Tahap naskah">
              {steps.map((s, i) => (
                <li key={s.key} className={i < stepIndex ? "is-done" : i === stepIndex ? "is-now" : ""}>
                  <span>{i < stepIndex ? <Check size={12} /> : i + 1}</span>
                  {s.label}
                </li>
              ))}
            </ol>
            <p className="wr-panel__hint">{info.hint}</p>
          </section>

          {!locked && (
            <section className="wr-panel">
              <span className="wr-panel__k">Siap diajukan?</span>
              <ul className="wr-checks">
                {checks.map((c) => (
                  <li key={c.label} className={c.ok ? "is-ok" : ""}>
                    {c.ok ? <Check size={14} aria-hidden="true" /> : <CircleAlert size={14} aria-hidden="true" />} {c.label}
                  </li>
                ))}
              </ul>
              <div className="wr-actions">
                <button type="button" className="cms-btn cms-btn--ghost" onClick={saveDraft} disabled={!dirty && !!item}>Simpan draft</button>
                <button type="button" className="cms-btn cms-btn--solid" onClick={() => setConfirm("submit")} disabled={!ready}>
                  <Send size={14} aria-hidden="true" /> {state === "changes" ? "Ajukan ulang" : "Ajukan ke editor"}
                </button>
              </div>
            </section>
          )}

          {state === "submitted" && (
            <section className="wr-panel">
              <span className="wr-panel__k">Perlu mengubah sesuatu?</span>
              <p className="wr-panel__hint">Tarik pengajuan untuk menyunting lagi. Naskah keluar dari antrian editor sampai Anda mengajukannya kembali.</p>
              <button type="button" className="cms-btn cms-btn--ghost" onClick={() => setConfirm("withdraw")}><Undo2 size={14} aria-hidden="true" /> Tarik pengajuan</button>
            </section>
          )}

          {state === "approved" && item?.status === "published" && item.slug ? (
            <Link href={`/blog/${String(item.slug)}`} className="cp-ab-btn cp-ab-btn--primary wr-live" target="_blank">Lihat di Blog <ArrowRight size={16} aria-hidden="true" /></Link>
          ) : null}

          {item && (
            <section className="wr-panel">
              <span className="wr-panel__k">Riwayat</span>
              <ReviewTimeline item={item} />
            </section>
          )}
        </aside>
      </div>

      <ConfirmDialog
        open={confirm === "submit"}
        title={state === "changes" ? "Ajukan ulang ke editor?" : "Ajukan naskah ke editor?"}
        confirmLabel={state === "changes" ? "Ajukan ulang" : "Ajukan"}
        body={<p>Naskah dikunci selama ditinjau. Anda akan melihat keputusan dan catatan editor di halaman ini.</p>}
        onConfirm={submit}
        onCancel={() => setConfirm(null)}
      />
      <ConfirmDialog
        open={confirm === "withdraw"}
        title="Tarik pengajuan?"
        confirmLabel="Tarik pengajuan"
        body={<p>Naskah keluar dari antrian review dan kembali menjadi draft.</p>}
        onConfirm={withdraw}
        onCancel={() => setConfirm(null)}
      />
      <ConfirmDialog
        open={confirm === "leave"}
        danger
        title="Keluar tanpa menyimpan?"
        confirmLabel="Buang perubahan"
        body={<p>Perubahan yang belum disimpan akan hilang.</p>}
        onConfirm={() => { setConfirm(null); onBack(); }}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
