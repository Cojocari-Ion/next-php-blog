import React, { useState, useEffect } from "react";
import IconButton from "@/ui/IconButton";
import { AiFillHeart, AiOutlineComment } from "react-icons/ai";
import styles from "@/styles/postElement.module.scss";
import clsx from "clsx";
import { likePost } from "@/services/posts";
import useAuth from "@/hooks/auth";
import Button from "@/ui/Button";

interface Props {
  post: any;
  showComment?(): void;
}

const CardFooter: React.FC<Props> = ({ post, showComment }) => {
  const [haveLiked, setHaveLiked] = useState<boolean>(false);
  const [postLikesArr, setPostLikesArr] = useState<Array<any>>([]);
  const [postLikesNum, setPostLikesNum] = useState<number>(
    post?.likes?.length | 0
  );
  const [postCommentsNum, setPostCommentsNum] = useState<number>(
    post?.comments?.length | 0
  );

  const [comentContent, setComentContent] = useState<string>("");
  // console.log("post", post.likes.length);
  const auth = useAuth();

  const like = async () => {
    if (!auth.isLoggedIn()) {
      alert("unauthorized");
      return;
    }

    const res = await likePost(auth.getUser().userId.toString(), post.id);

    let currentLikes = postLikesArr;
    let liked: boolean = postLikesArr.includes(
      auth.getUser().userId.toString()
    );

    if (liked) {
      currentLikes = currentLikes.filter((like) => {
        like === auth.getUser().userId.toString();
      });
      setPostLikesArr(currentLikes);
      setHaveLiked(false);
      setPostLikesNum((likes: number) => likes - 1);
    } else if (!liked) {
      currentLikes.push(auth.getUser().userId.toString());
      setHaveLiked(true);
      setPostLikesNum((likes: number) => likes + 1);
    }
  };

  // console.log(post);

  useEffect(() => {
    if (post.likes && auth.isLoggedIn()) {
      if (post.likes.includes(auth.getUser().userId.toString())) {
        setHaveLiked(true);
        setPostLikesArr(post.likes);
        // console.log(post.likes);
      }
    }

    if (post.likes?.length) {
      setPostLikesNum(post.likes.length);

      // console.log(post);
    }

    if (post.comments?.length) {
      setPostCommentsNum(post.comments.length);
    }
  }, [post]);

  return (
    <div className={styles.footerButtons}>
      <IconButton
        icon={<AiFillHeart />}
        localClassName={clsx(styles.iconHeart, haveLiked && styles.active)}
        count={postLikesNum}
        isCount={true}
        onClick={like}
      />

      <IconButton
        icon={<AiOutlineComment />}
        localClassName={clsx(styles.iconComment)}
        isCount={true}
        count={postCommentsNum}
        onClick={() => {
          if (typeof showComment === "function") {
            showComment();
          }
        }}
      />
    </div>
  );
};

export default CardFooter;
