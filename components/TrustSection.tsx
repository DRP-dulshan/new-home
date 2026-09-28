import { trust } from '@/data/homepage';
import ReviewsCarousel from './ReviewsCarousel';
import CountUp from './ui/CountUp';
import Reveal from './ui/Reveal';

export default function TrustSection() {
  return (
    <section aria-labelledby="trust-heading" className="section-y bg-ink text-white">
      <div className="container-drp">
        <Reveal>
          <h2 id="trust-heading" className="eyebrow text-orange">
            {trust.eyebrow}
          </h2>
        </Reveal>

        {/* Three facts, separated by hairline rules */}
        <div className="mt-12 grid grid-cols-1 divide-y divide-white/10 sm:mt-16 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {trust.stats.map((stat, i) => (
            <Reveal
              key={stat.id}
              delay={i * 0.12}
              className={`py-9 lg:py-0 ${i === 0 ? 'lg:pr-10 lg:pt-0' : 'lg:px-10'} ${
                i === trust.stats.length - 1 ? 'lg:pb-0 lg:pr-0' : ''
              }`}
            >
              <p className="text-[10px] uppercase tracking-eyebrow text-white/40">
                {stat.label}
              </p>

              {stat.value ? (
                <p className="mt-4 font-serif text-[clamp(3.5rem,8vw,5.5rem)] font-light leading-none text-white">
                  <CountUp from={stat.countFrom ?? 1990} to={stat.value} />
                </p>
              ) : (
                <p className="mt-4 max-w-[14ch] font-serif text-[clamp(1.75rem,3.4vw,2.6rem)] font-light leading-[1.15] text-white">
                  {stat.title}
                </p>
              )}

              <p className="mt-5 max-w-sm text-sm font-light leading-relaxed text-white/55">
                {stat.support}
              </p>
            </Reveal>
          ))}
        </div>
      </div>

      <ReviewsCarousel />
    </section>
  );
}
