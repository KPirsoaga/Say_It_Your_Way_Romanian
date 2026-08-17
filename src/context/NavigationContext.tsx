import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { PageId } from '../App';

export interface NavFrame {
  page: PageId;
  arg?: string;
  scrollY?: number;
}

export interface DictionaryNavState {
  query: string;
  filter: string;
  scrollY: number;
}

export interface GrammarNavState {
  verbId?: string;
  tense?: string;
}

interface NavigationContextValue {
  go: (page: PageId, arg?: string, options?: { replace?: boolean }) => void;
  back: () => void;
  canGoBack: boolean;
  current: NavFrame;
  dictionaryState: DictionaryNavState;
  setDictionaryState: (patch: Partial<DictionaryNavState>) => void;
  grammarState: GrammarNavState;
  setGrammarState: (patch: Partial<GrammarNavState>) => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

const DEFAULT_DICT: DictionaryNavState = { query: '', filter: 'all', scrollY: 0 };
const DEFAULT_GRAMMAR: GrammarNavState = {};

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<NavFrame[]>([{ page: 'home' }]);
  const [dictionaryState, setDictionaryStateInternal] = useState<DictionaryNavState>(() => {
    try {
      const raw = sessionStorage.getItem('rcd-nav-dictionary');
      return raw ? { ...DEFAULT_DICT, ...JSON.parse(raw) } : DEFAULT_DICT;
    } catch {
      return DEFAULT_DICT;
    }
  });
  const [grammarState, setGrammarStateInternal] = useState<GrammarNavState>(() => {
    try {
      const raw = sessionStorage.getItem('rcd-nav-grammar');
      return raw ? JSON.parse(raw) : DEFAULT_GRAMMAR;
    } catch {
      return DEFAULT_GRAMMAR;
    }
  });
  const scrollRestoreRef = useRef(0);
  const skipPushRef = useRef(false);

  const current = stack[stack.length - 1] ?? { page: 'home' as PageId };

  useEffect(() => {
    sessionStorage.setItem('rcd-nav-dictionary', JSON.stringify(dictionaryState));
  }, [dictionaryState]);

  useEffect(() => {
    sessionStorage.setItem('rcd-nav-grammar', JSON.stringify(grammarState));
  }, [grammarState]);

  const setDictionaryState = useCallback((patch: Partial<DictionaryNavState>) => {
    setDictionaryStateInternal((prev) => ({ ...prev, ...patch }));
  }, []);

  const setGrammarState = useCallback((patch: Partial<GrammarNavState>) => {
    setGrammarStateInternal((prev) => ({ ...prev, ...patch }));
  }, []);

  const go = useCallback((page: PageId, arg?: string, options?: { replace?: boolean }) => {
    const scrollY = window.scrollY;
    setStack((prev) => {
      const top = prev[prev.length - 1];
      const withScroll = top ? [...prev.slice(0, -1), { ...top, scrollY }] : prev;
      const next: NavFrame = { page, arg };
      if (options?.replace && withScroll.length > 0) {
        return [...withScroll.slice(0, -1), next];
      }
      if (top && top.page === page && top.arg === arg) return withScroll;
      return [...withScroll, next];
    });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const back = useCallback(() => {
    setStack((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.slice(0, -1);
      const target = next[next.length - 1];
      scrollRestoreRef.current = target?.scrollY ?? 0;
      skipPushRef.current = true;
      return next;
    });
  }, []);

  useEffect(() => {
    const y = scrollRestoreRef.current;
    if (y > 0) {
      requestAnimationFrame(() => window.scrollTo({ top: y, behavior: 'auto' }));
      scrollRestoreRef.current = 0;
    }
  }, [current.page, current.arg]);

  useEffect(() => {
    if (skipPushRef.current) {
      skipPushRef.current = false;
      return;
    }
    window.history.pushState({ nav: true }, '');
  }, [stack]);

  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      e.preventDefault();
      back();
    };
    window.addEventListener('popstate', onPop);
    window.history.replaceState({ nav: true }, '');
    return () => window.removeEventListener('popstate', onPop);
  }, [back]);

  const value = useMemo(
    () => ({
      go,
      back,
      canGoBack: stack.length > 1,
      current,
      dictionaryState,
      setDictionaryState,
      grammarState,
      setGrammarState,
    }),
    [go, back, stack.length, current, dictionaryState, setDictionaryState, grammarState, setGrammarState]
  );

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider');
  return ctx;
}

export function useSafeBack(fallback: () => void) {
  const { back, canGoBack } = useNavigation();
  return useCallback(() => {
    if (canGoBack) back();
    else fallback();
  }, [back, canGoBack, fallback]);
}
