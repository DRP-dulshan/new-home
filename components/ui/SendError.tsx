import { contact } from '@/data/homepage';

/** Shown when a form could not be sent: points to the direct lines instead. */
export default function SendError() {
  return (
    <p role="alert" className="border-l-2 border-orange bg-cream px-4 py-3 text-[13px] font-light leading-relaxed text-charcoal">
      Sorry, your message could not be sent. Please try again, or call{' '}
      <a href={contact.phoneHref} className="link-underline whitespace-nowrap text-charcoal">
        {contact.phone}
      </a>{' '}
      or{' '}
      <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="link-underline text-charcoal">
        WhatsApp us
      </a>
      .
    </p>
  );
}
