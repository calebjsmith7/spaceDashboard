import styles from "../dashboard.module.css";
import SatelliteControls from "./satellites/SatelliteControls";

type SubPanelLeftProps = {
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
    backgroundColor: "#58a6ff",
    boxShadow: "0 0 8px rgba(88, 166, 255, 0.6)",
  },
  headerTitle: {
    color: "#e6edf3",
    fontSize: "13px",
    fontWeight: 600,
    letterSpacing: "0.5px",
    textTransform: "uppercase" as const,
    margin: 0,
  },
  statusIndicator: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "10px",
    color: "#3fb950",
  },
  statusDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#3fb950",
    animation: "pulse 2s infinite",
  },
  content: {
    flex: 1,
    overflow: "auto",
    padding: "8px",
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
};

const SubPanelLeft = ({ expanded, collapsed, onToggle }: SubPanelLeftProps) => {
  const getPanelClass = () => {
    const base = `${styles.panel} ${styles.panelLeft}`;
    if (expanded) return `${base} ${styles.panelExpanded}`;
    if (collapsed) return `${base} ${styles.panelCollapsed}`;
    return base;
  };

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
          Control Panel
        </span>
        <span style={{ fontSize: "10px", opacity: 0.7 }}>
          {expanded ? "▼" : "▲"}
        </span>
      </button>

      {/* Desktop header */}
      <div style={panelStyles.header} className={styles.desktopOnly}>
        <span style={panelStyles.headerIcon} />
        <h2 style={panelStyles.headerTitle}>Control Panel</h2>
        <div style={panelStyles.statusIndicator}>
          <span style={panelStyles.statusDot} />
          <span>ONLINE</span>
        </div>
      </div>

      <div style={panelStyles.content}>
        <SatelliteControls />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default SubPanelLeft;
