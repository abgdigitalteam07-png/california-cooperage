'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';

function Model({ src }: { src: string }) {
  const { scene } = useGLTF(src, true);
  return <primitive object={scene} />;
}

export default function Model3DViewer({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      role="img"
      aria-label={alt}
      className="w-full aspect-square bg-[#0F0F0F] rounded-lg overflow-hidden"
    >
      <Canvas camera={{ position: [3, 2, 3], fov: 35 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6} adjustCamera>
            <Model src={src} />
          </Stage>
        </Suspense>
        <OrbitControls
          enablePan={false}
          minDistance={2}
          maxDistance={8}
          autoRotate
          autoRotateSpeed={0.6}
        />
      </Canvas>
    </div>
  );
}
