import { useEffect, useState, useCallback } from 'react';

function mergeWithDefaults<T extends object>(value: unknown, initial: T): T {
  if (value == null || typeof value !== 'object' || Array.isArray(value)) return initial;
  return { ...initial, ...(value as Partial<T>) };
}

/** A tiny typed localStorage hook that survives JSON errors and SSR. */
export function useLocalStorage<T extends object>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return initial;
      return mergeWithDefaults(JSON.parse(raw), initial);
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
