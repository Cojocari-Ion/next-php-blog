import React, { useState, useEffect } from "react";
import styles from "../styles/nav.module.scss";
import Link from "next/link";
import TextField from "@mui/material/TextField";
import { BiSearch } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "@/hooks/auth";

type Props = {};

const Navbar = (props: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const auth = useAuth();

  console.log(auth.isLoggedIn());

  const fetchSearchResult = async () => {
    const res = await fetch(
      `http://localhost/next-php-blog/server/searchResult?keyword=vero`,
      {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );

    const response = await res.json();

    return await response;
  };

  useEffect(() => {
    auth.updateProfile();
  }, []);

  return (
    <div className={styles.nav}>
      <div className={styles.menu}>
        <div className={styles.menu__link}>
          <Link href={"/"}>Home</Link>
        </div>
        <div className={styles.menu__link}>
          <Link href={"/contact"}>Contact</Link>
        </div>
        {!auth.isLoggedIn() && (
          <div className={styles.menu__link}>
            <Link href={"/auth"}>Auth</Link>
          </div>
        )}

        {auth.isLoggedIn() && (
          <div className={styles.menu__link}>
            <button
              onClick={() => {
                auth.logOut();
              }}
            >
              Log Out
            </button>
          </div>
        )}
      </div>

      <div className={styles.searchContainer}>
        <input type="Search post" />
        <div
          onClick={() => fetchSearchResult()}
          className={styles.searchContainer__svgContainer}
        >
          <BiSearch />
        </div>
      </div>

      <div hidden className={styles.resultsContainer}></div>
    </div>
  );
};

export default Navbar;
