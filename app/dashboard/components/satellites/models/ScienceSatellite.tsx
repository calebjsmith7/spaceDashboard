"use client";

import { useRef } from "react";
import * as THREE from "three";

interface ScienceSatelliteProps {
  scale?: number;
  hovered?: boolean;
  variant?: 'hubble' | 'landsat' | 'default';
}

/**
 * Science satellite model - Hubble/Observatory style
 * Features:
 * - Cylindrical telescope body
 * - Solar panel arrays
 * - Aperture door
 * - Various instruments
 */
export default function ScienceSatellite({ 
  scale = 1, 
  hovered = false,
  variant = 'default'
}: ScienceSatelliteProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  const baseScale = 0.022 * scale;
  const emissiveIntensity = hovered ? 0.8 : 0.3;
  
  return (
    <group ref={groupRef} scale={[baseScale, baseScale, baseScale]}>
      {/* Main telescope tube */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 2.5, 24]} />
        <meshStandardMaterial 
          color="#c0c0c0"
          metalness={0.7}
          roughness={0.3}
          emissive="#ff69b4"
          emissiveIntensity={emissiveIntensity * 0.2}
        />
      </mesh>
      
      {/* Forward equipment section */}
      <mesh position={[0, 0, 1.4]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.55, 0.5, 0.4, 24]} />
        <meshStandardMaterial 
          color="#a0a0a0"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
      
      {/* Aperture door (light shield) */}
      <mesh position={[0, 0, 1.65]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.48, 0.52, 0.15, 24]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Primary mirror housing (aft shroud) */}
      <mesh position={[0, 0, -1.35]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.52, 0.48, 0.25, 24]} />
        <meshStandardMaterial 
          color="#2d2d2d"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      
      {/* Thermal insulation bands */}
      {[-0.8, -0.3, 0.2, 0.7].map((zPos, i) => (
        <mesh key={i} position={[0, 0, zPos]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.51, 0.015, 8, 32]} />
          <meshStandardMaterial 
            color="#d4af37"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
      
      {/* Solar panel array - port */}
      <group position={[-1.5, 0, 0]}>
        <mesh>
          <boxGeometry args={[1.8, 0.04, 1.2]} />
          <meshStandardMaterial 
            color="#0d47a1"
            metalness={0.9}
            roughness={0.1}
            emissive="#e91e63"
            emissiveIntensity={emissiveIntensity}
          />
        </mesh>
        {/* Panel support arm */}
        <mesh position={[0.95, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.15, 8]} />
          <meshStandardMaterial color="#666666" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
      
      {/* Solar panel array - starboard */}
      <group position={[1.5, 0, 0]}>
        <mesh>
          <boxGeometry args={[1.8, 0.04, 1.2]} />
          <meshStandardMaterial 
            color="#0d47a1"
            metalness={0.9}
            roughness={0.1}
            emissive="#e91e63"
            emissiveIntensity={emissiveIntensity}
          />
        </mesh>
        <mesh position={[-0.95, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.15, 8]} />
          <meshStandardMaterial color="#666666" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
      
      {/* High-gain antennas (2) */}
      <mesh position={[0, 0.6, -0.5]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.25, 0.12, 16, 1, true]} />
        <meshStandardMaterial 
          color="#e0e0e0"
          metalness={0.8}
          roughness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0.6, 0.5]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.25, 0.12, 16, 1, true]} />
        <meshStandardMaterial 
          color="#e0e0e0"
          metalness={0.8}
          roughness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Antenna booms */}
      <mesh position={[0, 0.35, -0.5]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 6]} />
        <meshStandardMaterial color="#888888" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.35, 0.5]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 6]} />
        <meshStandardMaterial color="#888888" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Fine guidance sensors (side blisters) */}
      <mesh position={[0.45, -0.25, 0]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[0.15, 0.1, 0.4]} />
        <meshStandardMaterial 
          color="#2d2d2d"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[-0.45, -0.25, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[0.15, 0.1, 0.4]} />
        <meshStandardMaterial 
          color="#2d2d2d"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
      
      {/* Observation aperture glow */}
      <mesh position={[0, 0, 1.73]}>
        <circleGeometry args={[0.35, 32]} />
        <meshStandardMaterial 
          color="#000033"
          metalness={0.95}
          roughness={0.05}
          emissive="#ff69b4"
          emissiveIntensity={emissiveIntensity * 0.8}
        />
      </mesh>
      
      {/* Status indicator light */}
      <mesh position={[0.52, 0, 1]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial 
          color="#ff69b4"
          emissive="#ff1493"
          emissiveIntensity={hovered ? 2 : 1}
        />
      </mesh>
      
      {/* Highlight glow when hovered */}
      {hovered && (
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 3, 16]} />
          <meshBasicMaterial 
            color="#ff69b4" 
            transparent 
            opacity={0.1}
          />
        </mesh>
      )}
    </group>
  );
}
