import React, { useState, useEffect } from "react";
import styles from "../styles/posts.module.scss";
import { useRouter } from "next/router";
import CardFooter from "./CardFooter";
import clsx from "clsx";
import { useSelector, useDispatch } from "react-redux";
import { setCommentText } from "@/store/common/actions";
import Button from "@/ui/Button";
import useAuth from "@/hooks/auth";
import { commentPost, fetchPost } from "@/services/posts";

interface Props {
  post: any;
}

const Card: React.FC<Props> = ({ post }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useAuth();

  const [showComment, setShowComment] = useState<boolean>(false);
  const [localPost, setLocalPost] = useState<any>(post);
  const postId = localPost.id;

  const comentContent = useSelector((state: any) => state.common.commentText);

  const showCommentToggle = () => {
    if (!auth.isLoggedIn()) {
      alert("You have to log in to comment");
      return;
    }

    setShowComment(!showComment);
  };

  const getPost = async () => {
    const res = await fetchPost(postId);
    console.log(res);
    setLocalPost(res.response.post);
  };

  const postComent = async () => {
    if (!auth.isLoggedIn()) {
      alert("Unauthorized");
      return;
    }

    try {
      const userId = auth.getUser().userId;
      const res = await commentPost(userId, localPost.id, comentContent);
      dispatch(setCommentText(""));
      getPost();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.card}>
      <div
        onClick={() => {
          router.push("/" + postId);
        }}
        className={styles.card__imgContainer}
      >
        <img src={localPost.image} alt="image" />
      </div>

      <div className={styles.card__details}>
        <h3 className={styles.card__heading}>{localPost.title}</h3>
        <span>#{localPost.topic}</span>
      </div>

      <CardFooter
        showComment={() => {
          showCommentToggle();
        }}
        post={localPost}
      />

      {/* FOOTER POST COMENT START FOOTER POST COMENT START */}

      {showComment ? (
        <div
          // style={{ border: "1px solid #000" }}
          className={styles.footerPostComment}
        >
          <div className={styles.footerPostComment__postComment}>
            <form
              onSubmit={(e: React.FormEvent) => {
                e.preventDefault();
                postComent();
              }}
              className={clsx(styles.commentForm)}
              action="addComment"
            >
              <label htmlFor="comment">Comment</label>

              <textarea
                value={comentContent}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  dispatch(setCommentText(e.target.value));
                }}
                name="comment"
              ></textarea>

              <div className={styles.btnContainer}>
                <Button
                  type={"submit"}
                  // onClick={postComent}
                  className={styles.postButton}
                  text={"post"}
                />
              </div>
            </form>
          </div>

          <div className={styles.footerPostComment__comments}></div>
        </div>
      ) : null}

      {/* FOOTER POST COMENT END FOOTER POST COMENT END */}
    </div>
  );
};

export default Card;
