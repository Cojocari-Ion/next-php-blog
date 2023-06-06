import React from "react";
import { Interface } from "readline";
import internal from "stream";
import styles from "../styles/posts.module.scss";

interface Props {
  post: any;
}

const Card: React.FC<Props> = ({ post }) => {
  //   console.log(post);
  return (
    <div className={styles.card}>
      <div className={styles.card__imgContainer}>
        <img src={post.image} alt="image" />
      </div>
      <h3 className={styles.card__heading}>{post.title}</h3>
    </div>
  );
};

export default Card;
