import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'

function Clouds({ cloudsMap }) {
  const cloudsRef = useRef()
  useFrame((_, delta) => { cloudsRef.current.rotation.y += delta * 0.10 })
  return (
    <mesh ref={cloudsRef}>
      <sphereGeometry args={[1.02, 64, 64]} />
      <meshPhongMaterial map={cloudsMap} transparent opacity={0.35} depthWrite={false} />
    </mesh>
  )
}

// Earth textures — hosted on reliable public CDNs
const EARTH_TEXTURE = '/earth-color.jpg'
const EARTH_BUMP    = '/earth-bump.png'
const EARTH_SPEC    = '/earth-spec.png'
const CLOUDS        = '/clouds.jpg'

function Earth() {
  const earthRef = useRef()
  const [colorMap, bumpMap, specMap] = useTexture([EARTH_TEXTURE, EARTH_BUMP, EARTH_SPEC])
const cloudsMap = useTexture(CLOUDS, undefined, (err) => console.warn('clouds failed', err))
  useFrame((_, delta) => { earthRef.current.rotation.y += delta * 0.08 })

  return (
    <>
    {cloudsMap && <Clouds cloudsMap={cloudsMap} />}
      <mesh ref={earthRef}>
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
  )
}

export default Earth