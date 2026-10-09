'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { currencies, type CurrencyCode } from '@/data/currency';

/** The visitor's display currency, remembered in this browser. */
const KEY = 'drp:currency';
const EVENT = 'drp:currency';

function read(): CurrencyCode {
  try {
    const v = window.localStorage.getItem(KEY);
    return currencies.some((c) => c.code === v) ? (v as CurrencyCode) : 'AED';
  } catch {
    return 'AED';
  }
}

function subscribe(onChange: () => void) {
  const onStorage = (e: StorageEvent) => e.key === KEY && onChange();
  window.addEventListener(EVENT, onChange);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener('storage', onStorage);
  };
}

export function useCurrency() {
  const code = useSyncExternalStore(subscribe, read, () => 'AED' as CurrencyCode);
  const setCode = useCallback((next: CurrencyCode) => {
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      /* Blocked storage: the choice holds until the page reloads */
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);
  return { code, setCode };
}
