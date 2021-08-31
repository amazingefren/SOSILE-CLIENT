import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
// import { CachedUser } from "../../graphql/user/user.model";
// import cachedUser from "../../hooks/getUser";
import CreatePostStyle from "./createpost.module.scss";

const CREATE_POST_MUTATION = gql`
  mutation createpost($content: String!) {
    createPost(data: { content: $content }) {
      id
    }
  }
`;

interface CreatePostProps {
  props?: { refetch?: any };
}

const CreatePost = ({ props }: CreatePostProps) => {
  // const { user: me } = cachedUser() as { user: Required<CachedUser> };
  const [userInput, setUserInput] = useState<string>("");
  const [createPost] = useMutation(CREATE_POST_MUTATION, {
    onCompleted: (d) => {
      if (props) {
        props.refetch();
      }
      console.log(d);
    },
  });

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value.trimStart());
  };
  const handleSubmit = () => {
    createPost({ variables: { content: userInput } });
  };

  return (
    <div id={CreatePostStyle.container}>
      <div id={CreatePostStyle.image} />
      <input
        id={CreatePostStyle.input}
        placeholder="Hello World!"
        value={userInput}
        onChange={handleUserInput}
      />
      <button
        disabled={userInput === ""}
        id={CreatePostStyle.submit}
        onClick={handleSubmit}
      >
        <div id={CreatePostStyle.submitText}>Submit</div>
      </button>
    </div>
  );
};

export default CreatePost;
