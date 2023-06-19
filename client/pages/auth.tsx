import React, { useEffect, useState } from "react";
import styles from "../styles/Auth.module.scss";
import clsx from "clsx";
import { setEmitFlags } from "typescript";

type Props = {};

const Auth = (props: Props) => {
  const [user, setUser] = useState<string>("");
  const [pass, setPass] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [msg, setMsg] = useState<string>("");

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // $stmt->bind_param('sss', $userData['userName'], $userData['userEmail'], $userData['userPwd']);

    let userData = {
      userName: user,
      userEmail: email,
      userPwd: pass,
    };

    try {
      const response = await fetch(
        "http://localhost/next-php-blog/server/controllers/auth.php",

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Handle the successful response
        console.log("User created:", data);
      } else {
        // Handle the error response
        console.error("Failed to create user");
      }
    } catch (error) {
      // Handle any network or other errors
      console.error("An error occurred:", error);
    }
  };

  const logIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // $stmt->bind_param('sss', $userData['userName'], $userData['userEmail'], $userData['userPwd']);

    const userData = {
      userName: user,
      userEmail: email,
      userPwd: pass,
    };

    try {
      const response = await fetch(
        "http://localhost/next-php-blog/server/controllers/loginUser.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Handle the successful response
        console.log("User created:", data);
      } else {
        // Handle the error response
        console.error("Failed to create user");
      }
    } catch (error) {
      // Handle any network or other errors
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    console.log(user, email, pass);
  }, [user, email, pass]);

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
      case "email":
        setError("");
        setEmail(e.target.value);
        if (e.target.value === "") {
          setError("Type your email");
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
            className={clsx(styles.form__input, styles.inputEmail)}
            type="email"
            name="email"
            placeholder="your email"
            onChange={(e) => {
              handleInputChange(e, "email");
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
