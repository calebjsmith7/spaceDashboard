import styles from "../dashboard.module.css";

type SubPanelRightProps = {
  expanded: boolean;
  collapsed: boolean;
  onToggle: () => void;
};

const SubPanelRight = ({ expanded, collapsed, onToggle }: SubPanelRightProps) => {
  const getPanelClass = () => {
    const base = styles.panel;
    if (expanded) return `${base} ${styles.panelExpanded}`;
    if (collapsed) return `${base} ${styles.panelCollapsed}`;
    return base;
  };

  return (
    <div className={getPanelClass()}>
      <button className={styles.tabButton} onClick={onToggle}>
        <span>Panel 2</span>
        <span>{expanded ? "▼" : "▲"}</span>
      </button>
      <div className={styles.panelContent}>
        <h2 className={styles.panelHeader}>Panel 2</h2>
      </div>
    </div>
  );
};

export default SubPanelRight;
