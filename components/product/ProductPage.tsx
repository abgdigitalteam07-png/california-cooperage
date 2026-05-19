import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CTABand from '@/components/shared/CTABand';
import ElectricalNotice from '@/components/shared/ElectricalNotice';
import CompareBar from '@/components/product/CompareBar';
import FAQAccordion from '@/components/ui/FAQAccordion';
import { Product } from '@/lib/products';

export default function ProductPage({ product }: { product: Product }) {
  const p = product;

  return (
    <>
      <ElectricalNotice />
      <Navbar activePage={`/${p.slug}`} />

      {/* Product Hero */}
      <section className="bg-[#1E1E1E] py-16 px-6">
        <div className="max-w-[1180px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Product image panel */}
            <div className="rounded-lg overflow-hidden">
              <img
                src={`/images/${p.key}-hero.jpg`}
                alt={`California Cooperage ${p.name} ${p.seats}-person ${p.shape} rotomold hot tub`}
                className="w-full object-cover"
              />
            </div>

            {/* Text block */}
            <div>
              <p className="text-[#B8963E] font-body font-bold text-xs uppercase tracking-widest mb-3">{p.label}</p>
              <h1 className="font-display font-bold text-white text-4xl md:text-5xl mb-3">{p.subtitle}</h1>
              <p className="font-display italic text-white/60 text-lg mb-6">&ldquo;{p.tagline}&rdquo;</p>

              {/* Spec chips */}
              <div className="flex flex-wrap gap-2 mb-8">
                {p.specChips.map((chip, i) => (
                  <span
                    key={chip}
                    className={`px-3 py-1.5 rounded text-xs font-body font-bold ${i === 0 ? 'bg-[#B8963E] text-white' : 'bg-white/10 text-white/80'}`}
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <p className="font-body text-white/70 leading-relaxed mb-8">{p.heroBody}</p>

              <div className="flex flex-wrap gap-4">
                <Link href="/find-a-dealer" className="px-8 py-3 bg-[#3A5F35] hover:bg-[#2C4A28] text-white font-body font-bold text-sm rounded-sm transition-colors">
                  Request Information
                </Link>
                <Link href="/warranty" className="px-8 py-3 border-2 border-white/30 hover:border-white text-white font-body font-bold text-sm rounded-sm transition-colors">
                  View Warranty
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specs Table */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-[1180px] mx-auto">
          <p className="text-[#3A5F35] font-body font-bold text-xs uppercase tracking-widest mb-3">Technical Specifications — Confirmed from sunspa.cn</p>
          <h2 className="font-display font-bold text-[#1E1E1E] text-3xl mb-10">{p.name} Specifications</h2>

          <div className="max-w-[880px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#EDE8DC] border border-[#EDE8DC] rounded-lg overflow-hidden">
              {p.specs.map((spec) => (
                <div key={spec.label} className="bg-white px-6 py-4">
                  <p className="text-xs font-body font-bold uppercase tracking-wider text-[#A89F98] mb-1">{spec.label}</p>
                  <p className="font-display font-semibold text-[#1E1E1E]">{spec.value}</p>
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div className="mt-6 flex flex-wrap gap-2">
              {['CE', 'ETL', 'RoHS', 'SAA', 'ISO 9000'].map((cert) => (
                <span key={cert} className="px-3 py-1.5 bg-[#D6E8D2] text-[#3A5F35] font-body font-bold text-xs rounded">
                  {cert}
                </span>
              ))}
            </div>

            {/* Optional upgrades */}
            <p className="mt-4 text-[#6B6560] font-body text-sm">
              <strong className="text-[#1E1E1E]">Optional Upgrades:</strong> Steps · Wi-Fi module · Mini LED · Waterfall
            </p>

            {/* Electrical block */}
            <div className="mt-8 border-l-4 border-[#3A5F35] pl-6 bg-[#F8F4EC] py-4 rounded-r-lg">
              <p className="font-body font-bold text-[#1E1E1E] text-sm mb-1">Standard Configuration</p>
              <p className="font-body text-[#6B6560] text-sm">220–240V / 50Hz / 16–32 Amp</p>
              <p className="font-body text-[#6B6560] text-xs mt-1">Confirm North American 110–120V/60Hz availability with your dealer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CR3-specific shape guide (passed as children) */}
      {p.key === 'cr3' && (
        <section className="bg-[#FFF8E8] py-20 px-6">
          <div className="max-w-[1180px] mx-auto">
            <h2 className="font-display font-bold text-[#1E1E1E] text-3xl mb-10 text-center">Round vs. Square — Which Is Right for You?</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-[800px] mx-auto">
              <div className="bg-white rounded-lg p-6 border border-[#EDE8DC]">
                <h3 className="font-body font-bold text-[#3A5F35] uppercase tracking-wider text-xs mb-4">Round — CR3</h3>
                <ul className="space-y-2 font-body text-[#6B6560] text-sm">
                  <li>✓ Face-to-face social seating for 6</li>
                  <li>✓ Panoramic views from every seat</li>
                  <li>✓ Distinctive backyard focal point</li>
                  <li>✓ No corner dead zones</li>
                  <li>✓ ⌀203cm — fits most patio spaces</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-6 border border-[#EDE8DC]">
                <h3 className="font-body font-bold text-[#6B6560] uppercase tracking-wider text-xs mb-4">Square / Rectangular — CR1 &amp; CR2</h3>
                <ul className="space-y-2 font-body text-[#6B6560] text-sm">
                  <li>✓ Efficient corner-to-corner seating</li>
                  <li>✓ Aligns naturally to deck edges</li>
                  <li>✓ 5-person (CR1) or 7-person (CR2)</li>
                  <li>✓ Traditional spa form factor</li>
                  <li>✓ Rectangular option fits narrow spaces</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CR2 site prep warning */}
      {p.key === 'cr2' && (
        <section className="bg-[#FDEAEA] py-6 px-6">
          <div className="max-w-[1180px] mx-auto">
            <p className="font-body text-[#C0392B] font-bold text-sm">
              ⚠️ <strong>Site Preparation Note:</strong> The CR2 weighs approximately 1,100 kg (2,425 lbs) when filled. Ensure the installation surface can support this load. Consult a structural engineer or contractor before installation.
            </p>
          </div>
        </section>
      )}

      {/* Features Grid */}
      <section className="bg-[#F8F4EC] py-20 px-6">
        <div className="max-w-[1180px] mx-auto">
          <p className="text-[#3A5F35] font-body font-bold text-xs uppercase tracking-widest mb-3">Why the {p.name}</p>
          <h2 className="font-display font-bold text-[#1E1E1E] text-3xl mb-12">
            {p.key === 'cr1' ? 'Real Spa Performance. Accessible Price.' :
             p.key === 'cr2' ? 'The Flagship. The Full Experience.' :
             'The Spa California Nights Were Made For.'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {p.features.map((feature) => (
              <div key={feature.title} className="bg-white rounded-lg p-6 border border-[#EDE8DC]">
                <div className="w-10 h-10 rounded bg-[#D6E8D2] flex items-center justify-center text-[#3A5F35] text-lg mb-4">
                  {feature.icon}
                </div>
                <h4 className="font-body font-bold text-[#1E1E1E] mb-2">{feature.title}</h4>
                <p className="font-body text-[#6B6560] text-sm leading-relaxed">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-[800px] mx-auto">
          <p className="text-[#3A5F35] font-body font-bold text-xs uppercase tracking-widest mb-3">Questions</p>
          <h2 className="font-display font-bold text-[#1E1E1E] text-3xl mb-10">{p.name} FAQ</h2>
          <FAQAccordion items={p.faqs} />
        </div>
      </section>

      {/* Compare Bar */}
      <CompareBar models={p.compareWith} />

      {/* CTA */}
      <CTABand
        heading={`Ready for the ${p.subtitle}?`}
        body="Connect with an authorized dealer for honest guidance and no-pressure advice."
        ctaLabel="Find a Dealer Near You"
        ctaHref="/find-a-dealer"
        secondaryLabel="View All Specs"
        secondaryHref="/warranty"
      />

      <Footer />
    </>
  );
}
