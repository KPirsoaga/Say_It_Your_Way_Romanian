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
import { GrammarHelpPage } from './pages/GrammarHelpPage';
import { GrammarTopicPage } from './pages/GrammarTopicPage';
import { GrammarVerbPage } from './pages/GrammarVerbPage';
import { WeeklyTopicsPage } from './pages/WeeklyTopicsPage';
import { WeeklyTopicDetailPage } from './pages/WeeklyTopicDetailPage';
import { WeeklyVocabPage } from './pages/WeeklyVocabPage';
import { WeeklyReadingPage } from './pages/WeeklyReadingPage';
import { WeeklyExercisePage } from './pages/WeeklyExercisePage';
import { NoShamePage } from './components/NoShameBanner';
import { NavigationFallback } from './components/NavigationFallback';
import { getWeeklyTopic } from './content/weeklyTopics';
import type { ScenarioId, WeeklyExerciseType } from './types';

function parseWeeklyReadingArg(arg: string): { topicId: string; readingId: string } | null {
  const i = arg.indexOf(':');
  if (i < 1) return null;
  return { topicId: arg.slice(0, i), readingId: arg.slice(i + 1) };
}

function parseWeeklyExerciseArg(arg: string): { topicId: string; exerciseType: WeeklyExerciseType } | null {
  const i = arg.indexOf(':');
  if (i < 1) return null;
  const topicId = arg.slice(0, i);
  const exerciseType = arg.slice(i + 1) as WeeklyExerciseType;
  if (!['ro-en', 'en-ro', 'match', 'sort'].includes(exerciseType)) return null;
  return { topicId, exerciseType };
}

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
  | 'conversation'
  | 'grammar'
  | 'grammar-topic'
  | 'grammar-verb'
  | 'weekly-topics'
  | 'weekly-topic'
  | 'weekly-vocab'
  | 'weekly-reading'
  | 'weekly-exercise';

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
          type="button"
          onClick={() => go('settings')}
          aria-label="Open settings"
          className="fixed top-[max(0.75rem,env(safe-area-inset-top))] right-[max(0.75rem,env(safe-area-inset-right))] z-20 tap-target rounded-2xl bg-white/80 dark:bg-ink-900/80 backdrop-blur p-2 text-ink-700 dark:text-ink-300 shadow-soft hover:bg-white dark:hover:bg-ink-700 transition"
        >
          <Icon name="Settings" className="h-6 w-6" />
        </button>
      )}

      <main className={showNav ? 'pb-24' : ''}>
        {page === 'home' && <HomePage go={go} />}
        {page === 'daily' && <DailyPage go={go} />}
        {page === 'scenarios' && <ScenariosPage go={go} />}
        {page === 'scenario' && arg ? (
          <ScenarioDetailPage scenarioId={arg as ScenarioId} go={go} />
        ) : page === 'scenario' ? (
          <NavigationFallback
            title="Scenario not found"
            message="We couldn’t open that scenario. Pick one from the list."
            onBack={() => go('scenarios')}
            backLabel="View scenarios"
            backIcon="LayoutGrid"
          />
        ) : null}
        {page === 'favourites' && <FavouritesPage />}
        {page === 'progress' && <ProgressPage go={go} />}
        {page === 'settings' && <SettingsPage onBack={() => go('home')} />}
        {page === 'builder' && <PhraseBuilderPage go={go} />}
        {page === 'reallife' && <RealLifePage onBack={() => go('home')} initialCategoryId={arg} />}
        {page === 'survival' && <SurvivalPage onBack={() => go('home')} />}
        {page === 'tiny' && <TinyPracticePage onBack={() => go('home')} onHome={() => go('home')} />}
        {page === 'noshame' && <NoShamePage onBack={() => go('home')} />}
        {page === 'conversations' && <MiniConversationsPage go={go} onBack={() => go('home')} />}
        {page === 'conversation' && arg ? (
          <MiniConversationDetailPage conversationId={arg} onBack={() => go('conversations')} onHome={() => go('home')} />
        ) : page === 'conversation' ? (
          <NavigationFallback
            title="Conversation not found"
            message="We couldn’t open that conversation. Pick one from the list."
            onBack={() => go('conversations')}
            backLabel="View conversations"
            backIcon="MessagesSquare"
          />
        ) : null}
        {page === 'grammar' && <GrammarHelpPage go={go} onBack={() => go('home')} />}
        {page === 'grammar-topic' && arg ? (
          <GrammarTopicPage topicId={arg} onBack={() => go('grammar')} />
        ) : page === 'grammar-topic' ? (
          <NavigationFallback
            title="Topic not found"
            message="We couldn’t open that grammar topic."
            onBack={() => go('grammar')}
            backLabel="Back to Grammar Help"
            backIcon="BookOpen"
          />
        ) : null}
        {page === 'grammar-verb' && arg ? (
          <GrammarVerbPage verbId={arg} onBack={() => go('grammar')} />
        ) : page === 'grammar-verb' ? (
          <NavigationFallback
            title="Verb not found"
            message="We couldn’t open that verb."
            onBack={() => go('grammar')}
            backLabel="Back to Grammar Help"
            backIcon="BookOpen"
          />
        ) : null}
        {page === 'weekly-topics' && <WeeklyTopicsPage go={go} onBack={() => go('home')} />}
        {page === 'weekly-topic' && arg && getWeeklyTopic(arg) ? (
          <WeeklyTopicDetailPage topicId={arg} go={go} onBack={() => go('weekly-topics')} />
        ) : page === 'weekly-topic' ? (
          <NavigationFallback
            title="Topic not found"
            message="We couldn’t open that weekly topic."
            onBack={() => go('weekly-topics')}
            backLabel="Weekly Topics"
            backIcon="BookOpen"
          />
        ) : null}
        {page === 'weekly-vocab' && arg ? (
          <WeeklyVocabPage topicId={arg} onBack={() => go('weekly-topic', arg)} />
        ) : page === 'weekly-vocab' ? (
          <NavigationFallback
            title="Topic not found"
            message="We couldn’t open that vocabulary bank."
            onBack={() => go('weekly-topics')}
            backLabel="Weekly Topics"
            backIcon="BookOpen"
          />
        ) : null}
        {page === 'weekly-reading' && arg ? (() => {
          const parsed = parseWeeklyReadingArg(arg);
          return parsed ? (
            <WeeklyReadingPage
              topicId={parsed.topicId}
              readingId={parsed.readingId}
              onBack={() => go('weekly-topic', parsed.topicId)}
            />
          ) : (
            <NavigationFallback
              title="Reading not found"
              message="We couldn’t open that reading passage."
              onBack={() => go('weekly-topics')}
              backLabel="Weekly Topics"
              backIcon="BookOpen"
            />
          );
        })() : page === 'weekly-reading' ? (
          <NavigationFallback
            title="Reading not found"
            message="We couldn’t open that reading passage."
            onBack={() => go('weekly-topics')}
            backLabel="Weekly Topics"
            backIcon="BookOpen"
          />
        ) : null}
        {page === 'weekly-exercise' && arg ? (() => {
          const parsed = parseWeeklyExerciseArg(arg);
          return parsed ? (
            <WeeklyExercisePage
              topicId={parsed.topicId}
              exerciseType={parsed.exerciseType}
              onBack={() => go('weekly-topic', parsed.topicId)}
            />
          ) : (
            <NavigationFallback
              title="Exercise not found"
              message="We couldn’t open that exercise."
              onBack={() => go('weekly-topics')}
              backLabel="Weekly Topics"
              backIcon="BookOpen"
            />
          );
        })() : page === 'weekly-exercise' ? (
          <NavigationFallback
            title="Exercise not found"
            message="We couldn’t open that exercise."
            onBack={() => go('weekly-topics')}
            backLabel="Weekly Topics"
            backIcon="BookOpen"
          />
        ) : null}
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
