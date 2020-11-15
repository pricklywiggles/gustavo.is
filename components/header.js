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

  React.useLayoutEffect(() => {
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
            <img src="/worldblot.png" alt="ink blot" />
          </Logo>
          <Legend padding="0">
            <div className="gustavo">gustavo.is</div>
            <div className="typewritten">
              <div>{actions[actionIndex].slice(0, count)}</div>
              <div>⎽</div>
            </div>
          </Legend>
          <Nav>
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

  img {
    height: var(--logo-size);
    width: var(--logo-size);
  }

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
  font-size: var(--local-font-size);

  ${Box} {
    padding: var(--local-space);
    ${"" /* padding: var(--s0); */}
  }

  .current {
    background: var(--highlight-icon) left center no-repeat;
    background-size: 0.8em;
  }

  a {
    text-decoration: none;
    padding-left: 1em;
  }

  button {
    ::before {
      content: var(--theme-switch-icon);
    }
    width: var(--s2);
    height: var(--s2);
    align-self: bottom;
    border-radius: 25px;dd
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
