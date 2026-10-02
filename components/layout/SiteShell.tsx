import type { ReactNode } from 'react';
import Footer from '../Footer';
import Header from '../Header';
import WhatsAppFloat from '../WhatsAppFloat';

/** Header, main, footer and the WhatsApp button — the frame of every inner page. */
export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
