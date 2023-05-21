import { useState } from "react";

// export function useThrottledState() {
//   /**
//    * - a query that provides the state
//    * - a function to set the state
//    * - a mutator to persist to the db
//    *
//    * If we're called back while we still have an outstanding write, ignore the callback
//    */
// }

/**
 * Convenience function for mirroring a prop into state and ensuring that the state is updated
 * when the prop changes.
 *
 * Removes all the dragons from the pattern and gives us fine grained control over updates.
 *
 * @param propValue
 * @returns
 */
export function useCachedState<T>(propValue: T): [T, (value: T) => void] {
  const [lastValue, setLastValue] = useState(propValue);
  const [currValue, setCurrValue] = useState(propValue);
  if (propValue !== lastValue) {
    setLastValue(propValue);
    setCurrValue(propValue);
  }

  return [
    currValue,
    (value: T) => {
      setCurrValue(value);
    },
  ];
}
