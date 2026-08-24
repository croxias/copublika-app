import { getActiveBatch } from "@/lib/data/batches";
import { JoinBatchForm } from "@/components/forms/JoinBatchForm";

export default async function JoinBatchPage() {
  const batch = await getActiveBatch();
  const isOpen = batch.status === "open";
  const fillPercent = Math.round(((batch.seatsTotal - batch.seatsRemaining) / batch.seatsTotal) * 100);

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
              <span>{isOpen ? "Batch Open" : "Batch Closed"}</span>
            </div>
          </div>

          <h1 className="cp-jb-hero__title">
            Join Batch
            <span className="cp-jb-hero__accent"> #{batch.number}</span>
          </h1>
          <p className="cp-jb-hero__lead">
            {isOpen
              ? `Applications are now open for Batch #${batch.number}. Submit your profile for curation and accelerate your research output with a curated community.`
              : "Batch applications are currently closed. Follow us for announcements about the next opening."}
          </p>

          {isOpen && (
            <div className="cp-jb-stats">
              <div className="cp-jb-stat">
                <span className="cp-jb-stat__num">{batch.seatsRemaining}</span>
                <span className="cp-jb-stat__lbl">Seats Left</span>
              </div>
              <div className="cp-jb-stat">
                <span className="cp-jb-stat__num">{batch.seatsTotal}</span>
                <span className="cp-jb-stat__lbl">Total Seats</span>
              </div>
              <div className="cp-jb-stat cp-jb-stat--bar">
                <div className="cp-jb-stat__track">
                  <div className="cp-jb-stat__fill" style={{ width: `${fillPercent}%` }} />
                </div>
                <span className="cp-jb-stat__lbl">{fillPercent}% Filled</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Form section */}
      {isOpen && (
        <section className="cp-jb-section">
          <div className="cp-jb-section__inner">
            <div className="cp-jb-header">
              <div className="cp-jb-header__tag">
                <span className="cp-jb-header__bar" />
                <span className="cp-jb-header__num">01</span>
                Application
              </div>
              <h2 className="cp-jb-header__title">Submit Your Profile</h2>
              <p className="cp-jb-header__desc">
                Complete the form below in 4 simple steps. The Curation Council will review your application within 10 working days.
              </p>
            </div>
            <JoinBatchForm />
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
              <h2 className="cp-jb-closed__title">Applications Closed</h2>
              <p className="cp-jb-closed__desc">
                Batch #{batch.number} has reached capacity or the application window has ended. 
                Follow our channels to get notified when the next batch opens.
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
