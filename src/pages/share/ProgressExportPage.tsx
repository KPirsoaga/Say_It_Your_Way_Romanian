import { useMemo } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { MultiQrPanel } from '../../components/qr/MultiQrPanel';
import { useProgress } from '../../context/ProgressContext';
import { useReview } from '../../context/ReviewContext';
import { buildProgressExportPayload, encodeProgressExport } from '../../services/qr/progressPackage';

interface Props {
  onBack: () => void;
}

export function ProgressExportPage({ onBack }: Props) {
  const { progress } = useProgress();
  const { catalog, getEffectiveStatus } = useReview();

  const payload = useMemo(
    () => buildProgressExportPayload(progress, catalog, getEffectiveStatus),
    [progress, catalog, getEffectiveStatus]
  );

  const codes = useMemo(() => encodeProgressExport(payload), [payload]);

  return (
    <div className="min-h-screen">
      <PageHeader title="Share progress" subtitle="Show this to Mihaela before the lesson" onBack={onBack} />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-4">
        <Card>
          <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
            Includes your weekly lesson progress, grammar, phrase builder, conversations, and review summary. No settings or saved phrases.
          </p>
        </Card>
        <MultiQrPanel codes={codes} title="Progress package" hint={`${payload.currentWeeklyTopic.title} · ${payload.needsReviewCount} items need review`} />
      </div>
    </div>
  );
}
