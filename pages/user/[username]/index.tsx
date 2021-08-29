import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
// import Link from 'next/link'
import Layout from "../../../components/layout/Layout";
import PostCard from "../../../components/posts/Card";
import { FeedPost } from "../../../graphql/post/post.model";
import cachedUser from "../../../hooks/getUser";
import { protect } from "../../../hooks/protected";
import ProfileStyle from "./index.module.scss";

const GET_USER_QUERY = gql`
  query userbyusername($username: String!) {
    findUserByUsername(username: $username) {
      username
      displayName
      id
      profile {
        biography
      }
      posts {
        id
        content
      }
      _count {
        followers
        following
      }
      followed
    }
  }
`;

const GET_USER_POST_QUERY = gql`
  query findpostbyuser($username: String!) {
    findPostByUser(where: { username: $username }) {
      id
      updated
      content
      date
      liked
      _count {
        likes
        comments
      }
    }
  }
`;

const FOLLOW_USER_MUTATION = gql`
  mutation followUser($id: Float!) {
    userFollow(user: $id)
  }
`;

const UNFOLLOW_USER_MUTATION = gql`
  mutation unfollowUser($id: Float!) {
    userUnfollow(user: $id)
  }
`;

const UserProfile = () => {
  protect({
    to: "/",
  });
  let { username } = useRouter().query;
  const { user: me } = cachedUser() as any;
  const [isMe, setIsMe] = useState<boolean>(true);

  const {
    data: { findPostByUser: posts } = {},
    fetchMore: postsRefresh,
    loading: postLoading,
  } = useQuery(GET_USER_POST_QUERY, {
    variables: { username },
    skip: !username,
  });

  const {
    data: { findUserByUsername: user } = {},
    fetchMore: userRefresh,
    loading: userLoading,
  } = useQuery(GET_USER_QUERY, {
    variables: { username },
    skip: !username,
  });

  const [followUser] = useMutation(FOLLOW_USER_MUTATION, {
    onCompleted: (data) => {
      if (data.userFollow) {
        userRefresh({ variables: { username } });
        postsRefresh({ variables: { username } });
      }
    },
  });

  const [unfollowUser] = useMutation(UNFOLLOW_USER_MUTATION, {
    onCompleted: (data) => {
      if (data.userUnfollow) {
        userRefresh({ variables: { username } });
        postsRefresh({ variables: { username } });
      }
    },
  });

  const handleFollow = () => {
    if (user) {
      followUser({ variables: { id: user!.id } });
    }
  };
  const handleUnfollow = () => {
    if (user) {
      unfollowUser({ variables: { id: user!.id } });
    }
  };

  useEffect(() => {
    if (me && user) {
      if (me.username === user?.username) {
        setIsMe(true);
      } else {
        setIsMe(false);
      }
    }
  }, [user, me]);

  return (
    <Layout title={user ? user.username + "@" + username : ""}>
      <div id={ProfileStyle.root}>
        {userLoading && <div>Loading...</div>}
        {user && !userLoading && (
          <div id={ProfileStyle.header}>
            <div id={ProfileStyle.headerImg}></div>
            <div id={ProfileStyle.headerUser}>
              <div id={ProfileStyle.headerUserImg} />
              <div id={ProfileStyle.headerUserName}>
                <div id={ProfileStyle.headerUserDisplayName}>
                  {user.displayName}
                </div>
                <div id={ProfileStyle.headerUserSeperator}> ‧ </div>
                <div id={ProfileStyle.headerUserUsername}>{user.username}</div>
              </div>
              <div id={ProfileStyle.headerUserBio}>
                {user.profile!.biography}
              </div>
              {!isMe &&
                (user.followed ? (
                  <div
                    id={ProfileStyle.headerUserButton}
                    onClick={handleUnfollow}
                  >
                    <div id={ProfileStyle.headerUserButtonFollow}>Unfollow</div>
                  </div>
                ) : (
                  <div
                    id={ProfileStyle.headerUserButton}
                    onClick={handleFollow}
                  >
                    <div id={ProfileStyle.headerUserButtonFollow}>Follow</div>
                  </div>
                ))}
            </div>
          </div>
        )}
        {postLoading && <div>Loading...</div>}
        {user && !postLoading && (
          <div id={ProfileStyle.selection}>
            <div className={ProfileStyle.selectionFlex}>
              <div id={ProfileStyle.selectionPosts}>Posts</div>
            </div>
            <div className={ProfileStyle.selectionFlex}>
              <div id={ProfileStyle.selectionReplies}>Replies</div>
            </div>
            <div className={ProfileStyle.selectionFlex}>
              <div id={ProfileStyle.selectionLikes}>Likes</div>
            </div>
          </div>
        )}
        {posts && (
          <div id={ProfileStyle.postWrapper}>
            {posts?.map((post: FeedPost) => {
              return (
                <PostCard key={post.id} props={{ ...post, author: user }} />
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserProfile;
