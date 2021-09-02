import { gql, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { FeedPost, Comment } from "../../graphql/post/post.model";
import { CachedUser } from "../../graphql/user/user.model";
import cachedUser from "../../hooks/getUser";
import PostCard from "./Card";
// import { CachedUser } from "../../graphql/user/user.model";
// import cachedUser from "../../hooks/getUser";
import CreatePostStyle from "./CreatePost.module.scss";

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

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($content: String!, $postId: Float!) {
    createComment(data: { content: $content }, postId: $postId) {
      id
      content
      date
      _count {
        likes
      }
    }
  }
`;

interface CreatePostProps {
  postId?: number;
  comment?: boolean;
  adjuster?: any;
}

const CreatePost = ({
  postId,
  comment = false,
  adjuster = () => {},
}: CreatePostProps) => {
  const { user: me } = cachedUser() as { user: Required<CachedUser> };
  const [userInput, setUserInput] = useState<string>("");
  // const [disabled, setDisabled] = useState<boolean>(true);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [newPost, setNewPost] = useState<FeedPost[] | Comment[]>([]);

  const [createPost] = useMutation(
    comment ? CREATE_COMMENT_MUTATION : CREATE_POST_MUTATION,
    {
      onCompleted: ({ createPost, createComment }) => {
        setUserInput("");
        adjuster("increase");
        comment
          ? setNewPost([createComment, ...newPost])
          : setNewPost([createPost, ...newPost]);
      },
    }
  );

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value.trimStart());
  };
  const handleSubmit = () => {
    comment
      ? createPost({ variables: { content: userInput, postId: postId } })
      : createPost({ variables: { content: userInput } });
  };

  useEffect(() => {
    // console.log(newPost);
  }, [newPost]);

  useEffect(() => {
    setLoaded(true);
  }, [loaded]);

  // useEffect(() => {
  //   setUserInput(window.localStorage.getItem("create-post-input") || "");
  // }, []);

  // useEffect(() => {
  //   window.localStorage.setItem("create-post-input", userInput);
  // }, [userInput]);

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
        newPost.map((post: FeedPost | Comment) => (
          <PostCard
            key={post.id}
            props={{ ...post, author: me }}
            temp={true}
            comment={comment}
            adjuster={adjuster}
          />
        ))}
    </>
  ) : (
    <></>
  );
};

export default CreatePost;
