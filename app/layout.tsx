import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'California Cooperage | Affordable Hot Tubs Built on 50 Years of California Tradition',
  description: 'California Cooperage created the first mass-produced hot tub in 1972. Discover the CR1, CR2, and CR3 — durable rotomold spas with Balboa controls, full foam insulation, and 3KW heaters. Find a dealer today.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.californiaspa.com'),
  icons: {
    icon: '/logos/california-cooperage-icon-color.png',
    apple: '/logos/california-cooperage-icon-color.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
