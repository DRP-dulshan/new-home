'use client';

import { useId, useState, type FormEvent } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { contact, contactSection } from '@/data/homepage';
import { EMAIL_PATTERN, inputBase, labelBase } from './ui/formStyles';

type Fields = {
  name: string;
  phone: string;
  email: string;
  interest: string;
  message: string;
};

type Errors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = { name: '', phone: '', email: '', interest: '', message: '' };

export default function ContactSection() {
  const uid = useId();
  const reduce = useReducedMotion();
  const [values, setValues] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const set = (key: keyof Fields) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const validate = (v: Fields): Errors => {
    const next: Errors = {};
    if (!v.name.trim()) next.name = 'Please enter your name.';
    if (!v.phone.trim()) next.phone = 'Please enter a phone or WhatsApp number.';
    if (!v.email.trim()) next.email = 'Please enter your email address.';
    else if (!EMAIL_PATTERN.test(v.email.trim()))
      next.email = 'Please enter a valid email address.';
    if (!v.interest) next.interest = 'Please choose what you are interested in.';
    return next;
  };

  /* Demo only — no backend. Replace with the real endpoint/CRM before launch. */
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = document.getElementById(`${uid}-${Object.keys(found)[0]}`);
      first?.focus();
      return;
    }
    setSent(true);
  };

  const details = [
    { icon: Phone, label: 'Call', value: contact.phone, href: contact.phoneHref },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: contact.whatsapp,
      href: contact.whatsappHref,
      external: true,
    },
    { icon: Mail, label: 'Email', value: contact.email, href: contact.emailHref },
    { icon: MapPin, label: 'Office', value: contact.addressLine, href: contact.mapHref, external: true },
  ];

  return (
    <section id="contact" aria-labelledby="contact-heading" className="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* ---------- Left: photograph with overlay ---------- */}
        <div className="relative min-h-[320px] overflow-hidden bg-ink lg:min-h-[760px]">
          <Image
            src={contactSection.image}
            alt={contactSection.imageAlt}
            fill
            loading="lazy"
            sizes="(max-width: 1024px) 100vw, 50vw"
            /* Keeps the D|R|P reception sign in frame on wide, short crops */
            className="object-cover object-[50%_62%]"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-ink/65" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent"
          />

          <div className="relative flex h-full flex-col justify-end p-8 sm:p-12 lg:p-16">
            <p className="eyebrow text-orange">{contactSection.eyebrow}</p>
            <h2
              id="contact-heading"
              className="heading-display mt-6 max-w-[14ch] text-[clamp(2rem,4.2vw,3.5rem)] text-white"
            >
              {contactSection.heading}
            </h2>
            <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-white/70 sm:text-base">
              {contactSection.paragraph}
            </p>

            {/* Direct contact routes for visitors who would rather not fill a form */}
            <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:mt-12">
              {details.map(({ icon: Icon, label, value, href, external }) => (
                <li key={label}>
                  <p className="flex items-center gap-2 text-[10px] uppercase tracking-eyebrow text-white/40">
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      {...(external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className="mt-1.5 block break-words text-sm font-light text-white transition-colors duration-300 hover:text-orange"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="mt-1.5 text-sm font-light text-white">{value}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---------- Right: form ---------- */}
        <div className="flex items-center bg-white px-5 py-16 sm:px-12 lg:px-16 lg:py-24">
          <div className="w-full max-w-xl">
            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                <motion.div
                  key="success"
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                  role="status"
                  aria-live="polite"
                  className="py-8"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-orange/10 text-orange">
                    <Check className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <h3 className="heading-display mt-8 text-3xl text-charcoal sm:text-4xl">
                    {contactSection.successTitle}
                  </h3>
                  <p className="mt-5 max-w-md text-sm font-light leading-relaxed text-charcoal-muted sm:text-base">
                    {contactSection.successBody}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setValues(EMPTY);
                      setSent(false);
                    }}
                    className="link-underline group mt-10 text-[11px] font-medium text-charcoal"
                  >
                    Send another enquiry
                    <span
                      aria-hidden="true"
                      className="transition-[transform,color] duration-500 ease-premium group-hover:translate-x-1.5 group-hover:text-orange"
                    >
                      &rarr;
                    </span>
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={false}
                  exit={reduce ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: reduce ? 0 : 0.35 }}
                  onSubmit={onSubmit}
                  noValidate
                  aria-describedby={`${uid}-note`}
                  className="space-y-9"
                >
                  {/* Name */}
                  <div className="relative">
                    <input
                      id={`${uid}-name`}
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder=" "
                      value={values.name}
                      onChange={set('name')}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? `${uid}-name-error` : undefined}
                      className={`${inputBase} ${errors.name ? 'border-orange' : ''}`}
                    />
                    <label htmlFor={`${uid}-name`} className={labelBase}>
                      Name
                    </label>
                    {errors.name ? (
                      <p id={`${uid}-name-error`} className="mt-2 text-xs text-orange-600">
                        {errors.name}
                      </p>
                    ) : null}
                  </div>

                  {/* Phone + Email */}
                  <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                    <div className="relative">
                      <input
                        id={`${uid}-phone`}
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder=" "
                        value={values.phone}
                        onChange={set('phone')}
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? `${uid}-phone-error` : undefined}
                        className={`${inputBase} ${errors.phone ? 'border-orange' : ''}`}
                      />
                      <label htmlFor={`${uid}-phone`} className={labelBase}>
                        Phone / WhatsApp
                      </label>
                      {errors.phone ? (
                        <p id={`${uid}-phone-error`} className="mt-2 text-xs text-orange-600">
                          {errors.phone}
                        </p>
                      ) : null}
                    </div>

                    <div className="relative">
                      <input
                        id={`${uid}-email`}
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder=" "
                        value={values.email}
                        onChange={set('email')}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? `${uid}-email-error` : undefined}
                        className={`${inputBase} ${errors.email ? 'border-orange' : ''}`}
                      />
                      <label htmlFor={`${uid}-email`} className={labelBase}>
                        Email
                      </label>
                      {errors.email ? (
                        <p id={`${uid}-email-error`} className="mt-2 text-xs text-orange-600">
                          {errors.email}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {/* Interest — a select always shows a value, so the label stays raised */}
                  <div className="relative">
                    <label
                      htmlFor={`${uid}-interest`}
                      className="block text-[11px] font-medium uppercase tracking-eyebrow text-charcoal-muted"
                    >
                      I&rsquo;m interested in&hellip;
                    </label>
                    <select
                      id={`${uid}-interest`}
                      name="interest"
                      value={values.interest}
                      onChange={set('interest')}
                      aria-invalid={!!errors.interest}
                      aria-describedby={errors.interest ? `${uid}-interest-error` : undefined}
                      className={`mt-4 w-full cursor-pointer appearance-none border-0 border-b bg-transparent pb-2.5 text-[15px] font-light text-charcoal outline-none transition-colors duration-300 focus:border-orange ${
                        errors.interest ? 'border-orange' : 'border-line'
                      }`}
                    >
                      <option value="">Please select</option>
                      {contactSection.interests.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                    {errors.interest ? (
                      <p id={`${uid}-interest-error`} className="mt-2 text-xs text-orange-600">
                        {errors.interest}
                      </p>
                    ) : null}
                  </div>

                  {/* Message */}
                  <div className="relative">
                    <textarea
                      id={`${uid}-message`}
                      name="message"
                      rows={3}
                      placeholder=" "
                      value={values.message}
                      onChange={set('message')}
                      className={`${inputBase} resize-none`}
                    />
                    <label htmlFor={`${uid}-message`} className={labelBase}>
                      Message
                    </label>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 pt-2">
                    <button
                      type="submit"
                      className="group inline-flex items-center gap-3 bg-orange px-9 py-4 text-[11px] font-medium uppercase tracking-eyebrow text-white transition-colors duration-300 hover:bg-orange-600"
                    >
                      {contactSection.submitLabel}
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-500 ease-premium group-hover:translate-x-1.5"
                      >
                        &rarr;
                      </span>
                    </button>
                    <p
                      id={`${uid}-note`}
                      className="text-xs font-light text-charcoal-muted"
                    >
                      We reply within one business day.
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
