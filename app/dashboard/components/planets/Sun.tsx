"use client"
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sparkles, useTexture } from '@react-three/drei'
import * as THREE from 'three'

export const SUN_POS: [number, number, number] = [12, 4, -10]

const CORE_COLOR   = '#fff4a3'
const SURFACE_COLOR = '#ff9500'
const CORONA_COLOR  = '#ff6a00'

export default function Sun() {
  const coronaRef = useRef<THREE.Mesh>(null!)
  const surfaceRef = useRef<THREE.Mesh>(null!)
  const sunTexture = useTexture('/sun-texture.jpg')

  useFrame((state, delta) => {
    // Slowly rotate the distorted surface for a churning look
    surfaceRef.current.rotation.y += delta * 0.05
    surfaceRef.current.rotation.z += delta * 0.03
    // Corona pulses in and out slightly
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.03
    coronaRef.current.scale.setScalar(pulse)
  })

  return (
    <>
      {/* Light emanating from the sun */}
      <pointLight position={SUN_POS} intensity={3} color="#fff4a3" distance={30} decay={1} />
      <directionalLight position={SUN_POS} intensity={1.5} color="#fff5e0" />

      {/* Core — bright white-yellow center */}
      <mesh position={SUN_POS}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshBasicMaterial color={CORE_COLOR} />
      </mesh>

      {/* Surface — textured with real solar photo, slight distort for movement */}
      <mesh position={SUN_POS} ref={surfaceRef}>
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
      <mesh position={SUN_POS} ref={coronaRef}>
        <sphereGeometry args={[0.48, 32, 32]} />
        <meshBasicMaterial color={CORONA_COLOR} transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>

      {/* Outer glow halo */}
      <mesh position={SUN_POS}>
        <sphereGeometry args={[0.62, 32, 32]} />
        <meshBasicMaterial color="#ff4400" transparent opacity={0.05} side={THREE.BackSide} />
      </mesh>

      {/* Sparkles simulate solar flares / corona particles */}
      <Sparkles
        position={SUN_POS}
        count={40}
        scale={1.2}
        size={2}
        speed={0.4}
        color="#ffaa00"
        opacity={0.7}
      />
    </>
  )
}