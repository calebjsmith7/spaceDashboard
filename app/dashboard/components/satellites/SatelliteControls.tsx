"use client";

import { useSatelliteContext } from "../../../context/satelliteContext";
import { SatelliteCategory } from "../../../types/satellite";

export default function SatelliteControls() {
  const {
    enabledCategories,
    toggleCategory,
    showSatellites,
    setShowSatellites,
    getCategoryConfig,
    allCategories,
  } = useSatelliteContext();

  return (
    <div style={{ padding: "16px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>
          Satellites
        </h3>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={showSatellites}
            onChange={(e) => setShowSatellites(e.target.checked)}
            style={{ cursor: "pointer" }}
          />
          <span style={{ fontSize: "12px" }}>Show</span>
        </label>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          opacity: showSatellites ? 1 : 0.5,
          pointerEvents: showSatellites ? "auto" : "none",
        }}
      >
        {allCategories.map((category) => {
          const config = getCategoryConfig(category);
          const isEnabled = enabledCategories.includes(category);

          return (
            <label
              key={category}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                padding: "4px 0",
              }}
            >
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={() => toggleCategory(category)}
                style={{ cursor: "pointer" }}
              />
              <span
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: config.color,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: "12px" }}>{config.label}</span>
            </label>
          );
        })}
      </div>

      <p
        style={{
          marginTop: "12px",
          fontSize: "10px",
          color: "#888",
          lineHeight: 1.4,
        }}
      >
        Click on Earth to view satellites. Satellite positions update in real-time.
      </p>
    </div>
  );
}
