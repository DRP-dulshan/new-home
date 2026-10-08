'use client';

import { useCallback, useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, FileText, Upload, X } from 'lucide-react';
import { careers } from '@/data/company';
import { DEFAULT_DIAL, normalisePhone, phoneError } from '@/lib/phone';
import { SuccessState } from '../LeadForm';
import PhoneField from '../ui/PhoneField';
import { EMAIL_PATTERN, inputBase, labelBase } from '../ui/formStyles';
import SendError from '../ui/SendError';
import { useEnquiry } from '@/lib/enquiry';

const cfg = careers.join;

type Fields = {
  name: string;
  dial: string;
  phone: string;
  email: string;
  location: string;
  experienced: '' | 'yes' | 'no';
  years: string;
  languages: string[];
  cv: File | null;
};

type Errors = Partial<Record<'name' | 'phone' | 'email' | 'location' | 'experienced' | 'years' | 'languages' | 'cv', string>>;

const EMPTY: Fields = {
  name: '',
  dial: DEFAULT_DIAL,
  phone: '',
  email: '',
  location: '',
  experienced: '',
  years: '',
  languages: [],
  cv: null,
};

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

/** Small uppercase label used above the chip and card groups. */
const groupLabel = 'block text-[11px] font-medium uppercase tracking-eyebrow text-charcoal-muted';

const chipClass = (on: boolean) =>
  `min-h-[44px] rounded-full border px-4 text-[14px] transition-colors duration-200 ${
    on ? 'border-orange bg-orange text-white' : 'border-charcoal/20 bg-white text-charcoal hover:border-charcoal/50'
  }`;

