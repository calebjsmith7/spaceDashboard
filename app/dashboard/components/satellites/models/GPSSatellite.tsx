"use client";

import { useRef } from "react";
import * as THREE from "three";

interface GPSSatelliteProps {
  scale?: number;
  hovered?: boolean;
}

/**
 * GPS satellite model - Block IIF/III style
 * Features:
 * - Box-shaped main body
 * - Two large deployable solar wing arrays
 * - Multiple antennas for navigation signals
 * - Characteristic gold thermal blanket
 */
export default function GPSSatellite({ 
  scale = 1, 
  hovered = false 
}: GPSSatelliteProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  const baseScale = 0.02 * scale;
  const emissiveIntensity = hovered ? 0.8 : 0.3;
  
  return (
    <group ref={groupRef} scale={[baseScale, baseScale, baseScale]}>
      {/* Main body - box-shaped bus */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 1, 1.2]} />
        <meshStandardMaterial 
          color="#c9a227"
          metalness={0.7}
          roughness={0.3}
          emissive="#ffd700"
          emissiveIntensity={emissiveIntensity * 0.4}
        />
      </mesh>
      
      {/* Thermal blanket detail - horizontal bands */}
      <mesh position={[0, 0.35, 0.61]}>
        <boxGeometry args={[1.1, 0.08, 0.01]} />
        <meshStandardMaterial color="#8b7355" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.61]}>
        <boxGeometry args={[1.1, 0.08, 0.01]} />
        <meshStandardMaterial color="#8b7355" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.35, 0.61]}>
        <boxGeometry args={[1.1, 0.08, 0.01]} />
        <meshStandardMaterial color="#8b7355" metalness={0.5} roughness={0.5} />
      </mesh>
      
      {/* Solar panel wing - port side */}
      <group position={[-1.8, 0, 0]}>
        {/* Wing structure */}
        <mesh>
          <boxGeometry args={[2.4, 0.04, 1.4]} />
          <meshStandardMaterial 
            color="#1a237e"
            metalness={0.9}
            roughness={0.1}
            emissive="#ffd700"
            emissiveIntensity={emissiveIntensity}
          />
        </mesh>
        {/* Panel frame */}
        <mesh position={[0, 0.025, 0]}>
          <boxGeometry args={[2.42, 0.01, 1.42]} />
          <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Cell divisions */}
        <mesh position={[-0.6, 0.03, 0]}>
          <boxGeometry args={[0.02, 0.01, 1.38]} />
          <meshStandardMaterial color="#111122" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[0.6, 0.03, 0]}>
          <boxGeometry args={[0.02, 0.01, 1.38]} />
          <meshStandardMaterial color="#111122" metalness={0.5} roughness={0.5} />
        </mesh>
      </group>
      
      {/* Solar panel wing - starboard side */}
      <group position={[1.8, 0, 0]}>
        <mesh>
          <boxGeometry args={[2.4, 0.04, 1.4]} />
          <meshStandardMaterial 
            color="#1a237e"
            metalness={0.9}
            roughness={0.1}
            emissive="#ffd700"
            emissiveIntensity={emissiveIntensity}
          />
        </mesh>
        <mesh position={[0, 0.025, 0]}>
          <boxGeometry args={[2.42, 0.01, 1.42]} />
          <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[-0.6, 0.03, 0]}>
          <boxGeometry args={[0.02, 0.01, 1.38]} />
          <meshStandardMaterial color="#111122" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[0.6, 0.03, 0]}>
          <boxGeometry args={[0.02, 0.01, 1.38]} />
          <meshStandardMaterial color="#111122" metalness={0.5} roughness={0.5} />
        </mesh>
      </group>
      
      {/* Solar panel deployment arms */}
      <mesh position={[-0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.3, 8]} />
        <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.3, 8]} />
        <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* L-Band navigation antenna array (Earth-facing) */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.15, 12]} />
        <meshStandardMaterial 
          color="#2d2d2d"
          metalness={0.6}
          roughness={0.4}
          emissive="#ffaa00"
          emissiveIntensity={emissiveIntensity * 0.6}
        />
      </mesh>
      
      {/* Antenna feed cone */}
      <mesh position={[0, -0.75, 0]}>
        <coneGeometry args={[0.15, 0.2, 8]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      
      {/* UHF antenna */}
      <mesh position={[0.4, 0.6, 0.4]} rotation={[0.3, 0, 0.3]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 6]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* S-Band antenna dish */}
      <mesh position={[0, 0.5, -0.5]} rotation={[Math.PI / 4, 0, 0]}>
        <coneGeometry args={[0.2, 0.1, 12, 1, true]} />
        <meshStandardMaterial 
          color="#cccccc"
          metalness={0.8}
          roughness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Signal transmission indicator */}
      <mesh position={[0, -0.9, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial 
          color="#ffd700"
          emissive="#ffaa00"
          emissiveIntensity={hovered ? 2 : 1}
        />
      </mesh>
      
      {/* Highlight glow when hovered */}
      {hovered && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[6.5, 1.5, 2]} />
          <meshBasicMaterial 
            color="#ffd700" 
            transparent 
            opacity={0.1}
          />
        </mesh>
      )}
    </group>
  );
}
