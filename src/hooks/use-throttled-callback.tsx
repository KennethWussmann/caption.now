import { useCallback, useEffect, useMemo, useRef } from 'react';

/** Configuration options for controlling the behavior of the throttled function. */
type ThrottleOptions = {
  /**
   * Determines whether the function should be invoked on the leading edge of the interval.
   * @default true
   */
  leading?: boolean;
  /**
   * Determines whether the function should be invoked on the trailing edge of the interval.
   * @default false
   */
  trailing?: boolean;
};

/** Functions to manage a throttled callback. */
type ControlFunctions = {
  /** Cancels pending function invocations. */
  cancel: () => void;
  /**
   * Checks if there are any pending function invocations.
   * @returns `true` if there are pending invocations, otherwise `false`.
   */
  isPending: () => boolean;
};

/**
 * Represents the state and control functions of a throttled callback.
 * Subsequent calls to the throttled function return the result of the last invocation.
 * Note: If there are no previous invocations, the result will be undefined.
 * Ensure proper handling in your code.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ThrottledState<T extends (...args: any) => ReturnType<T>> = ((
  ...args: Parameters<T>
) => ReturnType<T> | undefined) &
  ControlFunctions;

/**
 * Custom hook that creates a throttled version of a callback function.
 * @template T - Type of the original callback function.
 * @param {T} func - The callback function to be throttled.
 * @param {number} interval - The interval in milliseconds to throttle the callback.
 * @param {ThrottleOptions} [options] - Options to control the behavior of the throttled function.
 * @returns {ThrottledState<T>} A throttled version of the original callback along with control functions.
 */
export function useThrottledCallback<T extends (...args: any) => ReturnType<T>>(
  func: T,
  interval = 500,
  options: ThrottleOptions = { leading: true, trailing: false }
): ThrottledState<T> {
  const lastCallTime = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingArgs = useRef<Parameters<T> | null>(null);

  const throttled = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (lastCallTime.current === null && options.leading) {
        // Invoke immediately on the leading edge
        lastCallTime.current = now;
        func(...args);
      } else {
        pendingArgs.current = args;

        if (!timeoutRef.current) {
          timeoutRef.current = setTimeout(() => {
            const shouldInvoke =
              options.trailing && pendingArgs.current && now - lastCallTime.current! >= interval;

            if (shouldInvoke && pendingArgs.current) {
              func(...pendingArgs.current);
              lastCallTime.current = Date.now();
            }

            timeoutRef.current = null;
          }, interval);
        }
      }
    },
    [func, interval, options.leading, options.trailing]
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    pendingArgs.current = null;
  }, []);

  const isPending = useCallback(() => !!timeoutRef.current, []);

  // Clean up on unmount
  useEffect(() => cancel, [cancel]);

  const wrappedFunc: ThrottledState<T> = useMemo(() => {
    const throttledFunction: ThrottledState<T> = (...args: Parameters<T>) => throttled(...args);

    throttledFunction.cancel = cancel;
    throttledFunction.isPending = isPending;

    return throttledFunction;
  }, [throttled, cancel, isPending]);

  return wrappedFunc;
}
