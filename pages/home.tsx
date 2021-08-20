import React, { useEffect } from "react";
import { protect } from "../authentication/protected";
import Layout from "../components/layout/Layout";
import HomeStyles from "../styles/home/home.module.scss";

const Home = () => {
  const { user } = protect({
    to: "/",
    user: { opts: { followers: true }, data: { email: true, username: true } },
  });
  return (
    <Layout title={"@ Home"}>
      <div id={HomeStyles.container}>Welcome Back {user?.username}</div>
    </Layout>
  );
};

export default Home;
