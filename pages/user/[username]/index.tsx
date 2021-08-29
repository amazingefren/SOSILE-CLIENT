import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
// import Link from 'next/link'
import Layout from "../../../components/layout/Layout";
import PostCard from "../../../components/posts/Card";
import { FeedPost } from "../../../graphql/post/post.model";
import { User } from "../../../graphql/user/user.model";
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
  let { username } = useRouter().query;
  protect({
    to: "/",
  });
  const { user: me } = cachedUser() as any;
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<FeedPost[] | null>(null);
  const [isMe, setIsMe] = useState<boolean>(true);

  useQuery(GET_USER_POST_QUERY, {
    variables: { username },
    skip: !username,
    onCompleted: (data) => {
      setPosts(data.findPostByUser);
    },
  });

  useQuery(GET_USER_QUERY, {
    variables: { username },
    skip: !username,
    onCompleted: (data) => {
      setUser(data.findUserByUsername);
    },
  });

  const [followUser] = useMutation(FOLLOW_USER_MUTATION, {
    onCompleted: (data) => {
      if (data.userFollow) {
        setUser({ ...user!, followed: true });
      }
    },
  });

  const [unfollowUser] = useMutation(UNFOLLOW_USER_MUTATION, {
    onCompleted: (data) => {
      if (data.userUnfollow) {
        setUser({ ...user!, followed: false });
      }
    },
  });

  const handleFollow = () => {
    if (user) {
      followUser({
        variables: { id: user!.id },
        onCompleted: () => {
          setUser({ ...user!, followed: true });
        },
      });
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
        {user && (
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
              {!isMe ? (
                user.followed ? (
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
                )
              ) : (
                <></>
              )}
            </div>
          </div>
        )}
        {user && true && (
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
