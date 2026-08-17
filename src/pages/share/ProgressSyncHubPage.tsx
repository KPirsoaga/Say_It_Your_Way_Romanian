import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';

interface Props {
  onBack: () => void;
  onExport: () => void;
  onTeacher: () => void;
}

export function ProgressSyncHubPage({ onBack, onExport, onTeacher }: Props) {
  return (
    <div className="min-h-screen">
      <PageHeader title="Progress Sync" subtitle="Share practice before each lesson" onBack={onBack} />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-4">
        <Card>
          <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
            Before your lesson, generate a progress QR. Your teacher scans it and sees what you have practised — vocabulary, reading, exercises, and more. Read-only for the teacher.
          </p>
        </Card>

        <Button variant="primary" size="lg" className="w-full" onClick={onExport}>
          <Icon name="QrCode" className="h-5 w-5" />
          Share progress with teacher
        </Button>

        <Button variant="secondary" size="lg" className="w-full" onClick={onTeacher}>
          <Icon name="ScanLine" className="h-5 w-5" />
          Teacher view — scan progress QR
        </Button>
      </div>
    </div>
  );
}
