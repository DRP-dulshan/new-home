'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { stays, type Stay } from '@/data/services';
import { EMAIL_PATTERN, inputBase, labelBase } from '../ui/formStyles';
import { useEnquiry } from '@/lib/enquiry';
import SendError from '../ui/SendError';

const areaFilters = ['All areas', ...new Set(stays.map((s) => s.area))];
const guestOptions = [1, 2, 3, 4, 5, 6, 8, 10];

const DAY = 86_400_000;
/** Local calendar date as YYYY-MM-DD (toISOString alone would be UTC). */
const isoDay = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
const nightsBetween = (a: string, b: string) =>
  a && b ? Math.round((Date.parse(b) - Date.parse(a)) / DAY) : 0;
const aed = (n: number) => `AED ${n.toLocaleString('en-US')}`;

type Fields = { stay: string; checkIn: string; checkOut: string; guests: string; name: string; phone: string; email: string };
type Errors = Partial<Record<keyof Fields, string>>;

/**
 * Browse DRP holiday homes and send a booking request with dates.
 * No live availability: the team confirms each request personally.
 */
export default function StayFinder() {
  const uid = useId();
  const reduce = useReducedMotion();
  const formRef = useRef<HTMLDivElement>(null);
  const [area, setArea] = useState(areaFilters[0]);
  const [minGuests, setMinGuests] = useState(1);
  const [values, setValues] = useState<Fields>({
    stay: '', checkIn: '', checkOut: '', guests: '2', name: '', phone: '', email: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const { sending, failed, send } = useEnquiry();

  const shown = stays.filter((s) => (area === areaFilters[0] || s.area === area) && s.guests >= minGuests);
  const selected = stays.find((s) => s.id === values.stay);
  const nights = nightsBetween(values.checkIn, values.checkOut);
  /* Set after mount so the statically built page does not carry the build date */
  const [today, setToday] = useState('');
  useEffect(() => setToday(isoDay(new Date())), []);

  const set = (key: keyof Fields, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };

  const choose = (s: Stay) => {
    set('stay', s.id);
    if (Number(values.guests) > s.guests) set('guests', String(s.guests));
    formRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!values.stay) e.stay = 'Please choose a home.';
    if (!values.checkIn) e.checkIn = 'Please choose a check-in date.';
    else if (today && values.checkIn < today) e.checkIn = 'Check-in cannot be in the past.';
    if (!values.checkOut) e.checkOut = 'Please choose a check-out date.';
    else if (nights < 1) e.checkOut = 'Check-out must be after check-in.';
    if (selected && Number(values.guests) > selected.guests)
      e.guests = `This home sleeps up to ${selected.guests}.`;
    if (!values.name.trim()) e.name = 'Please enter your name.';
    if (!values.phone.trim() || values.phone.replace(/\D/g, '').length < 7) e.phone = 'Please enter a phone or WhatsApp number.';
    if (!EMAIL_PATTERN.test(values.email.trim())) e.email = 'Please enter a valid email address.';
    return e;
  };

  const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const found = validate();
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    const payload = {
      form: 'book-a-stay',
      ...values,
      stay: selected?.name ?? values.stay,
      nights,
      estimate: selected ? `AED ${(selected.nightlyFrom * nights).toLocaleString('en-US')}` : '',
    };
    if (await send(payload)) setSent(true);
  };

  const err = (key: keyof Fields) =>
    errors[key] ? (
      <p id={`${uid}-${key}-error`} role="alert" className="mt-2 text-xs text-orange-600">
        {errors[key]}
      </p>
    ) : null;
  const aria = (key: keyof Fields) => ({
    id: `${uid}-${key}`,
    'aria-invalid': !!errors[key],
    'aria-describedby': errors[key] ? `${uid}-${key}-error` : undefined,
  });
  const selectClass =
    'mt-3 w-full cursor-pointer appearance-none border-0 border-b border-line bg-transparent pb-2.5 text-[15px] font-light text-charcoal outline-none transition-colors duration-300 focus:border-orange';
  const fieldLabel = 'block text-[11px] font-medium uppercase tracking-eyebrow text-charcoal-muted';

  return (
    <div>
      {/* ---------- Filters ---------- */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label="Filter by area" className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
          {areaFilters.map((a) => {
            const active = a === area;
            return (
              <button
                key={a}
                type="button"
                aria-pressed={active}
                onClick={() => setArea(a)}
                className={`h-11 shrink-0 rounded-full border px-5 text-[13px] transition-colors duration-300 ${
                  active ? 'border-charcoal bg-charcoal text-white' : 'border-charcoal/20 bg-white text-charcoal hover:border-charcoal/50'
                }`}
              >
                {a}
              </button>
            );
          })}
        </div>
        <label className="flex items-center gap-3 text-[13px] text-charcoal">
          Guests
          <select
            value={minGuests}
            onChange={(e) => setMinGuests(Number(e.target.value))}
            className="h-11 cursor-pointer rounded-md border border-line bg-white px-3 text-[13px] outline-none focus-visible:border-orange"
          >
            {guestOptions.map((g) => (
              <option key={g} value={g}>
                {g}+
              </option>
            ))}
          </select>
        </label>
      </div>
      <p aria-live="polite" className="mt-6 text-[13px] font-light text-charcoal-muted">
        {shown.length} {shown.length === 1 ? 'home' : 'homes'} available to request
      </p>

      {/* ---------- Homes ---------- */}
      <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
        {shown.map((s) => (
          <li key={s.id} className="flex flex-col">
            <div className="relative aspect-[4/3] overflow-hidden bg-line">
              <Image src={s.image} alt={s.alt} fill loading="lazy" sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
              {values.stay === s.id ? (
                <span className="absolute left-4 top-4 bg-orange px-3 py-1.5 text-[10px] font-medium uppercase tracking-eyebrow text-white">
                  Selected
                </span>
              ) : null}
            </div>
            <p className="mt-5 text-[10px] uppercase tracking-eyebrow text-charcoal-muted">{s.area}</p>
            <h3 className="mt-2 font-serif text-[1.5rem] leading-snug text-charcoal">{s.name}</h3>
            <p className="mt-2 text-[13px] font-light text-charcoal-muted">
              {s.beds === 0 ? 'Studio' : `${s.beds} bedroom${s.beds === 1 ? '' : 's'}`} · Sleeps {s.guests} ·{' '}
              {s.highlights.join(' · ')}
            </p>
            <div className="mt-auto flex items-center justify-between gap-4 border-t border-line pt-4">
              <p className="text-charcoal">
                <span className="text-[11px] uppercase tracking-eyebrow text-charcoal-muted">From </span>
                <span className="font-serif text-lg">{aed(s.nightlyFrom)}</span>
                <span className="text-[12px] font-light text-charcoal-muted"> / night</span>
              </p>
              <button
                type="button"
                onClick={() => choose(s)}
                className="link-underline text-[11px] font-medium text-charcoal"
              >
                Request <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* ---------- Booking request ---------- */}
      <div
        ref={formRef}
        id="request"
        className="mt-20 scroll-mt-24 bg-white px-5 py-8 shadow-[0_24px_70px_-30px_rgba(26,26,26,0.18)] sm:px-10 sm:py-12 lg:px-14"
      >
        <AnimatePresence mode="wait" initial={false}>
          {sent ? (
            <motion.div
              key="sent"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              role="status"
              className="py-6"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-orange/10 text-orange">
                <Check aria-hidden="true" strokeWidth={1.5} className="h-6 w-6" />
              </span>
              <h3 className="heading-display mt-8 text-[clamp(2rem,4vw,3rem)] text-charcoal">Request received.</h3>
              <p className="mt-4 max-w-lg text-[15px] font-light leading-relaxed text-charcoal-muted">
                Our guest team will confirm availability for {selected?.name} and send your booking details shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setValues((v) => ({ ...v, stay: '', checkIn: '', checkOut: '' }));
                }}
                className="link-underline mt-10 text-[11px] font-medium text-charcoal"
              >
                Request another stay <span aria-hidden="true">&rarr;</span>
              </button>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={onSubmit} noValidate aria-labelledby={`${uid}-title`}>
              <p className="eyebrow text-orange">Booking Request</p>
              <h3 id={`${uid}-title`} className="heading-display mt-4 text-[clamp(1.8rem,3.4vw,2.6rem)] text-charcoal">
                Request your dates
              </h3>
              <p className="mt-3 max-w-lg text-sm font-light text-charcoal-muted">
                Availability and the final rate are confirmed by our team, usually within the hour.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-4">
                <div className="sm:col-span-2">
                  <label htmlFor={`${uid}-stay`} className={fieldLabel}>Home</label>
                  <select {...aria('stay')} value={values.stay} onChange={(e) => set('stay', e.target.value)} className={selectClass}>
                    <option value="">Choose a home</option>
                    {stays.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} — {s.area}
                      </option>
                    ))}
                  </select>
                  {err('stay')}
                </div>
                <div>
                  <label htmlFor={`${uid}-checkIn`} className={fieldLabel}>Check-in</label>
                  <input
                    type="date"
                    {...aria('checkIn')}
                    min={today || undefined}
                    value={values.checkIn}
                    onChange={(e) => set('checkIn', e.target.value)}
                    className={selectClass}
                  />
                  {err('checkIn')}
                </div>
                <div>
                  <label htmlFor={`${uid}-checkOut`} className={fieldLabel}>Check-out</label>
                  <input
                    type="date"
                    {...aria('checkOut')}
                    min={values.checkIn || today || undefined}
                    value={values.checkOut}
                    onChange={(e) => set('checkOut', e.target.value)}
                    className={selectClass}
                  />
                  {err('checkOut')}
                </div>
                <div>
                  <label htmlFor={`${uid}-guests`} className={fieldLabel}>Guests</label>
                  <select {...aria('guests')} value={values.guests} onChange={(e) => set('guests', e.target.value)} className={selectClass}>
                    {Array.from({ length: selected?.guests ?? 10 }, (_, i) => i + 1).map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                  {err('guests')}
                </div>
                {(['name', 'phone', 'email'] as const).map((key) => (
                  <div key={key} className="relative">
                    <input
                      {...aria(key)}
                      type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'}
                      autoComplete={key === 'phone' ? 'tel' : key}
                      placeholder=" "
                      value={values[key]}
                      onChange={(e) => set(key, e.target.value)}
                      className={`${inputBase} ${errors[key] ? 'border-orange' : ''}`}
                    />
                    <label htmlFor={`${uid}-${key}`} className={labelBase}>
                      {key === 'phone' ? 'Phone / WhatsApp' : key === 'email' ? 'Email' : 'Name'}
                    </label>
                    {err(key)}
                  </div>
                ))}
              </div>

              {failed ? (
                <div className="mt-8">
                  <SendError />
                </div>
              ) : null}
              <div className="mt-10 flex flex-col gap-6 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p aria-live="polite" className="text-sm font-light text-charcoal">
                  {selected && nights > 0 ? (
                    <>
                      {nights} {nights === 1 ? 'night' : 'nights'} · from{' '}
                      <span className="font-serif text-lg">{aed(selected.nightlyFrom * nights)}</span>
                      <span className="text-charcoal-muted"> before fees</span>
                    </>
                  ) : (
                    <span className="text-charcoal-muted">Choose a home and dates to see an estimate.</span>
                  )}
                </p>
                <button
                  type="submit"
                  disabled={sending}
                  className="group inline-flex h-14 items-center justify-center gap-3 bg-orange px-9 text-[11px] font-medium uppercase tracking-eyebrow text-white transition-colors duration-300 hover:bg-orange-600 disabled:cursor-wait disabled:opacity-70"
                >
                  {sending ? 'Sending…' : 'Send Request'}
                  <span aria-hidden="true" className="transition-transform duration-500 ease-premium group-hover:translate-x-1.5">
                    &rarr;
                  </span>
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
