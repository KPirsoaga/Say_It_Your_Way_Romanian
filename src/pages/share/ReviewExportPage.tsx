import { useMemo, useState, type ReactNode } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { MultiQrPanel } from '../../components/qr/MultiQrPanel';
import { useReview } from '../../context/ReviewContext';
import {
  buildReviewExportItems,
  countReviewExportQrs,
  encodeReviewExport,
} from '../../services/qr/reviewPackage';
import type { ReviewContentArea } from '../../types';

interface Props {
  onBack: () => void;
}

type StatusFilter = 'pending' | 'needs-changes';

const AREA_FILTERS: ReviewContentArea[] = [
  'Grammar Help',
  'Weekly Topics',
  'Scenarios',
  'Phrase Builder',
  'Real Life Mode',
  'Mini Conversations',
];

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-3 py-1.5 text-sm font-bold transition ${
        active
          ? 'bg-sea-600 text-white dark:bg-sea-400 dark:text-ink-900'
          : 'bg-sand-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300'
      }`}
    >
      {children}
    </button>
  );
}

export function ReviewExportPage({ onBack }: Props) {
  const { catalog, getEffectiveStatus } = useReview();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
  const [areaFilter, setAreaFilter] = useState<ReviewContentArea | null>(null);
  const [generated, setGenerated] = useState(false);

  const filteredCatalog = useMemo(
    () =>
      catalog.filter((item) => {
        const status = getEffectiveStatus(item.id);
        if (statusFilter === 'pending' && status !== 'pending') return false;
        if (statusFilter === 'needs-changes' && status !== 'needs-changes') return false;
        if (areaFilter && item.contentArea !== areaFilter) return false;
        return true;
      }),
    [catalog, getEffectiveStatus, statusFilter, areaFilter]
  );

  const exportItems = useMemo(
    () => buildReviewExportItems(filteredCatalog, getEffectiveStatus),
    [filteredCatalog, getEffectiveStatus]
  );

  const codes = useMemo(
    () => (generated ? encodeReviewExport(exportItems) : []),
    [generated, exportItems]
  );

  const estimatedQrCount = useMemo(() => countReviewExportQrs(exportItems), [exportItems]);

  const hasItems = exportItems.length > 0;

  return (
    <div className="min-h-screen">
      <PageHeader title="Share review items" subtitle="Show this QR to Mihaela" onBack={onBack} />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-4">
        {!generated ? (
          <>
            <Card className="bg-sun-50 dark:bg-sun-300/10 border border-sun-200 dark:border-sun-300/20">
              <p className="text-sm text-ink-700 dark:text-ink-300 leading-relaxed">
                If there are many review items, share only pending items or filter by area.
              </p>
            </Card>

            <Card className="space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-ink-500 dark:text-ink-300 mb-2">
                  Status
                </p>
                <div className="flex flex-wrap gap-2">
                  <FilterChip active={statusFilter === 'pending'} onClick={() => setStatusFilter('pending')}>
                    Pending only
                  </FilterChip>
                  <FilterChip
                    active={statusFilter === 'needs-changes'}
                    onClick={() => setStatusFilter('needs-changes')}
                  >
                    Needs changes only
                  </FilterChip>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-ink-500 dark:text-ink-300 mb-2">
                  Content area
                </p>
                <div className="flex flex-wrap gap-2">
                  <FilterChip active={areaFilter === null} onClick={() => setAreaFilter(null)}>
                    All areas
                  </FilterChip>
                  {AREA_FILTERS.map((area) => (
                    <FilterChip key={area} active={areaFilter === area} onClick={() => setAreaFilter(area)}>
                      {area}
                    </FilterChip>
                  ))}
                </div>
              </div>
            </Card>

            <Card>
              <p className="text-sm font-bold text-ink-900 dark:text-sand-100">
                {exportItems.length} item{exportItems.length === 1 ? '' : 's'} selected for sharing
              </p>
              {!hasItems ? (
                <p className="text-sm text-ink-500 dark:text-ink-300 mt-2">
                  Nothing matches these filters. Try a different status or area.
                </p>
              ) : estimatedQrCount > 3 ? (
                <p className="text-sm text-coral-500 mt-2 leading-relaxed">
                  This is a lot to scan during a lesson. Try filtering the list first.
                </p>
              ) : (
                <p className="text-sm text-ink-500 dark:text-ink-300 mt-2">
                  Only review data is included — no progress or settings.
                </p>
              )}
            </Card>

            {hasItems ? (
              <Button variant="primary" size="lg" className="w-full" onClick={() => setGenerated(true)}>
                <Icon name="QrCode" className="h-5 w-5" />
                Generate review QR
              </Button>
            ) : (
              <Button variant="soft" size="lg" className="w-full" onClick={onBack}>
                Go back
              </Button>
            )}
          </>
        ) : (
          <>
            <Card>
              <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
                {exportItems.length} item{exportItems.length === 1 ? '' : 's'} selected for sharing. Ask Mihaela to
                open <span className="font-bold">Teacher review</span> and scan{' '}
                {codes.length > 1 ? `all ${codes.length} codes` : 'this code'}.
              </p>
            </Card>

            {codes.length > 3 && (
              <Card className="bg-coral-50 dark:bg-coral-400/10 border border-coral-200 dark:border-coral-400/20">
                <p className="text-sm text-coral-600 dark:text-coral-300 leading-relaxed">
                  This is a lot to scan during a lesson. Try filtering the list first.
                </p>
              </Card>
            )}

            <MultiQrPanel
              codes={codes}
              title="Review package"
              hint="Only review data is included — no settings or favourites."
            />

            <Button variant="soft" size="lg" className="w-full" onClick={() => setGenerated(false)}>
              Change filters
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
