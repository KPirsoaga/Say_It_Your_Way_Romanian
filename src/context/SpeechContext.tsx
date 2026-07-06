import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

interface SpeakOptions {
  /** rate 0.1–10, default 1 */
  rate?: number;
}

interface SpeechCtx {
  supported: boolean;
  speaking: boolean;
  currentId: string | null;
  speak: (text: string, id?: string, opts?: SpeakOptions) => void;
  speakSlow: (text: string, id?: string) => void;
  stop: () => void;
}

const Ctx = createContext<SpeechCtx | null>(null);

/**
 * Shared Web Speech API state so play buttons stay in sync across the app.
 * Falls back gracefully when speech synthesis is not supported.
 */
export function SpeechProvider({ children }: { children: ReactNode }) {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [speaking, setSpeaking] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (!supported) return;
    const load = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    load();
    window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load);
  }, [supported]);

  const pickRomanianVoice = useCallback((): SpeechSynthesisVoice | undefined => {
    const voices = voicesRef.current.length ? voicesRef.current : window.speechSynthesis?.getVoices() ?? [];
    return (
      voices.find((v) => v.lang.toLowerCase().startsWith('ro')) ||
      voices.find((v) => v.lang.toLowerCase().includes('ro-')) ||
      undefined
    );
  }, []);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setCurrentId(null);
  }, [supported]);

  const speak = useCallback(
    (text: string, id?: string, opts: SpeakOptions = {}) => {
      if (!supported) return;
      window.speechSynthesis.cancel();
      setSpeaking(false);
      setCurrentId(null);

      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ro-RO';
      const v = pickRomanianVoice();
      if (v) u.voice = v;
      u.rate = opts.rate ?? 1;
      u.onstart = () => {
        setSpeaking(true);
        setCurrentId(id ?? null);
      };
      u.onend = () => {
        setSpeaking(false);
        setCurrentId(null);
      };
      u.onerror = () => {
        setSpeaking(false);
        setCurrentId(null);
      };
      window.speechSynthesis.speak(u);
    },
    [supported, pickRomanianVoice]
  );

  const speakSlow = useCallback((text: string, id?: string) => speak(text, id, { rate: 0.6 }), [speak]);

  return (
    <Ctx.Provider value={{ supported, speaking, currentId, speak, speakSlow, stop }}>
      {children}
    </Ctx.Provider>
  );
}

export function useSpeech() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSpeech must be used within SpeechProvider');
  return ctx;
}
