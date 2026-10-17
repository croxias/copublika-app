'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowUpRight, Award, BadgeCheck, Banknote, NotebookPen, Pencil, CalendarClock, Check, CircleAlert, Clock3, CreditCard, Gift, IdCard, Landmark, Mail, MessageCircle, Minus, Phone, Plus, RotateCcw, Save, Star, Timer, Trash2, Wallet,
} from 'lucide-react';
import { useCms } from '@/lib/cms/store';
import {
  DEFAULT_SETTINGS, OFFER_EDITORS, SETTINGS_KEY, TEMPLATE_VARS, accountText, fillTemplate, monthsText, primaryAccount, programPrices, settingsFrom,
  type BankAccount, type RegistrationSettings, type TemplateKey,
} from '@/lib/cms/registration-settings';
import { PROGRAMS, formatRupiah, type ProgramKey } from '@/lib/data/programs';
import { CmsSelect } from './CmsSelect';
import { ConfirmDialog, PageHeader, StagingNote } from './ui';

const EASE = [0.22, 1, 0.36, 1] as const;
const BANKS = ['BCA', 'Mandiri', 'BNI', 'BRI', 'BSI', 'CIMB Niaga', 'Permata', 'BTN', 'Bank Jago', 'SeaBank'];
const SECTIONS = [
  { id: 'harga', label: 'Harga & masa aktif', icon: <Banknote size={15} /> },
  { id: 'tinjauan', label: 'Tinjauan', icon: <Clock3 size={15} /> },
  { id: 'pembayaran', label: 'Pembayaran', icon: <Wallet size={15} /> },
  { id: 'pesan', label: 'Template pesan', icon: <Mail size={15} /> },
  { id: 'kartu', label: 'Kartu member', icon: <IdCard size={15} /> },
];
const TEMPLATES: { key: TemplateKey; label: string; channel: 'email' | 'wa'; subject?: string; use: string }[] = [
  { key: 'activation', label: 'Link aktivasi', channel: 'email', subject: 'Link aktivasi akun CoPublika', use: 'Dikirim saat registrasi gratis disetujui, dan untuk kirim ulang link dari Anggota.' },
  { key: 'rejection', label: 'Penolakan', channel: 'email', subject: 'Pendaftaran CoPublika', use: 'Dipakai tombol Email saat menolak pendaftaran.' },
  { key: 'payReminder', label: 'Pengingat bayar', channel: 'wa', use: 'Tombol "Ingatkan via WhatsApp" pada pendaftaran yang menunggu pembayaran.' },
  { key: 'expiryReminder', label: 'Pengingat masa aktif', channel: 'wa', use: 'Tombol "Kirim pengingat" pada member yang akan habis atau kedaluwarsa.' },
  { key: 'invite', label: 'Ajakan member', channel: 'wa', use: 'Tombol "Ajak jadi member" di menu Data Peserta Event, untuk non-member yang bersedia dihubungi.' },
];

