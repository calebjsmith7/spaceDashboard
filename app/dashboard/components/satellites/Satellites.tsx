"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import * as satelliteJs from "satellite.js";
import {
  Satellite,
  SatelliteCategory,
  SATELLITE_CATEGORIES,
} from "../../../types/satellite";
import {
  fetchSatellitesByCategory,
  createSatRec,
  calculateSatellitePosition,
  geoToThreeJS,
} from "../../../services/satelliteService";
import { useSatelliteContext } from "../../../context/satelliteContext";
import {
  StarlinkSatellite,
  WeatherSatellite,
  SpaceStation,
  GPSSatellite,
  ScienceSatellite,
  GenericSatellite,
} from "./models";
import { ThreeEvent } from "@react-three/fiber";
import SatelliteOrbit from "./SatelliteOrbit";

interface SatellitePointProps {
  satellite: Satellite;
  satrec: satelliteJs.SatRec;
  color: string;
  category: SatelliteCategory;
  earthPosition: THREE.Vector3;
  onHover?: (satellite: Satellite | null) => void;
  onClick?: (satellite: Satellite) => void;
}

// Get the appropriate 3D model component based on satellite category
function getSatelliteModel(
  category: SatelliteCategory, 
  hovered: boolean, 
  color: string
) {
  switch (category) {
    case 'starlink':
      return <StarlinkSatellite hovered={hovered} />;
    case 'weather':
      return <WeatherSatellite hovered={hovered} />;
    case 'stations':
      return <SpaceStation hovered={hovered} />;
    case 'gps-ops':
      return <GPSSatellite hovered={hovered} />;
    case 'science':
      return <ScienceSatellite hovered={hovered} />;
    case 'active':
    default:
      return <GenericSatellite hovered={hovered} color={color} />;
  }
}

function SatellitePoint({
  satellite,
  satrec,
  color,
  category,
  earthPosition,
  onHover,
  onClick,
}: SatellitePointProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;

    const now = new Date();
    const position = calculateSatellitePosition(satrec, now);

    if (position) {
      const threePos = geoToThreeJS(
        position.lat,
        position.lng,
        position.altitude,
      );
      // Offset by Earth's position in the scene
      groupRef.current.position.set(
        threePos.x + earthPosition.x,
        threePos.y + earthPosition.y,
        threePos.z + earthPosition.z,
      );

      // Make satellite face the direction of travel (tangent to orbit)
      // Calculate velocity direction for orientation
      const futureTime = new Date(now.getTime() + 1000); // 1 second ahead
      const futurePosition = calculateSatellitePosition(satrec, futureTime);

      if (futurePosition) {
        const futureThreePos = geoToThreeJS(
          futurePosition.lat,
          futurePosition.lng,
          futurePosition.altitude,
        );

        // Calculate direction vector
        const direction = new THREE.Vector3(
          futureThreePos.x - threePos.x,
          futureThreePos.y - threePos.y,
          futureThreePos.z - threePos.z,
        ).normalize();

        // Orient satellite along its velocity vector
        const up = new THREE.Vector3(
          threePos.x,
          threePos.y,
          threePos.z,
        ).normalize();
        const quaternion = new THREE.Quaternion();
        const matrix = new THREE.Matrix4();
        matrix.lookAt(new THREE.Vector3(0, 0, 0), direction, up);
        quaternion.setFromRotationMatrix(matrix);
        groupRef.current.quaternion.copy(quaternion);
      }
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover?.(satellite);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover?.(null);
        document.body.style.cursor = "default";
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onClick?.(satellite);
      }}
    >
      {/* Invisible hitbox for easier hovering */}
      <mesh visible={false}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Render the appropriate 3D satellite model */}
      {getSatelliteModel(category, hovered, color)}

      {/* Tooltip on hover */}
      {hovered && (
        <Html distanceFactor={5} style={{ pointerEvents: "none" }}>
          <div
            style={{
              background: "rgba(0, 0, 0, 0.85)",
              color: "white",
              padding: "6px 10px",
              borderRadius: "4px",
              fontSize: "11px",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              border: `1px solid ${color}`,
              boxShadow: `0 0 10px ${color}40`,
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
              {satellite.name}
            </div>
            <div style={{ fontSize: "10px", opacity: 0.8, color: color }}>
              {SATELLITE_CATEGORIES[category].label}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

interface SatellitesProps {
  categories?: SatelliteCategory[];
  earthPosition?: THREE.Vector3;
  visible?: boolean;
}

export default function Satellites({
  categories = ["stations", "weather", "gps-ops", "science"],
  earthPosition = new THREE.Vector3(50, 0, 0), // Default Earth position (at orbit radius)
  visible = true,
}: SatellitesProps) {
  const { setSelectedSatellite, showOrbits } = useSatelliteContext();
  const [satellites, setSatellites] = useState<
    Map<SatelliteCategory, { satellite: Satellite; satrec: satelliteJs.SatRec }[]>
  >(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredSatellite, setHoveredSatellite] = useState<Satellite | null>(null);

  // Fetch satellites for each category
  useEffect(() => {
    async function loadSatellites() {
      setLoading(true);
      setError(null);

      const newSatellites = new Map<
        SatelliteCategory,
        { satellite: Satellite; satrec: satelliteJs.SatRec }[]
      >();

      for (const category of categories) {
        const config = SATELLITE_CATEGORIES[category];
        const sats = await fetchSatellitesByCategory(category, config);

        const processedSats: { satellite: Satellite; satrec: satelliteJs.SatRec }[] = [];

        for (const sat of sats) {
          const satrec = createSatRec(sat.tle);
          if (satrec) {
            processedSats.push({ satellite: sat, satrec });
          }
        }

        newSatellites.set(category, processedSats);
        console.log(`Loaded ${processedSats.length} ${category} satellites`);
      }

      setSatellites(newSatellites);
      setLoading(false);
    }

    loadSatellites();
  }, [categories]);

  if (!visible || loading) {
    return null;
  }

  return (
    <group>
      {Array.from(satellites.entries()).map(([category, sats]) => {
        const config = SATELLITE_CATEGORIES[category];
        return sats.map(({ satellite, satrec }) => (
          <group key={satellite.id}>
            {/* Render orbital path if enabled */}
            {showOrbits && (
              <SatelliteOrbit
                satrec={satrec}
                color={config.color}
                earthPosition={earthPosition}
              />
            )}
            {/* Render satellite point */}
            <SatellitePoint
              satellite={satellite}
              satrec={satrec}
              color={config.color}
              category={category}
              earthPosition={earthPosition}
              onHover={setHoveredSatellite}
              onClick={setSelectedSatellite}
            />
          </group>
        ));
      })}
    </group>
  );
}
