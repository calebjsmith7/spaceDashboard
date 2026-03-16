import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";

type CameraControllerProps = {
  center: "earth" | "sun";
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
};

export default function CameraController({ center, controlsRef }: CameraControllerProps) {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const isAnimating = useRef(false);
  const prevCenter = useRef<string | null>(null);

  useEffect(() => {
    // Only animate if center actually changed
    if (prevCenter.current === center) return;
    prevCenter.current = center;
    
    isAnimating.current = true;
    
    if (center === "sun") {
      // Zoomed out view for sun
      targetPosition.current.set(0, 45, 45);
    } else {
      // Zoomed in view for earth - Earth moves to origin, camera looks at origin
      targetPosition.current.set(3, 2, 4);
    }
  }, [center]);

  // Stop animation when user interacts with controls
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const handleStart = () => {
      isAnimating.current = false;
    };

    controls.addEventListener("start", handleStart);
    return () => {
      controls.removeEventListener("start", handleStart);
    };
  }, [controlsRef]);

  useFrame((_, delta) => {
    if (!isAnimating.current) return;

    // Smoothly interpolate camera position
    camera.position.lerp(targetPosition.current, delta * 2);
    
    // Smoothly move the OrbitControls target
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt.current, delta * 2);
      controlsRef.current.update();
    }

    // Check if we're close enough to stop animating
    if (camera.position.distanceTo(targetPosition.current) < 0.1) {
      isAnimating.current = false;
    }
  });

  return null;
}
