'use client';

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { facets, projects, type Facet, type FacetKey, type Project } from '@/data/offPlan';
import SectionHeading from '../ui/SectionHeading';
import ProjectCard from './ProjectCard';

type Selection = Record<FacetKey, string[]>;

const EMPTY: Selection = { area: [], developer: [], type: [], beds: [], price: [], handover: [] };

/** Header height + breathing room, so a scrolled-to grid clears the sticky bars. */
const SCROLL_OFFSET = 160;

const matches = (p: Project, sel: Selection, skip?: FacetKey) =>
  facets.every((f) => f.key === skip || sel[f.key].length === 0 || f.test(p, sel[f.key]));

/**
 * Filterable off-plan project grid. Filters run client-side against
 * /data/offPlan.ts. Desktop gets a sticky row of dropdowns; below `lg` the
 * same facets open in a bottom sheet.
 */
export default function ProjectExplorer() {
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState<Selection>(EMPTY);
  const [openFacet, setOpenFacet] = useState<FacetKey | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetTriggerRef = useRef<HTMLButtonElement>(null);
  const gridTopRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const results = useMemo(() => projects.filter((p) => matches(p, selected)), [selected]);

  /** How many projects an option would show, given every other active filter. */
  const countFor = useCallback(
    (f: Facet, id: string) => {
      const next = { ...selected, [f.key]: [id] };
      return projects.filter((p) => matches(p, next)).length;
    },
    [selected],
  );

  const chips = facets.flatMap((f) =>
    selected[f.key].map((id) => ({
      facet: f,
      id,
      label: f.options.find((o) => o.id === id)?.label ?? id,
    })),
  );

  const toggle = (f: Facet, id: string) =>
    setSelected((s) => {
      const current = s[f.key];
      const next = current.includes(id)
        ? current.filter((x) => x !== id)
        : f.single
          ? [id]
          : [...current, id];
      return { ...s, [f.key]: next };
    });

  /* Stable so the sheet's setup effect (scroll lock, focus) runs once per open */
  const closeSheet = useCallback(() => setSheetOpen(false), []);

  const clearFacet = (f: Facet) => setSelected((s) => ({ ...s, [f.key]: [] }));
  const clearAll = () => setSelected(EMPTY);

  /* If the grid's top has scrolled out of view, bring it back after a change
     so a shorter result list does not leave the visitor staring at the footer. */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (sheetOpen) return;
    const el = gridTopRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    if (top < SCROLL_OFFSET - 40) {
      window.scrollTo({
        top: window.scrollY + top - SCROLL_OFFSET,
        behavior: reduce ? 'auto' : 'smooth',
      });
    }
  }, [selected, sheetOpen, reduce]);

  const countLabel =
    results.length === projects.length
      ? `${projects.length} projects`
      : `${results.length} of ${projects.length} projects`;

  return (
    <section id="projects" aria-labelledby="projects-heading" className="bg-cream pb-[var(--section-y)]">
      <div className="container-drp pb-10 pt-[var(--section-y)] sm:pb-12">
        <SectionHeading
          eyebrow="All Projects"
          heading="Explore Off-Plan Projects"
          headingId="projects-heading"
        />
      </div>

      {/* ---------- Filter bar, sticky under the header ---------- */}
      <div className="sticky top-16 z-30 border-y border-line bg-cream/95 backdrop-blur-md lg:top-[72px]">
        <div className="container-drp flex min-h-[68px] items-center justify-between gap-4 py-3">
          <div className="hidden flex-wrap items-center gap-2 lg:flex">
            {facets.map((f) => (
              <FacetDropdown
                key={f.key}
                facet={f}
                selected={selected[f.key]}
                open={openFacet === f.key}
                onOpenChange={(open) => setOpenFacet(open ? f.key : null)}
                onToggle={(id) => toggle(f, id)}
                onClear={() => clearFacet(f)}
                countFor={(id) => countFor(f, id)}
              />
            ))}
          </div>

          <button
            ref={sheetTriggerRef}
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-haspopup="dialog"
            className="flex h-11 items-center gap-2.5 rounded-md border border-charcoal/20 bg-white px-4 text-[13px] text-charcoal transition-colors duration-300 hover:border-charcoal/50 lg:hidden"
          >
            <SlidersHorizontal aria-hidden="true" strokeWidth={1.5} className="h-4 w-4" />
            Filters
            {chips.length ? <CountBadge n={chips.length} /> : null}
          </button>

          <div className="flex shrink-0 items-center gap-5">
            <p aria-live="polite" className="text-[12px] font-light text-charcoal-muted sm:text-[13px]">
              {countLabel}
            </p>
            {chips.length ? (
              <button
                type="button"
                onClick={clearAll}
                className="link-underline text-[11px] font-medium text-charcoal"
              >
                Clear all
              </button>
            ) : null}
          </div>
        </div>

        {/* Active filters as removable chips */}
        {chips.length ? (
          <div className="container-drp pb-3">
            <ul
              aria-label="Active filters"
              className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 lg:flex-wrap"
            >
              {chips.map((c) => (
                <li key={`${c.facet.key}-${c.id}`} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => toggle(c.facet, c.id)}
                    aria-label={`Remove filter: ${c.facet.label} ${c.label}`}
                    className="group flex h-8 items-center gap-2 rounded-full border border-charcoal/15 bg-white pl-3.5 pr-2.5 text-[12px] text-charcoal transition-colors duration-300 hover:border-orange"
                  >
                    {c.label}
                    <X
                      aria-hidden="true"
                      strokeWidth={1.75}
                      className="h-3.5 w-3.5 text-charcoal-muted transition-colors duration-300 group-hover:text-orange"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {/* ---------- Results ---------- */}
      <div ref={gridTopRef} className="container-drp pt-10 sm:pt-14">
        {results.length ? (
          <ul className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
            <AnimatePresence mode="popLayout" initial={false}>
              {results.map((p) => (
                <motion.li
                  key={p.slug}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
                  transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ProjectCard project={p} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        ) : (
          <div className="border-y border-line py-16 text-center sm:py-24">
            <p className="font-serif text-[clamp(1.6rem,3vw,2.2rem)] font-light text-charcoal">
              No projects match these filters.
            </p>
            <p className="mt-3 text-sm font-light text-charcoal-muted">
              Try removing a filter, or speak to a specialist about upcoming launches.
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="link-underline mt-8 text-[11px] font-medium text-charcoal"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {sheetOpen ? (
          <FilterSheet
            selected={selected}
            resultCount={results.length}
            onToggle={toggle}
            onClearAll={clearAll}
            countFor={countFor}
            onClose={closeSheet}
            returnFocusRef={sheetTriggerRef}
          />
        ) : null}
      </AnimatePresence>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function CountBadge({ n }: { n: number }) {
  return (
    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange px-1.5 text-[10px] font-medium text-white">
      {n}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Desktop dropdown                                                          */
/* -------------------------------------------------------------------------- */

type DropdownProps = {
  facet: Facet;
  selected: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggle: (id: string) => void;
  onClear: () => void;
  countFor: (id: string) => number;
};

function FacetDropdown({
  facet,
  selected,
  open,
  onOpenChange,
  onToggle,
  onClear,
  countFor,
}: DropdownProps) {
  const uid = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = `${uid}-panel`;
  const active = selected.length > 0;

  useEffect(() => {
    if (!open) return;
    /* Clicking or tabbing anywhere outside the dropdown closes it */
    const onOutside = (e: Event) => {
      if (!wrapRef.current?.contains(e.target as Node)) onOpenChange(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('focusin', onOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('focusin', onOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onOpenChange]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onOpenChange(!open)}
        className={`flex h-11 items-center gap-2 rounded-md border bg-white px-4 text-[13px] transition-colors duration-300 ${
          active || open
            ? 'border-charcoal text-charcoal'
            : 'border-line text-charcoal-light hover:border-charcoal/40'
        }`}
      >
        {facet.label}
        {active ? <CountBadge n={selected.length} /> : null}
        <ChevronDown
          aria-hidden="true"
          strokeWidth={1.5}
          className={`h-4 w-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open ? (
        <div
          id={panelId}
          className="absolute left-0 top-full z-40 mt-2 max-h-[min(22rem,60vh)] w-64 overflow-y-auto rounded-md bg-white p-2 shadow-[0_12px_40px_rgba(26,26,26,0.18)]"
        >
          <fieldset>
            <legend className="sr-only">{facet.label}</legend>
            {facet.single ? (
              <OptionRow
                name={`${uid}-opt`}
                type="radio"
                label={`Any ${facet.label.toLowerCase()}`}
                checked={!active}
                onChange={onClear}
              />
            ) : null}
            {facet.options.map((o) => (
              <OptionRow
                key={o.id}
                name={`${uid}-opt`}
                type={facet.single ? 'radio' : 'checkbox'}
                label={o.label}
                count={countFor(o.id)}
                checked={selected.includes(o.id)}
                onChange={() => onToggle(o.id)}
              />
            ))}
          </fieldset>
        </div>
      ) : null}
    </div>
  );
}

function OptionRow({
  name,
  type,
  label,
  count,
  checked,
  onChange,
}: {
  name: string;
  type: 'checkbox' | 'radio';
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}) {
  const empty = count === 0 && !checked;
  return (
    <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded px-3 transition-colors duration-150 hover:bg-cream">
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center border border-charcoal/30 bg-white transition-colors duration-200 peer-checked:border-orange peer-checked:bg-orange peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-orange ${
          type === 'radio' ? 'rounded-full' : 'rounded-sm'
        }`}
      >
        {type === 'radio' ? (
          <span className={`h-1.5 w-1.5 rounded-full bg-white ${checked ? 'opacity-100' : 'opacity-0'}`} />
        ) : (
          <Check strokeWidth={2.5} className={`h-3 w-3 text-white ${checked ? 'opacity-100' : 'opacity-0'}`} />
        )}
      </span>
      <span className={`flex-1 text-[14px] font-light ${empty ? 'text-charcoal-muted/60' : 'text-charcoal'}`}>
        {label}
      </span>
      {count !== undefined ? (
        <span className="text-[11px] font-light text-charcoal-muted">{count}</span>
      ) : null}
    </label>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mobile bottom sheet                                                       */
/* -------------------------------------------------------------------------- */

type SheetProps = {
  selected: Selection;
  resultCount: number;
  onToggle: (f: Facet, id: string) => void;
  onClearAll: () => void;
  countFor: (f: Facet, id: string) => number;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement>;
};

function FilterSheet({
  selected,
  resultCount,
  onToggle,
  onClearAll,
  countFor,
  onClose,
  returnFocusRef,
}: SheetProps) {
  const reduce = useReducedMotion();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const hasActive = Object.values(selected).some((v) => v.length > 0);

  /* Lock page scroll, take focus, close on Escape or on reaching desktop width */
  useEffect(() => {
    const returnTo = returnFocusRef.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onResize = () => desktop.matches && onClose();
    document.addEventListener('keydown', onKey);
    desktop.addEventListener('change', onResize);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
      desktop.removeEventListener('change', onResize);
      returnTo?.focus();
    };
  }, [onClose, returnFocusRef]);

  /* Keep Tab inside the sheet while it is open */
  const trapFocus = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>('button:not([disabled])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const fade = reduce ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
  const slide = reduce
    ? {}
    : {
        initial: { y: '100%' },
        animate: { y: 0 },
        exit: { y: '100%' },
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <div className="fixed inset-0 z-[90] lg:hidden">
      <motion.div
        {...fade}
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]"
      />
      <motion.div
        {...slide}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={trapFocus}
        className="absolute inset-x-0 bottom-0 flex max-h-[88svh] flex-col rounded-t-2xl bg-white shadow-[0_-12px_40px_rgba(26,26,26,0.2)]"
      >
        <div aria-hidden="true" className="mx-auto mt-3 h-1 w-10 rounded-full bg-line" />
        <div className="flex items-center justify-between border-b border-line px-5 pb-4 pt-3">
          <h2 id={titleId} className="font-serif text-2xl font-light text-charcoal">
            Filters
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-charcoal transition-colors duration-300 hover:text-orange"
          >
            <X aria-hidden="true" strokeWidth={1.5} className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-2">
          {facets.map((f) => (
            <div key={f.key} role="group" aria-label={f.label} className="border-b border-line py-6 last:border-b-0">
              <p className="eyebrow text-charcoal-muted">{f.label}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {f.options.map((o) => {
                  const on = selected[f.key].includes(o.id);
                  const empty = !on && countFor(f, o.id) === 0;
                  return (
                    <button
                      key={o.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => onToggle(f, o.id)}
                      className={`min-h-[44px] rounded-full border px-4 text-[14px] transition-colors duration-200 ${
                        on
                          ? 'border-orange bg-orange text-white'
                          : empty
                            ? 'border-line text-charcoal-muted/60'
                            : 'border-charcoal/20 text-charcoal'
                      }`}
                    >
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-line px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
          <button
            type="button"
            onClick={onClearAll}
            disabled={!hasActive}
            className="h-12 text-[11px] font-medium uppercase tracking-eyebrow text-charcoal transition-opacity disabled:opacity-30"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-12 flex-1 items-center justify-center gap-3 bg-orange px-6 text-[11px] font-medium uppercase tracking-eyebrow text-white transition-colors duration-300 hover:bg-orange-600 sm:flex-none sm:px-9"
          >
            Show {resultCount} {resultCount === 1 ? 'project' : 'projects'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
