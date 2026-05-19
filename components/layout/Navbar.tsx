'use client';

import Link from 'next/link';
import { useState } from 'react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'CR1 — The Classic', href: '/cr1-hot-tub' },
  { label: 'CR2 — The Entertainer', href: '/cr2-hot-tub' },
  { label: 'CR3 — The Social', href: '/cr3-hot-tub' },
  { label: 'Warranty & Docs', href: '/warranty' },
];

export default function Navbar({ activePage }: { activePage?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#1E1E1E] shadow-lg">
      <div className="max-w-[1180px] mx-auto px-6 lg:px-14 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex flex-col leading-none">
            <span className="font-display font-bold text-white text-lg tracking-tight">CALIFORNIA</span>
            <span className="font-display font-bold text-[#B8963E] text-lg tracking-tight -mt-1">COOPERAGE</span>
          </div>
          <div className="ml-1 w-8 h-8 rounded-full border-2 border-[#3A5F35] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 18 Q8 6 12 12 Q16 18 21 6" stroke="#3A5F35" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <path d="M3 14 Q8 4 12 9 Q16 14 21 3" stroke="#B8963E" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1 mx-6">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-2 text-sm font-body font-bold text-white/80 hover:text-white hover:bg-white/10 rounded transition-all ${activePage === l.href ? 'text-white bg-white/10' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/find-a-dealer"
          className="hidden lg:inline-flex items-center gap-2 px-4 py-2 bg-[#3A5F35] hover:bg-[#2C4A28] text-white text-sm font-body font-bold rounded-sm transition-colors"
        >
          Find a Dealer
        </Link>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          <div className="w-6 space-y-1.5">
            <span className={`block h-0.5 bg-white transition-transform ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 bg-white transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-white transition-transform ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-[#1E1E1E] border-t border-white/10 px-6 pb-4">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm font-body font-bold text-white/80 hover:text-white border-b border-white/5"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/find-a-dealer"
            onClick={() => setOpen(false)}
            className="mt-4 block w-full text-center py-3 bg-[#3A5F35] text-white text-sm font-body font-bold rounded-sm"
          >
            Find a Dealer
          </Link>
        </div>
      )}
    </nav>
  );
}
