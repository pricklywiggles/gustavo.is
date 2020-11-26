import Head from "next/head";
import React from "react";
import Link from "next/link";
import { css } from "@emotion/core";
import { Header } from "components/header";
import { Logo } from "components/logo";
import {
  Box,
  Center,
  Stack,
  Switcher,
  Sidebar,
  Cluster,
  Frame
} from "components/layouts";
import { headerRoom } from "styles/util";
import { WithLove } from "components/sprinkles";
import styled from "@emotion/styled";

export default function Home() {
  return (
    <main>
      <Head>
        <title>Hello World</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Center css={headerRoom} gutterWidth="var(--s1)">
        <div>
          <h1>Hey there! I&apos;m Gustavo.</h1>
          <div
            css={{
              fontFamily: "Archia",
              fontSize: "var(--font-size-base)",
              fontStyle: "italic",
              textAlign: "right",
              position: "relative",
              top: "-2.5rem"
            }}
          >
            (as if you didn&apos;t know by now)
          </div>

          <p css={{ fontSize: "var(--font-size-biggish)" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Dolor
            sit amet consectetur adipiscing elit. Ut etiam sit amet nisl purus
            in. Nec ultrices dui sapien eget mi. Sagittis orci a scelerisque
            purus semper eget duis. In massa tempor nec feugiat nisl pretium
            fusce id. Tristique senectus et netus et malesuada fames. Lorem
            ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Dolor sit amet
            consectetur adipiscing elit. Ut etiam sit amet nisl purus in. Nec
            ultrices dui sapien eget mi. Sagittis orci a scelerisque purus
            semper eget duis. In massa tempor nec feugiat nisl pretium fusce id.
            Tristique senectus et netus et malesuada fames.
          </p>
        </div>
      </Center>
      <Center maxWidth="100vw" intrinsic>
        <h2>Examples of my work</h2>
      </Center>
      <Cluster justify="center" space="4em" css={{ overflow: "visible" }}>
        <Link href="/projects/ponder">
          <Card>
            <div>
              <img src="/ponder-logo.svg" alt="Ponder Logo" className="logo" />
              <div className="highlight" />
            </div>
            <div>
              <div className="title">ponder</div>
              <div>
                <Logo src="/react-logo.svg" size="2.5ch" />
                <Logo src="/graphql-logo.svg" size="2.5ch" />
                <Logo src="/neo4j-logo.svg" size="2.5ch" />
              </div>
              <div className="description">
                A fun and simple tool for creating collaborative blogs.
              </div>
            </div>
          </Card>
        </Link>
        <Card>
          <div className="card-head">
            <img
              css={{ width: "9ch" }}
              src="/logomark.svg"
              alt="Ponder Blogs Logo"
              className="logo"
            />
          </div>{" "}
          <div className="card-body">
            <div className="title">Ponder Blogs</div>
            <div>
              <Logo src="/next-logo.svg" size="2.5ch" />
              <Logo src="/graphql-logo.svg" size="2.5ch" />
              <Logo src="/neo4j-logo.svg" size="2.5ch" />
            </div>
            <div className="description">
              A collection of creative group blogs from the Ponder community.
            </div>
          </div>
        </Card>
        <Card>
          <div className="card-head">
            <img
              css={{ width: "9ch" }}
              src="/logomark.svg"
              alt="Ponder Blogs Logo"
              className="logo"
            />
          </div>{" "}
          <div className="card-body">
            <div className="title">Ponder Blogs</div>
            <div>
              <Logo src="/next-logo.svg" size="2.5ch" />
              <Logo src="/graphql-logo.svg" size="2.5ch" />
              <Logo src="/neo4j-logo.svg" size="2.5ch" />
            </div>
            <div className="description">
              A collection of creative group blogs from the Ponder community.
            </div>
          </div>
        </Card>
      </Cluster>
      <Center intrinsic alignText gutterWidth="var(--s1)">
        <h2>Get in touch!</h2>

        <footer>
          <WithLove css={{ alignSelf: "center" }} />
        </footer>
      </Center>
    </main>
  );
}

const Card = styled.div`
  --flow: row nowrap;
  --head-width: 10em;
  --head-height: 10em;
  --body-width: 12em;
  --body-height: 10em;
  --border-top: none;
  --border-left: 2px dotted #888888;
  --container-padding: var(--s1) 0 var(--s1) 0;

  @media (min-width: 768px) {
    --flow: column;
    --body-width: 10em;
    --body-height: 12em;
    --border-left: none;
    --border-top: 2px dotted #888888;
    --container-padding: 0 var(--s1) 0 var(--s1);
  }

  display: flex;
  flex-flow: var(--flow);
  border: none;
  color: var(--colors-background);
  background-color: rgb(var(--colors-background-light-rgb));
  padding: var(--container-padding);
  border-radius: var(--s-2);
  box-shadow: inset 0 0 3px 1px var(--colors-background-secondary);

  /* head */
  & > div:first-of-type {
    position: relative;
    width: var(--head-width);
    height: var(--head-height);

    & img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 70%;
      height: 70%;
      padding: 10px;
      border-radius: 999px;
      background: var(--colors-background);
      border: 5px double rgb(var(--colors-background-light-rgb));
    }

    &::after {
      display: block;
      content: "";
      position: absolute;
      z-index: 100;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 60%;
      height: 60%;
      border-radius: 100%;
      background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 1) 0%,
        rgba(255, 255, 255, 0) 100%
      );
      opacity: 0.52;
      transition: transform 0.65s cubic-bezier(0.18, 0.9, 0.58, 1);
    }
  }

  &:hover {
    & > div:first-of-type {
      &::after {
        transform: translate(-50%, -40%);
      }
    }
    box-shadow: none;
    transform: scale(1.01);
    cursor: pointer;
  }
  transition: all 0.65s cubic-bezier(0.18, 0.9, 0.58, 1);

  /* body */
  & > div:nth-of-type(2) {
    width: var(--body-width);
    height: var(--body-height);
    border-top: var(--border-top);
    border-left: var(--border-left);
    padding: var(--s-2);
    display: flex;
    flex-flow: column;
    text-align: center;

    & > div:first-of-type {
      padding-bottom: var(--s-3);
      text-transform: lowercase;
      font-variant: small-caps;
      font-weight: bold;
      font-size: var(--font-size-big);
    }

    & > div:nth-of-type(2) {
      display: flex;
      flex-flow: row nowrap;
      width: 100%;
      justify-content: space-around;
      padding-bottom: var(--s-1);
    }
  }
`;

// const Card = styled.div`
//   --flex-direction: row;
//   --width: 300px;
//   --height: 150px;

//   @media (min-width: 768px) {
//     flex-flow: column;
//     width: 155px;
//     height: 300px;
//   }

//   display: flex;
//   flex-flow: row;
//   width: 300px;
//   height: 150px;
//   text-align: center;
//   border-radius: 10px;
//   padding: var(--s2);
//   color: var(--colors-background);
//   background-color: rgb(var(--colors-background-light-rgb));
//   box-shadow: inset 0 0 3px 1px var(--colors-background-secondary);
//   transition: all 0.1s ease-in-out;
//   &:hover {
//     box-shadow: none;
//     transform: scale(1.03);
//     cursor: pointer;
//   }

//   .card-head {
//     border: 1px solid blue;
//   }

//   img {
//     position: relative;
//     width: 80px;
//     height: 80px;
//     max-width: 100%;
//     padding: 10px;
//     border-radius: 999px;
//     margin-bottom: var(--s0);
//     background: var(--colors-background);
//     border: 5px double rgb(var(--colors-background-light-rgb));
//   }
//   .title {
//     padding-top: var(--s-1);
//     padding-bottom: var(--s-3);
//     color: blue;
//     text-transform: lowercase;
//     font-variant: small-caps;
//     font-size: var(--font-size-big);
//     border-top: 3px dotted #888888;
//   }
//   .logos {
//     padding-bottom: var(--s0);
//   }
//   .description {
//   }
// `;

// const Card = styled.div`
//   --flex-direction: row;
//   --width: 300px;
//   --height: 150px;

//   @media (min-width: 768px) {
//     flex-flow: column;
//     width: 155px;
//     height: 300px;
//   }

//   display: flex;
//   flex-flow: row;
//   width: 300px;
//   height: 150px;
//   text-align: center;
//   border-radius: 10px;
//   padding: var(--s2);
//   color: var(--colors-background);
//   background-color: rgb(var(--colors-background-light-rgb));
//   box-shadow: inset 0 0 3px 1px var(--colors-background-secondary);
//   transition: all 0.1s ease-in-out;
//   &:hover {
//     box-shadow: none;
//     transform: scale(1.03);
//     cursor: pointer;
//   }

//   .card-head {
//     border: 1px solid blue;
//   }

//   img {
//     position: relative;
//     width: 80px;
//     height: 80px;
//     max-width: 100%;
//     padding: 10px;
//     border-radius: 999px;
//     margin-bottom: var(--s0);
//     background: var(--colors-background);
//     border: 5px double rgb(var(--colors-background-light-rgb));
//   }
//   .title {
//     padding-top: var(--s-1);
//     padding-bottom: var(--s-3);
//     color: blue;
//     text-transform: lowercase;
//     font-variant: small-caps;
//     font-size: var(--font-size-big);
//     border-top: 3px dotted #888888;
//   }
//   .logos {
//     padding-bottom: var(--s0);
//   }
//   .description {
//   }
// `;
