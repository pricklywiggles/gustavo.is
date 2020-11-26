import {
  Stack,
  Center,
  Box,
  Switcher,
  Sidebar,
  Cover,
  Cluster,
  Frame,
  Imposter,
  Grid,
  Reel
} from "components/layouts";
import { Logo } from "components/logo";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

// eslint-disable-next-line react/display-name
export default function Home() {
  return (
    <div>
      <Center maxWidth="100vw" alignText>
        <h2>Examples of my work</h2>
      </Center>
      <Cluster justify="center" space="4em" css={{ overflow: "visible" }}>
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
    </div>
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
  border: 1px solid white;
  color: var(--colors-background);
  background-color: rgb(var(--colors-background-light-rgb));
  padding: var(--container-padding);

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
    &:hover {
      &::after {
        transform: translate(-50%, -45%);
      }
    }
  }

  &:hover {
    & > div:first-of-type {
      &::after {
        transform: translate(-50%, -40%);
      }
    }
  }

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

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  & > * {
    width: 100vw;
    margin: auto;
    border: 1px solid darkblue;
  }

  ${Box} {
    border: 0.5px solid red;
    border-radius: 20px;
  }

  ${Stack} {
    border: 1px dashed gray;
    & > * {
      border: 1px dotted yellow;
    }
  }
`;
