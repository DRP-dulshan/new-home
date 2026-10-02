import Footer from '@/components/Footer';
import Header from '@/components/Header';
import PageHero from '@/components/PageHero';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import LatestLaunches from '@/components/offplan/LatestLaunches';
import ProjectExplorer from '@/components/offplan/ProjectExplorer';

export const metadata = { title: 'Off-Plan Investments in Dubai | Dubai Rapid Properties' };

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Off-Plan"
          heading="Off-Plan Investments in Dubai"
          intro="Selected new developments from Dubai's leading developers, with payment plans and handover timelines at a glance."
          // DEMO PLACEHOLDER – swap for DRP photography
          image="https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=2000&q=80"
          imageAlt="The Downtown Dubai skyline at dusk"
        />
        <LatestLaunches />
        <ProjectExplorer />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