/** Keanggotaan → Pengaturan Membership: prices, periods, review target, transfer accounts, messages and card rules. */
export function RegistrationSettingsAdmin() {
  const cms = useCms();
  const reduce = useReducedMotion();
  const saved = useMemo(() => settingsFrom(cms.sections), [cms.sections]);
  const prices = useMemo(() => programPrices(cms.sections), [cms.sections]);
  const offerInfo = (k: ProgramKey) => {
    const o = (cms.sections[k === 'siap-tembus-scopus' ? 'program.sts.offer' : 'program.btm.offer'] ?? {}) as { mentors?: unknown[]; batches?: unknown[]; seatsPerMentor?: number };
    return k === 'siap-tembus-scopus' ? `${(o.mentors ?? []).length} mentor · ${o.seatsPerMentor ?? '-'} kursi/mentor` : `${(o.batches ?? []).length} angkatan`;
  };
  const [s, setS] = useState<RegistrationSettings>(saved);
  // The CMS loads browser storage after the first render; follow the stored values when they change.
  const savedJson = JSON.stringify(saved);
  const [seen, setSeen] = useState(savedJson);
  if (seen !== savedJson) {
    setSeen(savedJson);
    setS(saved);
  }
  const [confirmReset, setConfirmReset] = useState(false);
  const [active, setActive] = useState('harga');
  const [tpl, setTpl] = useState<TemplateKey>('activation');
  const dirty = JSON.stringify(s) !== JSON.stringify(saved);
  const set = <K extends keyof RegistrationSettings>(k: K, v: RegistrationSettings[K]) => setS((x) => ({ ...x, [k]: v }));

  // Problems that block saving.
  const issues = useMemo(() => {
    const out: string[] = [];
    // Programs are always paid, so a transfer account is always needed.
    if (!s.accounts.some((a) => a.bank && /^\d{6,20}$/.test(a.number.replace(/\s/g, '')) && a.holder.trim())) out.push('Isi minimal satu rekening lengkap (bank, nomor 6–20 digit, atas nama).');
    s.accounts.forEach((a, i) => { if (a.number && !/^\d{6,20}$/.test(a.number.replace(/\s/g, ''))) out.push(`Nomor rekening ${i + 1} harus 6–20 digit angka.`); });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.helpEmail.trim())) out.push('Email bantuan kartu tidak valid.');
    if (s.confirmWhatsapp.replace(/\D/g, '').length < 9) out.push('Nomor WhatsApp konfirmasi terlalu pendek.');
    (Object.keys(s.templates) as TemplateKey[]).forEach((k) => { if (s.templates[k].trim().length < 10) out.push(`Template "${TEMPLATES.find((t) => t.key === k)?.label}" masih kosong.`); });
    return out;
  }, [s]);

  const save = () => {
    if (issues.length) {
      cms.toast(issues[0], 'error');
      return;
    }
    cms.saveSection(SETTINGS_KEY, { ...s, accounts: s.accounts.map((a) => ({ ...a, number: a.number.replace(/\s/g, '') })) });
    cms.toast('Pengaturan membership disimpan. Website dan admin memakai nilai baru.');
  };

  // Section nav follows the scroll position.
  const refs = useRef<Record<string, HTMLElement | null>>({});
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      const top = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (top) setActive(top.target.id.replace('rgs-', ''));
    }, { rootMargin: '-20% 0px -65% 0px' });
    Object.values(refs.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  const go = (id: string) => refs.current[id]?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });

  const acc = primaryAccount(s);
  const t = TEMPLATES.find((x) => x.key === tpl)!;
  const sample = Object.fromEntries(TEMPLATE_VARS[tpl].map((v) => [v.key, v.sample]));
  if (tpl === 'payReminder' && acc?.number) sample.rekening = accountText(acc);
  if (tpl === 'expiryReminder') { sample.harga = formatRupiah(s.yearlyPrice); sample.masa_aktif = monthsText(s.yearlyMonths); }
  if (tpl === 'activation') sample.masa_aktif = monthsText(s.freeMonths);
  if (tpl === 'invite') sample.masa_gratis = monthsText(s.freeMonths);
  const area = useRef<HTMLTextAreaElement>(null);
  const insert = (key: string) => {
    const el = area.current;
    const text = s.templates[tpl];
    const at = el ? el.selectionStart : text.length;
    const next = `${text.slice(0, at)}{${key}}${text.slice(el ? el.selectionEnd : at)}`;
    set('templates', { ...s.templates, [tpl]: next });
    requestAnimationFrame(() => { if (el) { el.focus(); el.selectionStart = el.selectionEnd = at + key.length + 2; } });
  };

  const setAcc = (id: string, patch: Partial<BankAccount>) => set('accounts', s.accounts.map((a) => (a.id === id ? { ...a, ...patch } : patch.primary ? { ...a, primary: false } : a)));
  const addAcc = () => set('accounts', [...s.accounts, { id: `acc-${Date.now().toString(36)}`, bank: 'Mandiri', number: '', holder: s.accounts[0]?.holder ?? 'CoPublika', primary: !s.accounts.length }]);
  const removeAcc = (id: string) => {
    const next = s.accounts.filter((a) => a.id !== id);
    if (next.length && !next.some((a) => a.primary)) next[0] = { ...next[0], primary: true };
    set('accounts', next);
  };

  const reveal = (i: number) => (reduce ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, ease: EASE, delay: 0.04 * i } });

  return (
    <section className="cms-page">
      <PageHeader
        crumb={['Keanggotaan', 'Pengaturan Membership']}
        title="Pengaturan"
        accent="Membership"
        description="Harga, masa aktif, rekening transfer, dan pesan untuk pendaftar. Perubahan langsung dipakai di halaman Pendaftaran website dan menu Keanggotaan."
        publicHref="/daftar"
        actions={<Link href="/admin/applicants" className="cms-btn cms-btn--ghost">Pendaftaran <ArrowUpRight size={15} /></Link>}
      />
      <StagingNote />

      <div className="rgs">
        <div className="rgs-main">
          {/* 1. Harga & masa aktif */}
          <motion.section className="rgs-card" id="rgs-harga" ref={(el) => { refs.current.harga = el; }} {...reveal(0)}>
            <Head n={1} icon={<Banknote size={16} />} title="Harga & masa aktif" hint="Paket member di halaman Pendaftaran." />
            <div className="rgs-plans">
              <div className={`rgs-plan ${s.freeOpen ? '' : 'is-off'}`}>
                <div className="rgs-plan__top">
                  <span className="rgs-plan__ico"><Gift size={17} /></span>
                  <div><b>Registrasi Member</b><small>Gratis, ditinjau admin</small></div>
                  <Toggle on={s.freeOpen} onChange={(v) => set('freeOpen', v)} label="Buka registrasi member gratis" />
                </div>
                <Stepper label="Masa aktif gratis" value={s.freeMonths} min={1} max={12} unit="bulan" onChange={(v) => set('freeMonths', v)} />
              </div>
              <div className={`rgs-plan ${s.yearlyOpen ? '' : 'is-off'}`}>
                <div className="rgs-plan__top">
                  <span className="rgs-plan__ico"><BadgeCheck size={17} /></span>
                  <div><b>Aktivasi Member</b><small>Berbayar, transfer manual</small></div>
                  <Toggle on={s.yearlyOpen} onChange={(v) => set('yearlyOpen', v)} label="Buka aktivasi member" />
                </div>
                <div className="rgs-grid">
                  <Money label="Harga aktivasi" value={s.yearlyPrice} onChange={(v) => set('yearlyPrice', v)} />
                  <Stepper label="Masa aktif" value={s.yearlyMonths} min={1} max={60} unit="bulan" onChange={(v) => set('yearlyMonths', v)} />
                </div>
              </div>
            </div>
            <div className="rgs-progs">
              <div className="rgs-progs__head">
                <span className="mbc-label">Harga program</span>
                <small>Diatur bersama kuota mentor dan jadwal angkatan di menu programnya.</small>
              </div>
              {(Object.keys(PROGRAMS) as ProgramKey[]).map((k) => (
                <div className="rgs-prog" key={k}>
                  <span className="rgs-prog__ico" aria-hidden="true">{k === 'siap-tembus-scopus' ? <Award size={17} /> : <NotebookPen size={17} />}</span>
                  <div className="rgs-prog__text">
                    <b>{PROGRAMS[k].name}</b>
                    <small>{prices[k].unit} · {offerInfo(k)}</small>
                  </div>
                  <strong className="rgs-prog__price">{formatRupiah(prices[k].price)}</strong>
                  <Link href={OFFER_EDITORS[k]} className="cms-btn cms-btn--ghost cms-btn--sm"><Pencil size={13} /> Atur harga</Link>
                </div>
              ))}
            </div>
            <div className="rgs-grid">
              <Stepper label="Bonus member peserta program" hint="Siap Tembus Scopus & Bootcamp. 0 = tanpa bonus." value={s.programBonusMonths} min={0} max={60} unit="bulan" onChange={(v) => set('programBonusMonths', v)} />
              <Stepper label="Tandai “Akan habis”" hint="Member muncul di tab Akan habis dan bisa diingatkan." value={s.expiringDays} min={1} max={60} unit="hari sebelum" onChange={(v) => set('expiringDays', v)} />
            </div>
          </motion.section>

          {/* 2. Tinjauan */}
          <motion.section className="rgs-card" id="rgs-tinjauan" ref={(el) => { refs.current.tinjauan = el; }} {...reveal(1)}>
            <Head n={2} icon={<Clock3 size={16} />} title="Tinjauan" hint="Target waktu Tim Admin meninjau registrasi gratis." />
            <div className="rgs-review">
              <div className="rgs-chips" role="radiogroup" aria-label="Target tinjauan">
                {[12, 24, 48, 72].map((h) => (
                  <button type="button" role="radio" key={h} aria-checked={s.reviewHours === h} onClick={() => set('reviewHours', h)}>
                    {s.reviewHours === h && <Check size={13} aria-hidden="true" />} {h === 24 ? '1×24 jam' : h === 48 ? '2×24 jam' : h === 72 ? '3×24 jam' : '12 jam'}
                  </button>
                ))}
              </div>
              <Stepper label="Atau atur sendiri" value={s.reviewHours} min={1} max={168} unit="jam" onChange={(v) => set('reviewHours', v)} />
            </div>
            <p className="rgs-note"><Timer size={14} aria-hidden="true" /><span>Dipakai untuk penghitung waktu dan KPI “Lewat target” di Pendaftaran, dan janji waktu di halaman konfirmasi pendaftar.</span></p>
          </motion.section>

          {/* 3. Pembayaran */}
          <motion.section className="rgs-card" id="rgs-pembayaran" ref={(el) => { refs.current.pembayaran = el; }} {...reveal(2)}>
            <Head n={3} icon={<Wallet size={16} />} title="Pembayaran" hint="Rekening transfer manual yang ditampilkan ke pendaftar berbayar." />
            <div className="rgs-accs">
              <AnimatePresence initial={false}>
                {s.accounts.map((a, i) => (
                  <motion.div key={a.id} className={`rgs-acc ${a.primary ? 'is-primary' : ''}`} layout={!reduce} initial={reduce ? false : { opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0, marginTop: -10 }} transition={{ duration: 0.25, ease: EASE }}>
                    <span className="rgs-acc__ico" aria-hidden="true"><Landmark size={17} /></span>
                    <div className="rgs-acc__fields">
                      <div className="mbc-field">
                        <span className="mbc-label">Bank</span>
                        <CmsSelect aria-label={`Bank rekening ${i + 1}`} value={a.bank} onChange={(v) => setAcc(a.id, { bank: v })} options={[...new Set([...BANKS, a.bank].filter(Boolean))].map((b) => ({ value: b, label: b }))} />
                      </div>
                      <label className="mbc-field">
                        <span className="mbc-label">Nomor rekening</span>
                        <span className="mbc-control"><input className="is-mono" value={a.number} onChange={(e) => setAcc(a.id, { number: e.target.value.replace(/[^\d ]/g, '') })} inputMode="numeric" placeholder="1234567890" /></span>
                      </label>
                      <label className="mbc-field">
                        <span className="mbc-label">Atas nama</span>
                        <span className="mbc-control"><input value={a.holder} onChange={(e) => setAcc(a.id, { holder: e.target.value })} placeholder="Nama pemilik rekening" /></span>
                      </label>
                    </div>
                    <div className="rgs-acc__side">
                      <button type="button" className={`rgs-primary ${a.primary ? 'is-on' : ''}`} onClick={() => setAcc(a.id, { primary: true })} aria-pressed={a.primary}><Star size={13} aria-hidden="true" /> {a.primary ? 'Utama' : 'Jadikan utama'}</button>
                      {s.accounts.length > 1 && <button type="button" className="rgs-icon-btn" onClick={() => removeAcc(a.id)} aria-label={`Hapus rekening ${i + 1}`}><Trash2 size={15} /></button>}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {s.accounts.length < 4 && <button type="button" className="rgs-add" onClick={addAcc}><Plus size={15} /> Tambah rekening</button>}
            </div>
            <div className="rgs-grid">
              <Stepper label="Batas waktu pembayaran" hint="Ditampilkan di halaman konfirmasi." value={s.payDeadlineHours} min={1} max={336} unit="jam" onChange={(v) => set('payDeadlineHours', v)} />
              <label className="mbc-field">
                <span className="mbc-label">WhatsApp konfirmasi</span>
                <span className="mbc-control"><span className="mbc-control__ico" aria-hidden="true"><MessageCircle size={16} /></span><input value={s.confirmWhatsapp} onChange={(e) => set('confirmWhatsapp', e.target.value)} inputMode="tel" placeholder="0851-1145-4440" /></span>
                <span className="mbc-hint">Tujuan bukti transfer dari pendaftar.</span>
              </label>
              <label className="mbc-field is-wide">
                <span className="mbc-label">Instruksi transfer</span>
                <span className="mbc-control is-area"><textarea rows={2} value={s.payNote} onChange={(e) => set('payNote', e.target.value)} /></span>
              </label>
            </div>
          </motion.section>

          {/* 4. Template pesan */}
          <motion.section className="rgs-card" id="rgs-pesan" ref={(el) => { refs.current.pesan = el; }} {...reveal(3)}>
            <Head n={4} icon={<Mail size={16} />} title="Template pesan" hint="Teks email dan WhatsApp dari tombol-tombol di Pendaftaran dan Anggota." />
            <div className="rgs-tabs" role="tablist" aria-label="Template">
              {TEMPLATES.map((x) => (
                <button type="button" role="tab" key={x.key} aria-selected={tpl === x.key} onClick={() => setTpl(x.key)}>
                  {tpl === x.key && <motion.span layoutId="rgs-tab" className="rgs-tabs__pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                  <span className="rgs-tabs__text">{x.channel === 'email' ? <Mail size={14} aria-hidden="true" /> : <MessageCircle size={14} aria-hidden="true" />}{x.label}</span>
                </button>
              ))}
            </div>
            <div className="rgs-tpl">
              <div className="rgs-tpl__edit">
                <p className="rgs-tpl__use">{t.use}</p>
                <textarea ref={area} rows={9} value={s.templates[tpl]} onChange={(e) => set('templates', { ...s.templates, [tpl]: e.target.value })} aria-label={`Template ${t.label}`} />
                <div className="rgs-vars">
                  <span>Sisipkan:</span>
                  {TEMPLATE_VARS[tpl].map((v) => <button type="button" key={v.key} onClick={() => insert(v.key)} title={v.label}>{`{${v.key}}`}</button>)}
                  {s.templates[tpl] !== DEFAULT_SETTINGS.templates[tpl] && <button type="button" className="is-reset" onClick={() => set('templates', { ...s.templates, [tpl]: DEFAULT_SETTINGS.templates[tpl] })}><RotateCcw size={12} aria-hidden="true" /> Teks awal</button>}
                </div>
              </div>
              <div className={`rgs-preview is-${t.channel}`} aria-label="Pratinjau pesan">
                <span className="rgs-preview__k">Pratinjau</span>
                {t.channel === 'email' ? (
                  <div className="rgs-mail">
                    <div className="rgs-mail__head"><b>{t.subject}</b><small>Tim Admin CoPublika · kepada {sample.nama?.toLowerCase()}@kampus.ac.id</small></div>
                    <p>{fillTemplate(s.templates[tpl], sample)}</p>
                  </div>
                ) : (
                  <div className="rgs-wa"><p>{fillTemplate(s.templates[tpl], sample)}</p><small>10.24 <Check size={12} aria-hidden="true" /><Check size={12} aria-hidden="true" className="is-2" /></small></div>
                )}
              </div>
            </div>
          </motion.section>

          {/* 5. Kartu member */}
          <motion.section className="rgs-card" id="rgs-kartu" ref={(el) => { refs.current.kartu = el; }} {...reveal(4)}>
            <Head n={5} icon={<IdCard size={16} />} title="Kartu member" hint="Siapa yang berhak dan kontak yang dicetak di kartu." />
            <div className="rgs-grid">
              <Stepper label="Minimal masa aktif" hint="Member aktif dengan masa aktif sepanjang ini berhak atas kartu." value={s.cardMinMonths} min={1} max={60} unit="bulan" onChange={(v) => set('cardMinMonths', v)} />
              <div />
              <label className="mbc-field">
                <span className="mbc-label">Email bantuan</span>
                <span className="mbc-control"><span className="mbc-control__ico" aria-hidden="true"><Mail size={16} /></span><input type="email" value={s.helpEmail} onChange={(e) => set('helpEmail', e.target.value)} /></span>
              </label>
              <label className="mbc-field">
                <span className="mbc-label">Telepon bantuan</span>
                <span className="mbc-control"><span className="mbc-control__ico" aria-hidden="true"><Phone size={16} /></span><input value={s.helpPhone} onChange={(e) => set('helpPhone', e.target.value)} inputMode="tel" /></span>
              </label>
            </div>
          </motion.section>
        </div>

        <aside className="rgs-side">
          <nav className="rgs-nav" aria-label="Bagian pengaturan">
            {SECTIONS.map((x) => (
              <button type="button" key={x.id} className={active === x.id ? 'is-on' : ''} onClick={() => go(x.id)}>
                {active === x.id && <motion.span layoutId="rgs-nav" className="rgs-nav__bar" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span className="rgs-nav__ico" aria-hidden="true">{x.icon}</span>{x.label}
              </button>
            ))}
          </nav>
          <section className="rgs-sum" aria-label="Ringkasan">
            <span className="rgs-sum__k">Tampil di website</span>
            <ul>
              <li className={s.freeOpen ? '' : 'is-off'}><Gift size={15} aria-hidden="true" /><span>Registrasi gratis<small>{s.freeOpen ? `${monthsText(s.freeMonths)} pertama` : 'Ditutup'}</small></span></li>
              <li className={s.yearlyOpen ? '' : 'is-off'}><BadgeCheck size={15} aria-hidden="true" /><span>Aktivasi member<small>{s.yearlyOpen ? `${formatRupiah(s.yearlyPrice)} · ${monthsText(s.yearlyMonths)}` : 'Ditutup'}</small></span></li>
              <li><Award size={15} aria-hidden="true" /><span>Siap Tembus Scopus<small>{formatRupiah(prices['siap-tembus-scopus'].price)}</small></span></li>
              <li><NotebookPen size={15} aria-hidden="true" /><span>Bootcamp 30 Hari<small>{formatRupiah(prices['bootcamp-menulis'].price)}</small></span></li>
              <li><Star size={15} aria-hidden="true" /><span>Bonus peserta program<small>{s.programBonusMonths ? `Member ${monthsText(s.programBonusMonths)}` : 'Tanpa bonus'}</small></span></li>
              <li><CalendarClock size={15} aria-hidden="true" /><span>Tinjauan<small>{s.reviewHours} jam</small></span></li>
              <li><CreditCard size={15} aria-hidden="true" /><span>Transfer ke<small>{acc?.number ? accountText(acc) : 'Belum ada rekening'}</small></span></li>
            </ul>
            <Link href="/daftar" target="_blank" className="rgs-sum__link">Buka halaman Pendaftaran <ArrowUpRight size={13} /></Link>
          </section>
        </aside>
      </div>

      <AnimatePresence>
        {(dirty || issues.length > 0) && (
          <motion.div className="rgs-bar" initial={reduce ? false : { y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} transition={{ duration: 0.25, ease: EASE }}>
            <span className={`rgs-bar__state ${issues.length ? 'is-warn' : ''}`}>
              {issues.length ? <><CircleAlert size={15} aria-hidden="true" /> {issues[0]}</> : <><span className="rgs-bar__dot" aria-hidden="true" /> Ada perubahan yang belum disimpan</>}
            </span>
            <div className="rgs-bar__actions">
              <button type="button" className="cms-btn cms-btn--ghost" onClick={() => setConfirmReset(true)}><RotateCcw size={14} /> Nilai awal</button>
              {dirty && <button type="button" className="cms-btn cms-btn--ghost" onClick={() => setS(saved)}>Batalkan</button>}
              <button type="button" className="cms-btn cms-btn--solid" onClick={save} disabled={!dirty}><Save size={15} /> Simpan pengaturan</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={confirmReset}
        title="Kembalikan ke nilai awal?"
        confirmLabel="Kembalikan"
        body={<p>Harga, masa aktif, target tinjauan, template pesan, dan aturan kartu kembali ke nilai awal. Rekening transfer ikut dikosongkan. Belum tersimpan sampai Anda menekan <strong>Simpan pengaturan</strong>.</p>}
        onConfirm={() => { setS(DEFAULT_SETTINGS); setConfirmReset(false); }}
        onCancel={() => setConfirmReset(false)}
      />
    </section>
  );
}

function Head({ n, icon, title, hint }: { n: number; icon: ReactNode; title: string; hint: string }) {
  return (
    <header className="rgs-head">
      <span className="mbc-step__n" aria-hidden="true">{n}</span>
      <div>
        <h3><span aria-hidden="true">{icon}</span>{title}</h3>
        <p>{hint}</p>
      </div>
    </header>
  );
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} className={`rgs-switch ${on ? 'is-on' : ''}`} onClick={() => onChange(!on)}>
      <motion.i layout transition={{ type: 'spring', stiffness: 600, damping: 34 }} />
      <span>{on ? 'Dibuka' : 'Ditutup'}</span>
    </button>
  );
}

function Stepper({ label, hint, value, min, max, unit, onChange }: { label: string; hint?: string; value: number; min: number; max: number; unit: string; onChange: (v: number) => void }) {
  const clamp = (v: number) => Math.min(max, Math.max(min, Math.round(v) || min));
  return (
    <div className="mbc-field">
      <span className="mbc-label">{label}</span>
      <div className="mbc-stepper">
        <button type="button" onClick={() => onChange(clamp(value - 1))} disabled={value <= min} aria-label={`Kurangi ${label}`}><Minus size={15} /></button>
        <input type="number" min={min} max={max} value={value} onChange={(e) => onChange(clamp(Number(e.target.value)))} aria-label={label} />
        <span>{unit}</span>
        <button type="button" onClick={() => onChange(clamp(value + 1))} disabled={value >= max} aria-label={`Tambah ${label}`}><Plus size={15} /></button>
      </div>
      {hint && <span className="mbc-hint">{hint}</span>}
    </div>
  );
}

function Money({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="mbc-field">
      <span className="mbc-label">{label}</span>
      <span className="mbc-control rgs-money">
        <span className="rgs-money__pre" aria-hidden="true">Rp.</span>
        <input inputMode="numeric" value={value ? value.toLocaleString('id-ID') : '0'} onChange={(e) => onChange(Math.min(10_000_000, Number(e.target.value.replace(/\D/g, '')) || 0))} />
      </span>
      <span className="mbc-hint">{value ? `${formatRupiah(value)} per masa aktif` : 'Gratis'}</span>
    </label>
  );
}
