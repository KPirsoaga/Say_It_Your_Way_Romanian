import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { NoShameBanner } from '../components/NoShameBanner';
import { useSettings } from '../context/SettingsContext';
import { useProgress } from '../context/ProgressContext';
import { useSpeech } from '../hooks/useSpeech';
import { colorMap, miniConversations } from '../content';
import { FlagForTeacher } from '../components/FlagForTeacher';
import { userFlagId } from '../content/review/reviewIds';
import type { ConversationTurn } from '../types';

interface Props {
  conversationId: string;
  onBack: () => void;
  onHome: () => void;
}

/** Break a Romanian line into short, speakable chunks for "Show easier version". */
function breakDown(turn: ConversationTurn): string[] {
  const base = turn.slow ?? turn.ro;
  if (base.includes('...')) return base.split('...').map((s) => s.trim()).filter(Boolean);
  const parts = base
    .replace(/,\s*/g, '|||')
    .replace(/\bși\b/gi, '|||și ')
    .replace(/\bdar\b/gi, '|||dar ')
    .split('|||')
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length > 1 ? parts : [base];
}

export function MiniConversationDetailPage({ conversationId, onBack, onHome }: Props) {
  const conv = miniConversations.find((c) => c.id === conversationId);
  const { settings } = useSettings();
  const { supported, speak, speakSlow, stop, currentId } = useSpeech();
  const { markConversationCompleted, markPractisedToday } = useProgress();
  const [revealed, setRevealed] = useState(1);
  const [saidTurns, setSaidTurns] = useState<Set<number>>(new Set());
  const [easierFor, setEasierFor] = useState<Set<number>>(new Set());
  const [done, setDone] = useState(false);

  if (!conv) {
    return (
      <div className="min-h-screen">
        <PageHeader title="Conversation not found" onBack={onBack} />
        <div className="mx-auto max-w-md px-4 pb-32 pt-8 text-center space-y-4">
          <p className="text-ink-700 dark:text-ink-300 text-lg">We couldn’t find that conversation. Pick one from the list.</p>
          <Button variant="primary" size="lg" onClick={onBack}>
            <Icon name="MessagesSquare" className="h-5 w-5" />
            View conversations
          </Button>
        </div>
      </div>
    );
  }

  const c = colorMap[conv.color];

  const visibleTurns = conv.turns.slice(0, revealed);
  const allRevealed = revealed >= conv.turns.length;

  const revealNext = () => {
    if (revealed < conv.turns.length) setRevealed((r) => r + 1);
  };

  const markSaid = (i: number) => {
    setSaidTurns((s) => new Set(s).add(i));
    if (revealed < conv.turns.length) setRevealed((r) => r + 1);
  };

  const toggleEasier = (i: number) => {
    setEasierFor((s) => {
      const next = new Set(s);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const finish = () => {
    markConversationCompleted(conv.id);
    markPractisedToday();
    setDone(true);
  };

  const practiseAgain = () => {
    setRevealed(1);
    setSaidTurns(new Set());
    setEasierFor(new Set());
    setDone(false);
  };

  if (done) {
    return (
      <div className="min-h-screen">
        <PageHeader title={conv.title} onBack={onBack} />
        <div className="mx-auto max-w-md px-4 pb-32 pt-4">
          <div className="animate-fade-in text-center py-8">
            <div className={`mx-auto h-24 w-24 rounded-full ${c.bgSoft} flex items-center justify-center mb-4 animate-pop`}>
              <Icon name="Trophy" className={`h-12 w-12 ${c.text}`} />
            </div>
            <h2 className="text-2xl font-bold text-ink-900 dark:text-sand-100">Conversation complete!</h2>
            <p className="mt-2 text-ink-700 dark:text-ink-300 text-lg">
              You practised a real exchange. That’s how real conversations get easier.
            </p>
            <NoShameBanner compact />
            <div className="mt-6 flex flex-col gap-2 max-w-xs mx-auto">
              <Button variant="primary" size="lg" onClick={practiseAgain}>
                <Icon name="RotateCcw" className="h-5 w-5" />
                Practise again
              </Button>
              <Button variant="soft" size="lg" onClick={onHome}>
                <Icon name="Home" className="h-5 w-5" />
                Back to home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader title={conv.title} onBack={onBack} />

      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-4">
        {/* Situation banner */}
        <div className={`rounded-3xl ${c.bgSoft} p-5 flex items-start gap-3`}>
          <div className="h-12 w-12 rounded-2xl bg-white/70 dark:bg-white/10 flex items-center justify-center shrink-0">
            <Icon name={conv.icon} className={`h-6 w-6 ${c.text}`} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide font-bold text-ink-500 dark:text-ink-300">The situation</p>
            <p className="text-lg text-ink-900 dark:text-sand-100 font-bold leading-snug">{conv.situation}</p>
          </div>
        </div>

        <p className="text-ink-500 dark:text-ink-300 text-sm">
          Tap to hear each line. When it’s your turn, say it out loud and tap “I said it”.
        </p>

        {/* Conversation turns */}
        <div className="space-y-3">
          {visibleTurns.map((turn, i) => {
            const isYou = turn.who === 'you';
            const said = saidTurns.has(i);
            const easier = easierFor.has(i);
            const chunks = breakDown(turn);
            const playId = `${conv.id}-${i}`;
            const slowId = `${conv.id}-${i}-slow`;
            const isPlaying = currentId === playId;
            const isSlow = currentId === slowId;

            return (
              <div key={i} className={`flex ${isYou ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[92%] ${isYou ? 'w-full' : 'w-full'}`}>
                  {/* Speaker label */}
                  <div className={`flex items-center gap-2 mb-1 ${isYou ? 'justify-end' : 'justify-start'}`}>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide ${
                        isYou ? 'text-coral-400' : 'text-sea-600 dark:text-sea-200'
                      }`}
                    >
                      <Icon name={isYou ? 'Mic' : 'MessageCircle'} className="h-4 w-4" />
                      {isYou ? 'You' : 'Them'}
                    </span>
                  </div>

                  <Card
                    className={`p-4 ${
                      isYou
                        ? 'bg-coral-50 dark:bg-coral-400/10 ring-1 ring-coral-100 dark:ring-coral-400/20 rounded-tr-sm'
                        : 'bg-sea-50 dark:bg-sea-600/10 ring-1 ring-sea-100 dark:ring-sea-600/20 rounded-tl-sm'
                    }`}
                  >
                    <p className="text-xl font-bold text-ink-900 dark:text-sand-100 leading-snug" lang="ro">
                      {turn.ro}
                    </p>
                    <p className="mt-2 text-ink-700 dark:text-ink-300 text-base">{turn.en}</p>
                    {settings.pronunciationHelp && turn.pron && (
                      <p className="mt-1 text-sea-600 dark:text-sea-200 italic text-base">{turn.pron}</p>
                    )}
                    {settings.literalTranslation && turn.literal && (
                      <p className="mt-1 text-ink-500 dark:text-ink-300 text-sm">
                        <span className="font-bold">Literal:</span> {turn.literal}
                      </p>
                    )}

                    {/* Easier version breakdown */}
                    {easier && (
                      <div className="mt-3 rounded-2xl bg-white/70 dark:bg-white/5 p-3 animate-fade-in">
                        <p className="text-xs font-bold uppercase tracking-wide text-sun-400 mb-2">One piece at a time</p>
                        <div className="flex flex-wrap gap-2">
                          {chunks.map((chunk, ci) => {
                            const cid = `${playId}-chunk-${ci}`;
                            const playing = currentId === cid;
                            return (
                              <button
                                key={ci}
                                type="button"
                                onClick={() => (playing ? stop() : speak(chunk, cid))}
                                disabled={!supported}
                                className="btn-md bg-white text-ink-900 ring-2 ring-sun-200 hover:ring-sun-300 dark:bg-ink-900 dark:text-sand-100 dark:ring-sun-300/30"
                              >
                                <Icon name={playing ? 'Pause' : 'Volume2'} className="h-4 w-4 shrink-0" />
                                <span className="tile-label">{chunk}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        variant={isPlaying ? 'secondary' : isYou ? 'secondary' : 'primary'}
                        size="md"
                        onClick={() => (isPlaying ? stop() : speak(turn.ro, playId))}
                        disabled={!supported}
                      >
                        <Icon name={isPlaying ? 'Pause' : 'Volume2'} className="h-5 w-5" />
                        Play
                      </Button>
                      {turn.slow && (
                        <Button
                          variant="outline"
                          size="md"
                          onClick={() => (isSlow ? stop() : speakSlow(turn.slow ?? turn.ro, slowId))}
                          disabled={!supported}
                        >
                          <Icon name="Gauge" className="h-5 w-5" />
                          Slow
                        </Button>
                      )}
                      <Button
                        variant={easier ? 'soft' : 'outline'}
                        size="md"
                        onClick={() => toggleEasier(i)}
                        aria-pressed={easier}
                      >
                        <Icon name="Lightbulb" className="h-5 w-5" />
                        {easier ? 'Hide easier' : 'Easier version'}
                      </Button>
                    </div>

                    {/* "My turn" button — only for learner lines */}
                    {isYou && (
                      <div className="mt-3">
                        <Button
                          variant={said ? 'soft' : 'primary'}
                          size="lg"
                          className="w-full"
                          onClick={() => markSaid(i)}
                          disabled={said}
                        >
                          <Icon name="Check" className="h-5 w-5" />
                          {said ? 'Said it!' : 'My turn — I said it'}
                        </Button>
                      </div>
                    )}
                    <FlagForTeacher
                      className="mt-3"
                      id={userFlagId(`conversation:${conv.id}:turn:${i}`)}
                      ro={turn.ro}
                      en={turn.en}
                      contentArea="Mini Conversations"
                      contextLabel={conv.title}
                    />
                  </Card>
                </div>
              </div>
            );
          })}
        </div>

        {/* Next / finish controls */}
        <div className="pt-2">
          {!allRevealed && (
            <Button variant="ghost" size="md" className="w-full" onClick={revealNext}>
              <Icon name="ArrowRight" className="h-5 w-5" />
              Reveal next line
            </Button>
          )}
          {allRevealed && !done && (
            <Button variant="primary" size="lg" className="w-full" onClick={finish}>
              <Icon name="Check" className="h-5 w-5" />
              I finished this conversation
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
