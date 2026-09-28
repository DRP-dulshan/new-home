'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import type { NavNode } from '@/data/navigation';
import { navCta } from '@/data/navigation';
import SmartLink from '../ui/SmartLink';

type Props = {
  node: NavNode;
  ctaHref: string;
  onNavigate: () => void;
};

export default function MegaPanel({ node, ctaHref, onNavigate }: Props) {
  const reduce = useReducedMotion();
  const columns = node.columns ?? [];

  /* The header is dark in both states now, so the panel is always dark too. */
  const text = 'text-white';
  const muted = 'text-white/55';
  const rule = 'border-white/15';

  return (
    <motion.div
      key={node.id}
      initial={reduce ? false : { opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 1 } : { opacity: 0, y: -6 }}
      transition={{ duration: reduce ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
      /* py is modest so the panel hugs its content */
      className="container-drp py-9"
    >
      <div className="flex items-start justify-between gap-16">
        {/* ---------- Link columns ----------
             Equal fractions so the columns spread across the container rather
             than bunching on the left when a panel has no promo. */}
        <div
          className="grid min-w-0 flex-1 gap-x-16"
          style={{
            gridTemplateColumns: node.promo
              ? /* promo fills the right, so columns hug their content */
                `repeat(${columns.length}, minmax(0, max-content))`
              : /* no promo — spread evenly so the panel never looks left-heavy */
                `repeat(${columns.length}, minmax(0, 1fr))`,
          }}
        >
          {columns.map((column) => (
            <div key={column.title} className="min-w-0">
              <p className="eyebrow text-orange">{column.title}</p>

              <ul className="mt-5 space-y-3.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <SmartLink
                      href={link.href}
                      external={link.external}
                      onClick={onNavigate}
                      data-mega-link=""
                      className={`group inline-flex items-center gap-2 whitespace-nowrap text-[16px] leading-snug transition-colors duration-300 hover:text-orange ${
                        link.accent ? 'font-medium text-orange' : `font-light ${text}`
                      }`}
                    >
                      <span className="relative">
                        {link.label}
                        <span
                          className={`absolute -bottom-0.5 left-0 h-px w-full bg-orange transition-transform duration-500 ease-premium group-hover:origin-left group-hover:scale-x-100 group-focus-visible:origin-left group-focus-visible:scale-x-100 ${
                            link.accent ? 'origin-left scale-x-100' : 'origin-right scale-x-0'
                          }`}
                        />
                      </span>
                      <span
                        aria-hidden="true"
                        className={`text-sm text-orange transition-[transform,opacity] duration-300 ease-premium group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 ${
                          link.accent ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0'
                        }`}
                      >
                        &rarr;
                      </span>
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ---------- Promo fills the right side ---------- */}
        {node.promo ? (
          <SmartLink
            href={node.promo.href}
            onClick={onNavigate}
            data-mega-link=""
            className="group hidden w-[17rem] shrink-0 xl:block"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink">
              <Image
                src={node.promo.image}
                alt={node.promo.alt}
                fill
                sizes="272px"
                className="object-cover transition-transform duration-[700ms] ease-premium group-hover:scale-[1.06]"
              />
            </div>
            <h3 className={`mt-3.5 font-serif text-lg font-normal leading-snug ${text}`}>
              {node.promo.title}
            </h3>
            <span
              className={`mt-1.5 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-eyebrow transition-colors duration-300 ${muted} group-hover:text-orange`}
            >
              {node.promo.linkLabel}
              <span
                aria-hidden="true"
                className="transition-transform duration-500 ease-premium group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </span>
          </SmartLink>
        ) : null}
      </div>

      {/* ---------- Closing CTA, bottom-right above a single hairline ---------- */}
      <div className={`mt-8 flex justify-end border-t pt-5 ${rule}`}>
        <SmartLink
          href={ctaHref}
          onClick={onNavigate}
          data-mega-link=""
          className={`group inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-eyebrow transition-colors duration-300 hover:text-orange ${text}`}
        >
          {navCta.label}
          <span
            aria-hidden="true"
            className="transition-transform duration-500 ease-premium group-hover:translate-x-1.5"
          >
            &rarr;
          </span>
        </SmartLink>
      </div>
    </motion.div>
  );
}
