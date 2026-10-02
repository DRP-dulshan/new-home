import { MessageCircle, Phone } from 'lucide-react';
import { contact } from '@/data/homepage';
import SmartLink from '../ui/SmartLink';

type Props = {
  eyebrow: string;
  heading: string;
  text?: string;
  button: { label: string; href: string };
  /** Pre-filled WhatsApp message. */
  whatsappText?: string;
};

/** Dark closing band: one button, with phone and WhatsApp beside it. */
export default function CtaBand({ eyebrow, heading, text, button, whatsappText }: Props) {
  const whatsappHref = whatsappText
    ? `${contact.whatsappHref}?text=${encodeURIComponent(whatsappText)}`
    : contact.whatsappHref;

  return (
    <section aria-labelledby="cta-heading" className="section-y bg-ink text-white">
      <div className="container-drp flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow text-orange">{eyebrow}</p>
          <h2
            id="cta-heading"
            className="heading-display mt-5 max-w-[18ch] text-[clamp(2rem,4.6vw,3.75rem)] text-white"
          >
            {heading}
          </h2>
          {text ? (
            <p className="mt-5 max-w-lg text-[15px] font-light leading-relaxed text-white/60">{text}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
          <SmartLink
            href={button.href}
            className="group inline-flex h-14 items-center justify-center gap-3 bg-orange px-10 text-[11px] font-medium uppercase tracking-eyebrow text-white transition-colors duration-300 hover:bg-orange-600"
          >
            {button.label}
            <span
              aria-hidden="true"
              className="transition-transform duration-500 ease-premium group-hover:translate-x-1.5"
            >
              &rarr;
            </span>
          </SmartLink>
          <ul className="flex flex-col gap-3 text-sm font-light sm:gap-2">
            <li>
              <a
                href={contact.phoneHref}
                className="inline-flex items-center gap-2.5 text-white/80 transition-colors duration-300 hover:text-orange"
              >
                <Phone aria-hidden="true" strokeWidth={1.5} className="h-4 w-4" />
                {contact.phone}
              </a>
            </li>
            <li>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-white/80 transition-colors duration-300 hover:text-orange"
              >
                <MessageCircle aria-hidden="true" strokeWidth={1.5} className="h-4 w-4" />
                WhatsApp {contact.whatsapp}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
