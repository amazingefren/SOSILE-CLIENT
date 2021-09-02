import React, { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import IndexStyle from "./index.module.scss";
import LoginForm from "../components/auth/Login";
import { protect } from "../hooks/protected";
import RegisterForm from "../components/auth/Register";

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
          <div className={IndexStyle.mainTop}>
            <h1 className={IndexStyle.mainTopText}>SOSILE</h1>
          </div>
          <div className={IndexStyle.mainForm}>
            {register ? <RegisterForm /> : <LoginForm />}
            <div
              onClick={() => {
                setRegister(!register);
              }}
              id={IndexStyle.mainFormToggle}
            >
              {register ? "Already Have An Account?" : "Create New Account?"}
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default Index;
