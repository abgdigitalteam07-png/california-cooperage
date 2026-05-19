import type { Metadata } from 'next';
import { PRODUCTS } from '@/lib/products';
import ProductPage from '@/components/product/ProductPage';

export const metadata: Metadata = {
  title: 'CR2 Hot Tub — 7-Person Square Rotomold Spa | California Cooperage',
  description: "The CR2 (RTO2000MD) is California Cooperage's flagship 7-person square rotomold spa — 25 jets, 2 headrest pillows, Balboa controls, 3KW heater. 205×205×81cm full square footprint.",
  alternates: { canonical: 'https://www.californiaspa.com/cr2-hot-tub' },
};

export default function CR2Page() {
  return <ProductPage product={PRODUCTS.cr2} />;
}
