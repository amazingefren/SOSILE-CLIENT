import Head from "next/head";
import React from "react";
import { protect } from "../authentication/protected";
import HomeStyles from "../styles/home/home.module.scss";

const Home = () => {
  protect({ to: "/" });
  return (
    <div id={HomeStyles.container}>
      <Head>
        <title>@ Home</title>
        <meta name="description" content="sosile-client" />
      </Head>
      <main>
        <div>Hello World</div>
      </main>
    </div>
  );
};

export default Home;
