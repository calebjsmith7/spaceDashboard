"use client";

import { useRef } from "react";
import * as THREE from "three";

interface GenericSatelliteProps {
  scale?: number;
  hovered?: boolean;
  color?: string;
}

/**
 * Generic satellite model for active/miscellaneous satellites
 * Standard cubesat/smallsat style with deployable solar panels
 */
export default function GenericSatellite({ 
  scale = 1, 
  hovered = false,
  color = "#ff6347"
}: GenericSatelliteProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  const baseScale = 0.018 * scale;
  const emissiveIntensity = hovered ? 0.8 : 0.3;
  
  // Convert hex color to a slightly different shade for emissive
  const emissiveColor = color;
  
  return (
    <group ref={groupRef} scale={[baseScale, baseScale, baseScale]}>
      {/* Main body - cube/box shape (typical smallsat) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial 
          color="#3d3d3d"
          metalness={0.6}
          roughness={0.4}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity * 0.3}
        />
      </mesh>
      
      {/* Metallic panel faces */}
      <mesh position={[0, 0, 0.41]}>
        <planeGeometry args={[0.75, 0.75]} />
        <meshStandardMaterial 
          color="#555555"
          metalness={0.8}
          roughness={0.2}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity * 0.2}
        />
      </mesh>
      
      {/* Deployable solar panel - left */}
      <group position={[-0.9, 0, 0]}>
        <mesh>
          <boxGeometry args={[1, 0.03, 0.6]} />
          <meshStandardMaterial 
            color="#1a237e"
            metalness={0.9}
            roughness={0.1}
            emissive={emissiveColor}
            emissiveIntensity={emissiveIntensity * 0.8}
          />
        </mesh>
        {/* Panel hinge */}
        <mesh position={[0.52, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.15, 8]} />
          <meshStandardMaterial color="#666666" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
      
      {/* Deployable solar panel - right */}
      <group position={[0.9, 0, 0]}>
        <mesh>
          <boxGeometry args={[1, 0.03, 0.6]} />
          <meshStandardMaterial 
            color="#1a237e"
            metalness={0.9}
            roughness={0.1}
            emissive={emissiveColor}
            emissiveIntensity={emissiveIntensity * 0.8}
          />
        </mesh>
        <mesh position={[-0.52, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.15, 8]} />
          <meshStandardMaterial color="#666666" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
      
      {/* Communication antenna */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.35, 6]} />
        <meshStandardMaterial color="#888888" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 1.5 : 0.5}
        />
      </mesh>
      
      {/* Camera/sensor package */}
      <mesh position={[0, -0.45, 0.2]}>
        <cylinderGeometry args={[0.12, 0.15, 0.15, 12]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Lens */}
      <mesh position={[0, -0.53, 0.2]}>
        <circleGeometry args={[0.1, 16]} />
        <meshStandardMaterial 
          color="#000022"
          metalness={0.95}
          roughness={0.05}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity * 0.5}
        />
      </mesh>
      
      {/* Thruster nozzles */}
      <mesh position={[0.3, -0.42, -0.3]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.05, 0.08, 8]} />
        <meshStandardMaterial color="#444444" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-0.3, -0.42, -0.3]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.05, 0.08, 8]} />
        <meshStandardMaterial color="#444444" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Highlight glow when hovered */}
      {hovered && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.5, 1.2, 1.2]} />
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.12}
          />
        </mesh>
      )}
    </group>
  );
}
