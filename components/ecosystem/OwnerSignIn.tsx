'use client';

import { useId, useState, type FormEvent } from 'react';
import { EMAIL_PATTERN, inputBase, labelBase } from '../ui/formStyles';
import SmartLink from '../ui/SmartLink';

/**
 * Demo sign-in. There is no portal backend yet, so the form validates and then
 * explains how owners get access. The password is never logged or sent.
 */
export default function OwnerSignIn() {
  const uid = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [notice, setNotice] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!EMAIL_PATTERN.test(email.trim())) next.email = 'Please enter the email address you registered with.';
    if (password.length < 6) next.password = 'Please enter your password.';
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(`${uid}-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    // TODO: connect to the owner portal authentication service
    setPassword('');
    setNotice(true);
  };

  return (
    <div className="bg-white px-6 py-10 shadow-[0_24px_70px_-30px_rgba(26,26,26,0.18)] sm:px-10 sm:py-12">
      <p className="eyebrow text-orange">Owner Portal</p>
      <h2 className="heading-display mt-4 text-[clamp(1.9rem,3.4vw,2.6rem)] text-charcoal">Sign in</h2>

      {notice ? (
        <div role="status" className="mt-8 border-l-2 border-orange bg-cream px-5 py-4 text-[14px] font-light leading-relaxed text-charcoal">
          Online access is being rolled out to owners. Your DRP account manager will email your login details — in the meantime, statements and documents are available on request.
        </div>
      ) : null}

      <form onSubmit={onSubmit} noValidate className="mt-8 space-y-9">
        <div className="relative">
          <input
            id={`${uid}-email`}
            type="email"
            autoComplete="username"
            placeholder=" "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${uid}-email-error` : undefined}
            className={`${inputBase} ${errors.email ? 'border-orange' : ''}`}
          />
          <label htmlFor={`${uid}-email`} className={labelBase}>Email</label>
          {errors.email ? (
            <p id={`${uid}-email-error`} role="alert" className="mt-2 text-xs text-orange-600">{errors.email}</p>
          ) : null}
        </div>
        <div className="relative">
          <input
            id={`${uid}-password`}
            type="password"
            autoComplete="current-password"
            placeholder=" "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? `${uid}-password-error` : undefined}
            className={`${inputBase} ${errors.password ? 'border-orange' : ''}`}
          />
          <label htmlFor={`${uid}-password`} className={labelBase}>Password</label>
          {errors.password ? (
            <p id={`${uid}-password-error`} role="alert" className="mt-2 text-xs text-orange-600">{errors.password}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            className="inline-flex h-14 items-center justify-center gap-3 bg-orange px-10 text-[11px] font-medium uppercase tracking-eyebrow text-white transition-colors duration-300 hover:bg-orange-600"
          >
            Sign In <span aria-hidden="true">&rarr;</span>
          </button>
          <SmartLink href="/contact" className="link-underline text-[11px] font-medium text-charcoal">
            Request access
          </SmartLink>
        </div>
      </form>
    </div>
  );
}
