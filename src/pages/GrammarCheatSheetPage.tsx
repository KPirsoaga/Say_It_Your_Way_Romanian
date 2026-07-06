import { PageHeader } from '../components/PageHeader';
import { getGrammarCheatSheet } from '../content/grammarCheatSheets';
import { GrammarCheatSheetView } from '../components/GrammarCheatSheetView';
import { Card } from '../components/Card';

interface Props {
  sheetId: string;
  onBack: () => void;
}

export function GrammarCheatSheetPage({ sheetId, onBack }: Props) {
  const sheet = getGrammarCheatSheet(sheetId);

  if (!sheet) {
    return (
      <div className="min-h-screen">
        <PageHeader title="Sheet not found" onBack={onBack} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader title={sheet.title} subtitle={sheet.summary} onBack={onBack} />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-4">
        <Card className="bg-sea-50 dark:bg-sea-600/10 p-4">
          <p className="text-sm text-ink-700 dark:text-ink-300">Quick reference — tap play to hear Romanian.</p>
        </Card>
        <GrammarCheatSheetView sheet={sheet} />
        {sheet.review?.needsReview && (
          <p className="text-xs text-sun-500 dark:text-sun-300 text-center">TODO: Review with Mihaela</p>
        )}
      </div>
    </div>
  );
}
