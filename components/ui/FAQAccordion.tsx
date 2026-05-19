'use client';

import { useState } from 'react';

interface FAQItem {
  q: string;
  a: string;
}

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="border border-[#EDE8DC] rounded-lg overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-4 text-left bg-white hover:bg-[#F8F4EC] transition-colors"
          >
            <span className="font-body font-bold text-[#1E1E1E] pr-4">{item.q}</span>
            <span className={`text-[#3A5F35] text-xl font-body font-light shrink-0 transition-transform ${open === i ? 'rotate-45' : ''}`}>
              +
            </span>
          </button>
          {open === i && (
            <div className="px-6 py-4 bg-white border-t border-[#EDE8DC]">
              <p className="font-body text-[#6B6560] leading-relaxed">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
