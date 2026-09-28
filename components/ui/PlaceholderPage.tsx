import Footer from '@/components/Footer';
import Header from '@/components/Header';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import ArrowLink from './ArrowLink';

type Props = {
  eyebrow: string;
  title: string;
  copy: string;
};

/**
 * DEMO PLACEHOLDER PAGE.
 *
 * Every route the menu points at exists so nothing 404s during a client
 * presentation. Replace these with the real pages as they are built.
 */
export default function PlaceholderPage({ eyebrow, title, copy }: Props) {
  return (
    <>
      <Header />
      <main className="flex min-h-[70vh] items-center bg-cream pb-24 pt-40 sm:pt-48">
        <div className="container-drp">
          <p className="eyebrow text-orange">{eyebrow}</p>
          <h1 className="heading-display mt-5 max-w-[18ch] text-[clamp(2.25rem,5vw,4rem)] text-charcoal">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-sm font-light leading-relaxed text-charcoal-muted sm:text-base">
            {copy}
          </p>
          <div className="mt-10 border-t border-line pt-8">
            <ArrowLink href="/" label="Back to Home" tone="dark" />
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
