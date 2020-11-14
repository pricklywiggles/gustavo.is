import Head from "next/head";
import React from "react";
import { css } from "@emotion/core";
import { Header } from "../components/header";
import { Box, Center } from "../components/layouts";
import styled from "@emotion/styled";

export default function Home() {
  return (
    <main>
      <Head>
        <title>Hello World</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Header />
        <Center
          gutterWidth="var(--s1)"
          css={css`
            padding-top: 100px;
            font-family: Wotfard;
            font-style: normal;
          `}
        >
          <div>
            <h1>This is an h1</h1>
            <h2>This is an h2</h2>
            <h3>This is an h3</h3>

            <p css={{ fontFamily: "Silka" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <p css={{ fontFamily: "Wotfard" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <p css={{ fontFamily: "Archia" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <p css={{ fontFamily: "Basier" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <p css={{ fontFamily: "Parking" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>

            <p css={{ fontFamily: "Silka" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Dolor
              sit amet consectetur adipiscing elit. Ut etiam sit amet nisl purus
              in. Nec ultrices dui sapien eget mi. Sagittis orci a scelerisque
              purus semper eget duis. In massa tempor nec feugiat nisl pretium
              fusce id. Tristique senectus et netus et malesuada fames.
            </p>
            <p css={{ fontFamily: "Wotfard" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Dolor
              sit amet consectetur adipiscing elit. Ut etiam sit amet nisl purus
              in. Nec ultrices dui sapien eget mi. Sagittis orci a scelerisque
              purus semper eget duis. In massa tempor nec feugiat nisl pretium
              fusce id. Tristique senectus et netus et malesuada fames.
            </p>
            <p css={{ fontFamily: "Archia" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Dolor
              sit amet consectetur adipiscing elit. Ut etiam sit amet nisl purus
              in. Nec ultrices dui sapien eget mi. Sagittis orci a scelerisque
              purus semper eget duis. In massa tempor nec feugiat nisl pretium
              fusce id. Tristique senectus et netus et malesuada fames.
            </p>
            <p css={{ fontFamily: "Basier" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Dolor
              sit amet consectetur adipiscing elit. Ut etiam sit amet nisl purus
              in. Nec ultrices dui sapien eget mi. Sagittis orci a scelerisque
              purus semper eget duis. In massa tempor nec feugiat nisl pretium
              fusce id. Tristique senectus et netus et malesuada fames.
            </p>
            <p css={{ fontFamily: "Parking" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Dolor
              sit amet consectetur adipiscing elit. Ut etiam sit amet nisl purus
              in. Nec ultrices dui sapien eget mi. Sagittis orci a scelerisque
              purus semper eget duis. In massa tempor nec feugiat nisl pretium
              fusce id. Tristique senectus et netus et malesuada fames.
            </p>
          </div>
        </Center>
      </div>
      <footer></footer>
    </main>
  );
}
