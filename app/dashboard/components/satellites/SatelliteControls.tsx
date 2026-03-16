"use client";

import { useSatelliteContext } from "../../../context/satelliteContext";
import { SatelliteCategory } from "../../../types/satellite";

const controlStyles = {
  container: {
    padding: "12px",
  },
  section: {
    background: "rgba(33, 38, 45, 0.6)",
    borderRadius: "8px",
    border: "1px solid rgba(48, 54, 61, 0.8)",
    padding: "12px",
    marginBottom: "12px",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
    paddingBottom: "8px",
    borderBottom: "1px solid rgba(48, 54, 61, 0.6)",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "11px",
    fontWeight: 600,
    color: "#8b949e",
    letterSpacing: "0.5px",
    textTransform: "uppercase" as const,
  },
  toggle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
  },
  toggleSwitch: {
    position: "relative" as const,
    width: "36px",
    height: "20px",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  toggleKnob: {
    position: "absolute" as const,
    top: "2px",
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    backgroundColor: "#fff",
    transition: "left 0.2s",
    boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
  },
  categoryList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
  },
  categoryItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.15s",
    border: "1px solid transparent",
  },
  categoryItemHover: {
    background: "rgba(88, 166, 255, 0.1)",
    border: "1px solid rgba(88, 166, 255, 0.2)",
  },
  checkbox: {
    appearance: "none" as const,
    width: "16px",
    height: "16px",
    borderRadius: "4px",
    border: "2px solid #30363d",
    background: "#0d1117",
    cursor: "pointer",
    position: "relative" as const,
    transition: "all 0.15s",
  },
  checkboxChecked: {
    background: "#58a6ff",
    borderColor: "#58a6ff",
  },
  colorDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    flexShrink: 0,
    boxShadow: "0 0 6px currentColor",
  },
  label: {
    fontSize: "12px",
    color: "#e6edf3",
    fontWeight: 500,
  },
  hint: {
    marginTop: "12px",
    padding: "10px",
    background: "rgba(88, 166, 255, 0.08)",
    borderRadius: "6px",
    border: "1px solid rgba(88, 166, 255, 0.15)",
    fontSize: "10px",
    color: "#8b949e",
    lineHeight: 1.5,
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
  },
  hintIcon: {
    fontSize: "12px",
    flexShrink: 0,
  },
};

export default function SatelliteControls() {
  const {
    enabledCategories,
    toggleCategory,
    showSatellites,
    setShowSatellites,
    showOrbits,
    setShowOrbits,
    getCategoryConfig,
    allCategories,
  } = useSatelliteContext();

  return (
    <div style={controlStyles.container}>
      <div style={controlStyles.section}>
        <div style={controlStyles.sectionHeader}>
          <h3 style={controlStyles.sectionTitle}>Satellite Visibility</h3>
          <label style={controlStyles.toggle}>
            <div
              style={{
                ...controlStyles.toggleSwitch,
                background: showSatellites ? "#238636" : "#30363d",
              }}
              onClick={() => setShowSatellites(!showSatellites)}
            >
              <div
                style={{
                  ...controlStyles.toggleKnob,
                  left: showSatellites ? "18px" : "2px",
                }}
              />
            </div>
          </label>
        </div>

        <div
          style={{
            ...controlStyles.categoryList,
            opacity: showSatellites ? 1 : 0.4,
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
                  ...controlStyles.categoryItem,
                  background: isEnabled
                    ? "rgba(88, 166, 255, 0.08)"
                    : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isEnabled) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isEnabled
                    ? "rgba(88, 166, 255, 0.08)"
                    : "transparent";
                }}
              >
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={() => toggleCategory(category)}
                  style={{
                    ...controlStyles.checkbox,
                    ...(isEnabled ? controlStyles.checkboxChecked : {}),
                  }}
                />
                <span
                  style={{
                    ...controlStyles.colorDot,
                    backgroundColor: config.color,
                    color: config.color,
                  }}
                />
                <span style={controlStyles.label}>{config.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Orbit Lines Toggle */}
      <div style={controlStyles.section}>
        <div style={controlStyles.sectionHeader}>
          <h3 style={controlStyles.sectionTitle}>Orbital Paths</h3>
          <label style={controlStyles.toggle}>
            <div
              style={{
                ...controlStyles.toggleSwitch,
                background: showOrbits ? "#238636" : "#30363d",
              }}
              onClick={() => setShowOrbits(!showOrbits)}
            >
              <div
                style={{
                  ...controlStyles.toggleKnob,
                  left: showOrbits ? "18px" : "2px",
                }}
              />
            </div>
          </label>
        </div>
        <div style={{ fontSize: "11px", color: "#8b949e", padding: "0 4px" }}>
          Show predicted orbital paths for visible satellites
        </div>
      </div>

      <div style={controlStyles.hint}>
        <span style={controlStyles.hintIcon}>💡</span>
        <span>
          Click on Earth to focus on satellites. Positions update in real-time
          using TLE data.
        </span>
      </div>
    </div>
  );
}
