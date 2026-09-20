import Link from "next/link";
import { getOpenBatches, getBatchById } from "@/lib/data/batches";
import { JoinBatchForm } from "@/components/forms/JoinBatchForm";

export default async function JoinBatchPage({ searchParams }: { searchParams: Promise<{ batchId?: string }> }) {
  const { batchId } = await searchParams;
  const openBatches = await getOpenBatches();

  // Jika ?batchId ada & valid & open → pakai itu. Jika tidak, pakai pertama atau null.
  const selectedBatch = batchId ? await getBatchById(batchId) : null;
  const isValidSelection = selectedBatch && selectedBatch.status === "open";
  const batch = isValidSelection ? selectedBatch : openBatches[0] ?? null;
  const showSelector = !isValidSelection && openBatches.length > 1;
  const isOpen = batch ? batch.status === "open" : false;
  const fillPercent = batch ? Math.round(((batch.seatsTotal - batch.seatsRemaining) / batch.seatsTotal) * 100) : 0;

  return (
    <>
      {/* Hero */}
      <section className="cp-jb-hero">
        <div className="cp-jb-hero__bg">
          <div className="cp-jb-hero__orb cp-jb-hero__orb--a" />
          <div className="cp-jb-hero__orb cp-jb-hero__orb--b" />
          <div className="cp-jb-hero__dots" />
          <div className="cp-jb-hero__vignette" />
        </div>

        <div className="cp-jb-hero__inner">
          <div className="cp-jb-hero__top">
            <div className="cp-jb-hero__eyebrow">
              <span className="cp-jb-hero__pulse" />
              <span>{isOpen ? "Batch Keanggotaan Terbuka" : "Batch Ditutup"}</span>
            </div>
          </div>

          <h1 className="cp-jb-hero__title">
            Gabung Batch
            {batch && <span className="cp-jb-hero__accent"> #{batch.number}</span>}
          </h1>
          <p className="cp-jb-hero__lead">
            {isOpen && batch
              ? `Pendaftaran Batch #${batch.number} sedang dibuka. Kirim profil Anda untuk kurasi — dan percepat output riset bersama komunitas terkurasi.`
              : "Pendaftaran batch saat ini ditutup. Ikuti kanal kami untuk info pembukaan batch berikutnya."}
          </p>

          {isOpen && batch && (
            <div className="cp-jb-stats">
              <div className="cp-jb-stat">
                <span className="cp-jb-stat__num">{batch.seatsRemaining}</span>
                <span className="cp-jb-stat__lbl">Kursi Tersisa</span>
              </div>
              <div className="cp-jb-stat">
                <span className="cp-jb-stat__num">{batch.seatsTotal}</span>
                <span className="cp-jb-stat__lbl">Total Kursi</span>
              </div>
              <div className="cp-jb-stat cp-jb-stat--bar">
                <div className="cp-jb-stat__track">
                  <div className="cp-jb-stat__fill" style={{ width: `${fillPercent}%` }} />
                </div>
                <span className="cp-jb-stat__lbl">{fillPercent}% Terisi</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Multi-batch selector — jika ada beberapa batch Open & tanpa ?batchId valid */}
      {isOpen && showSelector && (
        <section className="cp-jb-section">
          <div className="cp-jb-section__inner">
            <h2 className="cp-jb-header__title text-lg">Pilih Batch Keanggotaan</h2>
            <p className="cp-jb-header__desc">Pilih batch yang ingin Anda ikuti. Anda akan diarahkan ke formulir batch tersebut.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {openBatches.map((b) => {
                const pct = Math.round(((b.seatsTotal - b.seatsRemaining) / b.seatsTotal) * 100);
                return (
                  <Link
                    key={b.id}
                    href={`/join-batch?batchId=${b.id}`}
                    className="rounded-2xl border border-border bg-card p-5 transition hover:border-brand hover:shadow-md"
                  >
                    <div className="font-mono text-xs font-bold tracking-[0.08em] text-brand">BATCH #{b.number} · Terbuka</div>
                    <div className="mt-1 text-sm font-bold text-foreground">{b.id} — {b.seatsRemaining}/{b.seatsTotal} kursi</div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">{pct}% terisi · Tutup {new Date(b.closeDate).toLocaleDateString("id-ID")}</div>
                    <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-brand">Pilih batch ini →</div>
                  </Link>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Sudah tahu batch? Buka langsung <span className="font-mono">/join-batch?batchId=BAT-ID</span> — mis. dari Event detail.</p>
          </div>
        </section>
      )}

      {/* Form section — hanya jika batch terpilih valid */}
      {isOpen && batch && !showSelector && (
        <section className="cp-jb-section">
          <div className="cp-jb-section__inner">
            <div className="cp-jb-header">
              <div className="cp-jb-header__tag">
                <span className="cp-jb-header__bar" />
                Formulir Pendaftaran
              </div>
              <h2 className="cp-jb-header__title">Kirim Profil Anda</h2>
              <p className="cp-jb-header__desc">
                Lengkapi 4 langkah di bawah. Dewan Kurasi akan meninjau dalam 10 hari kerja. Batch terpilih:{" "}
                <b className="font-mono text-foreground">Batch #{batch.number} ({batch.id})</b> — {batch.seatsRemaining} kursi tersisa.
              </p>
            </div>
            <JoinBatchForm batchId={batch.id} batchNumber={batch.number} />
          </div>
        </section>
      )}

      {/* Closed state */}
      {!isOpen && (
        <section className="cp-jb-section cp-jb-section--closed">
          <div className="cp-jb-section__inner">
            <div className="cp-jb-closed">
              <div className="cp-jb-closed__icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M15 9l-6 6M9 9l6 6" />
                </svg>
              </div>
              <h2 className="cp-jb-closed__title">Pendaftaran Ditutup</h2>
              <p className="cp-jb-closed__desc">
                {batch ? `Batch #${batch.number} telah penuh atau periode pendaftaran berakhir.` : "Tidak ada batch yang sedang dibuka saat ini."} Ikuti kanal kami untuk info batch berikutnya.
              </p>
              {openBatches.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {openBatches.map((b) => (
                    <Link key={b.id} href={`/join-batch?batchId=${b.id}`} className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:border-brand">Batch #{b.number} →</Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
