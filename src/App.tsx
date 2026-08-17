import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { SettingsProvider } from './context/SettingsContext';
import { ProgressProvider } from './context/ProgressContext';
import { ReviewProvider } from './context/ReviewContext';
import { SpeechProvider } from './context/SpeechContext';
import { BottomNav } from './components/BottomNav';
import { Icon } from './components/Icon';
import { HomePage } from './pages/HomePage';
import { DailyPage } from './pages/DailyPage';
import { DictionaryPage } from './pages/DictionaryPage';
import { DictionaryEntryPage } from './pages/DictionaryEntryPage';
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
import { GrammarCheatSheetPage } from './pages/GrammarCheatSheetPage';
import { GrammarTenseGuidePage } from './pages/GrammarTenseGuidePage';
import { GrammarPatternPage } from './pages/GrammarPatternPage';
import { WeeklyTopicsPage } from './pages/WeeklyTopicsPage';
import { WeeklyTopicDetailPage } from './pages/WeeklyTopicDetailPage';
import { WeeklyVocabPage } from './pages/WeeklyVocabPage';
import { WeeklyReadingPage } from './pages/WeeklyReadingPage';
import { WeeklyExercisePage } from './pages/WeeklyExercisePage';
import { MihaelaReviewPage } from './pages/MihaelaReviewPage';
import { ShareWithTeacherPage } from './pages/share/ShareWithTeacherPage';
import { ReviewSyncHubPage } from './pages/share/ReviewSyncHubPage';
import { ReviewExportPage } from './pages/share/ReviewExportPage';
import { ReviewImportPage } from './pages/share/ReviewImportPage';
import { TeacherReviewPage } from './pages/share/TeacherReviewPage';
import { ProgressSyncHubPage } from './pages/share/ProgressSyncHubPage';
import { ProgressExportPage } from './pages/share/ProgressExportPage';
import { TeacherProgressPage } from './pages/share/TeacherProgressPage';
import { NoShamePage } from './components/NoShameBanner';
import { NavigationFallback } from './components/NavigationFallback';
import { getDictionaryEntry, getDictionaryPhrase } from './content/dictionary';
import { getWeeklyTopic } from './content/weeklyTopics';

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
  | 'dictionary'
  | 'dictionary-entry'
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
  | 'grammar-cheat'
  | 'grammar-tense'
  | 'grammar-pattern'
  | 'weekly-topics'
  | 'weekly-topic'
  | 'weekly-vocab'
  | 'weekly-reading'
  | 'weekly-exercise'
  | 'mihaela-review'
  | 'share-with-teacher'
  | 'share-review'
  | 'share-review-export'
  | 'share-review-import'
  | 'teacher-review'
  | 'share-progress'
  | 'share-progress-export'
  | 'teacher-progress';

import type { WeeklyExerciseType } from './types';

