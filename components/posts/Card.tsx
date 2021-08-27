import { gql, useMutation } from "@apollo/client";
import router from "next/router";
import { useEffect, useState } from "react";
import { FeedPost, Post } from "../../graphql/models/post.model";
import Style from "./card.module.scss";

function convertDate(date: string) {
  const time = new Date().getTime() - new Date(date).getTime();

  const seconds = Math.floor(time / 1000);
  switch (true) {
    case seconds < 60:
      return seconds + "s";
    case seconds / 60 < 60:
      return Math.floor(seconds / 60) + "m";
    case seconds / 60 / 60 < 24:
      return Math.floor(seconds / 60 / 60) + "h";
    case seconds / 60 / 60 / 24 < 30:
      return Math.floor(seconds / 60 / 60 / 24) + "d";
  }
}

const PostCard = ({ props }: { props: FeedPost }) => {
  const [postLikes, setPostLikes] = useState(Number(props._count?.likes));
  const [postLiked, setPostLiked] = useState(Boolean(props.liked) || false);
  const [likePost] = useMutation(
    gql`
    mutation likepost {
      postLikeToggle(postId: ${props.id})
    }`,
    {
      onCompleted: ({ postLikeToggle }) => {
        if (postLikeToggle) {
          setPostLikes(postLikes + 1);
          setPostLiked(true);
        } else {
          setPostLikes(postLikes - 1);
          setPostLiked(false);
        }
      },
    }
  );

  const handleUserRoute = () => {
    const to = "/user/" + props.author.username;
    if (router.route != to) {
      router.push("/user/" + props.author.username);
    }
  };

  return (
    <div className={Style.container}>
      <div className={Style.postTop}>
        <div className={Style.postUserImage} onClick={handleUserRoute}></div>
        <div className={Style.postUserNest}>
          <div className={Style.postDisplayName}>
            {props.author?.displayName}
          </div>
          <div className={Style.postUserSeperator}>/</div>
          <div className={Style.postUsername}>{props.author?.username}</div>
          {props.author?._count?.followers && (
            <>
              <div className={Style.postUserSeperator}>/</div>
              <div className={Style.postFollowerCount}>
                {props.author?._count?.followers} FOLLOWERS{" "}
              </div>
            </>
          )}
        </div>
        <div className={Style.postTime}>{convertDate(props.date)}</div>
      </div>
      <div className={Style.postMiddle}>{props.content}</div>
      <div
        className={Style.postBottom}
        onClick={async () => {
          await likePost();
        }}
      >
        <div className={postLiked ? Style.postLiked : Style.postNotLiked}>
          {postLikes} Likes
        </div>
      </div>
    </div>
  );
};

export default PostCard;
