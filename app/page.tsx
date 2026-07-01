import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CTABand from '@/components/shared/CTABand';
import FAQAccordion from '@/components/ui/FAQAccordion';
import { HOME_FAQS, PRODUCTS } from '@/lib/products';

export const metadata: Metadata = {
  title: 'California Cooperage | Affordable Hot Tubs Built on 50 Years of California Tradition',
  description: 'California Cooperage created the first mass-produced hot tub in 1972. Discover the CR1, CR2, and CR3 — durable rotomold spas with Balboa controls, full foam insulation, and 3KW heaters. Find a dealer today.',
};

const trustPills = [
  'Balboa Controls',
  '3KW Heater',
  'Full Foam Insulation',
  'California Heritage Since 1972',
];

export default function HomePage() {
  return (
    <>
      <Navbar activePage="/" />

      {/* Hero */}
      <section className="bg-[#1E1E1E] min-h-[520px] flex items-center px-6 py-16">
        <div className="max-w-[1180px] mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#B8963E] font-body font-bold text-xs uppercase tracking-widest mb-4">
                ★ California&apos;s Original Hot Tub Since 1972
              </p>
              <h1 className="font-display font-bold text-white text-4xl md:text-5xl leading-tight mb-6">
                California&apos;s Original Hot Tub — Now More Accessible Than Ever
              </h1>
              <p className="text-white/70 font-body text-lg leading-relaxed mb-8">
                Our 2026 rotomold lineup features Balboa controls, full foam insulation, and 3KW heaters — genuine spa performance at an accessible price.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/cr1-hot-tub" className="px-8 py-3 bg-[#3A5F35] hover:bg-[#2C4A28] text-white font-body font-bold text-sm rounded-sm transition-colors">
                  Explore Our Spas
                </Link>
                <Link href="/warranty" className="px-8 py-3 border-2 border-white/40 hover:border-white text-white font-body font-bold text-sm rounded-sm transition-colors">
                  Warranty &amp; Docs
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute -top-4 -right-4 bg-[#B8963E] text-white text-xs font-body font-bold px-4 py-2 rounded-sm shadow-lg z-10">
                  ★ Est. 1972 — America&apos;s Original Hot Tub Brand
                </div>
                <img
                  src="/images/homepage-hero.jpg"
                  alt="California Cooperage hot tubs on a backyard deck at sunset"
                  className="rounded-lg w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Strip */}
      <section className="bg-[#3A5F35] py-4 px-6">
        <div className="max-w-[1180px] mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {trustPills.map((pill) => (
              <div key={pill} className="flex items-center gap-2 text-white/90 font-body font-bold text-sm py-1">
                <span className="text-[#B8963E] text-lg leading-none">•</span>
                {pill}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-[1180px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-[#3A5F35] font-body font-bold text-xs uppercase tracking-widest mb-4">Our Heritage</p>
              <h2 className="font-display font-bold text-[#1E1E1E] text-3xl md:text-4xl mb-10">
                Born in the Wine Country. Built for the Backyard.
              </h2>
              <div className="grid grid-cols-3 gap-6 border-t border-[#EDE8DC] pt-8">
                {[
                  { stat: '1972', label: 'Founded' },
                  { stat: '50+', label: 'Years of Craft' },
                  { stat: '3', label: 'Rotomold Models' },
                ].map(({ stat, label }) => (
                  <div key={label} className="text-center">
                    <div className="font-display font-bold text-[#3A5F35] text-4xl mb-1">{stat}</div>
                    <div className="font-body text-[#6B6560] text-xs uppercase tracking-wider">{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="font-body text-[#6B6560] leading-relaxed mb-5">
                In 1972, California Cooperage created the first mass-produced redwood hot tub — launching an industry and a California lifestyle movement. Born from the wine country cooperage tradition of the Sonoma Valley, our tubs brought the ritual of communal soaking to everyday American families.
              </p>
              <p className="font-body text-[#6B6560] leading-relaxed mb-5">
                Over fifty years later, that spirit lives in every California Cooperage spa we build. Today&apos;s lineup uses modern rotational moulding technology — now equipped with industry-standard Balboa control systems, full foam insulation, 3KW heaters, and 2HP two-speed pumps. Real performance. Accessible pricing.
              </p>
              <p className="font-body text-[#6B6560] leading-relaxed mb-8">
                Whether it&apos;s five people unwinding in the CR1, seven friends gathering around the CR2, or six under the stars in the round CR3 — there&apos;s a California Cooperage spa for the life you&apos;re living.
              </p>
              <Link href="/cr1-hot-tub" className="inline-flex items-center gap-2 font-body font-bold text-[#3A5F35] text-sm border-b-2 border-[#3A5F35] pb-0.5 hover:text-[#2C4A28] transition-colors">
                View the Lineup →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Product Cards Grid */}
      <section className="bg-[#F8F4EC] py-20 px-6">
        <div className="max-w-[1180px] mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#3A5F35] font-body font-bold text-xs uppercase tracking-widest mb-3">The 2026 Lineup</p>
            <h2 className="font-display font-bold text-[#1E1E1E] text-3xl md:text-4xl mb-4">Three Spas. One California Standard.</h2>
            <p className="font-body text-[#6B6560] text-sm max-w-2xl mx-auto">All models: Balboa controls · 3KW heater · 2HP 2-speed pump · Full foam insulation</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(['cr1', 'cr2', 'cr3'] as const).map((key, i) => {
              const p = PRODUCTS[key];
              const featured = key === 'cr2';
              return (
                <div key={key} className={`bg-white rounded-lg overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-xl group ${featured ? 'border-[#3A5F35] ring-2 ring-[#3A5F35]/20' : 'border-[#EDE8DC]'}`}>
                  {featured && (
                    <div className="bg-[#3A5F35] text-white text-center text-xs font-body font-bold py-1.5 uppercase tracking-widest">★ Flagship Model</div>
                  )}
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={`/images/${key}-hero.jpg`}
                      alt={`California Cooperage ${p.name} ${p.shape} rotomold hot tub`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-[#A89F98] font-body font-bold text-xs uppercase tracking-widest mb-2">{p.label}</p>
                    <h3 className="font-display font-semibold text-[#1E1E1E] text-xl mb-2">{p.subtitle}</h3>
                    <p className="font-body text-[#6B6560] text-sm leading-relaxed mb-4">{p.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-3 py-1 bg-[#D6E8D2] text-[#3A5F35] font-body font-bold text-xs rounded">{p.badge}</span>
                      <Link href={`/${p.slug}`} className="font-body font-bold text-[#3A5F35] text-sm hover:text-[#2C4A28] transition-colors">Learn More →</Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partner Section */}
      <section className="bg-[#1E1E1E] py-20 px-6">
        <div className="max-w-[1180px] mx-auto">
          <div className="text-center mb-12">
            <p className="text-white/40 font-body font-bold text-xs uppercase tracking-widest mb-3">Partner Brands</p>
            <h2 className="font-display font-bold text-white text-3xl md:text-4xl">Complete Your Outdoor Wellness Experience</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-[700px] mx-auto">
            {[
              { title: 'MAAX Saunas', sub: 'Premium indoor and outdoor sauna solutions', cta: 'Explore Saunas →', href: 'https://www.maaxsaunas.com/' },
              { title: 'MAAX Chillers', sub: 'Cold plunge and contrast therapy systems', cta: 'Explore Chillers →', href: 'https://maaxchillers.com/' },
            ].map((partner) => (
              <div key={partner.title} className="bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#3A5F35] flex items-center justify-center font-body font-bold text-white shrink-0">M</div>
                  <div>
                    <h3 className="font-body font-bold text-white">{partner.title}</h3>
                    <p className="font-body text-white/50 text-xs">{partner.sub}</p>
                  </div>
                </div>
                <a href={partner.href} target="_blank" rel="noopener noreferrer" className="font-body font-bold text-[#3A5F35] text-sm hover:text-[#5A8252] transition-colors">{partner.cta}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-[800px] mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#3A5F35] font-body font-bold text-xs uppercase tracking-widest mb-3">Common Questions</p>
            <h2 className="font-display font-bold text-[#1E1E1E] text-3xl md:text-4xl">Everything You Want to Know</h2>
          </div>
          <FAQAccordion items={HOME_FAQS} />
        </div>
      </section>

      <CTABand
        heading="Ready to Find Your California Cooperage?"
        body="Talk to an authorized dealer — honest guidance, no pressure, on the spa that fits your life."
        ctaLabel="Find a Dealer Near You"
        ctaHref="/find-a-dealer"
      />

      <Footer />
    </>
  );
}
