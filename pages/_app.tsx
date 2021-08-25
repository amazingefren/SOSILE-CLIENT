import "../styles/globals.scss";
import type { AppProps } from "next/app";
import client from "../apollo.client";
import React from "react";
import { ApolloProvider } from "@apollo/client";
import AppStyles from "./_app.module.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} id={AppStyles.root} />
    </ApolloProvider>
  );
}
export default MyApp;
