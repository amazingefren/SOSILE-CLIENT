import { gql, useLazyQuery, useMutation } from "@apollo/client";
import router from "next/router";
import React, { useEffect, useState } from "react";
import { FeedPost, Comment } from "../../graphql/post/post.model";
import { CachedUser } from "../../graphql/user/user.model";
import cachedUser from "../../hooks/getUser";
import Style from "./card.module.scss";
import CreatePost from "./CreatePost";

const GET_POST_COMMENT_QUERY = gql`
  query getPostComments($id: Float!) {
    findPost(id: $id) {
      comments {
        id
        content
        date
        author {
          id
          username
          displayName
        }
        liked
        _count {
          likes
        }
      }
    }
  }
`;

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: Float!, $comment: Boolean!) {
    deletePost(postId: $postId, comment: $comment)
  }
`;

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

const PostCard = ({
  props,
  temp = false,
  comment = false,
  toggleComments = false,
  adjuster = () => {},
}: {
  props: FeedPost | Comment;
  temp?: boolean;
  comment?: boolean;
  toggleComments?: boolean;
  adjuster?: any;
}) => {
  const { user: me }: { user: CachedUser | null } = cachedUser();
  const [postLikes, setPostLikes] = useState(Number(props._count?.likes));
  const [postLiked, setPostLiked] = useState(Boolean(props.liked) || false);
  const [deleteToggle, setDeleteToggle] = useState(false);
  const [shareToggle, setShareToggle] = useState(false);
  const [commentToggle, setCommentToggle] = useState(false);
  const [commentCount, setCommentCount] = useState<number>(
    (props._count?.comments as number) || 0
  );
  const [loaded, setLoaded] = useState<boolean>(false);

  const [
    getComments,
    // { data: { findPost: { comments: commentData } = [] } = {} },
    {
      data: { findPost: { comments: commentData = [] } = [] } = {},
      loading: commentLoading,
    },
  ] = useLazyQuery(GET_POST_COMMENT_QUERY, {
    fetchPolicy: "no-cache",
    onCompleted: ({ findPost: { comments: commentData } }) => {
      console.log(commentData);
    },
  });

  const [likePost] = useMutation(
    gql`
    mutation likepost {
      postLikeToggle(postId: ${props.id}, comment:${comment})
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
        adjuster("decrease");
        setLoaded(false);
      }
    },
  });

  useEffect(() => {
    setLoaded(true);
  }, []);

  // useEffect(() => {
  //   if (commentToggle) {
  //     getComments({ variables: { id: props.id } });
  //   } else {
  //   }
  // }, [commentToggle]);

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
    deletePost({ variables: { postId: props.id, comment } });
  };

  const handleShareLinkSelect = (e: any) => {
    e.target.select();
  };

  const handleCommentToggle = () => {
    if (!commentToggle) {
      getComments({ variables: { id: props.id } });
      setCommentToggle(true);
    } else {
      setCommentToggle(false);
    }
  };

  useEffect(() => {
    if (toggleComments) {
      handleCommentToggle();
    }
  }, [toggleComments]);

  const adjustComment = (opt: "increase" | "decrease") => {
    if (!comment) {
      if (opt == "increase") {
        setCommentCount(commentCount + 1);
      } else if (opt === "decrease") {
        setCommentCount(commentCount - 1);
      }
    }
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
            <div className={Style.postMiddle}>
              <p> {props.content}</p>
            </div>
            <div className={Style.postBottom}>
              {temp ? (
                <></>
              ) : (
                <>
                  {!comment && (
                    <div
                      className={Style.postBottomComments}
                      onClick={handleCommentToggle}
                    >
                      <span>{commentCount} comments</span>
                    </div>
                  )}
                  <div
                    className={
                      postLiked
                        ? Style.postBottomLikes + " " + Style.postLiked
                        : Style.postBottomLikes
                    }
                    onClick={() => {
                      likePost();
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
              <div className={Style.postBottomExpand} onClick={handlePostRoute}>
                <span>expand</span>
              </div>
            </div>
            {shareToggle && (
              <div className={Style.postShareContainer}>
                <div className={Style.postShareWrapper}>
                  <input
                    className={Style.postShareLink}
                    value={
                      !comment
                        ? "http://localhost:3000/post/" + props.id
                        : "NOT IMPLEMENTED"
                    }
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
            {commentToggle && commentData && !commentLoading && (
              <div className={Style.postCommentContainer}>
                <CreatePost
                  postId={props.id}
                  comment={true}
                  adjuster={adjustComment}
                />
                {commentData.map((comment: Comment) => (
                  <PostCard
                    key={comment.id}
                    comment={true}
                    props={comment}
                    adjuster={adjustComment}
                  />
                ))}
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
