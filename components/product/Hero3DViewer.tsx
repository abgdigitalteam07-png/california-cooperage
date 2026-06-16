'use client';

import dynamic from 'next/dynamic';

const Model3DViewer = dynamic(() => import('./Model3DViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-square bg-[#0F0F0F] rounded-lg flex items-center justify-center">
      <p className="text-white/40 font-body text-sm tracking-widest uppercase">Loading 3D model…</p>
    </div>
  ),
});

export default function Hero3DViewer({ src, alt }: { src: string; alt: string }) {
  return <Model3DViewer src={src} alt={alt} />;
}
