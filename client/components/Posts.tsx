import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useRef,
} from "react";
import styles from "../styles/posts.module.scss";
import Card from "./Card";
import { AiOutlinePlus } from "react-icons/ai";
import useAuth from "@/hooks/auth";
import PostInterface from "@/interfaces/postInterface";
import { addPost } from "@/services/posts";
import firebase from "firebase/compat/app";
import * as storageConfig from "@/utils/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

type Props = {};

const Posts = (props: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [posts, setPosts] = useState<Array<any>>([]);
  const [pages, setPages] = useState<Array<number>>([]);
  const [postFormActive, setPostFormActive] = useState<boolean>(false);
  const [postImage, setImage] = useState<File | null>(null);
  const [imagePath, setImagePath] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [postInputs, setPostInputs] = useState<any>({
    title: "",
    content: "",
  });
  const [error, setError] = useState<any>({
    err: false,
    message: "",
  });

  const auth = useAuth();

  // SET INPUTS START SET INPUTS START SET INPUTS START

  const setInputs = (
    e: React.ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    console.log(postInputs);

    switch (e.target.name) {
      case "title":
        setPostInputs({ ...postInputs, title: e.target.value });
        break;

      case "content":
        setPostInputs({ ...postInputs, content: e.target.value });
        break;
    }
  };

  // SET INPUTS END SET INPUTS END SET INPUTS END

  const getPosts = async (limit?: number, offset?: number) => {
    const res = await fetch(
      `http://localhost/next-php-blog/server/controllers/getPosts.php?limit=10&offset=0`,
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

  const getImageUrl = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!postInputs.title.length || !postInputs.content.length) {
      setError({ err: true, message: "You haven't completed all fields" });
      setLoading(false);
      return;
    }
    // console.log("aee");

    if (!postImage) return;

    const imageRef = ref(storageConfig.storage, `images/${postImage.name}`);

    uploadBytes(imageRef, postImage).then(async (res) => {
      // console.log(res.metadata.fullPath);
      const imageRef = ref(storageConfig.storage, res.metadata.fullPath);
      const url = await getDownloadURL(imageRef);
      setImagePath(url);
      console.log(url);
    });
  };

  const insertPost = async (imagePath: string) => {
    const response = await addPost(
      postInputs.title,
      postInputs.content,
      imagePath,
      auth.getUser().userId
    );

    if (!response.error) {
      setError({
        err: response.error,
        message: response.message,
      });

      setPostInputs({
        title: "",
        content: "",
      });
      setImage(null);
    }

    console.log(response);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setImage(null);
    setImagePath("");
    setLoading(false);
    getPosts();
  };

  useEffect(() => {
    if (imagePath !== "") {
      insertPost(imagePath);
    }
  }, [imagePath]);

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      <div className={styles.posts}>
        <h1 className={styles.posts__heading}>See what's new</h1>

        {/* ADD POSTS START ADD POSTS START ADD POSTS START ADD POSTS START  */}

        {auth.isLoggedIn() && (
          <>
            <button
              onClick={() => {
                setPostFormActive(!postFormActive);
              }}
              className={styles.posts__addButton}
            >
              <AiOutlinePlus />
            </button>

            {postFormActive && (
              <div className={styles.posts__addContainer}>
                <form
                  onSubmit={(e) => {
                    getImageUrl(e);
                  }}
                  action="add post"
                >
                  <label htmlFor="title">Title</label>
                  <input
                    onChange={(e) => {
                      setInputs(e);
                    }}
                    type="text"
                    name="title"
                    value={postInputs.title}
                  />

                  <label htmlFor="photo">Photo</label>
                  <input
                    onChange={(e) => {
                      if (e.target.files?.length) {
                        setImage(e.target.files[0]);
                      }
                    }}
                    ref={fileInputRef}
                    type="file"
                    name="image"
                    accept="image/*"
                  />

                  <label htmlFor="content">Photo</label>
                  <textarea
                    onChange={(e) => {
                      setInputs(e);
                    }}
                    name="content"
                    value={postInputs.content}
                  ></textarea>

                  <button
                    style={{ color: `${loading ? "gray" : "black"}` }}
                    disabled={loading}
                    type="submit"
                  >
                    {loading ? "laoding..." : "Add post"}
                  </button>
                </form>

                {error.message !== "" && (
                  <span style={{ color: `${error.err ? "red" : "green"}` }}>
                    {error.message}
                  </span>
                )}
              </div>
            )}
          </>
        )}

        {/* ADD POSTS END ADD POSTS END ADD POSTS END ADD POSTS END  */}

        <div className={styles.posts__grid}>
          <div className={styles.right}>
            {posts?.map((x, i) => {
              return <Card key={"post" + i} post={x} />;
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