/** Single-page application form for /careers. */
export default function CareersForm() {
  const uid = useId();
  const reduce = useReducedMotion();
  const fileRef = useRef<HTMLInputElement>(null);
  const [v, setV] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const { sending, failed, send } = useEnquiry();

  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setV((s) => ({ ...s, [key]: value }));
    const errKey = (key === 'dial' ? 'phone' : key) as keyof Errors;
    setErrors((e) => (e[errKey] ? { ...e, [errKey]: undefined } : e));
  };

  /* Success heading takes focus once it mounts */
  const focusPending = useRef(false);
  const headingRef = useCallback((el: HTMLHeadingElement | null) => {
    if (!el || !focusPending.current) return;
    focusPending.current = false;
    el.focus({ preventScroll: true });
    const top = el.getBoundingClientRect().top;
    if (top < 80 || top > window.innerHeight) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const toggleLanguage = (lang: string) =>
    set('languages', v.languages.includes(lang) ? v.languages.filter((l) => l !== lang) : [...v.languages, lang]);

  const checkFile = (file: File): string | undefined => {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!cfg.cv.extensions.includes(ext)) return 'Please upload a PDF or Word document.';
    if (file.size > cfg.cv.maxBytes) return 'Please upload a file under 4 MB.';
    return undefined;
  };

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const problem = checkFile(file);
    if (problem) {
      /* Clear the file directly: set() would also wipe the error just raised */
      setV((s) => ({ ...s, cv: null }));
      setErrors((err) => ({ ...err, cv: problem }));
      e.target.value = '';
      return;
    }
    set('cv', file);
  };

  const clearFile = () => {
    set('cv', null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!v.name.trim()) e.name = 'Please enter your name.';
    const p = phoneError(v.dial, v.phone);
    if (p) e.phone = p;
    if (!v.email.trim()) e.email = 'Please enter your email address.';
    else if (!EMAIL_PATTERN.test(v.email.trim())) e.email = 'Please enter a valid email address.';
    if (!v.location.trim()) e.location = 'Please tell us where you are based.';
    if (!v.experienced) e.experienced = 'Please choose Yes or No.';
    if (v.experienced === 'yes' && !v.years) e.years = 'Please choose your years of experience.';
    if (!v.languages.length) e.languages = 'Please choose at least one language.';
    if (!v.cv) e.cv = 'Please upload your CV.';
    return e;
  };

  /* Each field's focus target, in the order errors should be announced */
  const focusTarget: Record<keyof Errors, string> = {
    name: `${uid}-name`,
    phone: `${uid}-phone`,
    email: `${uid}-email`,
    location: `${uid}-location`,
    experienced: `${uid}-exp-yes`,
    years: `${uid}-years-0`,
    languages: `${uid}-lang-0`,
    cv: `${uid}-cv-button`,
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    const first = (Object.keys(focusTarget) as (keyof Errors)[]).find((k) => found[k]);
    if (first) {
      document.getElementById(focusTarget[first])?.focus();
      return;
    }

    const payload = {
      form: 'careers',
      submittedAt: new Date().toISOString(),
      name: v.name.trim(),
      phone: normalisePhone(v.dial, v.phone),
      email: v.email.trim(),
      location: v.location.trim(),
      realEstateExperience: v.experienced === 'yes',
      yearsOfExperience: v.experienced === 'yes' ? v.years : null,
      languages: v.languages,
      cv: v.cv ? { name: v.cv.name, size: v.cv.size, type: v.cv.type } : null,
    };
    if (!(await send(payload, v.cv))) return;
    focusPending.current = true;
    setSent(true);
  };

  const err = (key: keyof Errors) =>
    errors[key] ? (
      <p id={`${uid}-${key}-error`} role="alert" className="mt-3 text-xs text-orange-600">
        {errors[key]}
      </p>
    ) : null;
  const describedBy = (key: keyof Errors) => (errors[key] ? `${uid}-${key}-error` : undefined);

  const textField = (key: 'name' | 'email' | 'location', label: string, type = 'text', autoComplete?: string) => (
    <div className="relative">
      <input
        id={`${uid}-${key}`}
        name={key}
        type={type}
        autoComplete={autoComplete}
        placeholder=" "
        value={v[key]}
        onChange={(e) => set(key, e.target.value)}
        aria-invalid={!!errors[key]}
        aria-describedby={describedBy(key)}
        className={`${inputBase} ${errors[key] ? 'border-orange' : ''}`}
      />
      <label htmlFor={`${uid}-${key}`} className={labelBase}>
        {label}
      </label>
      {err(key)}
    </div>
  );

  return (
    <div className="bg-white px-5 py-8 shadow-[0_24px_70px_-30px_rgba(26,26,26,0.18)] sm:px-10 sm:py-12 lg:px-14 lg:py-14">
      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <SuccessState
            key="success"
            title={cfg.successTitle}
            body={cfg.successBody}
            headingRef={headingRef}
            resetLabel="Send another application"
            onReset={() => {
              setV(EMPTY);
              setErrors({});
              setSent(false);
            }}
          />
        ) : (
          <motion.form
            key="form"
            exit={reduce ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: reduce ? 0 : 0.3 }}
            onSubmit={onSubmit}
            noValidate
            aria-label="Careers application"
            className="space-y-10"
          >
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
              {textField('name', 'Name', 'text', 'name')}
              <PhoneField
                id={`${uid}-phone`}
                dial={v.dial}
                onDialChange={(d) => set('dial', d)}
                value={v.phone}
                onChange={(p) => set('phone', p)}
                error={errors.phone}
                errorId={`${uid}-phone-error`}
              />
              {textField('email', 'Email', 'email', 'email')}
              {textField('location', 'Current Location', 'text', 'address-level2')}
            </div>

            {/* Experience — two large cards */}
            <fieldset aria-describedby={describedBy('experienced')}>
              <legend className={groupLabel}>Real Estate Experience</legend>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {(['yes', 'no'] as const).map((opt) => {
                  const on = v.experienced === opt;
                  return (
                    <button
                      key={opt}
                      id={`${uid}-exp-${opt}`}
                      type="button"
                      aria-pressed={on}
                      onClick={() => {
                        set('experienced', opt);
                        if (opt === 'no') set('years', '');
                      }}
                      className={`flex min-h-[64px] items-center justify-between gap-4 rounded-md border px-5 text-left transition-[border-color,background-color] duration-300 ${
                        on ? 'border-orange bg-orange-50' : 'border-line bg-white hover:border-charcoal/30'
                      }`}
                    >
                      <span className="text-base font-light text-charcoal">{opt === 'yes' ? 'Yes' : 'No'}</span>
                      <span
                        aria-hidden="true"
                        className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                          on ? 'border-orange bg-orange text-white' : 'border-line text-transparent'
                        }`}
                      >
                        <Check className="h-3.5 w-3.5" strokeWidth={2} />
                      </span>
                    </button>
                  );
                })}
              </div>
              {err('experienced')}
            </fieldset>

            {/* Years — only when experienced */}
            <AnimatePresence initial={false}>
              {v.experienced === 'yes' ? (
                <motion.fieldset
                  key="years"
                  initial={reduce ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={reduce ? undefined : { opacity: 0, height: 0 }}
                  transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                  aria-describedby={describedBy('years')}
                >
                  <legend className={groupLabel}>Years of Experience</legend>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {cfg.experienceYears.map((y, i) => (
                      <button
                        key={y}
                        id={`${uid}-years-${i}`}
                        type="button"
                        aria-pressed={v.years === y}
                        onClick={() => set('years', y)}
                        className={chipClass(v.years === y)}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                  {err('years')}
                </motion.fieldset>
              ) : null}
            </AnimatePresence>

            {/* Languages — multi-select chips */}
            <fieldset aria-describedby={describedBy('languages')}>
              <legend className={groupLabel}>
                Languages Spoken <span className="normal-case tracking-normal text-charcoal-muted/70">— choose all that apply</span>
              </legend>
              <div className="mt-4 flex flex-wrap gap-2">
                {cfg.languages.map((lang, i) => {
                  const on = v.languages.includes(lang);
                  return (
                    <button
                      key={lang}
                      id={`${uid}-lang-${i}`}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleLanguage(lang)}
                      className={chipClass(on)}
                    >
                      {lang}
                    </button>
                  );
                })}
              </div>
              {err('languages')}
            </fieldset>

            {/* CV upload */}
            <div>
              <span id={`${uid}-cv-label`} className={groupLabel}>
                Upload CV
              </span>
              <input
                ref={fileRef}
                id={`${uid}-cv`}
                type="file"
                accept={cfg.cv.accept}
                onChange={onFile}
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
              />
              {v.cv ? (
                <div className="mt-4 flex items-center justify-between gap-4 rounded-md border border-orange/40 bg-orange-50 px-5 py-4">
                  <span className="flex min-w-0 items-center gap-3">
                    <FileText aria-hidden="true" strokeWidth={1.5} className="h-5 w-5 shrink-0 text-orange" />
                    <span className="min-w-0">
                      <span className="block truncate text-[15px] text-charcoal">{v.cv.name}</span>
                      <span className="block text-[12px] font-light text-charcoal-muted">{formatSize(v.cv.size)}</span>
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-4">
                    <button
                      id={`${uid}-cv-button`}
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="text-[11px] font-medium uppercase tracking-eyebrow text-charcoal hover:text-orange"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={clearFile}
                      aria-label={`Remove ${v.cv.name}`}
                      className="text-charcoal-muted hover:text-orange"
                    >
                      <X aria-hidden="true" strokeWidth={1.75} className="h-4 w-4" />
                    </button>
                  </span>
                </div>
              ) : (
                <button
                  id={`${uid}-cv-button`}
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  aria-labelledby={`${uid}-cv-label ${uid}-cv-hint`}
                  aria-describedby={describedBy('cv')}
                  className={`mt-4 flex w-full items-center gap-4 rounded-md border border-dashed px-5 py-6 text-left transition-colors duration-300 hover:border-orange hover:bg-orange-50/50 ${
                    errors.cv ? 'border-orange' : 'border-charcoal/25'
                  }`}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream text-charcoal">
                    <Upload aria-hidden="true" strokeWidth={1.5} className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-[15px] text-charcoal">Choose a file</span>
                    <span id={`${uid}-cv-hint`} className="block text-[12px] font-light text-charcoal-muted">
                      PDF or Word document, up to 5 MB
                    </span>
                  </span>
                </button>
              )}
              {err('cv')}
            </div>

            <div className="space-y-6 border-t border-line pt-8">
              {failed ? <SendError /> : null}
              <button
                type="submit"
                disabled={sending}
                className="group inline-flex h-14 w-full items-center justify-center gap-3 bg-orange px-10 text-[11px] font-medium uppercase tracking-eyebrow text-white transition-colors duration-300 hover:bg-orange-600 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
              >
                {sending ? 'Sending…' : cfg.submitLabel}
                <span aria-hidden="true" className="transition-transform duration-500 ease-premium group-hover:translate-x-1.5">
                  &rarr;
                </span>
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
