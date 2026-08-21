'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, MeshTransmissionMaterial, Html } from '@react-three/drei';
import { MathUtils, type Group } from 'three';
import { motion } from 'framer-motion';

// Balances refraction fidelity against 60fps on high-DPI external monitors.
const TRANSMISSION_RESOLUTION = 384;

const CARD_WIDTH = 2.1;
const CARD_HEIGHT = 2.55;
const CARD_DEPTH = 0.22;

export interface GlassCardContent {
  index: number;
  title: string;
  body: string;
}

interface GlassCardProps extends GlassCardContent {
  position: [number, number, number];
  reducedMotion?: boolean;
  revealed: boolean;
}

export function GlassCard({
  index,
  title,
  body,
  position,
  reducedMotion = false,
  revealed,
}: GlassCardProps) {
  const groupRef = useRef<Group>(null);
  const materialRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);

  const targetTilt = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (!reducedMotion) {
      groupRef.current.rotation.x = MathUtils.damp(
        groupRef.current.rotation.x,
        targetTilt.current.x,
        6,
        delta,
      );
      groupRef.current.rotation.y = MathUtils.damp(
        groupRef.current.rotation.y,
        targetTilt.current.y,
        6,
        delta,
      );
      groupRef.current.position.z = MathUtils.damp(
        groupRef.current.position.z,
        hovered ? 0.55 : 0,
        6,
        delta,
      );
    }

    if (materialRef.current) {
      materialRef.current.roughness = MathUtils.damp(
        materialRef.current.roughness,
        hovered ? 0.04 : 0.14,
        8,
        delta,
      );
    }
  });

  const handlePointerMove = (event: any) => {
    if (reducedMotion || !event.uv) return;
    targetTilt.current = {
      x: (event.uv.y - 0.5) * 0.5,
      y: -(event.uv.x - 0.5) * 0.5,
    };
  };

  const handlePointerLeave = () => {
    setHovered(false);
    targetTilt.current = { x: 0, y: 0 };
  };

  return (
    <group ref={groupRef} position={position}>
      <RoundedBox
        args={[CARD_WIDTH, CARD_HEIGHT, CARD_DEPTH]}
        radius={0.16}
        smoothness={6}
        onPointerMove={handlePointerMove}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={handlePointerLeave}
      >
        <MeshTransmissionMaterial
          ref={materialRef}
          color="#fdfcf8"
          transmission={1}
          thickness={0.5}
          roughness={0.14}
          ior={1.15}
          chromaticAberration={0.02}
          anisotropy={0.1}
          distortion={0.12}
          distortionScale={0.3}
          temporalDistortion={0.08}
          clearcoat={1}
          clearcoatRoughness={0.1}
          resolution={TRANSMISSION_RESOLUTION}
          samples={6}
        />
      </RoundedBox>

      <pointLight
        color="#ffd7a3"
        intensity={hovered ? 2.2 : 0}
        distance={2.4}
        decay={2}
        position={[0, 0, 0.6]}
      />

      <Html
        transform
        occlude={false}
        position={[0, 0, CARD_DEPTH / 2 + 0.01]}
        distanceFactor={2.9}
        wrapperClass="pointer-events-none select-none"
        style={{ pointerEvents: 'none' }}
      >
        <div
          className="flex flex-col justify-between"
          style={{ width: '260px', height: '310px' }}
        >
          <motion.span
            initial={reducedMotion ? false : { opacity: 0, y: 10 }}
            animate={revealed ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#7a6a55]"
          >
            0{index + 1}
          </motion.span>

          <div>
            <motion.h3
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              animate={revealed ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: index * 0.08 + 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-2xl font-black tracking-tight text-[#2b241c]"
            >
              {title}
            </motion.h3>
            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              animate={revealed ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: index * 0.08 + 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-3 font-sans text-sm leading-relaxed text-[#4a4033]"
            >
              {body}
            </motion.p>
          </div>
        </div>
      </Html>
    </group>
  );
}
