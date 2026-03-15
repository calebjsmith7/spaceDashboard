import styles from "../dashboard.module.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import Sun from './planets/Sun';
import Earth from './planets/Earth';

const MainPanel = () => {
  return (
    <div className={styles.topSection}>
      <Canvas camera={{ position: [0, 0, 2.5] }}>
        {/* Space-black background */}
        <color attach="background" args={["#000008"]} />

        <ambientLight intensity={2.2} />
        <Stars
          radius={100} // how far out the star field extends
          depth={50} // depth of the star field layers
          count={5000} // number of stars
          factor={4} // star size factor
          saturation={1} // 0 = white stars, 1 = colorful
          fade // stars fade at the edges
        />
        <Sun />
        <Earth />
        <OrbitControls enableZoom minDistance={1.5} maxDistance={6} />
      </Canvas>
    </div>
  );
};

export default MainPanel;
