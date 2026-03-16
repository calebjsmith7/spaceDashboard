"use client";

import { useRef } from "react";
import * as THREE from "three";

interface WeatherSatelliteProps {
  scale?: number;
  hovered?: boolean;
}

/**
 * Weather satellite model - GOES/NOAA style
 * Geostationary weather sats typically have:
 * - Cylindrical or box-shaped body
 * - Large solar arrays
 * - Prominent imaging instruments/dishes
 */
export default function WeatherSatellite({ 
  scale = 1, 
  hovered = false 
}: WeatherSatelliteProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  const baseScale = 0.02 * scale;
  const emissiveIntensity = hovered ? 0.8 : 0.3;
  
  return (
    <group ref={groupRef} scale={[baseScale, baseScale, baseScale]}>
      {/* Main body - cylindrical bus (GOES-style) */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 1.5, 16]} />
        <meshStandardMaterial 
          color="#e8e8f0"
          metalness={0.6}
          roughness={0.4}
          emissive="#88aacc"
          emissiveIntensity={emissiveIntensity * 0.3}
        />
      </mesh>
      
      {/* Thermal blanket bands */}
      <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.61, 0.03, 8, 32]} />
        <meshStandardMaterial color="#c4a000" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.61, 0.03, 8, 32]} />
        <meshStandardMaterial color="#c4a000" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Solar panel array - north wing */}
      <mesh position={[0, 0, 1.8]}>
        <boxGeometry args={[2, 0.05, 2]} />
        <meshStandardMaterial 
          color="#1a237e"
          metalness={0.9}
          roughness={0.1}
          emissive="#3949ab"
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      
      {/* Solar panel array - south wing */}
      <mesh position={[0, 0, -1.8]}>
        <boxGeometry args={[2, 0.05, 2]} />
        <meshStandardMaterial 
          color="#1a237e"
          metalness={0.9}
          roughness={0.1}
          emissive="#3949ab"
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      
      {/* Solar panel support booms */}
      <mesh position={[0, 0, 0.95]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.7, 8]} />
        <meshStandardMaterial color="#666666" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, -0.95]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.7, 8]} />
        <meshStandardMaterial color="#666666" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Main imaging instrument - Earth-facing scanner */}
      <mesh position={[0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.35, 0.4, 0.5, 16]} />
        <meshStandardMaterial 
          color="#2d2d2d"
          metalness={0.5}
          roughness={0.5}
          emissive="#00bfff"
          emissiveIntensity={emissiveIntensity * 0.5}
        />
      </mesh>
      
      {/* Lens/aperture */}
      <mesh position={[0.95, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <circleGeometry args={[0.28, 32]} />
        <meshStandardMaterial 
          color="#001122"
          metalness={0.95}
          roughness={0.05}
          emissive="#00ddff"
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      
      {/* Communication antenna dish */}
      <mesh position={[-0.5, 0.4, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <coneGeometry args={[0.4, 0.2, 16, 1, true]} />
        <meshStandardMaterial 
          color="#cccccc"
          metalness={0.8}
          roughness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Antenna feed */}
      <mesh position={[-0.35, 0.55, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.03, 0.03, 0.3, 8]} />
        <meshStandardMaterial color="#888888" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Highlight glow when hovered */}
      {hovered && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1.2, 16, 16]} />
          <meshBasicMaterial 
            color="#00bfff" 
            transparent 
            opacity={0.12}
          />
        </mesh>
      )}
    </group>
  );
}
