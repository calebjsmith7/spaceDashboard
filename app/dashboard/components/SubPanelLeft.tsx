import styles from "../dashboard.module.css";

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
        <span>Panel 1</span>
        <span>{expanded ? "▼" : "▲"}</span>
      </button>
      <div className={styles.panelContent}>
        <h2 className={styles.panelHeader}>Panel 1</h2>
      </div>
    </div>
  );
};

export default SubPanelLeft;
