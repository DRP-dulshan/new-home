import { solutions } from '@/data/homepage';
import SolutionTile from './SolutionTile';
import { tileSpanClasses } from './solutionLayout';
import Reveal from './ui/Reveal';
import SectionHeading from './ui/SectionHeading';

export default function Solutions() {
  return (
    <section id="solutions" aria-labelledby="solutions-heading" className="section-y bg-white">
      <div className="container-drp">
        <div className="lg:flex lg:items-end lg:justify-between lg:gap-12">
          <SectionHeading
            eyebrow={solutions.eyebrow}
            heading={solutions.heading}
            headingId="solutions-heading"
            className="lg:max-w-2xl"
          />
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-charcoal-muted lg:mt-0 lg:pb-3 lg:text-right">
              {solutions.intro}
            </p>
          </Reveal>
        </div>

        {/* Bento grid — 2 columns on mobile, 4 from lg with mixed row spans */}
        <div className="mt-12 grid auto-rows-auto grid-cols-2 gap-2.5 sm:mt-14 sm:gap-4 lg:mt-16 lg:auto-rows-[clamp(210px,17.5vw,268px)] lg:grid-cols-4 lg:gap-5">
          {solutions.tiles.map((tile, i) => (
            /* Reveal is the grid item, so it carries the placement classes */
            <Reveal
              key={tile.id}
              delay={Math.min(i, 6) * 0.07}
              y={36}
              className={tileSpanClasses[tile.span]}
            >
              <SolutionTile tile={tile} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
