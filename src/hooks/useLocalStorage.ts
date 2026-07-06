import { useEffect, useState, useCallback } from 'react';

/** A tiny typed localStorage hook that survives JSON errors and SSR. */
export function useLocalStorage<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return initial;
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* storage full or unavailable — ignore */
    }
  }, [key, state]);

  const set = useCallback((v: T | ((prev: T) => T)) => {
    setState((prev) => (typeof v === 'function' ? (v as (p: T) => T)(prev) : v));
  }, []);

  return [state, set];
}
