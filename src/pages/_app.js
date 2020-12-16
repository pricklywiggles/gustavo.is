import React from "react";
import "../styles/global.css";
import Head from "next/head";
import { Header } from "../components/header";
import { openGraphData } from "utils/data";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Gustavo Gallegos Dev Portfolio</title>
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff"></meta>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
        {Object.entries(openGraphData[Component.displayName] || {}).map(
          ([property, content]) => (
            <meta property={property} content={content} key={property} />
          )
        )}
      </Head>
      <Header />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
