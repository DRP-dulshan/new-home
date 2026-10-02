/**
 * Underline inputs with a floating label, shared by the contact form and the
 * multi-step lead forms. Inputs need `placeholder=" "` for the label to float.
 */
export const inputBase =
  'peer w-full border-0 border-b border-line bg-transparent pb-2.5 pt-6 text-[15px] font-light text-charcoal outline-none transition-colors duration-300 placeholder-shown:pt-6 focus:border-orange';

export const labelBase =
  'pointer-events-none absolute left-0 top-0 text-[11px] font-medium uppercase tracking-eyebrow text-charcoal-muted transition-all duration-300 peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-charcoal-muted/70 peer-focus:top-0 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-eyebrow peer-focus:text-orange';

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
