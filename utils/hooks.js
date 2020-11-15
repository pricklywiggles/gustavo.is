import React from "react";

// Here's where we can change storage place and where we deal with SSR
const store = {
  getItem: (key) => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem(key);
    }
    console.error("Attempted to get localStorage while on server");
    return null;
  },
  setItem: (key, value) => {
    if (typeof window !== "undefined") {
      return window.localStorage.setItem(key, value);
    }
    console.error("Attempted to set localStorage while on server");
    return null;
  }
};

/**
 * useState-like API for localStorage values
 *
 * @param {String} key The key to set in localStorage for this value
 * @param {Object} defaultValue The value to use if it is not already in localStorage
 * @param {{serialize: Function, deserialize: Function}} options The serialize and deserialize functions to use (defaults to JSON.stringify and JSON.parse respectively)
 */
export function useLocalStorageState(
  key,
  defaultValue = "",
  { serialize = JSON.stringify, deserialize = JSON.parse } = {}
) {
  const [state, setState] = React.useState(() => {
    // During SSR, we keep the default value
    const value = store.getItem(key);
    if (value) {
      return deserialize(value);
    }
    return typeof defaultValue === "function" ? defaultValue() : defaultValue;
  });

  React.useDebugValue(`${key}: ${serialize(state)}`);

  React.useEffect(() => {
    store.setItem(key, serialize(state));
  }, [key, serialize, state]);

  return [state, setState];
}

export function useCounter(initialValue = 0, tick = 1000) {
  const [counter, setCounter] = React.useState(initialValue);
  const tickRef = React.useRef(tick);
  const reset = React.useCallback(() => setCounter(0), []);

  React.useEffect(() => {
    let timer = setTimeout(() => {
      setCounter((prev) => prev + 1);
    }, tickRef.current);
    return () => clearTimeout(timer);
  }, [counter]);

  return [counter, reset];
}

export function useWindowWidth() {
  const [width, setWidth] = React.useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 800
  );

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        console.log("width resized to", window.innerWidth);
        setWidth(window.innerWidth);
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return width;
}
