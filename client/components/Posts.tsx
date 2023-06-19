import React, { useState, useEffect } from "react";
import styles from "../styles/posts.module.scss";
import Card from "./Card";

type Props = {};

const Posts = (props: Props) => {
  const [posts, setPosts] = useState<Array<any>>([]);
  const [pages, setPages] = useState<Array<number>>([]);

  useEffect(() => {
    const getPosts = async (limit?: number, offset?: number) => {
      const res = await fetch(
        `http://localhost/next-php-blog/server/controllers/getPosts.php?limit=10&offset=20`,
        {
          method: "GET",
        }
      );

      const body = await res.json();
      // console.log(body.posts);

      let numbers = [];

      if (body.count) {
        for (let i = 0; i <= body.count; i++) {
          if (i % 10 === 0) {
            numbers.push(i);
          }
        }
        setPages(numbers);
      }

      setPosts(body.posts);
    };

    getPosts();
  }, []);

  return (
    <>
      <div className={styles.posts}>
        <h1 className={styles.posts__heading}>Our Posts</h1>

        <div className={styles.posts__grid}>
          <div className={styles.right}>
            {posts?.map((x, i) => {
              return <Card post={x} />;
            })}
          </div>
          <div className={styles.left}></div>
        </div>

        <div className={styles.posts__pagination}>
          {pages?.map((page, i) => {
            return (
              //   <div className={styles.page}>
              <button className={styles.pageButton}>{i + 1}</button>
              //   </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Posts;
