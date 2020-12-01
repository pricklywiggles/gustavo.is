/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import NavLink from "components/navlink";
import { Center, Box } from "components/layouts";
import { useLocalStorageState, useCounter, useToggle } from "utils/hooks";
import { WithLove } from "components/sprinkles";

export default function Header() {
  const router = useRouter();
  const [isDark, setIsDark] = useLocalStorageState("theme", true);
  const [isMenuOpen, toggleMenuOpen, setIsMenuOpen] = useToggle(false);
  const toggleTheme = () => setIsDark((prev) => !prev);

  // closes the menu when user picks a route on mobile
  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [router.pathname, setIsMenuOpen]);

  // Fixes flash bug due to css transition.
  // React.useEffect(() => {
  //   document.body.dataset.bgtransition = "loaded";
  // }, []);

  // sets css variables for a given theme.
  React.useEffect(() => {
    document.body.dataset.theme = isDark ? "dark" : "light";
  }, [isDark]);

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background">
      <div className="flex items-center">
        <img className="h-14" alt="ink blot logo" src="/worldblot.png" />
        <div className="pl-2 text-xl">gustavo.is</div>
        <div className="text-sm hidden">glad you are here.</div>
      </div>
      <div>
        <button className="focus:outline-none" type="button">
          <svg
            className="h-5 w-5 fill-current hover:text-yellow-400"
            viewBox="0 0 100 80"
          >
            <rect width="100" height="10"></rect>
            <rect y="30" width="100" height="10"></rect>
            <rect y="60" width="100" height="10"></rect>
          </svg>
        </button>
      </div>

      <button
        className="py-20 bg-background-darker"
        onClick={() => toggleTheme()}
      >
        Toggle
      </button>
    </header>
  );
}

export { Header };
