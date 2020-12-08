import React from "react";
import "../styles/global.css";
import Head from "next/head";
import { Header } from "../components/header";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>
      <Header />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
