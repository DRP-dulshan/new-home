'use client';

import { useState } from 'react';
import ListingGallery from '../properties/ListingGallery';
import type { CarPhoto } from '@/data/carFleet';

type Props = { exterior: CarPhoto[]; interior: CarPhoto[]; title: string };

const tabs = [
  { id: 'exterior', label: 'Exterior' },
  { id: 'interior', label: 'Interior' },
] as const;

/** Exterior / Interior switch over the shared photo gallery. */
export default function CarGallery({ exterior, interior, title }: Props) {
  const [tab, setTab] = useState<(typeof tabs)[number]['id']>('exterior');
  const images = tab === 'exterior' ? exterior : interior;

  return (
    <div>
      <div role="tablist" aria-label="Photos" className="flex gap-2">
        {tabs.map((t) => {
          const active = t.id === tab;
          const count = (t.id === 'exterior' ? exterior : interior).length;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`car-tab-${t.id}`}
              aria-selected={active}
              aria-controls="car-gallery-panel"
              onClick={() => setTab(t.id)}
              className={`flex h-11 items-center gap-2 rounded-full border px-6 text-[13px] transition-colors duration-300 ${
                active ? 'border-charcoal bg-charcoal text-white' : 'border-charcoal/20 bg-white text-charcoal hover:border-charcoal/50'
              }`}
            >
              {t.label}
              <span className={active ? 'text-white/60' : 'text-charcoal-muted'}>{count}</span>
            </button>
          );
        })}
      </div>
      <div id="car-gallery-panel" role="tabpanel" aria-labelledby={`car-tab-${tab}`} className="mt-8">
        {/* Remount per tab so the gallery starts on the first photo */}
        <ListingGallery key={tab} images={images} title={`${title} ${tab}`} />
      </div>
    </div>
  );
}
