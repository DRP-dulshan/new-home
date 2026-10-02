'use client';

import { useState } from 'react';

/** Copy link, WhatsApp and LinkedIn share actions for an article. */
export default function ShareLinks({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const share = (kind: 'whatsapp' | 'linkedin') => {
    const url = window.location.href;
    const target =
      kind === 'whatsapp'
        ? `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`
        : `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(target, '_blank', 'noopener,noreferrer');
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard can be blocked; the address bar still works */
    }
  };

  const btn =
    'h-10 rounded-full border border-charcoal/20 px-4 text-[12px] text-charcoal transition-colors duration-300 hover:border-orange hover:text-orange';

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="mr-2 text-[10px] uppercase tracking-eyebrow text-charcoal-muted">Share</span>
      <button type="button" onClick={copy} className={btn}>
        <span aria-live="polite">{copied ? 'Link copied' : 'Copy link'}</span>
      </button>
      <button type="button" onClick={() => share('whatsapp')} className={btn}>
        WhatsApp
      </button>
      <button type="button" onClick={() => share('linkedin')} className={btn}>
        LinkedIn
      </button>
    </div>
  );
}
