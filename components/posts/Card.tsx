import { Post } from "../../graphql/models/post.model";
import Style from "./card.module.scss";

function convertDate(date: string) {
  const time = new Date().getTime() - new Date(date).getTime();

  const seconds = Math.floor(time / 1000);
  switch (true) {
    case seconds < 60:
      return seconds + "s";
    case seconds / 60 < 60:
      return Math.floor(seconds / 60) + "m";
    case seconds / 60 / 60 < 60:
      return Math.floor(seconds / 60 / 60) + "h";
  }
}

const PostCard = ({ props }: { props: Post }) => {
  return (
    <div className={Style.container}>
      <div className={Style.postTop}>
        <span className={Style.postUsername}>{props.author?.username}</span>
        <span className={Style.postFollowerCount}> {props.author?._count?.followers} FOLLOWERS </span>
        <span className={Style.postTime}>{convertDate(props.date)}</span>
      </div>
      <div className={Style.postMiddle}>{props.content}</div>
      <div className={Style.postBottom}>{props._count.likes} likes</div>
    </div>
  );
};

export default PostCard;
