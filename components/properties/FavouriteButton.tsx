'use client';

import { Heart } from 'lucide-react';
import { useFavourites } from '@/lib/favourites';

type Props = {
  slug: string;
  title: string;
  /** `overlay` sits on a card photo; `inline` is a labelled button on the listing page */
  variant?: 'overlay' | 'inline';
};

/** Adds a listing to, or removes it from, the visitor's shortlist. */
export default function FavouriteButton({ slug, title, variant = 'overlay' }: Props) {
  const { has, toggle } = useFavourites();
  const saved = has(slug);
  const label = saved ? `Remove ${title} from saved properties` : `Save ${title}`;

  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={() => toggle(slug)}
        aria-pressed={saved}
        className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[12px] transition-colors duration-300 ${
          saved ? 'border-orange bg-orange text-white' : 'border-charcoal/20 text-charcoal hover:border-orange hover:text-orange'
        }`}
      >
        <Heart aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} fill={saved ? 'currentColor' : 'none'} />
        {saved ? 'Saved' : 'Save'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        /* The card around it is a link */
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      aria-pressed={saved}
      aria-label={label}
      title={saved ? 'Saved' : 'Save'}
      className={`absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition-colors duration-300 ${
        saved ? 'bg-orange text-white' : 'bg-white/90 text-charcoal hover:text-orange'
      }`}
    >
      <Heart aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} fill={saved ? 'currentColor' : 'none'} />
    </button>
  );
}
