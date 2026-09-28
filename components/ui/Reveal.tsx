'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** Stagger offset in seconds for items revealed in a group. */
  delay?: number;
  /** Distance travelled on the y axis, in px. */
  y?: number;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'span';
};

/**
 * Scroll-triggered fade + rise. Collapses to a plain fade-free render when the
 * visitor prefers reduced motion.
 */
export default function Reveal({ children, delay = 0, y = 28, className, as = 'div' }: Props) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}
