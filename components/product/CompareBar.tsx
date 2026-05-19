import Link from 'next/link';
import { PRODUCTS, ProductKey } from '@/lib/products';

export default function CompareBar({ models }: { models: ProductKey[] }) {
  return (
    <section className="bg-[#D6E8D2] py-12 px-6">
      <div className="max-w-[1180px] mx-auto text-center">
        <p className="font-body text-[#3A5F35] font-bold mb-6 text-sm uppercase tracking-widest">Compare Models</p>
        <h3 className="font-display font-bold text-[#1E1E1E] text-2xl mb-8">Comparing models? See the full lineup.</h3>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {models.map((key) => {
            const p = PRODUCTS[key];
            return (
              <Link
                key={key}
                href={`/${p.slug}`}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-[#3A5F35] text-[#3A5F35] font-body font-bold text-sm rounded-sm hover:bg-[#3A5F35] hover:text-white transition-colors"
              >
                {p.name} — {p.seats}-Person {p.shape}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
