import { gql, useLazyQuery, useQuery } from "@apollo/client";
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
    }
  }
`;

const GET_USER_POST_QUERY = gql`
  query findpostbyuserid($id: Float!) {
    findPostByUserId(user: $id) {
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

const UserProfile = () => {
  const router = useRouter();
  const { username } = router.query;
  protect({
    to: "/",
  });
  // const { user: me } = cachedUser() as any;
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<FeedPost[] | null>(null);

  const [callPosts] = useLazyQuery(GET_USER_POST_QUERY, {
    onCompleted: (data) => {
      // console.log(data)
      setPosts(data.findPostByUserId);
    },
  });

  const [callUser] = useLazyQuery(GET_USER_QUERY, {
    onCompleted: (data) => {
      setUser(data.findUserByUsername);
      callPosts({ variables: { id: Number(data.findUserByUsername.id) } });
      // console.log(user)
    },
  });

  useEffect(() => {
    if (username && !user) {
      callUser({
        variables: { username: username },
      });
    }
  }, [username]);

  useEffect(() => {
    posts?.map((post) => {
      console.log(post);
    });
  }, [posts]);

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
