import { contact, footer, site } from '@/data/homepage';
import SmartLink from './ui/SmartLink';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      <div className="container-drp py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={site.logos.white}
              alt={`${site.name} logo`}
              className="h-[72px] w-[135px] object-contain object-left"
            />
            <p className="mt-6 max-w-xs text-sm font-light leading-relaxed text-white/55">
              {footer.tagline}
            </p>

            <address className="mt-8 space-y-2 text-sm font-light not-italic text-white/70">
              <p className="text-white/45">{contact.addressFull}</p>
              <a
                href={contact.phoneHref}
                className="block transition-colors duration-300 hover:text-orange"
              >
                {contact.phone}
              </a>
              <a
                href={contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-colors duration-300 hover:text-orange"
              >
                WhatsApp {contact.whatsapp}
              </a>
              <a
                href={contact.emailHref}
                className="block break-words transition-colors duration-300 hover:text-orange"
              >
                {contact.email}
              </a>
            </address>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6 lg:col-start-5">
            {footer.columns.map((column) => (
              <nav key={column.heading} aria-label={column.heading}>
                <h2 className="eyebrow text-white/40">{column.heading}</h2>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <SmartLink
                        href={link.href}
                        className="text-sm font-light text-white/75 transition-colors duration-300 hover:text-orange"
                      >
                        {link.label}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          {/* Social */}
          <div className="lg:col-span-2 lg:col-start-11">
            <h2 className="eyebrow text-white/40">Follow</h2>
            <ul className="mt-5 space-y-3">
              {footer.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-light text-white/75 transition-colors duration-300 hover:text-orange"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Careers note */}
        <div className="mt-14 border-t border-white/10 pt-6">
          <p className="text-sm font-light text-white/55">
            {footer.careersNote.text}{' '}
            <SmartLink
              href={footer.careersNote.href}
              className="group inline-flex items-center gap-2 text-white transition-colors duration-300 hover:text-orange"
            >
              {footer.careersNote.linkLabel}
              <span
                aria-hidden="true"
                className="transition-[transform,color] duration-500 ease-premium group-hover:translate-x-1 group-hover:text-orange"
              >
                &rarr;
              </span>
            </SmartLink>
          </p>
        </div>

        {/* Legal bar */}
        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-light text-white/40">{footer.copyright}</p>
          <ul className="flex items-center gap-6">
            {footer.legal.map((item) => (
              <li key={item.label}>
                <SmartLink
                  href={item.href}
                  className="text-xs font-light text-white/40 transition-colors duration-300 hover:text-orange"
                >
                  {item.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
