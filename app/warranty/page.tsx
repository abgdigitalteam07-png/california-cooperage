import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CTABand from '@/components/shared/CTABand';
import FAQAccordion from '@/components/ui/FAQAccordion';
import { WARRANTY_FAQS } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Warranty & Owner Resources | California Cooperage Hot Tubs',
  description: 'Access California Cooperage warranty information, owner manuals, electrical guides, and Balboa controls documentation for the CR1, CR2, and CR3 rotomold spas.',
};

const docs = [
  { title: 'CR1 Owner\'s Manual', scope: '5-Person Rectangular', href: '/cr1-hot-tub' },
  { title: 'CR2 Owner\'s Manual', scope: '7-Person Square — Flagship', href: '/cr2-hot-tub' },
  { title: 'CR3 Owner\'s Manual', scope: '6-Person Round', href: '/cr3-hot-tub' },
  { title: 'Electrical Installation Guide', scope: 'All Models', href: '#' },
  { title: 'Water Care & Chemistry Guide', scope: 'All Models', href: '#' },
  { title: 'Balboa Controls Guide', scope: 'All Models', href: '#' },
];

export default function WarrantyPage() {
  return (
    <>
      <Navbar activePage="/warranty" />

      {/* Page Hero */}
      <section className="bg-[#1E1E1E] py-20 px-6 text-center">
        <div className="max-w-[800px] mx-auto">
          <p className="text-[#B8963E] font-body font-bold text-xs uppercase tracking-widest mb-4">Owner Resources</p>
          <h1 className="font-display font-bold text-white text-4xl md:text-5xl mb-6">Warranty &amp; Documentation</h1>
          <p className="font-body text-white/70 text-lg leading-relaxed mb-8">
            California Cooperage products are built to last. Our warranty reflects that confidence. Find coverage details, owner manuals, and technical guides below.
          </p>
          <Link href="/find-a-dealer" className="inline-flex items-center px-8 py-3 bg-[#3A5F35] hover:bg-[#2C4A28] text-white font-body font-bold text-sm rounded-sm transition-colors">
            Register Your Spa
          </Link>
        </div>
      </section>

      {/* Coverage Cards */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-[1180px] mx-auto">
          <p className="text-[#3A5F35] font-body font-bold text-xs uppercase tracking-widest mb-3 text-center">Coverage</p>
          <h2 className="font-display font-bold text-[#1E1E1E] text-3xl mb-12 text-center">What&apos;s Covered</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { years: '3', title: 'Shell & Cabinet', body: 'HDPE rotomold shell and PE/PS cabinet covered against defects in materials and workmanship under normal use.' },
              { years: '2', title: 'Equipment', body: 'Balboa control system, 3KW heater, and 2HP pump covered against manufacturing defects.' },
              { years: '1', title: 'Labor', body: 'Authorized labor coverage for warranty repairs performed by an authorized California Cooperage service provider.' },
            ].map((card) => (
              <div key={card.title} className="bg-[#F8F4EC] rounded-lg p-8 text-center border border-[#EDE8DC]">
                <div className="font-display font-bold text-[#3A5F35] text-5xl mb-2">{card.years}</div>
                <div className="font-body font-bold text-[#1E1E1E] text-xs uppercase tracking-widest mb-1">Year{card.years !== '1' ? 's' : ''}</div>
                <h3 className="font-display font-semibold text-[#1E1E1E] text-xl mb-4">{card.title}</h3>
                <p className="font-body text-[#6B6560] text-sm leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#D6E8D2] rounded-lg p-6 max-w-[800px] mx-auto text-center">
            <p className="font-body text-[#3A5F35] font-bold text-sm">
              Register your California Cooperage spa within 30 days of purchase to activate full coverage. Contact your authorized dealer or use the form on this site.
            </p>
          </div>
        </div>
      </section>

      {/* Documents Grid */}
      <section className="bg-[#F8F4EC] py-20 px-6">
        <div className="max-w-[1180px] mx-auto">
          <p className="text-[#3A5F35] font-body font-bold text-xs uppercase tracking-widest mb-3">Documents</p>
          <h2 className="font-display font-bold text-[#1E1E1E] text-3xl mb-4">Downloadable Resources</h2>
          <p className="font-body text-[#6B6560] text-sm mb-10">Documents will be available upon product launch. Contact your authorized dealer for current documentation.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {docs.map((doc) => (
              <div key={doc.title} className="bg-white rounded-lg p-5 border border-[#EDE8DC] flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded bg-[#D6E8D2] flex items-center justify-center text-[#3A5F35] shrink-0 font-body font-bold text-sm">
                  PDF
                </div>
                <div>
                  <p className="font-body font-bold text-[#1E1E1E] text-sm mb-1">{doc.title}</p>
                  <p className="font-body text-[#A89F98] text-xs">{doc.scope}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Electrical Requirements Table */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-[1180px] mx-auto">
          <p className="text-[#3A5F35] font-body font-bold text-xs uppercase tracking-widest mb-3">Electrical Reference</p>
          <h2 className="font-display font-bold text-[#1E1E1E] text-3xl mb-3">Electrical Requirements — All Models</h2>
          <p className="font-body text-[#6B6560] text-sm mb-8">Specifications per manufacturer. Confirm North American configuration with your dealer.</p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm font-body">
              <thead>
                <tr className="bg-[#1E1E1E] text-white">
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-xs">Model</th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-xs">Voltage</th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-xs">Frequency</th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-xs">Amperage</th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-xs">Control System</th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-xs">Heater</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['CR1', '220–240V', '50Hz', '16/32A', 'Balboa', '3 kW'],
                  ['CR2', '220–240V', '50Hz', '16/32A', 'Balboa', '3 kW'],
                  ['CR3', '220–240V', '50Hz', '16/32A', 'Balboa', '3 kW'],
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-[#F8F4EC]' : 'bg-white'}>
                    {row.map((cell, j) => (
                      <td key={j} className="px-4 py-3 text-[#1E1E1E]">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-[#FDEAEA] border-l-4 border-[#C0392B] p-4 rounded-r-lg">
            <p className="font-body text-[#C0392B] text-sm font-bold">
              ⚡ North American Electrical Confirmation Required: All models are specified at 220–240V / 50Hz. North American standard is 110–120V / 60Hz. Please confirm North American-compatible variant availability with your authorized dealer before purchase.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#F8F4EC] py-20 px-6">
        <div className="max-w-[800px] mx-auto">
          <p className="text-[#3A5F35] font-body font-bold text-xs uppercase tracking-widest mb-3">Warranty Questions</p>
          <h2 className="font-display font-bold text-[#1E1E1E] text-3xl mb-10">Warranty FAQ</h2>
          <FAQAccordion items={WARRANTY_FAQS} />
        </div>
      </section>

      {/* Product links */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-[1180px] mx-auto text-center">
          <p className="text-[#3A5F35] font-body font-bold text-xs uppercase tracking-widest mb-6">Explore the Lineup</p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: 'CR1', href: '/cr1-hot-tub' },
              { label: 'CR2', href: '/cr2-hot-tub' },
              { label: 'CR3', href: '/cr3-hot-tub' },
              { label: 'Back to Home', href: '/' },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="px-6 py-2.5 border-2 border-[#3A5F35] text-[#3A5F35] font-body font-bold text-sm rounded-sm hover:bg-[#3A5F35] hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        heading="Need Help With Your Spa?"
        body="Our authorized dealers can answer warranty questions and arrange service."
        ctaLabel="Find a Dealer"
        ctaHref="/find-a-dealer"
      />

      <Footer />
    </>
  );
}
