import { gql, useQuery } from "@apollo/client";
import React from "react";
import { FeedPost } from "../../graphql/post/post.model";
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
  const { data: postData, loading: postLoading } = useQuery(FEED_QUERY, {
    fetchPolicy: "no-cache",
  });

  return (
    <div>
      <CreatePost />
      {/*postLoading && <div>SPINNER</div>*/}
      {postData?.getFeed &&
        postData?.getFeed.map((post: FeedPost) => {
          return <PostCard key={post.id} props={post} />;
        })}
    </div>
  );
};

export default HomePostFeed;
