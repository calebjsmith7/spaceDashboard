"use client"

import { useState } from "react";
import styles from "./dashboard.module.css";
import MainPanel from "./components/MainPanel";
import SubPanelLeft from "./components/SubPanelLeft";
import SubPanelRight from "./components/SubPanelRight";

const Dashboard = () => {
  const [expandedPanel, setExpandedPanel] = useState<"left" | "right" | null>(null);

  const togglePanel = (panel: "left" | "right") => {
    setExpandedPanel(expandedPanel === panel ? null : panel);
  };

  return (
    <div className={styles.container}>
      <MainPanel />

      <div className={styles.bottomContainer}>
        <SubPanelLeft
          expanded={expandedPanel === "left"}
          collapsed={expandedPanel === "right"}
          onToggle={() => togglePanel("left")}
        />
        <SubPanelRight
          expanded={expandedPanel === "right"}
          collapsed={expandedPanel === "left"}
          onToggle={() => togglePanel("right")}
        />
      </div>
    </div>
  );
};

export default Dashboard;