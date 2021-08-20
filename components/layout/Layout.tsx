import React, { ReactChildren, ReactElement } from "react";
import LayoutStyle from "../../styles/layout/layout.module.scss";
import Head from "next/head";

const Layout = ({children, title}:{children: ReactElement<any,any>, title: string}) => {
  return (
    <div id={LayoutStyle.root}>
      <Head>
        <title>{title}</title>
        <meta name="description" content="sosile-client" />
      </Head>
      <main id={LayoutStyle.container}>
        <div id={LayoutStyle.top}>top</div>
        <div id={LayoutStyle.child}>{children}</div>
        <div id={LayoutStyle.nav}>nav</div>
        <div id={LayoutStyle.bot}>bot</div>
      </main>
    </div>
  );
};

export default Layout;
