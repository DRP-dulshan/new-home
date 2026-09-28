import type { SolutionTile } from '@/data/homepage';

/**
 * Grid placement for each tile size. Applied to the animation wrapper in
 * Solutions.tsx (the real grid item), not to the tile itself.
 * Aspect-ratio drives height up to `lg`; row spans take over from `lg`.
 *
 * Lives in its own module (no 'use client') so the server-rendered Solutions
 * grid and the client SolutionTile can both import it.
 */
export const tileSpanClasses: Record<SolutionTile['span'], string> = {
  large: 'col-span-2 aspect-[4/5] sm:aspect-[16/10] lg:col-span-2 lg:row-span-2 lg:aspect-auto',
  standard: 'col-span-1 aspect-[3/4] sm:aspect-square lg:col-span-1 lg:row-span-1 lg:aspect-auto',
  tall: 'col-span-2 aspect-[16/10] sm:aspect-[2/1] lg:col-span-1 lg:row-span-2 lg:aspect-auto',
  wide: 'col-span-2 aspect-[16/10] sm:aspect-[2/1] lg:col-span-4 lg:row-span-1 lg:aspect-auto',
};

/** next/image `sizes` hint per tile footprint. */
export const tileImageSizes: Record<SolutionTile['span'], string> = {
  large: '(max-width: 1024px) 100vw, 50vw',
  standard: '(max-width: 1024px) 50vw, 25vw',
  tall: '(max-width: 1024px) 100vw, 25vw',
  wide: '100vw',
};
