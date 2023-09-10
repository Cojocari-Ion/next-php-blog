import React from "react";
import clsx from "clsx";

interface Props {
  icon: any;
  localClassName?: string;
  count?: number;
  isCount?: boolean;
  onClick?(): void;
  type?: "button" | "submit" | "reset" | undefined;
}

const IconButton: React.FC<Props> = ({
  icon,
  localClassName,
  isCount,
  count,
  onClick,
  type,
}) => {
  return (
    <div
      onClick={onClick}
      className={clsx("iconButton", localClassName, isCount && "count")}
    >
      <button type={type}>{icon}</button>
      {isCount && <div className="count">{count}</div>}
    </div>
  );
};

export default IconButton;
