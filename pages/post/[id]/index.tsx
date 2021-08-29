import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";

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
      liked
      _count {
        likes
        comments
      }
    }
  }
`;
const PostProfile = () => {
  const { id: postId } = useRouter().query;
  const { data: { findPost: postData } = {} } = useQuery(GET_POST_DATA_QUERY, {
    variables: { id: Number(postId) },
    skip: !postId,
  });
  return <div>{postData && postData.content}</div>;
};

export default PostProfile;
