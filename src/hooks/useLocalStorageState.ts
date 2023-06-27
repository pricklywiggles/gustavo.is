import * as React from 'react';

// Here's where we can change storage place and where we deal with SSR
const store = {
  getItem: (key: string) => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem(key);
    }
    console.error('Attempted to get localStorage while on server');
    return null;
  },
  setItem: (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      return window.localStorage.setItem(key, value);
    }
    console.error('Attempted to set localStorage while on server');
    return null;
  }
};

type UseLocalStorageStateProps<T> = {
  key: string;
  defaultValue: T | (() => T);
  serialize?: (input: T) => string;
  deserialize?: (input: string) => T;
};

/**
 * useState-like API for localStorage values
 *
 * @param {String} key The key to set in localStorage for this value
 * @param {Object} defaultValue The value to use if it is not already in localStorage
 * @param {{serialize: Function, deserialize: Function}} options The serialize and deserialize functions to use (defaults to JSON.stringify and JSON.parse respectively)
 */
export function useLocalStorageState<T>(
  key: string,
  defaultValue: T | (() => T),
  serialize: (input: T) => string = JSON.stringify,
  deserialize: (input: string) => T = JSON.parse
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = React.useState(() => {
    // During SSR, we keep the default value
    const value = store.getItem(key);
    if (value) {
      return deserialize(value);
    }
    return defaultValue instanceof Function ? defaultValue() : defaultValue;
  });

  React.useDebugValue(`${key}: ${serialize(state)}`);

  React.useEffect(() => {
    store.setItem(key, serialize(state));
  }, [key, serialize, state]);

  return [state, setState];
}
