import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/postPage.module.scss";
import clsx from "clsx";
import { commentPost, fetchPost } from "@/services/posts";
import { CircularProgress } from "@mui/material";
import CardFooter from "@/components/CardFooter";
import Button from "@/ui/Button";
import Divider from "@/ui/Divider";
import useAuth from "@/hooks/auth";
import Comment from "@/components/Comment";
import { useSelector, useDispatch } from "react-redux";
import { setCommentText } from "@/store/common/actions";

interface Props {}

const Post: React.FC<Props> = ({}) => {
  const router = useRouter();
  const auth = useAuth();
  let postId = router.query.post;
  const dispatch = useDispatch();

  const [localPost, setLocalPost] = useState<any>({});
  const comentContent = useSelector((state: any) => state.common.commentText);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  // console.log(comentContent);

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

      getPost();
    } catch (e) {
      console.error(e);
    }
  };

  const setCommentFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (router.query.post) {
      getPost();
    }
  }, [router.query]);

  return (
    <div className={clsx(styles.postPage)}>
      <div className={clsx(styles.postPage__grid)}>

        <div className={clsx(styles.postPage__container)}>
          {localPost ? (
            <>
              <div className={clsx(styles.postPage__head)}>
                <div className={clsx(styles.postPage__postinfo)}>
                  <div className={clsx(styles.image)}>
                    <img
                      src={localPost.image}
                      alt={"post image"}
                      width={222}
                      height={284}
                    />
                  </div>

                  <div className={clsx(styles.info)}>
                    <div className={clsx(styles.info__top)}>
                      <h3 className={clsx(styles.info__title)}>
                        {localPost.title}
                      </h3>
                      <p className={clsx(styles.info__content)}>
                        {localPost.content}
                      </p>
                    </div>

                    <div className={clsx(styles.info__bottom)}></div>
                    <CardFooter
                      showComment={setCommentFocus}
                      post={localPost}
                    />
                  </div>
                </div>
              </div>

              <Divider />

              <div className={clsx(styles.postPage__commentSection)}>
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
                    // value={comentContent}
                    ref={inputRef}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      dispatch(setCommentText(e.target.value));
                    }}
                    name="comment"
                  ></textarea>
                  <Button
                    onClick={postComent}
                    className={styles.postButton}
                    text={"post"}
                  />
                </form>
              </div>

              <Divider />

              {localPost?.comments ? (
                <div className={styles.comentsList}>
                  {localPost.comments.map((x: any, i: number) => {
                    return (
                      <>
                        <Comment key={"comment" + i} comment={x} />
                      </>
                    );
                  })}
                </div>
              ) : (
                <span>there are no coments</span>
              )}
            </>
          ) : (
            <CircularProgress />
          )}
        </div>

        <div className={clsx(styles.postPage__sidebar)}>
          
        </div>

      </div>
    </div>
  );
};

export default Post;
