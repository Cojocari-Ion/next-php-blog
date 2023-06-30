import React, { use, useEffect, useState } from "react";
import styles from "../styles/Auth.module.scss";
import clsx from "clsx";
import { setEmitFlags } from "typescript";
import { signUpService, fetchProfile } from "../services/account";
import { getAuthToken, setAuthToken } from "@/utils/cookies";
import useAuth from "@/hooks/auth";
import { useDispatch, useSelector } from "react-redux";
import UserInterface from "@/interfaces/user";
import { updateUserData } from "@/store/account/actions";
import { useRouter } from "next/router";

type Props = {};

const Auth = (props: Props) => {
  const [user, setUser] = useState<string>("");
  const [pass, setPass] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [msg, setMsg] = useState<string>("");
  const router = useRouter();
  const [action, setAction] = useState<"register" | "login">("register");

  const dispatch = useDispatch();

  const loggedUser: UserInterface = useSelector(
    (state: any) => state.account.user
  );

  const auth = useAuth();

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const registration = await signUpService(user, email, pass);

    if (registration.error && registration.message) {
      setError("");
      setMsg(registration.message);
    }

    console.log(registration.response);

    if (registration.response) {
      setAuthToken(registration.response.token);

      setTimeout(() => {
        let token = getAuthToken();

        if (!token.length) {
          setMsg("Can not upload your profile");
        } else {
          console.log("hello");
          auth.updateProfile();
        }
      }, 500);
    }
  };

  const logIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.length && pass.length) {
      auth.logIn(email, pass);
      setMsg("Success! Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } else {
      console.error("fill inputs accordingly");
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

  useEffect(() => {
    if (auth.isLoggedIn() || auth.isUpdating()) {
      // router.push("/");
    }
  }, [auth.isLoggedIn(), auth.isUpdating()]);

  const changeActionHandle = (arg: "register" | "login") => {
    setAction(arg);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.actionHandle}>
          <button
            onClick={() => {
              changeActionHandle("login");
            }}
            className={clsx(action === "login" && styles.active)}
          >
            login
          </button>

          <button
            onClick={() => {
              changeActionHandle("register");
            }}
            className={clsx(action === "register" && styles.active)}
          >
            register
          </button>
        </div>

        <form
          className={styles.form}
          onSubmit={(e) => {
            if (action === "register") {
              submitForm(e);
            } else if (action === "login") {
              logIn(e);
            }
          }}
          action="auth"
        >
          {action === "register" && (
            <div className={styles.form__inputContainer}>
              <label htmlFor="user">Username</label>
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
            </div>
          )}

          <div className={styles.form__inputContainer}>
            <label htmlFor="email">Email</label>
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
          </div>

          <div className={styles.form__inputContainer}>
            <label htmlFor="email">Password</label>
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
          </div>

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
