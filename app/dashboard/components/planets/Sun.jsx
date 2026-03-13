

// Sun position — tweak these to move both the asset and the light together
const SUN_POS = [6, 2, 4]

function Sun() {
  return (
    <>
      <directionalLight position={SUN_POS} intensity={1.5} color="#fff5e0" />
      <mesh position={SUN_POS}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial color="#fffbe0" />
      </mesh>
      <mesh position={SUN_POS}>
        <sphereGeometry args={[0.52, 16, 16]} />
        <meshBasicMaterial color="#ffe87a" transparent opacity={0.15} />
      </mesh>
    </>
  )
}

export default Sun;
