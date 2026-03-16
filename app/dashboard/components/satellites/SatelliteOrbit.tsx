"use client";

import { useMemo } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import * as satelliteJs from "satellite.js";
import { calculateSatellitePosition, geoToThreeJS } from "../../../services/satelliteService";

interface SatelliteOrbitProps {
  satrec: satelliteJs.SatRec;
  color: string;
  earthPosition: THREE.Vector3;
  segments?: number;
}

export default function SatelliteOrbit({
  satrec,
  color,
  earthPosition,
  segments = 180,
}: SatelliteOrbitProps) {
  const orbitPoints = useMemo(() => {
    const points: [number, number, number][] = [];
    const now = new Date();
    
    // Get orbital period from mean motion (revolutions per day)
    // Period in minutes = 1440 / meanMotion
    const meanMotion = satrec.no * (1440 / (2 * Math.PI)); // Convert from rad/min to rev/day
    const periodMinutes = 1440 / meanMotion;
    
    // Calculate positions around one complete orbit
    for (let i = 0; i <= segments; i++) {
      const fraction = i / segments;
      const timeOffset = fraction * periodMinutes * 60 * 1000; // Convert to milliseconds
      const futureTime = new Date(now.getTime() + timeOffset);
      
      const position = calculateSatellitePosition(satrec, futureTime);
      
      if (position) {
        const threePos = geoToThreeJS(
          position.lat,
          position.lng,
          position.altitude
        );
        
        points.push([
          threePos.x + earthPosition.x,
          threePos.y + earthPosition.y,
          threePos.z + earthPosition.z,
        ]);
      }
    }
    
    return points;
  }, [satrec, earthPosition, segments]);

  if (orbitPoints.length < 2) {
    return null;
  }

  return (
    <Line
      points={orbitPoints}
      color={color}
      lineWidth={1}
      transparent
      opacity={0.3}
    />
  );
}
