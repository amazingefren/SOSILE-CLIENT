import React from "react";
import { protect } from "../hooks/protected";
import HomePostFeed from "../components/home/Feed";
import Layout from "../components/layout/Layout";
import HomeStyles from "../styles/home/home.module.scss";
import cachedUser from "../hooks/getUser";

const Home = () => {
  protect({
    to: "/",
    // user: { fields: { username: true } },
  });
  const {user} = cachedUser()
  return (
    <Layout title={user ? user.username + "@Home": "Loading"}>
      <div id={HomeStyles.container}>
        <HomePostFeed />
      </div>
    </Layout>
  );
};

export default Home;
