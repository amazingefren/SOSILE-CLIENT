import { gql, useQuery } from "@apollo/client";
import { FeedPost } from "../../graphql/models/post.model";
import HomeStyles from "../../styles/home/home.module.scss";
import PostCard from "../posts/Card";

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
    onCompleted: (data) => {
      console.log(data);
    },
  });
  return (
    <div id={HomeStyles.postContainer}>
      {postLoading && <div>SPINNER</div>}

      {postData?.getFeed &&
        postData?.getFeed.map((post: FeedPost) => {
          return <PostCard key={post.id} props={post} />;
        })}
    </div>
  );
};

export default HomePostFeed;
