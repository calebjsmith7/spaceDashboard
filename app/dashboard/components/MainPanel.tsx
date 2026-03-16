import { useRef } from "react";
import styles from "../dashboard.module.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import Sun from "./planets/Sun";
import Earth from "./planets/Earth";
import Orbits from "./planets/Orbits";
import CameraController from "./CameraController";
import { useCameraContext } from "../../context/cameraContext";

const MainPanel = () => {
  const { center, setCenter } = useCameraContext();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  return (
    <div className={styles.topSection}>
      <Canvas camera={{ position: [0, 100, 100], fov: 50, near: 0.1, far: 5000 }}>
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
