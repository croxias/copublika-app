'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CalendarClock, CheckCircle2, ChevronDown, FileText, Inbox, Send, Star, XCircle } from 'lucide-react';
import { useCms } from '@/lib/cms/store';
import { BLOG_CATEGORY_OPTIONS, isLivePick } from '@/lib/cms/config/blog';
import { EDITORS_PICK_MAX } from '@/lib/content/blog';
import { historyOf, inAdminTable, inQueue, isWriterArticle, reviewOf } from '@/lib/cms/review';
import { Count, Kpi } from './ProgramOverview';
import { formatDate } from './ui';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Summary above Artikel Blog: what is live, what is scheduled next, how the archive spreads
 * over categories, and how many editor's-pick slots are taken.
 */
export function BlogOverview() {
  const cms = useCms();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(true);
  // Read the clock once per mount so render stays pure.
  const [now] = useState(() => Date.now());
  // Writer drafts stay private; they count only once submitted (as "menunggu review").
  const items = (cms.collections.blog ?? []).filter(inAdminTable);
  const waiting = (cms.collections.blog ?? []).filter(inQueue).length;
  // Writer pipeline: everything that reached an editor at least once.
  const submissions = (cms.collections.blog ?? []).filter((x) => isWriterArticle(x) && historyOf(x).some((e) => e.action === 'submitted' || e.action === 'resubmitted'));
  const approved = submissions.filter((x) => reviewOf(x) === 'approved').length;
  const rejected = submissions.filter((x) => reviewOf(x) === 'rejected').length;
  const revising = submissions.filter((x) => reviewOf(x) === 'changes').length;
  const decided = approved + rejected;

  const published = items.filter((x) => x.status === 'published');
  const scheduled = items.filter((x) => x.status === 'scheduled');
  const drafts = items.filter((x) => x.status === 'draft');
  const next = scheduled
    .map((x) => ({ x, t: new Date(String(x.publishAt ?? '')).getTime() }))
    .filter((s) => s.t >= now)
    .sort((a, b) => a.t - b.t)[0];
  const picks = items.filter(isLivePick);
  const byCategory = BLOG_CATEGORY_OPTIONS.map((c) => ({ ...c, n: published.filter((x) => x.category === c.value).length }));

  return (
    <section className="pov bov" aria-label="Ringkasan blog">
      <header className="pov-head">
        <div>
          <span className="pov-k">Ringkasan blog</span>
          <p>Dari artikel yang tersimpan. Teks halaman /blog diatur di Konfigurasi Website Publik → Halaman Blog.</p>
        </div>
        <button type="button" className="cms-btn cms-btn--ghost cms-btn--sm" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? 'Sembunyikan' : 'Tampilkan'} <ChevronDown size={14} className={`pov-caret ${open ? 'is-open' : ''}`} />
        </button>
      </header>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="pov-body"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE }}
          >
            <div className="pov-kpis">
              <Kpi icon={<FileText size={16} />} label="Artikel terbit">
                <strong><Count value={published.length} /></strong>
                <small>{drafts.length} draft{waiting ? ` · ${waiting} menunggu review` : ''}</small>
              </Kpi>
              <Kpi icon={<CalendarClock size={16} />} label="Artikel terjadwal" delay={0.05}>
                <strong><Count value={scheduled.length} /></strong>
                <small>{next ? `Berikutnya ${formatDate(String(next.x.publishAt), true)}` : 'Belum ada artikel yang dijadwalkan'}</small>
              </Kpi>
              <Kpi icon={<Star size={16} />} label="Slot Pilihan editor" delay={0.1}>
                <strong><Count value={picks.length} /><small className="bov-of">/{EDITORS_PICK_MAX}</small></strong>
                <span className="bov-slots" aria-hidden="true">
                  {Array.from({ length: EDITORS_PICK_MAX }, (_, i) => (
                    <motion.i key={i} className={i < picks.length ? 'is-on' : ''} initial={reduce ? false : { scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3, delay: 0.15 + i * 0.04 }} />
                  ))}
                </span>
              </Kpi>
            </div>

            <div className="bov-flow">
              <span className="pov-list__head">Pengajuan penulis</span>
              <div className="pov-kpis bov-kpis">
                <Kpi icon={<Send size={16} />} label="Pengajuan masuk">
                  <strong><Count value={submissions.length} /></strong>
                  <small>naskah dari Ruang Penulis</small>
                </Kpi>
                <Kpi icon={<Inbox size={16} />} label="Menunggu review" delay={0.05}>
                  <strong className={waiting ? 'bov-hot' : ''}><Count value={waiting} /></strong>
                  <small>{revising} sedang direvisi penulis</small>
                </Kpi>
                <Kpi icon={<CheckCircle2 size={16} />} label="Disetujui" delay={0.1}>
                  <strong className="bov-ok"><Count value={approved} /></strong>
                  <small>{decided ? `${Math.round((approved / decided) * 100)}% dari yang sudah diputuskan` : 'Belum ada keputusan'}</small>
                </Kpi>
                <Kpi icon={<XCircle size={16} />} label="Ditolak" delay={0.15}>
                  <strong className="bov-no"><Count value={rejected} /></strong>
                  <small>{decided ? `${Math.round((rejected / decided) * 100)}% dari yang sudah diputuskan` : 'Belum ada keputusan'}</small>
                </Kpi>
              </div>
            </div>

            <div className="bov-mix">
              <div className="bov-mix__head">
                <span className="pov-list__head">Artikel terbit per kategori</span>
                <span className="bov-mix__total">{published.length} artikel</span>
              </div>
              <div className="bov-mix__bar" role="img" aria-label={byCategory.map((c) => `${c.label} ${c.n}`).join(', ')}>
                {byCategory.filter((c) => c.n > 0).map((c, i) => (
                  <motion.i
                    key={c.value}
                    className={`is-${i % 5}`}
                    title={`${c.label}: ${c.n}`}
                    initial={reduce ? false : { flexGrow: 0 }}
                    animate={{ flexGrow: c.n }}
                    transition={{ duration: 0.7, delay: i * 0.05, ease: EASE }}
                  />
                ))}
              </div>
              <ul className="bov-mix__legend">
                {byCategory.map((c) => (
                  <li key={c.value} className={c.n ? '' : 'is-zero'}>
                    <i className={`is-${byCategory.filter((x) => x.n > 0).findIndex((x) => x.value === c.value) % 5}`} aria-hidden="true" />
                    <span>{c.label}</span>
                    <b>{c.n}</b>
                    <small>{published.length ? Math.round((c.n / published.length) * 100) : 0}%</small>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
