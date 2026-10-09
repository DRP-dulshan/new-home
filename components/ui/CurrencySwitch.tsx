'use client';

import { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { currencies, type CurrencyCode } from '@/data/currency';
import { useCurrency } from '@/lib/currency';

/** Chooses the currency prices are shown in; AED stays the price agreed. */
export default function CurrencySwitch({ className = '' }: { className?: string }) {
  const id = useId();
  const { code, setCode } = useCurrency();
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <label htmlFor={id} className="sr-only">
        Show prices in
      </label>
      <select
        id={id}
        value={code}
        onChange={(e) => setCode(e.target.value as CurrencyCode)}
        className="h-10 cursor-pointer appearance-none rounded-full border border-charcoal/20 bg-transparent pl-4 pr-9 text-[12px] text-charcoal outline-none transition-colors duration-300 hover:border-orange focus:border-orange"
      >
        {currencies.map((c) => (
          <option key={c.code} value={c.code}>
            {c.code}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 h-3.5 w-3.5 text-charcoal-muted" strokeWidth={1.5} />
    </div>
  );
}
