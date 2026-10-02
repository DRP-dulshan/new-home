'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { team } from '@/data/company';
import { contact } from '@/data/homepage';

const departments = ['All', ...new Set(team.map((m) => m.department))];

const initials = (s: string) =>
  s
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

/** Team members filterable by department. */
export default function TeamGrid() {
  const [dept, setDept] = useState('All');
  const shown = dept === 'All' ? team : team.filter((m) => m.department === dept);

  return (
    <div>
      <div role="group" aria-label="Filter by department" className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
        {departments.map((d) => {
          const active = d === dept;
          return (
            <button
              key={d}
              type="button"
              aria-pressed={active}
              onClick={() => setDept(d)}
              className={`h-11 shrink-0 rounded-full border px-5 text-[13px] transition-colors duration-300 ${
                active ? 'border-charcoal bg-charcoal text-white' : 'border-charcoal/20 bg-white text-charcoal hover:border-charcoal/50'
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>
      <p aria-live="polite" className="sr-only">
        {shown.length} team members
      </p>

      <ul className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
        {shown.map((m) => (
          <li key={m.id}>
            {/* Portrait placeholder until DRP supplies photography */}
            <div className="flex aspect-[4/5] items-end justify-between bg-cream p-5">
              <span className="font-serif text-[3.5rem] font-light leading-none text-charcoal/15">{initials(m.role)}</span>
              <span className="text-[10px] uppercase tracking-eyebrow text-charcoal-muted">{m.department}</span>
            </div>
            <h3 className="mt-5 font-serif text-[1.4rem] leading-snug text-charcoal">{m.role}</h3>
            <p className="mt-2 text-sm font-light text-charcoal-muted">{m.focus}</p>
            <div className="mt-4 flex items-center justify-between gap-4 border-t border-line pt-4">
              <span className="text-[10px] uppercase tracking-wide text-charcoal-muted">{m.languages.join(' · ')}</span>
              <a
                href={`${contact.whatsappHref}?text=${encodeURIComponent(`Hello DRP, I would like to speak to your ${m.role}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`WhatsApp DRP about the ${m.role}`}
                className="text-charcoal transition-colors duration-300 hover:text-orange"
              >
                <MessageCircle aria-hidden="true" strokeWidth={1.5} className="h-4 w-4" />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
