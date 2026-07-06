import { useState, useEffect } from 'react';
import { SettingsProvider } from './context/SettingsContext';
import { ProgressProvider } from './context/ProgressContext';
import { SpeechProvider } from './context/SpeechContext';
import { BottomNav } from './components/BottomNav';
import { Icon } from './components/Icon';
import { HomePage } from './pages/HomePage';
import { DailyPage } from './pages/DailyPage';
import { ScenariosPage } from './pages/ScenariosPage';
import { ScenarioDetailPage } from './pages/ScenarioDetailPage';
import { FavouritesPage } from './pages/FavouritesPage';
import { ProgressPage } from './pages/ProgressPage';
import { SettingsPage } from './pages/SettingsPage';
import { PhraseBuilderPage } from './pages/PhraseBuilderPage';
import { RealLifePage } from './pages/RealLifePage';
import { SurvivalPage } from './pages/SurvivalPage';
import { TinyPracticePage } from './pages/TinyPracticePage';
import { MiniConversationsPage } from './pages/MiniConversationsPage';
import { MiniConversationDetailPage } from './pages/MiniConversationDetailPage';
import { NoShamePage } from './components/NoShameBanner';
import type { ScenarioId } from './types';

export type PageId =
  | 'home'
  | 'daily'
  | 'scenarios'
  | 'scenario'
  | 'favourites'
  | 'progress'
  | 'settings'
  | 'builder'
  | 'reallife'
  | 'survival'
  | 'tiny'
  | 'noshame'
  | 'conversations'
  | 'conversation';

function Shell() {
  const [page, setPage] = useState<PageId>('home');
  const [arg, setArg] = useState<string | undefined>();

  const go = (p: PageId, a?: string) => {
    setArg(a);
    setPage(p);
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [page]);

  // Pages that show the bottom nav (top-level destinations)
  const navPages: PageId[] = ['home', 'daily', 'scenarios', 'favourites', 'progress'];
  const showNav = navPages.includes(page);
  const showSettingsGear = page === 'home';

  return (
    <div className="min-h-screen bg-sand-100 dark:bg-ink-900 text-ink-900 dark:text-sand-100">
      {showSettingsGear && (
        <button
          onClick={() => go('settings')}
          aria-label="Open settings"
          className="fixed top-3 right-3 z-20 tap-target rounded-2xl bg-white/80 dark:bg-ink-900/80 backdrop-blur p-2 text-ink-700 dark:text-ink-300 shadow-soft hover:bg-white dark:hover:bg-ink-700 transition"
        >
          <Icon name="Settings" className="h-6 w-6" />
        </button>
      )}

      <main className={showNav ? 'pb-24' : ''}>
        {page === 'home' && <HomePage go={go} />}
        {page === 'daily' && <DailyPage go={go} />}
        {page === 'scenarios' && <ScenariosPage go={go} />}
        {page === 'scenario' && arg && <ScenarioDetailPage scenarioId={arg as ScenarioId} go={go} />}
        {page === 'favourites' && <FavouritesPage />}
        {page === 'progress' && <ProgressPage go={go} />}
        {page === 'settings' && <SettingsPage onBack={() => go('home')} />}
        {page === 'builder' && <PhraseBuilderPage go={go} />}
        {page === 'reallife' && <RealLifePage onBack={() => go('home')} initialCategoryId={arg} />}
        {page === 'survival' && <SurvivalPage onBack={() => go('home')} />}
        {page === 'tiny' && <TinyPracticePage onBack={() => go('home')} onHome={() => go('home')} />}
        {page === 'noshame' && <NoShamePage onBack={() => go('home')} />}
        {page === 'conversations' && <MiniConversationsPage go={go} onBack={() => go('home')} />}
        {page === 'conversation' && arg && (
          <MiniConversationDetailPage conversationId={arg} onBack={() => go('conversations')} onHome={() => go('home')} />
        )}
      </main>

      {showNav && <BottomNav current={page} go={go} />}
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <ProgressProvider>
        <SpeechProvider>
          <Shell />
        </SpeechProvider>
      </ProgressProvider>
    </SettingsProvider>
  );
}
