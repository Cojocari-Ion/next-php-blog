import React from "react";
import clsx from "clsx";
import styles from "../styles/uiComponents.module.scss";

interface Props {}

const Divider: React.FC<Props> = ({}) => {
  return <div className={styles.divider}></div>;
};

export default Divider;
