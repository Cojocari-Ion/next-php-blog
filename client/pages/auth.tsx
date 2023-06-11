import React, { useState } from "react";
import styles from "../styles/Auth.module.scss";
import clsx from "clsx";
import { setEmitFlags } from "typescript";

type Props = {};

const Auth = (props: Props) => {
  const [user, setUser] = useState<string>("");
  const [pass, setPass] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [msg, setMsg] = useState<string>("");

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user !== "" && pass !== "") {
      var url = "http://localhost/next-php-blog/login";
      var headers = {
        Accept: "application/json",
        "Content-type": "application/json",
      };
      var Data = {
        user: user,
        pass: pass,
      };

      fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(Data),
      })
        .then((response) => response.json())
        .then((response) => {
          setMsg(response[0].result);
        })
        .catch((err) => {
          setError(err);
          console.log(err);
        });
    } else {
      setError("All fields are required");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    switch (type) {
      case "user":
        setError("");
        setUser(e.target.value);
        if (e.target.value === "") {
          setError("Type your username");
        }
        break;
      case "pass":
        setError("");
        setPass(e.target.value);
        if (e.target.value === "") {
          setError("Type your password");
        }
        break;
      default:
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <form
          className={styles.form}
          onSubmit={(e) => {
            submitForm(e);
          }}
          action="auth"
        >
          <input
            autoComplete="off"
            className={clsx(styles.form__input, styles.inputEmail)}
            type="text"
            name="user"
            placeholder="your username"
            onChange={(e) => {
              handleInputChange(e, "user");
            }}
          />
          <input
            autoComplete="off"
            className={clsx(styles.form__input, styles.inputPass)}
            type="password"
            name="password"
            placeholder="your password"
            onChange={(e) => {
              handleInputChange(e, "pass");
            }}
          />

          <button
            type="submit"
            className={clsx(styles.form__button, styles.inputEmail)}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
