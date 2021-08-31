import { gql, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { FeedPost } from "../../graphql/post/post.model";
import HomeStyles from "../../styles/home/home.module.scss";
import PostCard from "../posts/Card";
import CreatePost from "../posts/CreatePost";

const FEED_QUERY = gql`
  query UserFeed {
    getFeed {
      id
      content
      updated
      date
      author {
        username
        displayName
        id
        _count {
          followers
        }
      }
      liked
      _count {
        comments
        likes
      }
    }
  }
`;

const HomePostFeed = () => {
  const {
    data: postData,
    loading: postLoading,
    refetch,
    // startPolling,
    // stopPolling,
  } = useQuery(FEED_QUERY, { skip: false });

  useEffect(() => {
    refetch();
    // previous data + append new instead of remap postData?
    // this would require a seperate state to maintain session
    // without a new postData change clearing older posts
    // startPolling(5000);
    // return () => {
    //   stopPolling();
    // };
  }, [refetch]);

  return (
    <div id={HomeStyles.postContainer}>
      <CreatePost props={{ refetch }} />
      {postLoading && <div>SPINNER</div>}
      {postData?.getFeed &&
        postData?.getFeed.map((post: FeedPost) => {
          return <PostCard key={post.id} props={post} />;
        })}
    </div>
  );
};

export default HomePostFeed;
