import styles from "../dashboard.module.css";
import SatelliteControls from "./satellites/SatelliteControls";

type SubPanelLeftProps = {
  expanded: boolean;
  collapsed: boolean;
  onToggle: () => void;
};

const SubPanelLeft = ({ expanded, collapsed, onToggle }: SubPanelLeftProps) => {
  const getPanelClass = () => {
    const base = `${styles.panel} ${styles.panelLeft}`;
    if (expanded) return `${base} ${styles.panelExpanded}`;
    if (collapsed) return `${base} ${styles.panelCollapsed}`;
    return base;
  };

  return (
    <div className={getPanelClass()}>
      <button className={styles.tabButton} onClick={onToggle}>
        <span>Satellite Controls</span>
        <span>{expanded ? "▼" : "▲"}</span>
      </button>
      <div className={styles.panelContent}>
        <SatelliteControls />
      </div>
    </div>
  );
};

export default SubPanelLeft;
