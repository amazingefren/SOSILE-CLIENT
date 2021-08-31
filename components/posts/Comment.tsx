import router from "next/router";
import { PostComment } from "../../graphql/post/post.model";
import CommentStyle from "./comment.module.scss";

const CommentCard = ({ comment }: { comment: Required<PostComment> }) => {
  const handleUserRoute = () => {
    const to = "/user/" + comment.author.username;
    if (router.route != to) {
      router.push("/user/" + comment.author.username);
    }
  };

  /*WIP*/
  return (
    <div className={CommentStyle.container}>
      <div className={CommentStyle.hi}>HELLO WORLD</div>
      <div className={CommentStyle.hi}>HELLO WORLD</div>
      <div className={CommentStyle.hi}>HELLO WORLD</div>
      <div className={CommentStyle.hi}>HELLO WORLD</div>
    </div>
  );
};

export { CommentCard };
