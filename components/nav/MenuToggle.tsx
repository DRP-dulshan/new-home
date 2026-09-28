'use client';

import { motion, useReducedMotion } from 'framer-motion';

type Props = {
  open: boolean;
  onToggle: () => void;
  controls: string;
};

/**
 * The hamburger and the close X are the same button, so the icon can morph
 * between them and the X always lands exactly where the hamburger was.
 */
export default function MenuToggle({ open, onToggle, controls }: Props) {
  const reduce = useReducedMotion();
  const t = { duration: reduce ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] as const };

  const bar = 'absolute left-0 h-[1.5px] w-full origin-center rounded-full bg-current';

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={controls}
      aria-label={open ? 'Close menu' : 'Open menu'}
      className="relative -mr-1 flex h-11 w-11 shrink-0 items-center justify-center text-white transition-colors duration-300"
    >
      <span aria-hidden="true" className="relative block h-[14px] w-[26px]">
        <motion.span
          className={bar}
          initial={false}
          animate={open ? { top: 6, rotate: 45 } : { top: 0, rotate: 0 }}
          transition={t}
        />
        <motion.span
          className={bar}
          style={{ top: 6 }}
          initial={false}
          animate={open ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: reduce ? 0 : 0.15 }}
        />
        <motion.span
          className={bar}
          initial={false}
          animate={open ? { top: 6, rotate: -45 } : { top: 12, rotate: 0 }}
          transition={t}
        />
      </span>
    </button>
  );
}
