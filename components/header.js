/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import Link from "../components/link";
import { Center, Box, Stack } from "./layouts";
import { useLocalStorageState, useCounter, useToggle } from "../utils/hooks";

export default function Header() {
  const [actionIndex, setActionIndex] = React.useState(0);
  const [spin, setSpin] = React.useState(false);
  const router = useRouter();
  // This counter simulates the irregular frencuency of a human typing.
  const [count, resetCount] = useCounter(0, Math.random() * 300 + 90);
  const [isDark, setIsDark] = useLocalStorageState("theme", false);
  const [isMenuOpen, toggleMenuOpen, setIsMenuOpen] = useToggle(false);
  const toggleTheme = () => setIsDark((prev) => !prev);

  // closes the menu when user picks a route on mobile
  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [router.pathname, setIsMenuOpen]);

  React.useEffect(() => {
    document.body.dataset.theme = isDark ? "dark" : "light";
  }, [isDark]);

  // cycle through sentences for header.
  React.useEffect(() => {
    if (count > actions[actionIndex].length) {
      resetCount();
      setActionIndex((prev) => (prev === actions.length - 1 ? 0 : prev + 1));
    }
  }, [count, resetCount, actionIndex]);

  return (
    <div>
      <HeaderContainer>
        <Center maxWidth="1100px">
          <HeaderBar>
            <Logo
              spin={spin}
              aria-pressed={spin}
              onClick={() => setSpin(!spin)}
            >
              <img src="/worldblot.png" alt="ink blot" />
            </Logo>
            <Legend padding="0">
              <div className="gustavo">gustavo.is</div>
              <div className="typewritten">
                <div>{actions[actionIndex].slice(0, count)}</div>
                <div>⎽</div>
              </div>
            </Legend>
            <Nav isMenuOpen={isMenuOpen} className="hidden">
              <Box>
                <Link href="/">
                  <a>Portfolio</a>
                </Link>
              </Box>
              <Box>
                <Link href="/fonts">
                  <a>Blog</a>
                </Link>
              </Box>
              <Box>
                <a>About</a>
              </Box>
              <Box>
                <IconButton aria-pressed={isDark} onClick={toggleTheme} />
              </Box>
              <Box>
                <div>Made with </div>
                <span role="img" aria-label="love">
                  🤎
                </span>
                <div>in Los Angeles</div>
              </Box>
              <Box padding="var(--s3)"></Box>
            </Nav>
          </HeaderBar>
        </Center>
      </HeaderContainer>

      <MenuButton onClick={toggleMenuOpen}>
        <Box padding="var(--s0)">
          <Hamburger isMenuOpen={isMenuOpen}>
            {isMenuOpen ? (
              "❌"
            ) : (
              <svg
                css={{ fill: "var(--colors-primary)" }}
                viewBox="0 0 100 80"
                width="40"
                height="40"
              >
                <rect width="100" height="10"></rect>
                <rect y="30" width="100" height="10"></rect>
                <rect y="60" width="100" height="10"></rect>
              </svg>
            )}
          </Hamburger>
        </Box>
      </MenuButton>
    </div>
  );
}
//
export { Header };

// Creates the container fixed to the top of the screen with the fade image
const HeaderContainer = styled.div`
  --border-debug: none;

  @media (min-width: 768px) {
    position: fixed;
    top: 0;
    width: 100vw;

    * {
      z-index: 3;
    }

    /* In order to transition the gradients nicely when the theme changes we must do 
       a little dance. We transition the opacity between two overlapping 
       pseudos (light underneath, dark on top) and control the transition via an 
       opacity css var. */
    &::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1;
      background: linear-gradient(
        to bottom,
        rgb(var(--colors-background-light-rgb)),
        rgb(var(--colors-background-light-rgb)),
        rgb(var(--colors-background-light-rgb)),
        rgba(var(--colors-background-light-rgb), 0)
      );
      transition: opacity 0.5s;
      opacity: var(--light-header-opacity);
    }

    &::before {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 2;

      background: linear-gradient(
        to bottom,
        rgb(var(--colors-background-dark-rgb)),
        rgb(var(--colors-background-dark-rgb)),
        rgb(var(--colors-background-dark-rgb)),
        rgba(var(--colors-background-dark-rgb), 0)
      );
      transition: opacity 0.5s;
      opacity: calc(1 - var(--light-header-opacity));
    }
  }
`;

// Grid container for three header sections: image, legend and nav
const HeaderBar = styled.div`
  display: grid;
  grid-template-columns: auto 1fr 1fr;
  align-items: center;

  --local-font-size: var(--font-size-smallish);
  --local-space: var(--s-3);

  @media (min-width: 768px) {
    --local-font-size: var(--font-size-base);
    --local-space: var(--s0);
  }

  border: var(--border-debug);

  ${Box} {
    border: var(--border-debug);
  }
`;

