import React from "react";
import { Interface } from "readline";
import internal from "stream";
import styles from "../styles/posts.module.scss";
import { AiFillHeart } from "react-icons/ai";
import IconButton from "@/ui/IconButton";
import { AiOutlineComment } from "react-icons/ai";
import clsx from "clsx";
import { getAuthToken } from "@/utils/cookies";
import { likePost } from "@/services/posts";

interface Props {
  post: any;
}

const Card: React.FC<Props> = ({ post }) => {
  let haveLiked: boolean = true;
  //   console.log(post);

  const like = async () => {
    const res = await likePost();

    console.log(res);
  };

  return (
    <div className={styles.card}>
      <div className={styles.card__imgContainer}>
        <img src={post.image} alt="image" />
      </div>
      <h3 className={styles.card__heading}>{post.title}</h3>
      <div className={styles.card__footer}>
        <IconButton
          icon={<AiFillHeart />}
          localClassName={clsx(styles.iconHeart, haveLiked && styles.active)}
          count={0}
          isCount={true}
          onClick={like}
        />

        <IconButton
          icon={<AiOutlineComment />}
          localClassName={clsx(styles.iconComment)}
        />
      </div>
    </div>
  );
};

export default Card;
