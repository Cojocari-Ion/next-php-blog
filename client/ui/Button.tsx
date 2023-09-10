import React from "react";
import clsx from "clsx";
import styles from "../styles/uiComponents.module.scss";

interface Props {
  icon?: any;
  className?: string;
  text: string;
  onClick?(): void;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<Props> = ({ text, icon, className, onClick, type }) => {
  return (
    <button
      type={type === undefined ? "button" : type}
      onClick={onClick}
      className={clsx(styles.button, className)}
    >
      {text}
    </button>
  );
};

export default Button;
