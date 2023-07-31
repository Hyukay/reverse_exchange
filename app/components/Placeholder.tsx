import React from "react";
import styles from "../styles/Placeholder.module.css";

type Props = {
  width?: string;
  height?: string;
};

export default function Placeholder({ height, width }: Props) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: "inherit",
      }}
      className={styles.placeholder}
    />
  );
}