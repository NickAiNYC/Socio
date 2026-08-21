'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { MathUtils, type Group } from 'three';
import { BackgroundBloom } from './BackgroundBloom';
import { GlassCard, type GlassCardContent } from './GlassCard';

interface RigProps {
  reducedMotion: boolean;
  children: React.ReactNode;
}

/** Subtle whole-scene parallax that drifts opposite the pointer, independent of per-card tilt. */
function Rig({ reducedMotion, children }: RigProps) {
  const rigRef = useRef<Group>(null);

  useFrame((state, delta) => {
    if (reducedMotion || !rigRef.current) return;
    rigRef.current.position.x = MathUtils.damp(
      rigRef.current.position.x,
      state.pointer.x * -0.25,
      4,
      delta,
    );
    rigRef.current.position.y = MathUtils.damp(
      rigRef.current.position.y,
      state.pointer.y * -0.12,
      4,
      delta,
    );
  });

  return <group ref={rigRef}>{children}</group>;
}

function CardRow({
  cards,
  reducedMotion,
  revealed,
}: {
  cards: GlassCardContent[];
  reducedMotion: boolean;
  revealed: boolean;
}) {
  const { viewport } = useThree();
  const spacing = Math.min(2.55, viewport.width / 3.6);
  const startX = -spacing * ((cards.length - 1) / 2);

  return (
    <Rig reducedMotion={reducedMotion}>
      <BackgroundBloom reducedMotion={reducedMotion} />
      {cards.map((card, i) => (
        <GlassCard
          key={card.title}
          {...card}
          position={[startX + i * spacing, 0, 0]}
          reducedMotion={reducedMotion}
          revealed={revealed}
        />
      ))}
    </Rig>
  );
}

interface FeaturesSceneProps {
  cards: GlassCardContent[];
  reducedMotion?: boolean;
  revealed: boolean;
}

export function FeaturesScene({ cards, reducedMotion = false, revealed }: FeaturesSceneProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 8], fov: 32 }}
    >
      <ambientLight intensity={0.7} color="#fff2df" />
      <Suspense fallback={null}>
        <Environment preset="studio" />
        <CardRow cards={cards} reducedMotion={reducedMotion} revealed={revealed} />
      </Suspense>
    </Canvas>
  );
}
