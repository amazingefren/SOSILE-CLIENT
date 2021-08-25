import React, { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import IndexStyle from "../styles/index/index.module.scss";
import Login from "../components/index/Login";
import { protect } from "../hooks/protected";

const Index: NextPage = () => {
  const { isAuth } = protect({ to: "/home", reverse: true });

  return (
    <div className={IndexStyle.container}>
      <Head>
        <title>Sosile</title>
        <meta name="description" content="sosile-client" />
      </Head>

      {isAuth === false && (
        <main className={IndexStyle.main}>
          <div className={IndexStyle.mainLeft}>
            <h1>SOSILE</h1>
          </div>
          <div className={IndexStyle.mainRight}>
            <Login />
            <div>Sign Up</div>
          </div>
        </main>
      )}
    </div>
  );
};

export default Index;
