import { useRef, useMemo } from "react";
import styles from "../dashboard.module.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import Sun from "./planets/Sun";
import Earth from "./planets/Earth";
import Orbits from "./planets/Orbits";
import Satellites from "./satellites/Satellites";
import CameraController from "./CameraController";
import { useCameraContext } from "../../context/cameraContext";
import { useSatelliteContext } from "../../context/satelliteContext";

const EARTH_ORBIT_RADIUS = 50;

const MainPanel = () => {
  const { center, setCenter } = useCameraContext();
  const { enabledCategories, showSatellites } = useSatelliteContext();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Calculate Earth position based on current view center
  const earthPosition = useMemo(() => {
    return center === "earth"
      ? new THREE.Vector3(0, 0, 0)
      : new THREE.Vector3(EARTH_ORBIT_RADIUS, 0, 0);
  }, [center]);

  return (
    <div className={styles.topSection}>
      <Canvas
        camera={{ position: [0, 100, 100], fov: 50, near: 0.1, far: 5000 }}
      >
        {/* Space-black background */}
        <color attach="background" args={["#000008"]} />

        <ambientLight intensity={2.2} />
        <Stars
          radius={2000} // how far out the star field extends
          depth={500} // depth of the star field layers
          count={8000} // number of stars
          factor={6} // star size factor
          saturation={1} // 0 = white stars, 1 = colorful
          fade // stars fade at the edges
        />
        {center === "sun" && <Orbits />}
        <Sun center={center} setCenter={setCenter} />
        <Earth center={center} setCenter={setCenter} />

        {/* Satellites - only show when Earth is centered for better visibility */}
        {center === "earth" &&
          showSatellites &&
          enabledCategories.length > 0 && (
            <Satellites
              categories={enabledCategories}
              earthPosition={earthPosition}
            />
          )}

        <CameraController center={center} controlsRef={controlsRef} />
        <OrbitControls
          ref={controlsRef}
          enableZoom
          minDistance={2}
          maxDistance={2000}
        />
      </Canvas>
    </div>
  );
};

export default MainPanel;
