import React from "react";
import styles from "@/styles/uiComponents.module.scss";
import clsx from "clsx";
import { BiUser } from "react-icons/bi";

interface Props {
  className?: string;
  imgSrc: string;
}

const UserImg: React.FC<Props> = ({ className, imgSrc }) => {
  let isImg: boolean = imgSrc.length > 0;

  return (
    <div className={clsx(styles.userImg, className)}>
      {isImg ? (
        <div className={styles.imageContainer}>
          <img src={imgSrc} alt={"image"} />
        </div>
      ) : (
        <div className={clsx(styles.imageContainer, styles.imgEmpty)}>
          <div className={clsx(styles.iconContainer)}>
            <BiUser />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserImg;
