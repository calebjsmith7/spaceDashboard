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

interface SatellitePointProps {
  satellite: Satellite;
  satrec: satelliteJs.SatRec;
  color: string;
  earthPosition: THREE.Vector3;
  onHover?: (satellite: Satellite | null) => void;
}

function SatellitePoint({
  satellite,
  satrec,
  color,
  earthPosition,
  onHover,
}: SatellitePointProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!meshRef.current) return;

    const now = new Date();
    const position = calculateSatellitePosition(satrec, now);

    if (position) {
      const threePos = geoToThreeJS(position.lat, position.lng, position.altitude);
      // Offset by Earth's position in the scene
      meshRef.current.position.set(
        threePos.x + earthPosition.x,
        threePos.y + earthPosition.y,
        threePos.z + earthPosition.z
      );
    }
  });

  return (
    <mesh
      ref={meshRef}
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
    >
      <sphereGeometry args={[hovered ? 0.03 : 0.02, 8, 8]} />
      <meshBasicMaterial color={hovered ? "#ffffff" : color} />
      {hovered && (
        <Html distanceFactor={10}>
          <div
            style={{
              background: "rgba(0, 0, 0, 0.8)",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            {satellite.name}
          </div>
        </Html>
      )}
    </mesh>
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
          <SatellitePoint
            key={satellite.id}
            satellite={satellite}
            satrec={satrec}
            color={config.color}
            earthPosition={earthPosition}
            onHover={setHoveredSatellite}
          />
        ));
      })}
    </group>
  );
}
