import { Line } from "@react-three/drei";

type OrbitLineProps = {
  radius: number;
  color?: string;
};

export default function OrbitLine({ radius, color = "#4a90d9" }: OrbitLineProps) {
  const points: [number, number, number][] = [];
  const segments = 128;

  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius]);
  }

  return (
    <Line
      points={points}
      color={color}
      lineWidth={1}
      transparent
      opacity={0.4}
    />
  );
}
