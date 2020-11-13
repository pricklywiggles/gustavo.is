import React from "react";
import styled from "@emotion/styled";
import Link from "next/link";
import { isSafari } from "react-device-detect";
import { useLocalStorageState, useCounter } from "../utils/hooks";

export default function Header() {
  const [actionIndex, setActionIndex] = React.useState(0);
  const [addTransition, setAddTransition] = React.useState(true);
  const [count, resetCount] = useCounter(0, Math.random() * 300 + 90);
  const [isDark, setIsDark] = useLocalStorageState("theme", false);

  console.log(isSafari);

  React.useEffect(() => {
    if (isSafari) setAddTransition(false);
  }, [addTransition]);

  const toggleTheme = () => setIsDark((prev) => !prev);

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
    <HeaderContainer>
      <HeaderBar addTransition={addTransition}>
        <img src="/worldblot.png" alt="ink blot" width={60} height={60} />
        <div className="callout">
          <div>gustavo.is</div>
          <div className="typewrite">
            <div>{actions[actionIndex].slice(0, count)}</div>
            <div>⎽</div>
          </div>
        </div>
        <nav>
          <div>
            <Link href="/">Portfolio</Link>
          </div>
          <div>
            <Link href="/test">Blog</Link>
          </div>
          <div>About</div>
          <button aria-pressed={isDark} onClick={toggleTheme}>
            <span role="img" aria-label="color theme icon">
              {isDark ? "☀️" : "🌜"}
            </span>
          </button>
        </nav>
      </HeaderBar>
    </HeaderContainer>
  );
}
//
export { Header };

const HeaderContainer = styled.div`
  position: fixed;
  top: 0;
  width: 100vw;
`;

const HeaderBar = styled.div`
  display: grid;
  grid-template-columns: auto 1fr 1fr;
  align-items: center;
  background: var(--navfade) bottom center no-repeat;
  background-size: 100% 100%;
  padding: var(--s1);
  max-width: 1200px;
  ${(props) => (props.addTransition ? "transition: background 0.5s;" : "")}
  img {
    margin-right: var(--s1);
  }

  nav {
    display: flex;
    align-items: center;
    justify-self: right;

    div {
      padding: 0 var(--s1);
      font-size: var(--font-size-base);
    }
    button {
      font-size: var(--font-size-base);
      width: var(--s2);
      height: var(--s2);
      border-radius: 999px;
      color: white;
      border: 1px dotted var(--colors-background);
      background-color: var(--colors-secondary);
      :hover {
        border: 1px dotted gray;
      }
    }
    
  }
  div.callout {
    display: flex;
    flex-flow: row nowrap;
    align-items: baseline;
    font-family: "Wotfard";
    font-weight: 400;
    font-size: var(--font-size-biggish);
  }
  div.typewrite {
    display: float;
    letter-spacing: normal;
    font-family: "Indie Flower", sans-serif;
    font-size: var(--font-size-base);
    font-weight: 400;
    color: var(--colors-fun);
    margin-left: var(--s-2);
    text-decoration: underline dashed;
    @keyframes blinker {
      50% {
        opacity: 0;
      }
    }
    div:last-of-type {
      animation: blinker 1s linear infinite;
      margin-left: -0.5em;
      margin-top: 0.1em;
    }
`;

const actions = [
  "ready for something new...      ",
  "glad you are here...      ",
  "coding...      ",
  "typing furiously...      ",
  "a big fan of React...      ",
  "working on something...      ",
  "from Guadalajara...      ",
  "drinking tea...      ",
  "in Los Angeles...      "
];
