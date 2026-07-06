import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Settings } from '../types';

const DEFAULT_SETTINGS: Settings = {
  textSize: 'normal',
  pronunciationHelp: true,
  literalTranslation: false,
  reduceAnimations: false,
  darkMode: false,
};

interface SettingsCtx {
  settings: Settings;
  update: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  reset: () => void;
}

const Ctx = createContext<SettingsCtx | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useLocalStorage<Settings>('rcd-settings', DEFAULT_SETTINGS);

  // Apply settings to <html> for CSS-driven globals (text size, motion, dark mode)
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-text-size', settings.textSize === 'normal' ? 'normal' : settings.textSize);
    html.setAttribute('data-reduce-motion', String(settings.reduceAnimations));
    html.classList.toggle('dark', settings.darkMode);
    html.style.setProperty('--font-scale', settings.textSize === 'xlarge' ? '1.15' : settings.textSize === 'large' ? '1.08' : '1');
  }, [settings]);

  const update: SettingsCtx['update'] = (key, value) => setSettings((s) => ({ ...s, [key]: value }));
  const reset = () => setSettings(DEFAULT_SETTINGS);

  return <Ctx.Provider value={{ settings, update, reset }}>{children}</Ctx.Provider>;
}

export function useSettings() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