const Logo = styled.button`
  border: var(--border-debug);
  padding: var(--s1) var(--s-1) var(--s1) var(--s1);
  background-color: transparent;

  --logo-size: var(--s2);
  @media (min-width: 768px) {
    --logo-size: var(--s3);
  }

  & img {
    height: var(--logo-size);
    width: var(--logo-size);
  }

  ${(props) =>
    props.spin
      ? `
    & img { 
      animation: spin 200s linear infinite;
    }`
      : ""};
`;

// flexbox container for the site name and typewritten message
const Legend = styled(Box)`
  border: var(--border-debug);
  display: flex;
  flex-flow: row nowrap;

  .gustavo {
    font-size: calc(var(--local-font-size) * var(--ratio));
    font-weight: 400;
  }

  /* typewritten message + cursor container*/
  .typewritten {
    display: none;

    @media (min-width: 768px) {
      display: flex;
    }
    letter-spacing: normal;
    font-family: "Indie Flower", sans-serif;
    font-size: var(--local-font-size);
    font-weight: 400;
    color: var(--colors-fun);
    padding-left: var(--s-2);

    text-decoration: underline dotted;

    & > div {
      padding-top: 0.6em;
    }
    /* blinking cursor at the end of the sentence */
    & > div:last-of-type {
      animation: blinker 1s linear infinite;
      margin-left: -0.5em;
    }
  }
`;

const Nav = styled.nav`
  display: flex;
  transition: 0.3s cubic-bezier(0.77, 0, 0.175, 1);
  @media (max-width: 767px) {
    ${(props) => (props.isMenuOpen ? "left: 0;" : "left: 100vw;")}
    position: fixed;
    right: 0;
    background-color: rgba(var(--colors-background-rgb), 0.5);
    backdrop-filter: blur(20px);
    flex-flow: column;

    height: 100vh;
    width: 100vw;

    & > :first-of-type {
      padding-top: var(--s2);
    }

    & > * {
      margin-top: 0;
      margin-bottom: 0;
      background-color: transparent;
    }

    & > * + * {
      margin-top: var(--s-4);
    }

    &:only-child {
      height: 100%;
    }

    & > :nth-child(3) {
      margin-bottom: auto;
    }

    & > :nth-last-child(2) {
      font-size: var(--font-size-smallish);
      align-self: center;
      display: float;
      div {
        padding-left: 1.8em;
        padding-right: 0.5em;
      }
      span {
        position: absolute;
        padding-right: 1em;
        animation: font-bounce-small 1s 0s cubic-bezier(0.18, 1.06, 0.6, 0.95)
          infinite;
      }
    }
  }

  @media (min-width: 768px) {
    justify-self: right;
    align-items: center;
    flex-flow: row nowrap;

    & > ${Box} {
      padding: var(--local-space);
    }

    & > :nth-last-of-type(2) {
      display: none;
    }
  }

  font-weight: 600;
  font-size: var(--font-size-base);

  .current {
    background: var(--highlight-icon) left center no-repeat;
    background-size: 0.8em;
  }

  a {
    text-decoration: none;
    padding-left: 1em;
  }
`;

const IconButton = styled.button`
  &::before {
    content: var(--theme-switch-icon);
  }
  width: var(--s2);
  height: var(--s2);
  align-self: bottom;
  border-radius: 25px;
  color: white;
  border: 1px dotted var(--colors-background);
  background-color: var(--colors-secondary);
  &:hover {
    border: 1px dotted gray;
  }
  &:active {
    animation: font-bounce 0.5s 0s cubic-bezier(0.18, 1.06, 0.6, 0.95) none; /*cubic-bezier(0.47, 0, 0.745, 0.715)*/
  }
`;

const MenuButton = styled.button`
  @media (min-width: 768px) {
    display: none;
  }
  position: fixed;
  top: 0;
  right: 0;
  background-color: transparent;
  border: 0px;
`;

const Hamburger = styled.div`
  width: var(--s3);
  height: var(--s3);
  color: white;

  ${(props) =>
    !props.isMenuOpen
      ? `
  border-radius: 999px;
  background-color: rgba(var(--colors-background-rgb),0.8);
  `
      : ``}

  padding-top: var(--s-1);
  font-size: var(--font-size-big);
`;

const actions = [
  "ready for new ideas...      ",
  "glad you are here...      ",
  "coding...      ",
  "typing furiously...      ",
  "a big fan of React...      ",
  "working on something...      ",
  "from Guadalajara...      ",
  "drinking tea...      ",
  "in Los Angeles...      "
];
