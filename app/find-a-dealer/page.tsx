import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DealerForm from '@/components/shared/DealerForm';

export const metadata: Metadata = {
  title: 'Find a Dealer | California Cooperage Hot Tubs',
  description: 'Connect with an authorized California Cooperage dealer near you. Honest guidance, no pressure, on the CR1, CR2, or CR3 rotomold spa that fits your space and budget.',
};

const trustSignals = [
  { icon: '⊕', text: 'Balboa — Industry Standard Controls' },
  { icon: '◷', text: 'Full Foam Insulation + 3KW Heater on All Models' },
  { icon: '★', text: 'California Heritage Since 1972' },
];

export default function FindADealerPage() {
  return (
    <>
      <Navbar activePage="/find-a-dealer" />

      {/* Hero */}
      <section className="bg-[#1E1E1E] py-20 px-6 text-center">
        <div className="max-w-[600px] mx-auto">
          <p className="text-[#B8963E] font-body font-bold text-xs uppercase tracking-widest mb-4">Authorized Dealers</p>
          <h1 className="font-display font-bold text-white text-4xl md:text-5xl mb-6">Find a Dealer</h1>
          <p className="font-body text-white/70 text-lg">
            Connect with an authorized California Cooperage dealer near you — honest guidance, no pressure, on the spa that fits your life.
          </p>
        </div>
      </section>

      {/* Two-column layout */}
      <section className="bg-[#F8F4EC] py-20 px-6">
        <div className="max-w-[1180px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Form */}
            <div className="bg-white rounded-lg p-8 border border-[#EDE8DC] shadow-sm">
              <h2 className="font-display font-bold text-[#1E1E1E] text-2xl mb-2">Send an Inquiry</h2>
              <p className="font-body text-[#6B6560] text-sm mb-8">Fill out the form and we&apos;ll connect you with an authorized dealer in your area.</p>
              <DealerForm />
            </div>

            {/* Trust signals */}
            <div>
              <h2 className="font-display font-bold text-[#1E1E1E] text-2xl mb-8">Why California Cooperage</h2>
              <div className="space-y-6">
                {trustSignals.map((signal) => (
                  <div key={signal.text} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded bg-[#D6E8D2] flex items-center justify-center text-[#3A5F35] shrink-0">
                      {signal.icon}
                    </div>
                    <p className="font-body font-bold text-[#1E1E1E] pt-2">{signal.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 bg-[#1E1E1E] rounded-lg p-6 text-white">
                <p className="font-body font-bold text-[#B8963E] text-xs uppercase tracking-widest mb-3">About Our Dealers</p>
                <p className="font-body text-white/70 text-sm leading-relaxed">
                  Our authorized dealer network provides honest guidance, in-person demonstrations, and local service support. No call centers. No hard sells. Just real advice from people who know our spas.
                </p>
              </div>

              <div className="mt-6 bg-[#D6E8D2] rounded-lg p-6">
                <p className="font-body font-bold text-[#3A5F35] text-xs uppercase tracking-widest mb-2">Built to California Standards</p>
                <p className="font-body text-[#1E1E1E] font-bold">California Cooperage</p>
                <p className="font-body text-[#6B6560] text-xs mt-1">America&apos;s Original Hot Tub Brand · Est. 1972</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
