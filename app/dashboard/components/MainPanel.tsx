import styles from "../dashboard.module.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Sun from './planets/Sun';
import Earth from './planets/Earth';

const MainPanel = () => {
  return (
    <div className={styles.topSection}>
      <Canvas camera={{ position: [0, 0, 2.5] }}>
          {/* Space-black background */}
          <color attach="background" args={['#000008']} />

          <ambientLight intensity={2.2} />
          <Sun />
          <Earth />
          <OrbitControls enableZoom minDistance={1.5} maxDistance={6} />
        </Canvas>
    </div>
  );
};

export default MainPanel;
