/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useRouter } from "next/router";
import NavLink from "components/navlink";
import { useLocalStorageState, useCounter, useToggle } from "utils/hooks";
import { BeatingHeart } from "components/sprinkles";
import { LogoLink } from "./contact";
import { accounts } from "utils/data";

const actions = [
  "ready for new ideas.",
  "glad you are here.",
  "coding.",
  "typing furiously.",
  "a big fan of React.",
  "working on something.",
  "from Guadalajara.",
  "drinking tea.",
  "in Los Angeles."
];

export default function Header() {
  const router = useRouter();
  const [isDark, setIsDark] = useLocalStorageState("theme", true);
  const [isMenuOpen, toggleMenuOpen, setIsMenuOpen] = useToggle(false);
  const [count, resetCount, toggleCounter] = useCounter(0, 10000);
  const [currentAction, setCurrentAction] = React.useState(actions[0]);
  const toggleTheme = () => setIsDark((prev) => !prev);

  // closes the menu when user picks a route on mobile
  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [router.pathname, setIsMenuOpen]);

  // cycle through sentences for header.
  React.useEffect(() => {
    if (count === actions.length) {
      resetCount();
    } else {
      setCurrentAction(actions[count]);
    }
  }, [count, resetCount]);

  // Fixes flash bug due to css transition.
  React.useEffect(() => {
    document.body.dataset.bgtransition = "loaded";
  }, []);

  // sets css variables for a given theme.
  React.useEffect(() => {
    let root = document.documentElement;
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDark]);

  return (
    <header>
      <div>
        <div className="relative z-20 sm:fixed w-screen">
          <div className="absolute inset-0 dark-gradient opacity-0 dark:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute inset-0 light-gradient dark:opacity-0 transition-opacity duration-500"></div>
          <div className="relative mx-auto sm:flex sm:justify-between sm:items-center max-w-screen-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  className="h-14 rounded-full shadow-xl"
                  alt="ink blot logo"
                  src="/worldblot.png"
                />
                <div className="flex items-baseline">
                  <div className="pl-3 font-quirky text-2xl">gustavo.is</div>
                  <button
                    key={currentAction}
                    onClick={toggleCounter}
                    className="hidden whitespace-nowrap overflow-hidden border-black animate-typewrite sm:block pl-1 text-xs tracking-tighter font-mono text-accentlight dark:text-accentdark "
                  >
                    {currentAction}
                  </button>
                </div>
              </div>
              <div className="fixed top-0 right-0 z-10 sm:hidden m-6">
                <button
                  className="block bg-lt-bg-8 dark:bg-dk-bg-8 rounded-full dark:focus:text-dk-primary dark:hover:text-dk-primary focus:outline-none"
                  onClick={toggleMenuOpen}
                  type="button"
                >
                  <div className="flex h-10 w-10">
                    <svg
                      className="m-auto w-100 h-6"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {isMenuOpen ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      )}
                    </svg>
                  </div>
                </button>
              </div>
            </div>
            <div
              className={`${
                isMenuOpen ? "" : "left-full"
              } fixed sm:static flex flex-col sm:flex-row sm:items-center w-screen sm:w-auto inset-0 text-2xl text-dk-bg dark:text-lt-bg-200 sm:text-lg bg-blur-50 sm:bg-blur-0  bg-opacity-40 p-6 sm:p-0 transition-all duration-500 boing`}
            >
              <NavLink href="/" passHref>
                <a className="box marker font-semibold hover:cursor-pointer  sm:mt-0 sm:pl-4">
                  Portfolio
                </a>
              </NavLink>
              <NavLink href="/resume" passHref>
                <a className="box font-semibold hover:cursor-pointer hover:text-lt-primary sm:mt-0 sm:pl-4">
                  Resume
                </a>
              </NavLink>
              <LogoLink
                className="text-dk-bg mt-auto sm:mt-0 ml-1 sm:ml-0 mb-4 sm:mb-0 transform scale-50"
                {...accounts.github}
              />
              <button
                onClick={() => toggleTheme()}
                className="ml-3 mb-10 sm:mb-0 h-8 w-8 border  border-transparent shadow-sm text-md sm:text-sm active:animate-font-bounce rounded-full hover:ring-1 hover:ring-offset-2 hover:ring-accentlight dark:hover:ring-accentdark hover:border-dotted focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-accentlight dark:focus:ring-accentdark"
                type="button"
              >
                <div className="">{isDark ? "☀️" : "🌓"}</div>
              </button>
              {isMenuOpen ? (
                <div className="block sm:hidden text-base self-center">
                  Made with
                  <BeatingHeart />
                  in Los Angeles
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="sm:py-8"></div>
    </header>
  );
}

export { Header };
