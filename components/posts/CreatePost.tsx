import { gql, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { FeedPost } from "../../graphql/post/post.model";
import { CachedUser } from "../../graphql/user/user.model";
import cachedUser from "../../hooks/getUser";
import PostCard from "./Card";
// import { CachedUser } from "../../graphql/user/user.model";
// import cachedUser from "../../hooks/getUser";
import CreatePostStyle from "./createpost.module.scss";

const CREATE_POST_MUTATION = gql`
  mutation createpost($content: String!) {
    createPost(data: { content: $content }) {
      id
      content
      date
      _count {
        comments
        likes
      }
    }
  }
`;

interface CreatePostProps {
  props?: { refetch?: any };
}

const CreatePost = ({ props }: CreatePostProps) => {
  const { user: me } = cachedUser() as { user: Required<CachedUser> };
  const [userInput, setUserInput] = useState<string>("");
  // const [disabled, setDisabled] = useState<boolean>(true);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [newPost, setNewPost] = useState<FeedPost[]>([]);

  const [createPost] = useMutation(CREATE_POST_MUTATION, {
    onCompleted: ({ createPost }) => {
      // ignored for now
      if (props) {
        props.refetch();
      }
      setNewPost([createPost, ...newPost]);
    },
  });

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value.trimStart());
  };
  const handleSubmit = () => {
    createPost({ variables: { content: userInput } });
  };

  useEffect(() => {
    console.log(newPost);
  }, [newPost]);

  useEffect(() => {
    setLoaded(true);
  }, [loaded]);

  useEffect(() => {
    setUserInput(window.localStorage.getItem("create-post-input") || "");
  }, []);

  useEffect(() => {
    window.localStorage.setItem("create-post-input", userInput);
  }, [userInput]);

  return loaded ? (
    <>
      <div id={CreatePostStyle.container}>
        <div id={CreatePostStyle.image} />
        <input
          id={CreatePostStyle.input}
          placeholder="Hello World!"
          value={userInput}
          onChange={handleUserInput}
          // ref={inputRef}
        />
        <button
          /* FIREFOX WILL GIVE ERROR CAN IGNORE */
          type={"button"}
          disabled={!userInput}
          id={CreatePostStyle.submit}
          onClick={handleSubmit}
        >
          <div id={CreatePostStyle.submitText}>Submit</div>
        </button>
      </div>
      {newPost &&
        newPost.map((post: FeedPost) => (
          <PostCard key={post.id} props={{ ...post, author: me }} temp={true} />
        ))}
    </>
  ) : (
    <></>
  );
};

export default CreatePost;
