import { gql, useMutation } from "@apollo/client";
import router from "next/router";
import { useEffect, useState } from "react";
import { FeedPost } from "../../graphql/post/post.model";
import { CachedUser } from "../../graphql/user/user.model";
import cachedUser from "../../hooks/getUser";
import Style from "./card.module.scss";

export const convertDate = (date: string) => {
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
};

const DELETE_POST_MUTATION = gql`
  mutation deletePost($id: Float!) {
    deletePost(postId: $id)
  }
`;

const PostCard = ({
  props,
  temp = false,
}: {
  props: FeedPost;
  temp?: boolean;
}) => {
  const { user: me }: { user: CachedUser | null } = cachedUser();
  const [postLikes, setPostLikes] = useState(Number(props._count?.likes));
  const [postLiked, setPostLiked] = useState(Boolean(props.liked) || false);
  const [deleteToggle, setDeleteToggle] = useState(false);
  const [shareToggle, setShareToggle] = useState(false);
  const [loaded, setLoaded] = useState<boolean>(false);
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

  const [deletePost] = useMutation(DELETE_POST_MUTATION, {
    onCompleted: ({ deletePost }) => {
      if (deletePost) {
        setLoaded(false);
      }
    },
  });

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleUserRoute = () => {
    const to = "/user/" + props.author?.username;
    if (router.route != to) {
      router.push("/user/" + props.author?.username);
    }
  };

  const handlePostRoute = () => {
    const to = "/post/" + props.id;
    if (router.route != to) {
      router.push("/post/" + props.id);
    }
  };

  const handlePostDelete = () => {
    deletePost({ variables: { id: props.id } });
  };

  const handleShareLinkSelect = (e: any) => {
    e.target.select();
  };

  return (
    <>
      {loaded ? (
        <>
          <div className={Style.container}>
            <div className={Style.postTop}>
              <div
                className={Style.postUserImage}
                onClick={handleUserRoute}
              ></div>
              <div className={Style.postUserNest}>
                <div className={Style.postDisplayName}>
                  {props.author?.displayName}
                </div>
                <div className={Style.postUserSeperator}>‧</div>
                <div className={Style.postUsername}>
                  {props.author?.username}
                </div>
                <div className={Style.postUserSeperator}>‧</div>
                <div className={Style.postTime}>{convertDate(props.date)}</div>
              </div>
              {props.author?.id === me?.id && (
                <div
                  className={Style.postTrashCan}
                  onClick={() => {
                    setDeleteToggle(true);
                  }}
                >
                  DEL
                </div>
              )}
            </div>
            <div className={Style.postMiddle}>{props.content}</div>
            <div className={Style.postBottom}>
              {temp ? (
                <></>
              ) : (
                <>
                  <div
                    className={Style.postBottomComments}
                    onClick={handlePostRoute}
                  >
                    <span>{props._count?.comments} comments</span>
                  </div>
                  <div
                    className={
                      postLiked
                        ? Style.postBottomLikes + " " + Style.postLiked
                        : Style.postBottomLikes
                    }
                    onClick={async () => {
                      await likePost();
                    }}
                  >
                    <span>
                      {postLikes == 1 ? "1 like" : postLikes + " likes"}
                    </span>
                  </div>
                </>
              )}
              <div
                className={Style.postBottomShare}
                onClick={() => setShareToggle(!shareToggle)}
              >
                <span>share</span>
              </div>
            </div>
            {deleteToggle && (
              <div className={Style.postDeleteContainer}>
                <div className={Style.postDeleteHeader}>ARE YOU SURE</div>
                <div>
                  <button
                    onClick={handlePostDelete}
                    className={Style.postDeleteButtonYes}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setDeleteToggle(false)}
                    className={Style.postDeleteButtonNo}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {shareToggle && (
              <div className={Style.postShareContainer}>
                <div className={Style.postShareWrapper}>
                  <input
                    className={Style.postShareLink}
                    value={"http://localhost:3000/post/" + props.id}
                    autoFocus={true}
                    onFocus={handleShareLinkSelect}
                    readOnly={true}
                  />
                  <div
                    className={Style.postShareClose}
                    onClick={() => setShareToggle(false)}
                  >
                    X
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default PostCard;
