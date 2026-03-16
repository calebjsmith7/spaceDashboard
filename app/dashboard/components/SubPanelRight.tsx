"use client";

import styles from "../dashboard.module.css";
import { useSatelliteContext } from "../../context/satelliteContext";
import { SATELLITE_CATEGORIES } from "../../types/satellite";

type SubPanelRightProps = {
  expanded: boolean;
  collapsed: boolean;
  onToggle: () => void;
};

const panelStyles = {
  container: {
    background: "linear-gradient(180deg, #0d1117 0%, #161b22 100%)",
    height: "100%",
    display: "flex",
    flexDirection: "column" as const,
  },
  header: {
    padding: "16px 20px",
    borderBottom: "1px solid rgba(48, 54, 61, 0.8)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  headerIcon: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#a371f7",
    boxShadow: "0 0 8px rgba(163, 113, 247, 0.6)",
  },
  headerTitle: {
    color: "#e6edf3",
    fontSize: "13px",
    fontWeight: 600,
    letterSpacing: "0.5px",
    textTransform: "uppercase" as const,
    margin: 0,
  },
  content: {
    flex: 1,
    overflow: "auto",
    padding: "16px",
  },
  tabButton: {
    background: "linear-gradient(180deg, #21262d 0%, #161b22 100%)",
    border: "none",
    borderBottom: "1px solid rgba(48, 54, 61, 0.8)",
    color: "#e6edf3",
    padding: "0 16px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.5px",
    textTransform: "uppercase" as const,
  },
  emptyState: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: "#8b949e",
    textAlign: "center" as const,
    padding: "20px",
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "16px",
    opacity: 0.5,
  },
  emptyText: {
    fontSize: "14px",
    lineHeight: 1.5,
  },
  satelliteCard: {
    background: "rgba(33, 38, 45, 0.6)",
    borderRadius: "8px",
    border: "1px solid rgba(48, 54, 61, 0.8)",
    overflow: "hidden",
  },
  satelliteName: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#e6edf3",
    padding: "16px",
    borderBottom: "1px solid rgba(48, 54, 61, 0.8)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  categoryBadge: {
    fontSize: "10px",
    padding: "4px 8px",
    borderRadius: "4px",
    fontWeight: 500,
    textTransform: "uppercase" as const,
  },
  dataSection: {
    padding: "16px",
  },
  sectionTitle: {
    fontSize: "11px",
    fontWeight: 600,
    color: "#8b949e",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    marginBottom: "12px",
  },
  dataGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  dataItem: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
  },
  dataLabel: {
    fontSize: "10px",
    color: "#8b949e",
    textTransform: "uppercase" as const,
  },
  dataValue: {
    fontSize: "13px",
    color: "#e6edf3",
    fontFamily: "monospace",
  },
  closeButton: {
    marginLeft: "auto",
    background: "transparent",
    border: "none",
    color: "#8b949e",
    cursor: "pointer",
    padding: "4px 8px",
    fontSize: "16px",
    borderRadius: "4px",
    transition: "all 0.2s",
  },
};

