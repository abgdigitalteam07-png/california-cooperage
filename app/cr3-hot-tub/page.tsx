import type { Metadata } from 'next';
import { PRODUCTS } from '@/lib/products';
import ProductPage from '@/components/product/ProductPage';

export const metadata: Metadata = {
  title: 'CR3 Hot Tub — 6-Person Round Rotomold Spa | California Cooperage',
  description: "The CR3 (RTO2100MD) is California Cooperage's signature 6-person round rotomold spa — 21 jets, Balboa controls, 3KW heater, ⌀203×81cm circular footprint. The most social spa in the lineup.",
  alternates: { canonical: 'https://www.californiaspa.com/cr3-hot-tub' },
};

export default function CR3Page() {
  return <ProductPage product={PRODUCTS.cr3} />;
}
