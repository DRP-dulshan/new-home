import PageHero from '@/components/PageHero';
import SiteShell from '@/components/layout/SiteShell';
import OwnerSignIn from '@/components/ecosystem/OwnerSignIn';
import Reveal from '@/components/ui/Reveal';
import { ownerPortal } from '@/data/ecosystem';
import { unsplash } from '@/lib/media';

export const metadata = { title: 'Owner Portal | Dubai Rapid Properties' };

export default function Page() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="For Owners"
        heading="Owner Portal"
        intro="Statements, occupancy, tenancy and maintenance for every property DRP manages for you — in one place."
        image={unsplash('1616486338812-3dadae4b4ace', 2000)}
        imageAlt="A bright living room in a DRP-managed home"
      />
      <section aria-labelledby="portal-heading" className="section-y bg-cream">
        <div className="container-drp grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <p className="eyebrow text-orange">Inside the Portal</p>
            <h2 id="portal-heading" className="heading-display mt-5 text-[clamp(2rem,4vw,3.25rem)] text-charcoal">
              Everything about your property
            </h2>
            <ul className="mt-10 grid grid-cols-1 gap-x-10 border-t border-line sm:grid-cols-2">
              {ownerPortal.features.map((f, i) => (
                <Reveal as="li" key={f.title} delay={i * 0.04} className="border-b border-line py-6">
                  <h3 className="font-serif text-[1.35rem] text-charcoal">{f.title}</h3>
                  <p className="mt-2 text-sm font-light text-charcoal-muted">{f.text}</p>
                </Reveal>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6">
            <OwnerSignIn />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
