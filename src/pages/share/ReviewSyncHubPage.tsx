import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';

interface Props {
  onBack: () => void;
  onExport: () => void;
  onTeacher: () => void;
  onImport: () => void;
}

export function ReviewSyncHubPage({ onBack, onExport, onTeacher, onImport }: Props) {
  return (
    <div className="min-h-screen">
      <PageHeader title="Review Sync" subtitle="Share Romanian for teacher review" onBack={onBack} />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-4">
        <Card>
          <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
            1. Learner generates a QR code with review items.
            <br />
            2. Teacher scans and reviews on their device.
            <br />
            3. Teacher generates a response QR.
            <br />
            4. Learner scans it — the review list updates.
          </p>
        </Card>

        <Button variant="primary" size="lg" className="w-full" onClick={onExport}>
          <Icon name="QrCode" className="h-5 w-5" />
          Create review package
        </Button>

        <Button variant="secondary" size="lg" className="w-full" onClick={onTeacher}>
          <Icon name="ScanLine" className="h-5 w-5" />
          Teacher review — scan QR
        </Button>

        <Button variant="soft" size="lg" className="w-full" onClick={onImport}>
          <Icon name="RefreshCw" className="h-5 w-5" />
          Return review — scan response
        </Button>
      </div>
    </div>
  );
}
