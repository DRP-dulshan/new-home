'use client';

import { Heart } from 'lucide-react';
import { useFavourites } from '@/lib/favourites';
import SmartLink from '../ui/SmartLink';

/** Header shortcut to /properties/saved, shown once something is saved. */
export default function SavedLink({ className = '' }: { className?: string }) {
  const { saved } = useFavourites();
  if (!saved.length) return null;
  return (
    <SmartLink
      href="/properties/saved"
      aria-label={`Saved properties (${saved.length})`}
      className={`relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/40 text-white transition-colors duration-300 hover:border-orange hover:bg-orange ${className}`}
    >
      <Heart aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
      <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-orange px-1 text-[10px] font-medium leading-none text-white">
        {saved.length}
      </span>
    </SmartLink>
  );
}
