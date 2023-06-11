import React, { useState } from "react";
import styles from "../styles/nav.module.scss";
import Link from "next/link";
import TextField from "@mui/material/TextField";
import { BiSearch } from "react-icons/bi";

type Props = {};

const Navbar = (props: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

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
    console.log(response);

    return await response;
  };

  return (
    <div className={styles.nav}>
      <div className={styles.menu}>
        <div className={styles.menu__link}>
          <Link href={"/"}>Home</Link>
        </div>
        <div className={styles.menu__link}>
          <Link href={"/contact"}>Contact</Link>
        </div>
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
