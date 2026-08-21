'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Icosahedron, MeshDistortMaterial } from '@react-three/drei';
import type { Mesh } from 'three';

interface BackgroundBloomProps {
  reducedMotion?: boolean;
}

/**
 * The abstract, soft-lit organic mass sitting behind the glass cards.
 * Low-poly on purpose: this is the object the transmission material
 * refracts, so its silhouette (not its polycount) is what reads.
 */
export function BackgroundBloom({ reducedMotion = false }: BackgroundBloomProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (reducedMotion || !meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.06;
    meshRef.current.rotation.x += delta * 0.02;
  });

  return (
    <Icosahedron ref={meshRef} args={[2.4, 3]} position={[0, 0, -3.2]}>
      <MeshDistortMaterial
        color="#e7b285"
        emissive="#c97c3f"
        emissiveIntensity={0.35}
        roughness={0.65}
        metalness={0.05}
        distort={0.35}
        speed={reducedMotion ? 0 : 1.1}
      />
    </Icosahedron>
  );
}
