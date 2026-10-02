'use client';

import { ChevronDown } from 'lucide-react';
import { DIAL_CODES } from '@/lib/phone';
import { inputBase, labelBase } from './formStyles';

type Props = {
  id: string;
  dial: string;
  onDialChange: (dial: string) => void;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  errorId: string;
  label?: string;
};

/** Dial code (UAE by default) + local number, with a floating label. */
export default function PhoneField({
  id,
  dial,
  onDialChange,
  value,
  onChange,
  error,
  errorId,
  label = 'Phone / WhatsApp',
}: Props) {
  return (
    <div>
      <div className="flex items-end gap-4">
        <div className="relative shrink-0">
          <span className="block text-[11px] font-medium uppercase tracking-eyebrow text-charcoal-muted">Code</span>
          {/* The native select sits invisibly over the short code so mobile
              visitors get the system picker. */}
          <div className="relative mt-[9px] flex items-center gap-1.5 border-b border-line pb-2.5 text-[15px] font-light text-charcoal transition-colors duration-300 focus-within:border-orange has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-orange">
            {dial}
            <ChevronDown aria-hidden="true" strokeWidth={1.5} className="h-3.5 w-3.5 text-charcoal-muted" />
            <select
              id={`${id}-dial`}
              name="dialCode"
              aria-label="Country dialling code"
              value={dial}
              onChange={(e) => onDialChange(e.target.value)}
              className="absolute inset-0 cursor-pointer opacity-0"
            >
              {DIAL_CODES.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.country} ({d.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative min-w-0 flex-1">
          <input
            id={id}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder=" "
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={`${inputBase} ${error ? 'border-orange' : ''}`}
          />
          <label htmlFor={id} className={labelBase}>
            {label}
          </label>
        </div>
      </div>
      {error ? (
        <p id={errorId} role="alert" className="mt-3 text-xs text-orange-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
