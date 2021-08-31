import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Layout from "../../../components/layout/Layout";
import PostCard from "../../../components/posts/Card";
import { CachedUser } from "../../../graphql/user/user.model";
import cachedUser from "../../../hooks/getUser";
import { protect } from "../../../hooks/protected";

const GET_POST_DATA_QUERY = gql`
  query getPostInfo($id: Float!) {
    findPost(id: $id) {
      id
      content
      updated
      date
      author {
        username
        displayName
        id
      }
      comments {
        id
        content
        author {
          username
          displayName
        }
        date
        liked
        _count {
          likes
        }
      }
      liked
      _count {
        likes
        comments
      }
    }
  }
`;
const PostProfile = () => {
  protect({
    to: "/",
  });
  const { user: me }: { user: CachedUser | null } = cachedUser();
  const { id: postId } = useRouter().query;
  const { data: { findPost: postData } = {}, loading: postLoading } = useQuery(
    GET_POST_DATA_QUERY,
    {
      variables: { id: Number(postId) },
      skip: !postId,
      fetchPolicy: "no-cache",
    }
  );

  /* DEBUG */
  useEffect(() => {
    console.log(postData);
  }, [postData]);

  return (
    <Layout
      title={
        me && postData ? me.username + " " + postData.content : "Loading..."
      }
    >
      <div>
        {!postLoading && postData && (
          <>
            <PostCard
              key={postData.id}
              props={postData}
              toggleComments={true}
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default PostProfile;
