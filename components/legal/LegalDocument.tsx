import type { LegalDoc } from '@/data/legal';
import SiteShell from '../layout/SiteShell';
import SmartLink from '../ui/SmartLink';

/** Plain, readable legal page with an in-page table of contents. */
export default function LegalDocument({ doc, other }: { doc: LegalDoc; other: { label: string; href: string } }) {
  return (
    <SiteShell>
      <article className="bg-white pb-[var(--section-y)] pt-28 sm:pt-36">
        <div className="container-drp">
          <p className="eyebrow text-orange">Legal</p>
          <h1 className="heading-display mt-5 text-[clamp(2.4rem,5vw,4rem)] text-charcoal">{doc.title}</h1>
          <p className="mt-4 text-[11px] uppercase tracking-eyebrow text-charcoal-muted">Last updated {doc.updated}</p>

          <div className="mt-12 grid grid-cols-1 gap-12 border-t border-line pt-12 lg:grid-cols-12 lg:gap-16">
            <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
              <p className="text-[10px] uppercase tracking-eyebrow text-charcoal-muted">On this page</p>
              <ol className="mt-4 space-y-2.5">
                {doc.sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="text-[14px] font-light text-charcoal transition-colors duration-300 hover:text-orange">
                      {i + 1}. {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
              <SmartLink href={other.href} className="link-underline mt-8 text-[11px] font-medium text-charcoal">
                {other.label} <span aria-hidden="true">&rarr;</span>
              </SmartLink>
            </nav>

            <div className="max-w-2xl lg:col-span-8">
              <p className="text-[17px] font-light leading-relaxed text-charcoal-light">{doc.intro}</p>
              {doc.sections.map((s, i) => (
                <section key={s.id} id={s.id} className="mt-12 scroll-mt-28">
                  <h2 className="font-serif text-[1.7rem] font-light text-charcoal">
                    {i + 1}. {s.heading}
                  </h2>
                  <div className="mt-4 space-y-4">
                    {s.paragraphs.map((p, j) => (
                      <p key={j} className="text-[15px] font-light leading-[1.8] text-charcoal-light">
                        {p}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </article>
    </SiteShell>
  );
}
