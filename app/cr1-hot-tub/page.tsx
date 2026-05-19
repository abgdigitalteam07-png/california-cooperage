import type { Metadata } from 'next';
import { PRODUCTS } from '@/lib/products';
import ProductPage from '@/components/product/ProductPage';

export const metadata: Metadata = {
  title: 'CR1 Hot Tub — 5-Person Rectangular Rotomold Spa | California Cooperage',
  description: "The CR1 (RTO1700MD) is California Cooperage's 5-person rectangular rotomold hot tub — 14 jets, Balboa controls, 3KW heater, full foam insulation. 173×150×76cm compact footprint.",
  alternates: { canonical: 'https://www.californiaspa.com/cr1-hot-tub' },
};

export default function CR1Page() {
  return <ProductPage product={PRODUCTS.cr1} />;
}
