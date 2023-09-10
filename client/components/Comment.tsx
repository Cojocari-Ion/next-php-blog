import React, { useEffect, useState } from "react";
import styles from "@/styles/Comment.module.scss";
import moment from "moment";
import { fetchPublicUser } from "@/services/account";

interface Props {
  comment: any;
}

const Comment: React.FC<Props> = ({ comment }) => {
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetchPublicUser(comment.userId);

        if (res?.response) {
          setUser(res?.response);
        }
      } catch (e) {
        console.error(e);
      }
    };

    if (comment.userId) {
      fetchUser();
    }
  }, [comment]);

  return (
    <div className={styles.main}>
      <div className={styles.main__header}>
        <div className={styles.user}>
          <img src="" alt="" />
          <span>User Name</span>
        </div>

        <span className={styles.createdAt}>
          {moment(comment.ts).format("YYYY-MMM-DD HH:mm:ss")}
        </span>
      </div>

      <div className={styles.main__content}>{comment.content}</div>
    </div>
  );
};

export default Comment;
