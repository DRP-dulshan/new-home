import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import SmartLink from '../ui/SmartLink';

type Props = {
  title: string;
  text: string;
  cta: string;
  href: string;
  image: string;
  alt: string;
  /** Small line above the title, e.g. a project count */
  meta?: string;
  priority?: boolean;
};

/**
 * Wide signpost card for the off-plan section: photo on the left (on top on
 * phones), title, one line and an arrow link on the right.
 */
export default function ChoiceCard({ title, text, cta, href, image, alt, meta, priority }: Props) {
  return (
    <SmartLink
      href={href}
      className="group grid h-full overflow-hidden bg-white transition-shadow duration-500 hover:shadow-[0_18px_40px_rgba(26,26,26,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange sm:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-line sm:aspect-auto sm:min-h-[260px]">
        <Image
          src={image}
          alt={alt}
          fill
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          sizes="(max-width: 640px) 100vw, 40vw"
          className="object-cover transition-transform duration-[900ms] ease-premium group-hover:scale-[1.05]"
        />
      </div>
      <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
        {meta ? <p className="text-[10px] uppercase tracking-eyebrow text-charcoal-muted">{meta}</p> : null}
        <h3 className={`${meta ? 'mt-3' : ''} font-serif text-[1.75rem] leading-tight text-charcoal sm:text-[2rem]`}>
          {title}
        </h3>
        <span aria-hidden="true" className="mt-4 block h-px w-12 bg-orange" />
        <p className="mt-5 max-w-md font-light leading-relaxed text-charcoal-muted">{text}</p>
        <span className="mt-7 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-eyebrow text-orange">
          {cta}
          <ArrowRight
            aria-hidden="true"
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
            strokeWidth={1.5}
          />
        </span>
      </div>
    </SmartLink>
  );
}
