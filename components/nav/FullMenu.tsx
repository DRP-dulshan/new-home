'use client';

import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { contact, footer } from '@/data/homepage';
import { fullMenu } from '@/data/navigation';
import SmartLink from '../ui/SmartLink';

/** The X logo (lucide only ships the old bird). */
function XLogo({ className }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77L17.75 3Zm-1.08 16.18h1.7L7.4 4.73H5.58l11.09 14.45Z" />
    </svg>
  );
}

const socialIcons: Record<string, typeof Instagram | typeof XLogo> = {
  Instagram,
  Facebook,
  LinkedIn: Linkedin,
  X: XLogo,
};

type Props = {
  id: string;
  onClose: () => void;
  /** Focused again when the overlay closes. */
  toggleRef: React.RefObject<HTMLElement>;
};

export default function FullMenu({ id, onClose, toggleRef }: Props) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  /* Escape closes; Tab is trapped between the toggle and the overlay. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const toggle = toggleRef.current;
      const inPanel = Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ) ?? [],
      );
      const focusables = [...(toggle ? [toggle] : []), ...inPanel];
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey && (active === first || !focusables.includes(active as HTMLElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, toggleRef]);

  /* Move focus into the overlay when it opens */
  useEffect(() => {
    const firstLink = panelRef.current?.querySelector<HTMLElement>('a[href]');
    firstLink?.focus();
  }, []);

  const item = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.55,
            delay: 0.12 + i * 0.045,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };

  return (
    <motion.div
      id={id}
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[60] flex flex-col overflow-y-auto overscroll-contain bg-ink"
    >
      {/* Top row is left empty — the header's own logo and X sit above this */}
      <div className="h-16 shrink-0 lg:h-[72px]" />

      <nav aria-label="Full menu" className="container-drp flex-1 py-6">
        <ul className="grid gap-x-16 gap-y-1 sm:grid-cols-2 lg:max-w-4xl">
          {fullMenu.map((link, i) => (
            <motion.li key={link.href} {...item(i)}>
              <SmartLink
                href={link.href}
                external={link.external}
                onClick={onClose}
                className={`group flex items-center gap-4 py-2 font-serif text-[clamp(1.75rem,4vw,2.75rem)] font-light leading-tight transition-colors duration-300 ${
                  link.accent ? 'text-orange hover:text-white' : 'text-white hover:text-orange'
                }`}
              >
                <span className="relative">
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-orange transition-transform duration-500 ease-premium group-hover:origin-left group-hover:scale-x-100 group-focus-visible:origin-left group-focus-visible:scale-x-100" />
                </span>
              </SmartLink>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* Office, phone, email and socials */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.5 }}
        className="shrink-0 border-t border-white/10"
      >
        <div className="container-drp flex flex-col gap-6 py-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2 text-sm font-light text-white/60">
            <p className="text-[10px] uppercase tracking-eyebrow text-white/35">Office</p>
            <a
              href={contact.mapHref}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-white/75 transition-colors duration-300 hover:text-orange"
            >
              {contact.addressLine}, Dubai
            </a>
            <a
              href={contact.phoneHref}
              className="block transition-colors duration-300 hover:text-orange"
            >
              {contact.phone}
            </a>
            <a
              href={contact.emailHref}
              className="block break-words transition-colors duration-300 hover:text-orange"
            >
              {contact.email}
            </a>
          </div>

          <ul className="flex items-center gap-3">
            {footer.socials.map((social) => {
              const Icon = socialIcons[social.label];
              return (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors duration-300 hover:border-orange hover:bg-orange hover:text-white"
                  >
                    {Icon ? (
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden="true" />
                    ) : (
                      <span className="text-xs">{social.label.charAt(0)}</span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
}
