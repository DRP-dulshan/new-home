'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * The visitor's shortlist of listings, by slug. Lives in this browser only
 * (localStorage), so it needs no account; /properties/saved shows it and
 * lets the visitor send it to DRP on WhatsApp.
 */
const KEY = 'drp:saved-listings';
const EVENT = 'drp:saved-listings';
const EMPTY: string[] = [];

let cache: string[] | null = null;

function read(): string[] {
  if (cache) return cache;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) ?? '[]');
    cache = Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === 'string') : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: string[]) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* Private mode or blocked storage: the list still works for this visit */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      onChange();
    }
  };
  window.addEventListener(EVENT, onChange);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener('storage', onStorage);
  };
}

export function useFavourites() {
  const saved = useSyncExternalStore(subscribe, read, () => EMPTY);
  const toggle = useCallback((slug: string) => {
    const current = read();
    write(current.includes(slug) ? current.filter((s) => s !== slug) : [slug, ...current]);
  }, []);
  const clear = useCallback(() => write([]), []);
  return { saved, toggle, clear, has: (slug: string) => saved.includes(slug) };
}
