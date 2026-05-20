import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#1E1E1E] text-white/70 pt-16 pb-8">
      <div className="max-w-[1180px] mx-auto px-6 lg:px-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="mb-4">
              <Image
                src="/logos/california-cooperage-logo-vert-white.png"
                alt="California Cooperage"
                width={100}
                height={66}
                className="h-14 w-auto"
              />
            </div>
            <p className="text-sm leading-relaxed mb-4">America&apos;s original hot tub brand since 1972. Rotomold spas for real backyards.</p>
            <p className="text-xs text-white/40">Est. 1972 · California Heritage</p>
          </div>

          {/* Col 2: Spas */}
          <div>
            <h4 className="font-body font-bold text-white text-xs uppercase tracking-widest mb-4">Our Spas</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/cr1-hot-tub" className="hover:text-white transition-colors">CR1 — The Classic</Link></li>
              <li><Link href="/cr2-hot-tub" className="hover:text-white transition-colors">CR2 — The Entertainer</Link></li>
              <li><Link href="/cr3-hot-tub" className="hover:text-white transition-colors">CR3 — The Social</Link></li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h4 className="font-body font-bold text-white text-xs uppercase tracking-widest mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/warranty" className="hover:text-white transition-colors">Warranty & Docs</Link></li>
              <li><Link href="/find-a-dealer" className="hover:text-white transition-colors">Register Your Spa</Link></li>
            </ul>
          </div>

          {/* Col 4: Partners & Contact */}
          <div>
            <h4 className="font-body font-bold text-white text-xs uppercase tracking-widest mb-4">Partners</h4>
            <ul className="space-y-2 text-sm mb-6">
              <li><a href="#" className="hover:text-white transition-colors">MAAX Saunas</a></li>
              <li><a href="#" className="hover:text-white transition-colors">MAAX Chillers</a></li>
            </ul>
            <h4 className="font-body font-bold text-white text-xs uppercase tracking-widest mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/find-a-dealer" className="hover:text-white transition-colors">Find a Dealer</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} California Cooperage. All rights reserved.</p>
          <p>America&apos;s Original Hot Tub — Est. 1972 · Sonoma Valley, California</p>
        </div>
      </div>
    </footer>
  );
}
