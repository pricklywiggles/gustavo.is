import React from "react";
import styled from "@emotion/styled";
import Link from "../components/link";
import { isSafari } from "react-device-detect";
import { Center, Box } from "./layouts";
import { useLocalStorageState, useCounter } from "../utils/hooks";

export default function Header() {
  const [actionIndex, setActionIndex] = React.useState(0);
  const [addTransition, setAddTransition] = React.useState(true);
  const [spin, setSpin] = React.useState(false);
  // This counter simulates the irregular frencuency of a human typing.
  const [count, resetCount] = useCounter(0, Math.random() * 300 + 90);
  const [isDark, setIsDark] = useLocalStorageState("theme", false);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // The css needed for fading the header background image needs help singling out
  // only safari browsers, we will use addTransition as an argument to a styled component.
  React.useEffect(() => {
    if (isSafari) setAddTransition(false);
  }, [addTransition]);

  React.useEffect(() => {
    document.body.dataset.theme = isDark ? "dark" : "light";
  }, [isDark]);

  React.useEffect(() => {
    if (count > actions[actionIndex].length) {
      resetCount();
      setActionIndex((prev) => (prev === actions.length - 1 ? 0 : prev + 1));
    }
  }, [count, resetCount, actionIndex]);

  return (
    <HeaderContainer addTransition={addTransition}>
      <Center maxWidth="1100px">
        <HeaderBar>
          <Logo spin={spin} aria-pressed={spin} onClick={() => setSpin(!spin)}>
            <img src="/worldblot.png" alt="ink blot" width={60} height={60} />
          </Logo>
          <Legend padding="0">
            <div className="gustavo">gustavo.is</div>
            <div className="typewritten">
              <div>{actions[actionIndex].slice(0, count)}</div>
              <div>⎽</div>
            </div>
          </Legend>
          <Nav>
            <Box padding="var(--s0)">
              <Link href="/">
                <a>Portfolio</a>
              </Link>
            </Box>
            <Box padding="var(--s0)">
              <Link href="/fonts">
                <a>Blog</a>
              </Link>
            </Box>
            <Box padding="var(--s0)">
              <a>About</a>
            </Box>
            <Box padding="var(--s0)">
              <button aria-pressed={isDark} onClick={toggleTheme}>
                {/* <span role="img" aria-label="color theme icon">
                  {isDark ? "☀️" : "🌜"}
                </span> */}
              </button>
            </Box>
          </Nav>
        </HeaderBar>
      </Center>
    </HeaderContainer>
  );
}
//
export { Header };

// Creates the container fixed to the top of the screen with the fade image
const HeaderContainer = styled.div`
  --border-debug: none;

  position: fixed;
  top: 0;
  width: 100vw;

  * {
    z-index: 3;
  }

  ::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    background: linear-gradient(
      to bottom,
      white,
      white,
      white,
      rgba(255, 255, 255, 0)
    );
    transition: opacity 0.5s;
    opacity: var(--light-header-opacity);
  }

  ::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2;

    background: linear-gradient(
      to bottom,
      rgba(26, 26, 46),
      rgba(26, 26, 46),
      rgba(26, 26, 46),
      rgba(26, 26, 46, 0)
    );
    transition: opacity 0.5s;
    opacity: calc(1 - var(--light-header-opacity));
  }
`;

// Grid container for three header sections: image, legend and nav
const HeaderBar = styled.div`
  display: grid;
  grid-template-columns: auto 1fr 1fr;
  align-items: center;

  border: var(--border-debug);

  ${Box} {
    border: var(--border-debug);
  }
`;

const Logo = styled.button`
  border: none;
  padding: var(--s1) var(--s-1) var(--s1) var(--s1);
  background-color: transparent;
  border: var(--border-debug);
  ${(props) =>
    props.spin
      ? `
    img { 
      animation: spin 200s linear infinite;
    }`
      : ""};
`;

// flexbox container for the site name and typewritten message
const Legend = styled(Box)`
  display: flex;
  flex-flow: row nowrap;
  flex-basis: 1;
  border: var(--border-debug);

  .gustavo {
    font-size: var(--font-size-biggish);
    font-weight: 400;
  }

  /* typewritten message + cursor container*/
  .typewritten {
    display: flex;
    letter-spacing: normal;
    font-family: "Indie Flower", sans-serif;
    font-size: var(--font-size-base);
    font-weight: 400;
    color: var(--colors-fun);
    padding-left: var(--s-2);

    text-decoration: underline dotted;

    div {
      padding-top: 0.6em;
    }
    /* blinking cursor at the end of the sentence */
    div:last-of-type {
      animation: blinker 1s linear infinite;
      margin-left: -0.5em;
    }
  }
`;

const Nav = styled.nav`
  justify-self: right;
  align-items: center;
  font-weight: 600;
  display: flex;
  flex-flow: row nowrap;

  .current {
    background: url("/stars2.png") left center no-repeat;
    background-size: 1em;
  }

  a {
    text-decoration: none;
    padding-left: 1em;
  }

  button {
    ::before {
      content: var(--theme-switch-icon);
    }
    font-size: var(--font-size-base);
    width: var(--s2);
    height: var(--s2);
    align-self: bottom;
    border-radius: 25px;
    color: white;
    border: 1px dotted var(--colors-background);
    background-color: var(--colors-secondary);
    :hover {
      border: 1px dotted gray;
    }
    :active {
      animation: font-bounce 0.5s 0s cubic-bezier(0.18, 1.06, 0.6, 0.95) none; /*cubic-bezier(0.47, 0, 0.745, 0.715)*/
    }
  }
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
