import React, { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import IndexStyle from "../styles/index/index.module.scss";
import LoginForm from "../components/index/Login";
import { protect } from "../hooks/protected";
import RegisterForm from "../components/index/Register";

const Index: NextPage = () => {
  const { isAuth } = protect({ to: "/home", reverse: true });
  const [register, setRegister] = useState<boolean>(false);

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
            {register ? <RegisterForm /> : <LoginForm />}
            <div
              onClick={() => {
                setRegister(!register);
              }}
            >
              {register ? "Sign In" : "Sign Up"}
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default Index;
