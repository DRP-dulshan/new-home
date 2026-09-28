import SmartLink from './SmartLink';

type Tone = 'light' | 'dark';

type Props = {
  href: string;
  label: string;
  external?: boolean;
  tone?: Tone;
  className?: string;
};

/**
 * The house text link: small uppercase, wide tracking, hairline underline that
 * wipes in on hover while the arrow slides right and turns orange.
 * Used in the hero and at the foot of sections — never styled as a button.
 */
export default function ArrowLink({
  href,
  label,
  external,
  tone = 'dark',
  className = '',
}: Props) {
  const toneClass = tone === 'light' ? 'text-white' : 'text-charcoal';

  return (
    <SmartLink
      href={href}
      external={external}
      className={`link-underline group py-1 text-[11px] font-medium sm:text-xs ${toneClass} ${className}`}
    >
      <span>{label}</span>
      <span
        aria-hidden="true"
        className="translate-x-0 text-current transition-[transform,color] duration-500 ease-premium group-hover:translate-x-1.5 group-hover:text-orange group-focus-visible:translate-x-1.5 group-focus-visible:text-orange"
      >
        &rarr;
      </span>
    </SmartLink>
  );
}