const SubPanelRight = ({
  expanded,
  collapsed,
  onToggle,
}: SubPanelRightProps) => {
  const { selectedSatellite, setSelectedSatellite, getCategoryConfig } =
    useSatelliteContext();

  const getPanelClass = () => {
    const base = styles.panel;
    if (expanded) return `${base} ${styles.panelExpanded}`;
    if (collapsed) return `${base} ${styles.panelCollapsed}`;
    return base;
  };

  const categoryConfig = selectedSatellite
    ? getCategoryConfig(selectedSatellite.category)
    : null;

  // Helper to safely display values (API returns strings)
  const displayValue = (value: unknown, suffix: string = "") => {
    if (value === undefined || value === null || value === "") {
      return "N/A";
    }
    return `${value}${suffix}`;
  };

  const formatDate = (dateStr: string | undefined | null) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  };

  // Get TLE data with type assertion for additional fields from Space-Track
  const tle = selectedSatellite?.tle as Record<string, unknown> | undefined;

  return (
    <div className={getPanelClass()} style={panelStyles.container}>
      {/* Mobile tab button */}
      <button
        className={styles.tabButton}
        onClick={onToggle}
        style={panelStyles.tabButton}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={panelStyles.headerIcon} />
          Satellite Details
        </span>
        <span style={{ fontSize: "10px", opacity: 0.7 }}>
          {expanded ? "▼" : "▲"}
        </span>
      </button>

      {/* Desktop header */}
      <div style={panelStyles.header} className={styles.desktopOnly}>
        <span style={panelStyles.headerIcon} />
        <h2 style={panelStyles.headerTitle}>Satellite Details</h2>
      </div>

      <div style={panelStyles.content}>
        {selectedSatellite && categoryConfig && tle ? (
          <div style={panelStyles.satelliteCard}>
            {/* Satellite Name Header */}
            <div style={panelStyles.satelliteName}>
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: categoryConfig.color,
                  boxShadow: `0 0 8px ${categoryConfig.color}80`,
                }}
              />
              <span style={{ flex: 1 }}>{selectedSatellite.name}</span>
              <button
                style={panelStyles.closeButton}
                onClick={() => setSelectedSatellite(null)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#e6edf3";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#8b949e";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                ✕
              </button>
            </div>

            {/* Category Badge */}
            <div
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid rgba(48, 54, 61, 0.8)",
              }}
            >
              <span
                style={{
                  ...panelStyles.categoryBadge,
                  backgroundColor: `${categoryConfig.color}20`,
                  color: categoryConfig.color,
                  border: `1px solid ${categoryConfig.color}40`,
                }}
              >
                {categoryConfig.label}
              </span>
            </div>

            {/* Identification Data */}
            <div style={panelStyles.dataSection}>
              <div style={panelStyles.sectionTitle}>Identification</div>
              <div style={panelStyles.dataGrid}>
                <div style={panelStyles.dataItem}>
                  <span style={panelStyles.dataLabel}>NORAD ID</span>
                  <span style={panelStyles.dataValue}>
                    {displayValue(tle.NORAD_CAT_ID)}
                  </span>
                </div>
                <div style={panelStyles.dataItem}>
                  <span style={panelStyles.dataLabel}>Object ID</span>
                  <span style={panelStyles.dataValue}>
                    {displayValue(tle.OBJECT_ID)}
                  </span>
                </div>
                <div style={panelStyles.dataItem}>
                  <span style={panelStyles.dataLabel}>Country</span>
                  <span style={panelStyles.dataValue}>
                    {displayValue(tle.COUNTRY_CODE)}
                  </span>
                </div>
                <div style={panelStyles.dataItem}>
                  <span style={panelStyles.dataLabel}>Object Type</span>
                  <span style={panelStyles.dataValue}>
                    {displayValue(tle.OBJECT_TYPE)}
                  </span>
                </div>
                <div style={panelStyles.dataItem}>
                  <span style={panelStyles.dataLabel}>RCS Size</span>
                  <span style={panelStyles.dataValue}>
                    {displayValue(tle.RCS_SIZE)}
                  </span>
                </div>
                <div style={panelStyles.dataItem}>
                  <span style={panelStyles.dataLabel}>Launch Date</span>
                  <span style={panelStyles.dataValue}>
                    {displayValue(tle.LAUNCH_DATE)}
                  </span>
                </div>
              </div>
            </div>

            {/* Orbital Parameters */}
            <div
              style={{
                ...panelStyles.dataSection,
                borderTop: "1px solid rgba(48, 54, 61, 0.8)",
              }}
            >
              <div style={panelStyles.sectionTitle}>Orbital Parameters</div>
              <div style={panelStyles.dataGrid}>
                <div style={panelStyles.dataItem}>
                  <span style={panelStyles.dataLabel}>Inclination</span>
                  <span style={panelStyles.dataValue}>
                    {displayValue(tle.INCLINATION, "°")}
                  </span>
                </div>
                <div style={panelStyles.dataItem}>
                  <span style={panelStyles.dataLabel}>Eccentricity</span>
                  <span style={panelStyles.dataValue}>
                    {displayValue(tle.ECCENTRICITY)}
                  </span>
                </div>
                <div style={panelStyles.dataItem}>
                  <span style={panelStyles.dataLabel}>Apoapsis</span>
                  <span style={panelStyles.dataValue}>
                    {displayValue(tle.APOAPSIS, " km")}
                  </span>
                </div>
                <div style={panelStyles.dataItem}>
                  <span style={panelStyles.dataLabel}>Periapsis</span>
                  <span style={panelStyles.dataValue}>
                    {displayValue(tle.PERIAPSIS, " km")}
                  </span>
                </div>
                <div style={panelStyles.dataItem}>
                  <span style={panelStyles.dataLabel}>Period</span>
                  <span style={panelStyles.dataValue}>
                    {displayValue(tle.PERIOD, " min")}
                  </span>
                </div>
                <div style={panelStyles.dataItem}>
                  <span style={panelStyles.dataLabel}>Semi-Major Axis</span>
                  <span style={panelStyles.dataValue}>
                    {displayValue(tle.SEMIMAJOR_AXIS, " km")}
                  </span>
                </div>
                <div style={panelStyles.dataItem}>
                  <span style={panelStyles.dataLabel}>Mean Motion</span>
                  <span style={panelStyles.dataValue}>
                    {displayValue(tle.MEAN_MOTION, " rev/day")}
                  </span>
                </div>
                <div style={panelStyles.dataItem}>
                  <span style={panelStyles.dataLabel}>RAAN</span>
                  <span style={panelStyles.dataValue}>
                    {displayValue(tle.RA_OF_ASC_NODE, "°")}
                  </span>
                </div>
              </div>
            </div>

            {/* Epoch & Other Data */}
            <div
              style={{
                ...panelStyles.dataSection,
                borderTop: "1px solid rgba(48, 54, 61, 0.8)",
              }}
            >
              <div style={panelStyles.sectionTitle}>Epoch Data</div>
              <div style={panelStyles.dataGrid}>
                <div style={{ ...panelStyles.dataItem, gridColumn: "1 / -1" }}>
                  <span style={panelStyles.dataLabel}>Epoch</span>
                  <span style={panelStyles.dataValue}>
                    {formatDate(tle.EPOCH as string)}
                  </span>
                </div>
                <div style={panelStyles.dataItem}>
                  <span style={panelStyles.dataLabel}>Rev at Epoch</span>
                  <span style={panelStyles.dataValue}>
                    {displayValue(tle.REV_AT_EPOCH)}
                  </span>
                </div>
                <div style={panelStyles.dataItem}>
                  <span style={panelStyles.dataLabel}>BSTAR</span>
                  <span style={panelStyles.dataValue}>
                    {displayValue(tle.BSTAR)}
                  </span>
                </div>
                <div style={{ ...panelStyles.dataItem, gridColumn: "1 / -1" }}>
                  <span style={panelStyles.dataLabel}>Launch Site</span>
                  <span style={panelStyles.dataValue}>
                    {displayValue(tle.SITE)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={panelStyles.emptyState}>
            <div style={panelStyles.emptyIcon}>🛰️</div>
            <div style={panelStyles.emptyText}>
              Click a satellite to view its details
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubPanelRight;
