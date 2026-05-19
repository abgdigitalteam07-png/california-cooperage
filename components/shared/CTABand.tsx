import Link from 'next/link';

interface CTABandProps {
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export default function CTABand({ heading, body, ctaLabel, ctaHref, secondaryLabel, secondaryHref }: CTABandProps) {
  return (
    <section className="bg-[#3A5F35] py-16 px-6">
      <div className="max-w-[1180px] mx-auto text-center">
        <h2 className="font-display font-bold text-white text-3xl md:text-4xl mb-4">{heading}</h2>
        <p className="text-white/80 font-body text-lg mb-8 max-w-xl mx-auto">{body}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#3A5F35] font-body font-bold text-sm rounded-sm hover:bg-[#F8F4EC] transition-colors"
          >
            {ctaLabel}
          </Link>
          {secondaryLabel && secondaryHref && (
            <Link
              href={secondaryHref}
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-body font-bold text-sm rounded-sm hover:bg-white/10 transition-colors"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
