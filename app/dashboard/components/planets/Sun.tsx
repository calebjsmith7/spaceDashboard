"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sparkles, useTexture } from "@react-three/drei";
import * as THREE from "three";

const CORE_COLOR = "#fff4a3";
const SURFACE_COLOR = "#ff9500";
const CORONA_COLOR = "#ff6a00";

const SUN_CENTER_POS: [number, number, number] = [0, 0, 0];
const SUN_OFFSET_POS: [number, number, number] = [-12, 4, -10];

export default function Sun({
  center,
  setCenter,
}: {
  center: "earth" | "sun";
  setCenter: (value: "earth" | "sun") => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const coronaRef = useRef<THREE.Mesh>(null!);
  const surfaceRef = useRef<THREE.Mesh>(null!);
  const positionRef = useRef(new THREE.Vector3(...SUN_OFFSET_POS));
  const sunTexture = useTexture("/sun-texture.jpg");

  const targetPosition = center === "sun" ? SUN_CENTER_POS : SUN_OFFSET_POS;

  useFrame((state, delta) => {
    // Slowly rotate the distorted surface for a churning look
    surfaceRef.current.rotation.y += delta * 0.05;
    surfaceRef.current.rotation.z += delta * 0.03;
    // Corona pulses in and out slightly
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.03;
    coronaRef.current.scale.setScalar(pulse);
    // Smoothly interpolate position
    positionRef.current.lerp(new THREE.Vector3(...targetPosition), delta * 2);
    groupRef.current.position.copy(positionRef.current);
  });

  return (
    <group
      ref={groupRef}
      onClick={() => setCenter("sun")}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      {/* Light emanating from the sun */}
      <pointLight intensity={3} color="#fff4a3" distance={30} decay={1} />
      <directionalLight intensity={1.5} color="#fff5e0" />

      {/* Core — bright white-yellow center */}
      <mesh>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshBasicMaterial color={CORE_COLOR} />
      </mesh>

      {/* Surface — textured with real solar photo, slight distort for movement */}
      <mesh ref={surfaceRef}>
        <sphereGeometry args={[0.35, 64, 64]} />
        <MeshDistortMaterial
          map={sunTexture}
          emissiveMap={sunTexture}
          emissive={SURFACE_COLOR}
          emissiveIntensity={0.8}
          distort={0.15}
          speed={1.5}
          roughness={0}
        />
      </mesh>

      {/* Corona — soft outer glow layer */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[0.48, 32, 32]} />
        <meshBasicMaterial
          color={CORONA_COLOR}
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer glow halo */}
      <mesh>
        <sphereGeometry args={[0.62, 32, 32]} />
        <meshBasicMaterial
          color="#ff4400"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Sparkles simulate solar flares / corona particles */}
      <Sparkles
        count={40}
        scale={1.2}
        size={2}
        speed={0.4}
        color="#ffaa00"
        opacity={0.7}
      />
    </group>
  );
}
