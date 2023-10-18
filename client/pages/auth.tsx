import React, { useEffect, useState } from "react";
import styles from "../styles/Auth.module.scss";
import clsx from "clsx";
import { signUpService, logInService } from "../services/account";
import { getAuthToken, setAuthToken } from "@/utils/cookies";
import useAuth from "@/hooks/auth";
import { useDispatch, useSelector } from "react-redux";
import UserInterface from "@/interfaces/user";
import * as storageConfig from "@/utils/firebaseConfig";
import { userIsUpdating, updateUserData } from "@/store/account/actions";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { useRouter } from "next/router";
import UserImg from "@/ui/UserImg";
import IconButton from "@/ui/IconButton";
import { BsTrash3Fill } from "react-icons/bs";

type Props = {};

const Auth = (props: Props) => {
  const [user, setUser] = useState<string>("");
  const [pass, setPass] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [authStatus, setAuthStatus] = useState<any>({
    success: false,
    message: "",
  });
  const router = useRouter();
  const [action, setAction] = useState<"register" | "login">("register");
  const [userImage, setImage] = useState<File | null>(null);
  const [imagePath, setImagePath] = useState<string>("");

  const dispatch = useDispatch();

  const loggedUser: UserInterface = useSelector(
    (state: any) => state.account.user
  );

  const auth = useAuth();

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user.length || !email.length || !pass.length) {
      setAuthStatus({
        success: false,
        message: "Fill all needed inputs",
      });

      return;
    }

    const registration = await signUpService(user, email, pass, imagePath);

    if (registration.error && registration.message) {
      setAuthStatus({
        success: false,
        message: "Something went wrong",
      });
      // setAuthStatus(registration.message);
    }

    if (registration.response) {
      setAuthToken(registration.response.token);

      setTimeout(() => {
        let token = getAuthToken();

        if (!token.length) {
          setAuthStatus({
            success: true,
            message: "Success. Redirecting...",
          });
        } else {
          auth.updateProfile();
        }
      }, 500);
    }
  };

  const logIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(userIsUpdating(true));

    const data = await logInService(email, pass);

    console.log(data);

    if (data.error) {
      dispatch(userIsUpdating(false));
      setAuthStatus({
        success: false,
        message: "Invalid credentials",
      });

      console.error(data.message);
    }

    if (!data.error && data.response) {
      setAuthToken(data.response.token);
      dispatch(updateUserData(data.response));
      dispatch(userIsUpdating(false));

      setAuthStatus({
        success: true,
        message: "Success.Redirecting...",
      });

      setTimeout(() => {
        router.push("/");
      }, 1000);
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
    if (auth.isLoggedIn()) {
      router.push("/");
    }
  }, [auth.isLoggedIn()]);

  const changeActionHandle = (arg: "register" | "login") => {
    setAction(arg);
  };

  const getImageUrl = async () => {
    if (!userImage) return;
    const imageRef = ref(storageConfig.storage, `images/${userImage.name}`);

    uploadBytes(imageRef, userImage).then(async (res) => {
      // console.log(res.metadata.fullPath);
      const imageRef = ref(storageConfig.storage, res.metadata.fullPath);
      const url = await getDownloadURL(imageRef);
      setImagePath(url);
      // console.log(url);
    });
  };

  const deleteImage = async (imageUrl: string) => {
    try {
      const imageRef = ref(storageConfig.storage, imageUrl);
      await deleteObject(imageRef);
      setImagePath("");
      setImage(null);
    } catch (error) {
      // Handle error if necessary
      console.error(error);
    }
  };

  const handleDeleteImage = () => {
    if (imagePath) {
      deleteImage(imagePath);
    }
  };

  useEffect(() => {
    getImageUrl();
  }, [userImage]);

  useEffect(() => {
    return () => {
      handleDeleteImage();
    };
  }, []);

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
            <label htmlFor="password">Password</label>
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

          {action === "register" && (
            <div
              className={clsx(styles.form__inputContainer, styles.fileInput)}
            >
              <label htmlFor="email">Image:</label>

              <div className={clsx(styles.imageContainer)}>
                <UserImg
                  imgSrc={imagePath.length > 0 ? imagePath : ""}
                  className={styles.imgPlaceholder}
                />

                {imagePath.length === 0 ? (
                  <div className={styles.tapToUpload}>click to upload</div>
                ) : null}

                <input
                  autoComplete="off"
                  className={clsx(styles.form__input, styles.inputImg)}
                  type="file"
                  name="image"
                  value={
                    userImage !== null && userImage.hasOwnProperty("name")
                      ? userImage.name
                      : ""
                  }
                  placeholder="your password"
                  onChange={(e) => {
                    if (e.target.files?.length) {
                      setImage(e.target.files[0]);
                    }
                  }}
                />

                {imagePath.length > 0 ? (
                  <div className={styles.controllers}>
                    <div onClick={handleDeleteImage}>
                      <IconButton type={"button"} icon={<BsTrash3Fill />} />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {authStatus.message.length ? (
            <span
              className={clsx(
                styles.form__statusMsg,
                authStatus.success ? styles.successTrue : styles.successFalse
              )}
            >
              {authStatus.message}
            </span>
          ) : null}

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
