import React, { useEffect, useState } from "react";
import styles from "@/styles/Home.module.scss";
import clsx from "clsx";
import { fetchPopularUsers } from "@/services/account";

type Props = {};

const PopularUsers = (props: Props) => {
  const [users, setUsers] = useState<Array<any>>([]);

  const getUsers = async () => {
    const body = await fetchPopularUsers();

    if (Array.isArray(body.response)) {
      setUsers(body.response);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className={clsx(styles.popularUsers)}>
      <h4>Popular users</h4>

      <div className={clsx(styles.popularUsers__container)}>
        {users && users.length > 0 ? (
          users.map((x, i) => {
            console.log(x);

            return (
              <div
                className={clsx(styles.popularUsers__item)}
                key={`popUser${i}`}
              >
                <img width={"50px"} height={"50px"} src={x.photo} alt="" />
                <p>{x.userName}</p>
              </div>
            );
          })
        ) : (
          <div>No popular users available.</div>
        )}
      </div>
    </div>
  );
};

export default PopularUsers;