function Shell() {
  const { current, go, back, canGoBack } = useNavigation();
  const page = current.page;
  const arg = current.arg;

  const navBack = () => {
    if (canGoBack) back();
    else go('home');
  };

  // Pages that show the bottom nav (top-level destinations)
  const navPages: PageId[] = ['home', 'weekly-topics', 'daily', 'favourites', 'progress'];
  const showNav =
    navPages.includes(page) ||
    page === 'dictionary' ||
    page === 'weekly-topic' ||
    page === 'weekly-vocab' ||
    page === 'weekly-reading' ||
    page === 'weekly-exercise';
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
        {page === 'dictionary' && <DictionaryPage go={go} onBack={navBack} />}
        {page === 'dictionary-entry' && arg && (getDictionaryEntry(arg) || getDictionaryPhrase(arg)) ? (
          <DictionaryEntryPage entryId={arg} go={go} onBack={navBack} />
        ) : page === 'dictionary-entry' ? (
          <NavigationFallback
            title="Word not found"
            message="We couldn’t open that dictionary entry."
            onBack={() => go('dictionary')}
            backLabel="Back to Dictionary"
            backIcon="BookOpen"
          />
        ) : null}
        {page === 'favourites' && <FavouritesPage />}
        {page === 'progress' && <ProgressPage go={go} />}
        {page === 'settings' && (
          <SettingsPage
            onBack={navBack}
            onOpenReview={() => go('mihaela-review')}
            onOpenShare={() => go('share-with-teacher')}
          />
        )}
        {page === 'builder' && <PhraseBuilderPage go={go} />}
        {page === 'reallife' && <RealLifePage onBack={navBack} initialCategoryId={arg} />}
        {page === 'survival' && <SurvivalPage onBack={navBack} />}
        {page === 'tiny' && <TinyPracticePage onBack={navBack} onHome={() => go('home')} />}
        {page === 'noshame' && <NoShamePage onBack={navBack} />}
        {page === 'conversations' && <MiniConversationsPage go={go} onBack={navBack} />}
        {page === 'conversation' && arg ? (
          <MiniConversationDetailPage conversationId={arg} onBack={navBack} onHome={() => go('home')} />
        ) : page === 'conversation' ? (
          <NavigationFallback
            title="Conversation not found"
            message="We couldn’t open that conversation. Pick one from the list."
            onBack={() => go('conversations')}
            backLabel="View conversations"
            backIcon="MessagesSquare"
          />
        ) : null}
        {page === 'grammar' && <GrammarHelpPage go={go} onBack={navBack} />}
        {page === 'grammar-topic' && arg ? (
          <GrammarTopicPage topicId={arg} onBack={navBack} />
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
          <GrammarVerbPage
            verbId={arg}
            onBack={navBack}
            onNavigate={(id) => go('grammar-verb', id, { replace: true })}
          />
        ) : page === 'grammar-verb' ? (
          <NavigationFallback
            title="Verb not found"
            message="We couldn’t open that verb."
            onBack={() => go('grammar')}
            backLabel="Back to Grammar Help"
            backIcon="BookOpen"
          />
        ) : null}
        {page === 'grammar-cheat' && arg ? (
          <GrammarCheatSheetPage sheetId={arg} onBack={navBack} />
        ) : page === 'grammar-cheat' ? (
          <NavigationFallback
            title="Cheat sheet not found"
            message="We couldn’t open that reference page."
            onBack={() => go('grammar')}
            backLabel="Back to Grammar Help"
            backIcon="BookOpen"
          />
        ) : null}
        {page === 'grammar-tense' && arg ? (
          <GrammarTenseGuidePage guideId={arg} onBack={navBack} />
        ) : page === 'grammar-tense' ? (
          <NavigationFallback
            title="Tense guide not found"
            message="We couldn’t open that tense guide."
            onBack={() => go('grammar')}
            backLabel="Back to Grammar Help"
            backIcon="BookOpen"
          />
        ) : null}
        {page === 'grammar-pattern' && arg ? (
          <GrammarPatternPage patternId={arg} onBack={navBack} />
        ) : page === 'grammar-pattern' ? (
          <NavigationFallback
            title="Pattern not found"
            message="We couldn’t open that sentence pattern."
            onBack={() => go('grammar')}
            backLabel="Back to Grammar Help"
            backIcon="BookOpen"
          />
        ) : null}
        {page === 'weekly-topics' && <WeeklyTopicsPage go={go} onBack={navBack} />}
        {page === 'weekly-topic' && arg && getWeeklyTopic(arg) ? (
          <WeeklyTopicDetailPage topicId={arg} go={go} onBack={navBack} />
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
          <WeeklyVocabPage topicId={arg} onBack={navBack} />
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
              onBack={navBack}
              go={go}
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
              onBack={navBack}
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
        {page === 'mihaela-review' && (
          <MihaelaReviewPage
            onBack={navBack}
            onShareReview={() => go('share-review-export')}
          />
        )}
        {page === 'share-with-teacher' && (
          <ShareWithTeacherPage
            onBack={navBack}
            onReviewSync={() => go('share-review')}
            onProgressSync={() => go('share-progress')}
          />
        )}
        {page === 'share-review' && (
          <ReviewSyncHubPage
            onBack={navBack}
            onExport={() => go('share-review-export')}
            onTeacher={() => go('teacher-review')}
            onImport={() => go('share-review-import')}
          />
        )}
        {page === 'share-review-export' && <ReviewExportPage onBack={navBack} />}
        {page === 'share-review-import' && (
          <ReviewImportPage onBack={navBack} onDone={() => go('mihaela-review')} />
        )}
        {page === 'teacher-review' && <TeacherReviewPage onBack={navBack} />}
        {page === 'share-progress' && (
          <ProgressSyncHubPage
            onBack={navBack}
            onExport={() => go('share-progress-export')}
            onTeacher={() => go('teacher-progress')}
          />
        )}
        {page === 'share-progress-export' && <ProgressExportPage onBack={navBack} />}
        {page === 'teacher-progress' && <TeacherProgressPage onBack={navBack} />}
      </main>

      {showNav && <BottomNav current={page} go={go} />}
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <ProgressProvider>
        <ReviewProvider>
          <SpeechProvider>
            <NavigationProvider>
              <Shell />
            </NavigationProvider>
          </SpeechProvider>
        </ReviewProvider>
      </ProgressProvider>
    </SettingsProvider>
  );
}
