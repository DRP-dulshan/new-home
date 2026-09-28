'use client';

import { useId, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Search } from 'lucide-react';
import {
  exploreProperties,
  offPlanProjects,
  readyProperties,
  rentalProperties,
  searchData,
  searchFields,
  type Offering,
} from '@/data/homepage';
import PropertyCard from './PropertyCard';
import ArrowLink from './ui/ArrowLink';
import Reveal from './ui/Reveal';
import SectionHeading from './ui/SectionHeading';

/** Shared with the hero search so both build the same query strings. */
const slug = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/\+/g, '-plus')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

type Option = { value: string; label: string };

function Field({
  label,
  options,
  id,
  value,
  onChange,
  className = '',
}: {
  label: string;
  options: Option[];
  id: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={`min-w-0 flex-1 px-4 py-3 sm:px-5 sm:py-4 ${className}`}>
      <label
        htmlFor={id}
        className="block text-[10px] font-medium uppercase tracking-eyebrow text-charcoal-muted"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full cursor-pointer appearance-none bg-transparent text-[13px] font-light text-charcoal outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function ExploreProperties() {
  const [tab, setTab] = useState<Offering>('buy');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [third, setThird] = useState('');
  const [band, setBand] = useState('any');

  const router = useRouter();
  const reduce = useReducedMotion();
  const uid = useId();

  const fields = searchFields[tab];
  const activeTab = exploreProperties.tabs.find((t) => t.id === tab)!;

  const switchTab = (next: Offering) => {
    setTab(next);
    /* Bedrooms/Handover and the price scale differ per offering, so reset them. */
    setThird('');
    setBand('any');
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({ offering: tab });
    if (location) params.set('q', slug(location));
    if (propertyType) params.set('type', slug(propertyType));
    if (third) params.set(fields.thirdParam, slug(third));

    const selected = fields.bands.find((b) => b.id === band);
    if (selected?.min) params.set('min', String(selected.min));
    if (selected?.max) params.set('max', String(selected.max));

    router.push(`${searchData.destinations[tab]}?${params.toString()}`);
  };

  const withAny = (options: string[], anyLabel: string): Option[] => [
    { value: '', label: anyLabel },
    ...options.map((o) => ({ value: o, label: o })),
  ];

  return (
    <section id="properties" aria-labelledby="properties-heading" className="section-y bg-white">
      <div className="container-drp">
        <div className="lg:flex lg:items-end lg:justify-between lg:gap-12">
          <SectionHeading
            eyebrow={exploreProperties.eyebrow}
            heading={exploreProperties.heading}
            headingId="properties-heading"
          />

          {/* ---------- Tabs with a sliding orange indicator ---------- */}
          <Reveal delay={0.12}>
            <div
              role="tablist"
              aria-label="Property offering"
              /* Tighter tracking and gaps keep all three on one row at 375px;
                 the scroll container is a fallback for very narrow screens. */
              className="no-scrollbar -mx-5 mt-8 flex items-center gap-5 overflow-x-auto px-5 sm:mx-0 sm:gap-8 sm:px-0 lg:mt-0 lg:pb-3"
            >
              {exploreProperties.tabs.map((t) => {
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    role="tab"
                    id={`${uid}-tab-${t.id}`}
                    aria-selected={active}
                    aria-controls={`${uid}-panel`}
                    onClick={() => switchTab(t.id)}
                    className={`relative shrink-0 whitespace-nowrap pb-2 text-[10px] font-medium uppercase tracking-[0.18em] transition-colors duration-300 sm:text-xs sm:tracking-eyebrow ${
                      active ? 'text-charcoal' : 'text-charcoal-muted hover:text-charcoal'
                    }`}
                  >
                    {t.label}
                    {active ? (
                      <motion.span
                        layoutId="property-tab-indicator"
                        className="absolute inset-x-0 -bottom-px h-[2px] bg-orange"
                        transition={
                          reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }
                        }
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>

        {/* ---------- Search bar — third and fourth fields follow the tab ---------- */}
        <Reveal delay={0.16}>
          <form
            role="search"
            aria-label="Property search"
            onSubmit={submit}
            className="mt-10 border border-line bg-white sm:mt-12 lg:mt-14"
          >
            <div className="grid grid-cols-2 lg:flex lg:flex-row">
              <Field
                id={`${uid}-loc`}
                label="Location"
                value={location}
                onChange={setLocation}
                options={withAny(searchData.locations, 'All Locations')}
                className="border-b border-r border-line lg:border-b-0"
              />
              <Field
                id={`${uid}-type`}
                label="Property Type"
                value={propertyType}
                onChange={setPropertyType}
                options={withAny(searchData.propertyTypes, 'All Types')}
                className="border-b border-line lg:border-b-0 lg:border-r"
              />
              <Field
                /* Bedrooms on Buy/Rent, Handover on Off-Plan */
                id={`${uid}-third`}
                label={fields.thirdLabel}
                value={third}
                onChange={setThird}
                options={withAny(fields.thirdOptions, 'Any')}
                className="border-b border-r border-line lg:border-b-0"
              />
              <Field
                id={`${uid}-price`}
                label={fields.priceLabel}
                value={band}
                onChange={setBand}
                options={fields.bands.map((b) => ({ value: b.id, label: b.label }))}
                className="border-b border-line lg:border-b-0 lg:border-r"
              />
              <button
                type="submit"
                className="col-span-2 flex items-center justify-center gap-2.5 bg-charcoal px-8 py-5 text-[11px] font-medium uppercase tracking-eyebrow text-white transition-colors duration-300 hover:bg-orange lg:col-span-1 lg:py-0"
              >
                <Search className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                Search
              </button>
            </div>
          </form>
        </Reveal>

        {/* ---------- Cards ---------- */}
        <div className="relative mt-10 sm:mt-14">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab}
              role="tabpanel"
              id={`${uid}-panel`}
              aria-labelledby={`${uid}-tab-${tab}`}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0, y: -12 }}
              transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-7"
            >
              {tab === 'buy'
                ? readyProperties.map((p) => <PropertyCard key={p.id} kind="ready" item={p} />)
                : tab === 'rent'
                  ? rentalProperties.map((p) => <PropertyCard key={p.id} kind="rent" item={p} />)
                  : offPlanProjects.map((p) => (
                      <PropertyCard key={p.id} kind="offplan" item={p} />
                    ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-14 border-t border-line pt-8">
            {/* Label and destination both follow the active tab */}
            <ArrowLink
              key={activeTab.id}
              href={activeTab.viewAll.href}
              label={activeTab.viewAll.label}
              tone="dark"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
