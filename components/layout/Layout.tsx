import React, { ReactChildren, ReactElement } from "react";
import LayoutStyle from "../../styles/layout/layout.module.scss";
import Head from "next/head";
import Navbar from "../navbar/Navbar";
import Header from "../header/Header";

const Layout = ({
  children,
  title,
}: {
  children: ReactElement<any, any>;
  title: string;
}) => {
  return (
    <div id={LayoutStyle.root}>
      <Head>
        <title>{title}</title>
        <meta name="description" content="sosile-client" />
      </Head>
      <main>
        <div id={LayoutStyle.container}>
          <div id={LayoutStyle.top}>
            <Header/>
          </div>
          <div id={LayoutStyle.nav}>
            <Navbar />
          </div>
        </div>
        <div id={LayoutStyle.child}>{children}</div>
      </main>
    </div>
  );
};

export default Layout;
