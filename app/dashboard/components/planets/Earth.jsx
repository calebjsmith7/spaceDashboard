import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from "three";

const EARTH_CENTER_POS = [0, 0, 0];
const EARTH_OFFSET_POS = [12, -4, 10];

function Clouds({ cloudsMap, targetPosition }) {
  const cloudsRef = useRef();
  const positionRef = useRef(new THREE.Vector3(...targetPosition));

  useFrame((_, delta) => {
    cloudsRef.current.rotation.y += delta * 0.1;
    // Smoothly interpolate position
    positionRef.current.lerp(new THREE.Vector3(...targetPosition), delta * 2);
    cloudsRef.current.position.copy(positionRef.current);
  });

  return (
    <mesh ref={cloudsRef}>
      <sphereGeometry args={[1.02, 64, 64]} />
      <meshPhongMaterial
        map={cloudsMap}
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </mesh>
  );
}

const EARTH_TEXTURE = '/earth-color.jpg'
const EARTH_BUMP    = '/earth-bump.png'
const EARTH_SPEC    = '/earth-spec.png'
const CLOUDS        = '/clouds.jpg'

function Earth({ center, setCenter }) {
  const earthRef = useRef();
  const positionRef = useRef(new THREE.Vector3(...EARTH_CENTER_POS));
  const [colorMap, bumpMap, specMap] = useTexture([
    EARTH_TEXTURE,
    EARTH_BUMP,
    EARTH_SPEC,
  ]);
  const cloudsMap = useTexture(CLOUDS, undefined, (err) =>
    console.warn("clouds failed", err),
  );

  const targetPosition =
    center === "earth" ? EARTH_CENTER_POS : EARTH_OFFSET_POS;

  useFrame((_, delta) => {
    earthRef.current.rotation.y += delta * 0.08;
    // Smoothly interpolate position
    positionRef.current.lerp(new THREE.Vector3(...targetPosition), delta * 2);
    earthRef.current.position.copy(positionRef.current);
  });

  return (
    <>
      {cloudsMap && (
        <Clouds cloudsMap={cloudsMap} targetPosition={targetPosition} />
      )}
      <mesh
        ref={earthRef}
        onClick={() => setCenter("earth")}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "default")}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.05}
          specularMap={specMap}
          specular={[0.25, 0.25, 0.25]}
          shininess={3}
        />
      </mesh>
    </>
  );
}

export default Earth