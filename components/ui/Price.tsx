'use client';

import { formatIn } from '@/data/currency';
import { useCurrency } from '@/lib/currency';

/** An AED price shown in the visitor's chosen currency. */
export default function Price({ aed }: { aed: number }) {
  const { code } = useCurrency();
  return <>{formatIn(aed, code)}</>;
}
