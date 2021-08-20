import Head from "next/head";
import React from "react";
import { protect } from "../authentication/protected";
import Layout from "../components/layout/Layout";
import HomeStyles from "../styles/home/home.module.scss";

const Home = () => {
  protect({ to: "/" });
  return (
    <Layout title={"@ Home"}> 
      <div id={HomeStyles.container}>
        hello world
      </div>
    </Layout>
  );
};

export default Home;
