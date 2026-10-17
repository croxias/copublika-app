'use client';

import { useEffect, useState, type PointerEvent, type ReactNode } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import {
  BadgeCheck, CalendarCheck2, CalendarClock, Check, CreditCard, Download, Hash, Images, Layers, Loader2, MousePointerClick, Stamp, UserRound,
} from 'lucide-react';
import { SOURCE_LABEL, memberState, type MemberSource } from '@/lib/cms/members';
import { ROLE_LABEL } from '@/lib/cms/signups';
import type { CmsItem } from '@/lib/cms/types';
import { cardData, downloadCard, periodMonths, renderCard, type CardSide } from '@/lib/member-card';
import { useCms } from '@/lib/cms/store';
import { Drawer, formatDate } from './ui';
import { useRegistrationSettings } from './useRegistrationSettings';

type Pick = CardSide | 'both';
const EASE = [0.22, 1, 0.36, 1] as const;
const OPTIONS: { value: Pick; label: string; hint: string; icon: ReactNode }[] = [
  { value: 'both', label: 'Depan & belakang', hint: '1 lembar · 2248 × 2888 px', icon: <Images size={17} /> },
  { value: 'front', label: 'Tampak depan', hint: 'PNG · 2024 × 1276 px', icon: <CreditCard size={17} /> },
  { value: 'back', label: 'Tampak belakang', hint: 'PNG · 2024 × 1276 px', icon: <Layers size={17} /> },
];
const PICK_LABEL: Record<Pick, string> = { both: 'depan & belakang', front: 'tampak depan', back: 'tampak belakang' };
const initials = (n: string) => n.replace(/^(dr|prof|ir)\.?\s+/gi, '').split(/[\s,]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

/** Anggota → ID Card Detail: the member card (front and back) with PNG downloads for the admin. */
export function MemberCardDialog({ item, now, onClose, onDownloaded }: { item: CmsItem; now: number; onClose: () => void; onDownloaded: (which: string) => void }) {
  const cms = useCms();
  const reduce = useReducedMotion();
  const [side, setSide] = useState<CardSide>('front');
  const [src, setSrc] = useState<Record<CardSide, string>>({ front: '', back: '' });
  const [pick, setPick] = useState<Pick>('both');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<Pick | null>(null);
  const settings = useRegistrationSettings();
  const data = cardData(item, { email: settings.helpEmail, phone: settings.helpPhone });
  const key = `${data.name}|${data.number}|${data.since}|${data.validThru}|${data.helpEmail}|${data.helpPhone}`;
  const s = memberState(item, now, settings.expiringDays);
  const months = periodMonths(item);

  useEffect(() => {
    let live = true;
    Promise.all([renderCard(data, 'front', 1.5), renderCard(data, 'back', 1.5)]).then(([f, b]) => {
      if (live) setSrc({ front: f.toDataURL('image/png'), back: b.toDataURL('image/png') });
    });
    return () => { live = false; };
    // Re-render only when what is printed on the card changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // A light 3D tilt that follows the pointer.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const tiltX = useSpring(useTransform(py, [-0.5, 0.5], [6, -6]), { stiffness: 180, damping: 18 });
  const tiltY = useSpring(useTransform(px, [-0.5, 0.5], [-8, 8]), { stiffness: 180, damping: 18 });
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { px.set(0); py.set(0); };

  const get = async (which: Pick) => {
    setBusy(true);
    setDone(null);
    await downloadCard(data, which);
    setBusy(false);
    setDone(which);
    setTimeout(() => setDone((d) => (d === which ? null : d)), 2200);
    onDownloaded(PICK_LABEL[which]);
    cms.toast(`Kartu ${PICK_LABEL[which]} diunduh.`);
  };

  const facts: { icon: ReactNode; label: string; value: string; mono?: boolean }[] = [
    { icon: <Hash size={15} />, label: 'Nomor kartu', value: data.number, mono: true },
    { icon: <CalendarCheck2 size={15} />, label: 'Member sejak', value: item.activatedAt ? formatDate(String(item.activatedAt)) : '—' },
    { icon: <CalendarClock size={15} />, label: 'Berlaku s.d.', value: item.expiresAt ? formatDate(String(item.expiresAt)) : '—' },
    { icon: <BadgeCheck size={15} />, label: 'Keanggotaan', value: `${SOURCE_LABEL[item.source as MemberSource] ?? '—'} · ${months} bulan` },
    { icon: <Stamp size={15} />, label: 'Diterbitkan', value: item.cardIssuedAt ? formatDate(String(item.cardIssuedAt), true) : '—' },
  ];

  return (
    <Drawer
      open
      size="center"
      title="ID Card Detail"
      subtitle={`${String(item.name)} · ${data.number}`}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="cms-btn cms-btn--ghost" onClick={onClose}>Tutup</button>
          <div className="cms-drawer-foot-right">
            <span className="mcd-foot-hint">{OPTIONS.find((o) => o.value === pick)?.label} · PNG</span>
            <button type="button" className="cms-btn cms-btn--solid mcd-get" onClick={() => get(pick)} disabled={busy}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={busy ? 'busy' : done === pick ? 'done' : 'idle'} className="mcd-get__ico" initial={reduce ? false : { opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ duration: 0.18 }}>
                  {busy ? <Loader2 size={15} className="mcd-spin" /> : done === pick ? <Check size={15} /> : <Download size={15} />}
                </motion.span>
              </AnimatePresence>
              {done === pick ? 'Terunduh' : 'Unduh kartu'}
            </button>
          </div>
        </>
      }
    >
      <div className="mcd">
        <section className="mcd-stage" aria-label="Kartu member">
          <header className="mcd-stage__top">
            <span className="mcd-live"><i aria-hidden="true" /> Kartu aktif</span>
            <div className="mcd-tabs" role="tablist" aria-label="Sisi kartu">
              {(['front', 'back'] as CardSide[]).map((v) => (
                <button type="button" role="tab" key={v} aria-selected={side === v} onClick={() => setSide(v)}>
                  {side === v && <motion.span layoutId="mcd-pill" className="mcd-tabs__pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                  <span className="mcd-tabs__text">{v === 'front' ? 'Tampak depan' : 'Tampak belakang'}</span>
                </button>
              ))}
            </div>
            <span className="mcd-no">{data.number}</span>
          </header>

          <div className="mcd-tilt" onPointerMove={onMove} onPointerLeave={onLeave}>
            <motion.div className="mcd-tilt__inner" style={reduce ? undefined : { rotateX: tiltX, rotateY: tiltY }}>
              <motion.button
                type="button"
                className="mcd-card"
                onClick={() => setSide((v) => (v === 'front' ? 'back' : 'front'))}
                animate={{ rotateY: side === 'back' ? 180 : 0 }}
                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 17, mass: 0.9 }}
                aria-label={`Balik kartu, sekarang ${side === 'front' ? 'tampak depan' : 'tampak belakang'}`}
              >
                <span className="mcd-face is-front">
                  {/* Canvas output (data URL), so next/image does not apply. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {src.front ? <img src={src.front} alt={`Kartu member ${data.name}, tampak depan`} draggable={false} /> : <span className="mcd-load"><Loader2 size={20} /></span>}
                </span>
                <span className="mcd-face is-back">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {src.back ? <img src={src.back} alt={`Kartu member ${data.name}, tampak belakang`} draggable={false} /> : <span className="mcd-load"><Loader2 size={20} /></span>}
                </span>
              </motion.button>
            </motion.div>
          </div>

          <div className="mcd-thumbs">
            {(['front', 'back'] as CardSide[]).map((v) => (
              <button type="button" key={v} className={side === v ? 'is-on' : ''} onClick={() => setSide(v)} aria-label={v === 'front' ? 'Lihat tampak depan' : 'Lihat tampak belakang'}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {src[v] ? <img src={src[v]} alt="" draggable={false} /> : <span className="mcd-thumbs__ph" />}
                <span>{v === 'front' ? 'Depan' : 'Belakang'}</span>
              </button>
            ))}
          </div>
          <p className="mcd-tip"><MousePointerClick size={14} aria-hidden="true" /> Klik kartu atau tekan Spasi untuk membalik</p>
        </section>

        <aside className="mcd-side">
          <motion.section className="rvd-card mcd-holder" initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }}>
            <div className="mcd-holder__who">
              <span className="mcd-holder__av" aria-hidden="true">{initials(String(item.name)) || <UserRound size={18} />}</span>
              <div>
                <b>{data.name}</b>
                <small>{[ROLE_LABEL[String(item.role)], item.institution].filter(Boolean).map(String).join(' · ') || 'Member CoPublika'}</small>
              </div>
              <span className={`cms-badge cms-badge--${s.tone}`}>{s.label}</span>
            </div>
            <div className="mcd-valid">
              <div className="mcd-valid__row"><span>Masa berlaku kartu</span><b>{s.daysLeft !== null ? `${s.daysLeft} hari lagi` : '—'}</b></div>
              <span className="mcd-valid__bar" aria-hidden="true"><motion.i initial={{ scaleX: 0 }} animate={{ scaleX: s.share }} transition={{ duration: reduce ? 0 : 0.9, ease: EASE, delay: 0.15 }} /></span>
            </div>
          </motion.section>

          <motion.section className="rvd-card mcd-facts" initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE, delay: 0.05 }}>
            <span className="rvd-k">Data kartu</span>
            <ul>
              {facts.map((f) => (
                <li key={f.label}>
                  <span className="mcd-facts__ico" aria-hidden="true">{f.icon}</span>
                  <span className="mcd-facts__label">{f.label}</span>
                  <b className={f.mono ? 'is-mono' : ''}>{f.value}</b>
                </li>
              ))}
            </ul>
          </motion.section>

          <motion.section className="rvd-card mcd-dl" initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE, delay: 0.1 }}>
            <span className="rvd-k"><Download size={13} aria-hidden="true" /> Unduh kartu</span>
            <div className="mcd-opts" role="radiogroup" aria-label="Pilihan unduhan">
              {OPTIONS.map((o) => (
                <button type="button" role="radio" key={o.value} aria-checked={pick === o.value} onClick={() => setPick(o.value)} onDoubleClick={() => get(o.value)}>
                  <span className="mcd-opts__ico" aria-hidden="true">{o.icon}</span>
                  <span className="mcd-opts__text"><b>{o.label}</b><small>{o.hint}</small></span>
                  <span className="mcd-opts__dot" aria-hidden="true">{pick === o.value && <motion.i layoutId="mcd-opt" transition={{ type: 'spring', stiffness: 500, damping: 32 }} />}</span>
                </button>
              ))}
            </div>
            <p className="mcd-dl__note">Ukuran kartu standar 85,6 × 54 mm, siap cetak atau dibagikan ke member.</p>
          </motion.section>

        </aside>
      </div>
    </Drawer>
  );
}
