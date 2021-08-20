import { useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { protect } from "../authentication/protected";
import Layout from "../components/layout/Layout";
import { Post } from "../graphql/models/post.model";
import { USER_POST } from "../graphql/post/post.query";
import HomeStyles from "../styles/home/home.module.scss";

const Home = () => {
  const { user } = protect({
    to: "/",
    user: { fields: { username: true } },
  });

  const { data: postData, loading: postLoading } = useQuery(
    USER_POST({ content: true })
  );

  return (
    <Layout title={user?.username + "@Home" || ""}>
      <div id={HomeStyles.container}>
        <div id={HomeStyles.postContainer}>
          {postLoading && <div>SPINNER</div>}
          {postData?.userPosts &&
            postData.userPosts.map((post: Post) => {
              return <div>{post.content}</div>;
            })}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
