'use client'
import React, { useState } from "react";
import styles from "../styles/Profile.module.css";

interface TabProps {
  labels: string[];
  children: React.ReactNode[];
}

const Tabs: React.FC<TabProps> = ({ labels, children }) => {
    
  const [activeTab, setActiveTab] = useState<string>(labels[0]);

  return (
    <div>
      <div className={styles.tabs}>
        {labels.map(label => (
          <h3
            key={label}
            className={`${styles.tab} ${activeTab === label ? styles.activeTab : ""}`}
            onClick={() => setActiveTab(label)}
          >
            {label}
          </h3>
        ))}
      </div>

      {children.map((child, index) => (
        <div
          key={labels[index]}
          className={`${activeTab === labels[index] ? styles.activeTabContent : styles.tabContent}`}
          style={{ flexDirection: "column" }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default Tabs;
