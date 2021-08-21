import React from "react";
import { protect } from "../authentication/protected";
import HomePostFeed from "../components/home/Feed";
import Layout from "../components/layout/Layout";
import HomeStyles from "../styles/home/home.module.scss";

const Home = () => {
  const { user } = protect({
    to: "/",
    user: { fields: { username: true } },
  });

  return (
    <Layout title={user?.username + "@Home" || ""}>
      <div id={HomeStyles.container}>
        <HomePostFeed />
      </div>
    </Layout>
  );
};

export default Home;
