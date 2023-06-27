import { random } from '@/utils/utils';
import * as React from 'react';

export const useRandomInterval = (
  callback: Function,
  minDelay: number,
  maxDelay: number
) => {
  const timeoutId = React.useRef<number | null>(null);
  const savedCallback = React.useRef(callback);
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  React.useEffect(() => {
    let isEnabled =
      typeof minDelay === 'number' && typeof maxDelay === 'number';
    if (isEnabled) {
      const handleTick = () => {
        const nextTickAt = random(minDelay, maxDelay);
        timeoutId.current = window.setTimeout(() => {
          savedCallback.current();
          handleTick();
        }, nextTickAt);
      };
      handleTick();
    }
    return () => {
      if (timeoutId.current) window.clearTimeout(timeoutId.current);
    };
  }, [minDelay, maxDelay]);
  const cancel = React.useCallback(function () {
    if (timeoutId.current) window.clearTimeout(timeoutId.current);
  }, []);
  return cancel;
};
