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
import { addPost } from "@/services/posts";
import * as storageConfig from "@/utils/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import DualPagination from "./DualPagination";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import topics from "@/public/json/post_topics.json";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

interface paramsProps {
  date: number;
  topic: string;
  offset: number;
  limit: number;
}

type Props = {};

const Posts = (props: Props) => {
  const auth = useAuth();
  const allTopics = topics.topics;

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
    topic: "",
  });

  const [error, setError] = useState<any>({
    err: false,
    message: "",
  });

  const defaultProps: paramsProps = {
    date: dayjs().subtract(1, "month").unix(),
    topic: allTopics[0].label,
    offset: 0,
    limit: 10,
  };

  // SET INPUTS START SET INPUTS START SET INPUTS START

  const setInputs = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLTextAreaElement>
      | ChangeEvent<HTMLSelectElement>
  ) => {
    switch (e.target.name) {
      case "title":
        setPostInputs({ ...postInputs, title: e.target.value });
        break;

      case "content":
        setPostInputs({ ...postInputs, content: e.target.value });
        break;

      case "topic":
        setPostInputs({ ...postInputs, topic: e.target.value });
        break;
    }
  };

  // SET INPUTS END SET INPUTS END SET INPUTS END

  const getImageUrl = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!postInputs.title.length || !postInputs.content.length) {
      setError({ err: true, message: "You haven't completed all fields" });
      setLoading(false);
      return;
    }

    if (!postImage) return;

    const imageRef = ref(storageConfig.storage, `images/${postImage.name}`);

    uploadBytes(imageRef, postImage).then(async (res) => {
      const imageRef = ref(storageConfig.storage, res.metadata.fullPath);
      const url = await getDownloadURL(imageRef);
      setImagePath(url);
    });
  };

  const insertPost = async (imagePath: string) => {
    const response = await addPost(
      postInputs.title,
      postInputs.content,
      imagePath,
      postInputs.topic,
      auth.getUser().userId,
      dayjs().unix()
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

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setImage(null);
    setImagePath("");
    setLoading(false);
  };

  useEffect(() => {
    if (imagePath !== "") {
      insertPost(imagePath);
    }
  }, [imagePath]);

  return (
    <>
      <DualPagination
        defaultProps={defaultProps}
        setRows={(data: Array<any>) => {
          setPosts(data);
        }}
      >
        {({ filterHandle }) => {
          return (
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

                        <label htmlFor="title">Topic</label>

                        <select
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                            setInputs(e);
                          }}
                          name="topic"
                          id=""
                        >
                          {allTopics?.map((x, i) => {
                            return (
                              <option key={"topic" + x.id} value={x.label}>
                                {x.value}
                              </option>
                            );
                          })}

                          <option value=""></option>
                        </select>

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
                          style={{ resize: "none" }}
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
                        <span
                          style={{ color: `${error.err ? "red" : "green"}` }}
                        >
                          {error.message}
                        </span>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* ADD POSTS END ADD POSTS END ADD POSTS END ADD POSTS END  */}
              <div className={styles.posts__filters}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label"></InputLabel>
                  <NativeSelect
                    inputProps={{
                      name: "age",
                      id: "uncontrolled-native",
                    }}
                    defaultValue={10}
                    onChange={(e: any) => {
                      filterHandle({ topic: e.target.value });
                    }}
                  >
                    {allTopics?.map((x, i) => {
                      return (
                        <option key={"topic" + x.id} value={x.label}>
                          {x.value}
                        </option>
                      );
                    })}
                  </NativeSelect>
                </FormControl>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    defaultValue={dayjs().subtract(1, "month")}
                    onChange={(e: any) => {
                      filterHandle({
                        date: dayjs(e).unix(),
                      });
                    }}
                  />
                </LocalizationProvider>
              </div>

              <div className={styles.posts__grid}>
                <div className={styles.right}>
                  {posts.map((x, i) => {
                    return <Card key={"post" + x.id} post={x} />;
                  })}
                </div>
                <div className={styles.left}></div>
              </div>

              <div className={styles.posts__pagination}>
                {pages?.map((page, i) => {
                  return <button className={styles.pageButton}>{i + 1}</button>;
                })}
              </div>
            </div>
          );
        }}
      </DualPagination>
    </>
  );
};

export default Posts;
