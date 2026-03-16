"use client";

import { useRef } from "react";
import * as THREE from "three";

interface StarlinkSatelliteProps {
  scale?: number;
  hovered?: boolean;
}

/**
 * Starlink satellite model - flat-panel design with solar array
 * Real Starlink sats are flat rectangular bodies (~3.2m x 1.6m) with
 * a single large solar panel array that folds out
 */
export default function StarlinkSatellite({ 
  scale = 1, 
  hovered = false 
}: StarlinkSatelliteProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  const baseScale = 0.015 * scale;
  const emissiveIntensity = hovered ? 0.8 : 0.3;
  
  return (
    <group ref={groupRef} scale={[baseScale, baseScale, baseScale]}>
      {/* Main body - flat rectangular chassis */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 0.15, 1]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          metalness={0.8} 
          roughness={0.3}
          emissive="#4a4a6a"
          emissiveIntensity={emissiveIntensity * 0.3}
        />
      </mesh>
      
      {/* Solar panel array - the distinctive flat panel */}
      <mesh position={[0, 0.1, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[3.2, 0.02, 1.6]} />
        <meshStandardMaterial 
          color="#1e3a5f"
          metalness={0.9}
          roughness={0.1}
          emissive="#3d7ab8"
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      
      {/* Solar cell grid lines */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[3.18, 0.005, 0.02]} />
        <meshStandardMaterial color="#0a1628" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.12, 0.4]}>
        <boxGeometry args={[3.18, 0.005, 0.02]} />
        <meshStandardMaterial color="#0a1628" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.12, -0.4]}>
        <boxGeometry args={[3.18, 0.005, 0.02]} />
        <meshStandardMaterial color="#0a1628" metalness={0.5} roughness={0.5} />
      </mesh>
      
      {/* Phased array antennas (Starlink's distinctive feature) */}
      <mesh position={[0, -0.12, 0]}>
        <boxGeometry args={[1.2, 0.05, 0.8]} />
        <meshStandardMaterial 
          color="#2d2d44"
          metalness={0.7}
          roughness={0.4}
          emissive="#5555aa"
          emissiveIntensity={emissiveIntensity * 0.5}
        />
      </mesh>
      
      {/* Ion thruster glow */}
      <mesh position={[-1.1, -0.05, 0]}>
        <cylinderGeometry args={[0.08, 0.06, 0.1, 8]} />
        <meshStandardMaterial 
          color="#6666ff"
          emissive="#4444ff"
          emissiveIntensity={hovered ? 2 : 0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Highlight glow when hovered */}
      {hovered && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3.4, 0.3, 1.8]} />
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.15}
          />
        </mesh>
      )}
    </group>
  );
}
