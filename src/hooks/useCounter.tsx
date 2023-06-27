import React from 'react';
import { useToggle } from './useToggle';

export function useCounter(
  initialValue = 0,
  tick = 1000
): [number, () => void, () => void] {
  const [counter, setCounter] = React.useState(initialValue);
  const [running, toggle] = useToggle(true);
  const tickRef = React.useRef(tick);
  const reset = React.useCallback(() => setCounter(0), []);

  React.useEffect(() => {
    if (running) {
      let timer = setTimeout(() => {
        setCounter((prev) => prev + 1);
      }, tickRef.current);
      return () => clearTimeout(timer);
    }
  }, [counter, running]);

  return [counter, reset, toggle];
}
