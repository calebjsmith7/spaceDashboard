"use client";

import { useRef } from "react";
import * as THREE from "three";

interface SpaceStationProps {
  scale?: number;
  hovered?: boolean;
}

/**
 * Space Station model - ISS/Tiangong style
 * Features:
 * - Multiple connected modules (cylindrical)
 * - Large solar panel arrays
 * - Truss structure
 * - Docking ports
 */
export default function SpaceStation({ 
  scale = 1, 
  hovered = false 
}: SpaceStationProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  const baseScale = 0.025 * scale;
  const emissiveIntensity = hovered ? 0.8 : 0.3;
  
  return (
    <group ref={groupRef} scale={[baseScale, baseScale, baseScale]}>
      {/* Main pressurized module (central) */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.4, 2, 16]} />
        <meshStandardMaterial 
          color="#f5f5f5"
          metalness={0.5}
          roughness={0.5}
          emissive="#aaffaa"
          emissiveIntensity={emissiveIntensity * 0.3}
        />
      </mesh>
      
      {/* Module 2 - perpendicular */}
      <mesh position={[0, 0, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 1.4, 16]} />
        <meshStandardMaterial 
          color="#e8e8e8"
          metalness={0.5}
          roughness={0.5}
          emissive="#88ff88"
          emissiveIntensity={emissiveIntensity * 0.3}
        />
      </mesh>
      
      {/* Module 3 - extension */}
      <mesh position={[1.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.8, 16]} />
        <meshStandardMaterial 
          color="#e0e0e0"
          metalness={0.5}
          roughness={0.5}
          emissive="#88ff88"
          emissiveIntensity={emissiveIntensity * 0.3}
        />
      </mesh>
      
      {/* Node/docking hub */}
      <mesh position={[-0.9, 0, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial 
          color="#dddddd"
          metalness={0.6}
          roughness={0.4}
          emissive="#66ff66"
          emissiveIntensity={emissiveIntensity * 0.4}
        />
      </mesh>
      
      {/* Main truss structure */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.15, 5, 0.15]} />
        <meshStandardMaterial 
          color="#888888"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
      
      {/* Solar panel array 1 (port side) */}
      <group position={[0, 0, -1.8]}>
        {/* Panel support */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.3, 8]} />
          <meshStandardMaterial color="#666666" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Solar panel - pair */}
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[1.8, 0.6, 0.02]} />
          <meshStandardMaterial 
            color="#0d47a1"
            metalness={0.9}
            roughness={0.1}
            emissive="#1976d2"
            emissiveIntensity={emissiveIntensity}
          />
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <boxGeometry args={[1.8, 0.6, 0.02]} />
          <meshStandardMaterial 
            color="#0d47a1"
            metalness={0.9}
            roughness={0.1}
            emissive="#1976d2"
            emissiveIntensity={emissiveIntensity}
          />
        </mesh>
      </group>
      
      {/* Solar panel array 2 (starboard side) */}
      <group position={[0, 0, 1.8]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.3, 8]} />
          <meshStandardMaterial color="#666666" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[1.8, 0.6, 0.02]} />
          <meshStandardMaterial 
            color="#0d47a1"
            metalness={0.9}
            roughness={0.1}
            emissive="#1976d2"
            emissiveIntensity={emissiveIntensity}
          />
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <boxGeometry args={[1.8, 0.6, 0.02]} />
          <meshStandardMaterial 
            color="#0d47a1"
            metalness={0.9}
            roughness={0.1}
            emissive="#1976d2"
            emissiveIntensity={emissiveIntensity}
          />
        </mesh>
      </group>
      
      {/* Radiator panels */}
      <mesh position={[0.5, 0, -0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.8, 0.3, 0.02]} />
        <meshStandardMaterial 
          color="#ffffff"
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>
      <mesh position={[0.5, 0, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.8, 0.3, 0.02]} />
        <meshStandardMaterial 
          color="#ffffff"
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>
      
      {/* Cupola window (ISS feature) */}
      <mesh position={[0, -0.45, 0.8]}>
        <cylinderGeometry args={[0.15, 0.18, 0.1, 8]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.1}
          emissive="#44aaff"
          emissiveIntensity={emissiveIntensity * 0.6}
        />
      </mesh>
      
      {/* Docking port lights */}
      <mesh position={[-1.2, 0, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial 
          color="#00ff00"
          emissive="#00ff00"
          emissiveIntensity={1.5}
        />
      </mesh>
      <mesh position={[1.7, 0, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial 
          color="#ff0000"
          emissive="#ff0000"
          emissiveIntensity={1.5}
        />
      </mesh>
      
      {/* Highlight glow when hovered */}
      {hovered && (
        <mesh position={[0.2, 0, 0]}>
          <boxGeometry args={[3, 1.5, 4]} />
          <meshBasicMaterial 
            color="#00ff00" 
            transparent 
            opacity={0.1}
          />
        </mesh>
      )}
    </group>
  );
}
