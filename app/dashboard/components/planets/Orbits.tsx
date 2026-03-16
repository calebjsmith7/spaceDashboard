"use client";

import { Line, Text } from "@react-three/drei";
import { useMemo } from "react";

type OrbitData = {
  name: string;
  label: string;
  radius: number;
  color: string;
};

// Sun radius for visual scale (not to true scale - would be 109x Earth)
const SUN_RADIUS = 10;

// Scaled orbital radii - starting from outside the sun
// Real ratios from Earth: Mercury 0.39, Venus 0.72, Earth 1.0, Mars 1.52, Jupiter 5.2, Saturn 9.5, Uranus 19.2, Neptune 30.1
// We use Earth's orbit as our base unit (50 units from center)
const EARTH_ORBIT_RADIUS = 50;

const ORBITS: OrbitData[] = [
  {
    name: "mercury",
    label: "Mercury Solar Orbit",
    radius: EARTH_ORBIT_RADIUS * 0.39,
    color: "#b0b0b0", // Gray
  },
  {
    name: "venus",
    label: "Venus Solar Orbit",
    radius: EARTH_ORBIT_RADIUS * 0.72,
    color: "#e6c87a", // Yellowish
  },
  {
    name: "earth",
    label: "Earth Solar Orbit",
    radius: EARTH_ORBIT_RADIUS * 1.0,
    color: "#4a90d9", // Blue
  },
  {
    name: "mars",
    label: "Mars Solar Orbit",
    radius: EARTH_ORBIT_RADIUS * 1.52,
    color: "#d9534f", // Red
  },
  {
    name: "jupiter",
    label: "Jupiter Solar Orbit",
    radius: EARTH_ORBIT_RADIUS * 5.2,
    color: "#d9a066", // Orange-brown
  },
  {
    name: "saturn",
    label: "Saturn Solar Orbit",
    radius: EARTH_ORBIT_RADIUS * 9.5,
    color: "#c9b896", // Tan/beige
  },
  {
    name: "uranus",
    label: "Uranus Solar Orbit",
    radius: EARTH_ORBIT_RADIUS * 19.2,
    color: "#7ec8e3", // Light cyan
  },
  {
    name: "neptune",
    label: "Neptune Solar Orbit",
    radius: EARTH_ORBIT_RADIUS * 30.1,
    color: "#4169e1", // Royal blue
  },
];

type OrbitLineProps = {
  radius: number;
  color: string;
  label: string;
};

function OrbitLine({ radius, color, label }: OrbitLineProps) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    const segments = 128;

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius]);
    }
    return pts;
  }, [radius]);

  // Position the label at a specific point on the orbit (45 degrees)
  const labelAngle = Math.PI / 4; // 45 degrees
  const labelPosition: [number, number, number] = [
    Math.cos(labelAngle) * radius,
    0.5, // Slightly above the orbit plane
    Math.sin(labelAngle) * radius,
  ];

  // Rotate text to follow the orbit direction (tangent to the circle)
  // At 45 degrees, the tangent direction is perpendicular to the radius
  const textRotation: [number, number, number] = [
    -Math.PI / 2, // Lay flat on the XZ plane
    0,
    -labelAngle - Math.PI / 2, // Align with orbit direction
  ];

  // Scale font size based on orbit radius for readability
  const fontSize = Math.max(1.5, Math.min(radius * 0.04, 8));

  return (
    <group>
      <Line
        points={points}
        color={color}
        lineWidth={1}
        transparent
        opacity={0.4}
      />
      <Text
        position={labelPosition}
        rotation={textRotation}
        fontSize={fontSize}
        color="white"
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

type OrbitsProps = {
  showOrbits?: string[]; // Optional filter to show only specific orbits
};

export default function Orbits({ showOrbits }: OrbitsProps) {
  const orbitsToRender = showOrbits
    ? ORBITS.filter((orbit) => showOrbits.includes(orbit.name))
    : ORBITS;

  return (
    <group>
      {orbitsToRender.map((orbit) => (
        <OrbitLine
          key={orbit.name}
          radius={orbit.radius}
          color={orbit.color}
          label={orbit.label}
        />
      ))}
    </group>
  );
}

// Export the Earth orbit radius for use in other components
export { EARTH_ORBIT_RADIUS, ORBITS };
