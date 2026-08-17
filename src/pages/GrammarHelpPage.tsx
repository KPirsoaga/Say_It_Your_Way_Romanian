import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { NoShameBanner } from '../components/NoShameBanner';
import { colorMap, grammarVerbs } from '../content';
import {
  grammarCheatSheets,
  grammarTenseGuides,
  grammarSentencePatterns,
  grammarPartsOfSpeech,
} from '../content/grammar';
import { getVerbNav } from '../content/grammarVerbNav';
import type { PageId } from '../App';

interface Props {
  go: (page: PageId, arg?: string) => void;
  onBack: () => void;
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-3">
      <h2 className="text-lg font-bold text-ink-900 dark:text-sand-100">{title}</h2>
      {subtitle && <p className="text-sm text-ink-500 dark:text-ink-300 mt-0.5">{subtitle}</p>}
    </div>
  );
}

function NavCard({
  title,
  subtitle,
  icon,
  color,
  onClick,
}: {
  title: string;
  subtitle?: string;
  icon: string;
  color: string;
  onClick: () => void;
}) {
  const c = colorMap[color as keyof typeof colorMap];
  return (
    <Card onClick={onClick} className="flex items-center gap-3 p-4">
      <div className={`h-11 w-11 rounded-2xl ${c.bgSoft} flex items-center justify-center shrink-0`}>
        <Icon name={icon} className={`h-5 w-5 ${c.text}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="tile-label font-bold text-ink-900 dark:text-sand-100 text-base leading-tight">{title}</p>
        {subtitle && <p className="text-sm text-ink-500 dark:text-ink-300 mt-0.5 line-clamp-2">{subtitle}</p>}
      </div>
      <Icon name="ChevronRight" className="h-5 w-5 text-ink-300 dark:text-ink-500 shrink-0" />
    </Card>
  );
}

export function GrammarHelpPage({ go, onBack }: Props) {
  const sortedVerbs = [...grammarVerbs].sort((a, b) => getVerbNav(a.id).index - getVerbNav(b.id).index);
  const firstVerb = sortedVerbs.find((v) => getVerbNav(v.id).index >= 0) ?? grammarVerbs[0];

  return (
    <div className="min-h-screen">
      <PageHeader title="Grammar Help" subtitle="Practical cheat sheets — find answers in one or two taps" onBack={onBack} />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-sun-300 to-sun-400 text-ink-900 p-5 shadow-soft">
          <p className="text-sm uppercase tracking-wide font-bold">Quick reference</p>
          <h2 className="text-xl font-bold leading-tight mt-1">Grammar supports communication — not linguistics</h2>
          <p className="mt-2 text-ink-800 text-base">Examples first. Plain English. No textbook stress.</p>
        </div>

        <NoShameBanner compact />

        {/* 1. Cheat sheets — primary */}
        <section>
          <SectionHeader title="Grammar cheat sheets" subtitle="Scan, tap play, move on — no exercises" />
          <div className="grid grid-cols-2 gap-2 tile-grid">
            {grammarCheatSheets.map((sheet) => (
              <Card key={sheet.id} onClick={() => go('grammar-cheat', sheet.id)} className="home-tile p-3">
                <Icon name={sheet.icon} className="h-5 w-5 text-sea-600 dark:text-sea-200" />
                <p className="tile-label font-bold text-ink-900 dark:text-sand-100 text-sm mt-1">{sheet.title}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* 2. Common verbs — primary */}
        <section>
          <SectionHeader
            title="Common verbs"
            subtitle="One page per verb — switch tense without leaving"
          />
          <NavCard
            title="Open verb reference"
            subtitle={firstVerb ? `Start with ${firstVerb.infinitive} — ${firstVerb.en}` : 'Conjugations and examples'}
            icon="Zap"
            color="coral"
            onClick={() => go('grammar-verb', firstVerb?.id ?? 'vb-fi')}
          />
          <div className="flex gap-2 overflow-x-auto pb-1 mt-3 -mx-1 px-1">
            {sortedVerbs.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => go('grammar-verb', v.id)}
                className="shrink-0 rounded-full px-3 py-2 text-sm font-bold bg-sand-100 text-ink-700 dark:bg-ink-900 dark:text-ink-300"
              >
                <span lang="ro">{v.infinitive.replace('a ', '')}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 3. Understanding tenses — primary */}
        <section>
          <SectionHeader title="Understanding Romanian tenses" subtitle="What each tense means — not full conjugation tables" />
          <div className="space-y-2">
            {grammarTenseGuides.map((guide) => (
              <NavCard
                key={guide.id}
                title={guide.title}
                subtitle={guide.subtitle}
                icon={guide.icon}
                color={guide.color}
                onClick={() => go('grammar-tense', guide.id)}
              />
            ))}
          </div>
        </section>

        {/* 4. Sentence patterns */}
        <section>
          <SectionHeader title="Sentence patterns" subtitle="Practical shapes for real conversation" />
          <div className="space-y-2">
            {grammarSentencePatterns.map((pattern) => (
              <NavCard
                key={pattern.id}
                title={pattern.title}
                subtitle={pattern.summary}
                icon={pattern.icon}
                color={pattern.color}
                onClick={() => go('grammar-pattern', pattern.id)}
              />
            ))}
          </div>
        </section>

        {/* 5. Parts of speech */}
        <section>
          <SectionHeader title="Parts of speech" subtitle="Six short guides — verb, noun, adjective, and more" />
          <div className="space-y-2">
            {grammarPartsOfSpeech.map((topic) => (
              <NavCard
                key={topic.id}
                title={topic.title}
                subtitle={topic.summary}
                icon={topic.icon}
                color={topic.color}
                onClick={() => go('grammar-topic', topic.id)}
              />
            ))}
          </div>
        </section>

        {/* 6. Exercises placeholder */}
        <section>
          <SectionHeader title="Grammar exercises" />
          <Card className="p-5 text-center bg-sand-100 dark:bg-ink-900">
            <Icon name="Sparkles" className="h-8 w-8 text-ink-300 dark:text-ink-500 mx-auto mb-2" />
            <p className="font-bold text-ink-700 dark:text-ink-300">Coming soon</p>
            <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">Gentle grammar practice will appear here in a future update.</p>
          </Card>
        </section>
      </div>
    </div>
  );
}
