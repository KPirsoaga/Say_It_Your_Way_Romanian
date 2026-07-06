import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { useReview } from '../context/ReviewContext';
import type { ReviewCatalogItem, ReviewStatus } from '../types';

interface Props {
  onBack: () => void;
}

type FilterKey = 'active' | ReviewStatus | 'all';

const filterOptions: { key: FilterKey; label: string }[] = [
  { key: 'active', label: 'To review' },
  { key: 'pending', label: 'Pending' },
  { key: 'needs-changes', label: 'Needs changes' },
  { key: 'approved', label: 'Approved' },
  { key: 'all', label: 'All' },
];

const statusStyles: Record<ReviewStatus, string> = {
  pending: 'bg-sun-100 text-sun-500 dark:bg-sun-300/20 dark:text-sun-300',
  approved: 'bg-sea-50 text-sea-600 dark:bg-sea-600/20 dark:text-sea-200',
  'needs-changes': 'bg-coral-50 text-coral-500 dark:bg-coral-400/20 dark:text-coral-200',
};

const statusLabels: Record<ReviewStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  'needs-changes': 'Needs changes',
};

export function MihaelaReviewPage({ onBack }: Props) {
  const { counts, itemsByStatus, getEffectiveStatus, getDecisionNotes, markApproved, markNeedsChanges, resetItem } =
    useReview();
  const [filter, setFilter] = useState<FilterKey>('active');

  const visible = itemsByStatus(filter);

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Mihaela Review"
        subtitle="Romanian content to check together in lessons"
        onBack={onBack}
      />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-5">
        <Card className="bg-gradient-to-br from-rose-50 to-white dark:from-ink-900 dark:to-ink-900">
          <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
            Items flagged for teacher review appear here. Mark approved or note what to change — saved on this device only.
          </p>
        </Card>

        <section className="grid grid-cols-3 gap-3 tile-grid">
          <CountCard label="Pending" value={counts.pending} color="text-sun-400" />
          <CountCard label="Approved" value={counts.approved} color="text-sea-600 dark:text-sea-200" />
          <CountCard label="Needs changes" value={counts.needsChanges} color="text-coral-400" />
        </section>

        <div className="flex flex-wrap gap-2">
          {filterOptions.map((opt) => {
            const active = filter === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => setFilter(opt.key)}
                aria-pressed={active}
                className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${
                  active
                    ? 'bg-sea-500 text-white shadow-soft'
                    : 'bg-sand-100 text-ink-700 dark:bg-ink-900 dark:text-ink-300'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {visible.length === 0 ? (
          <Card className="text-center py-8">
            <Icon name="Check" className="h-10 w-10 text-sea-600 dark:text-sea-200 mx-auto mb-3" />
            <p className="font-bold text-ink-900 dark:text-sand-100">Nothing in this list right now.</p>
            <p className="text-sm text-ink-500 dark:text-ink-300 mt-1">
              {filter === 'active' ? 'All flagged items have been reviewed on this device.' : 'Try another filter.'}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {visible.map((item) => (
              <ReviewCard
                key={item.id}
                item={item}
                status={getEffectiveStatus(item.id)}
                decisionNotes={getDecisionNotes(item.id)}
                onApprove={(notes) => markApproved(item.id, notes)}
                onNeedsChanges={(notes) => markNeedsChanges(item.id, notes)}
                onReset={() => resetItem(item.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CountCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="card !p-3 flex flex-col items-center gap-1 min-w-0">
      <span className={`text-2xl font-bold text-ink-900 dark:text-sand-100`}>{value}</span>
      <span className={`tile-label text-xs text-center font-bold ${color}`}>{label}</span>
    </div>
  );
}

function ReviewCard({
  item,
  status,
  decisionNotes,
  onApprove,
  onNeedsChanges,
  onReset,
}: {
  item: ReviewCatalogItem;
  status: ReviewStatus;
  decisionNotes?: string;
  onApprove: (notes?: string) => void;
  onNeedsChanges: (notes: string) => void;
  onReset: () => void;
}) {
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState(decisionNotes ?? '');

  const combinedNotes = [item.teacherNotes, decisionNotes].filter(Boolean).join(' · ');

  return (
    <Card className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wide text-ink-500 dark:text-ink-300">
          {item.contentArea}
        </span>
        <span className={`text-xs font-bold rounded-full px-3 py-1 ${statusStyles[status]}`}>{statusLabels[status]}</span>
      </div>

      {item.contextLabel && (
        <p className="text-sm font-bold text-ink-700 dark:text-ink-300">{item.contextLabel}</p>
      )}

      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-ink-400 dark:text-ink-500 mb-1">Romanian</p>
        <p className="text-lg font-bold text-ink-900 dark:text-sand-100 leading-snug" lang="ro">
          {item.ro}
        </p>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-ink-400 dark:text-ink-500 mb-1">English</p>
        <p className="text-base text-ink-700 dark:text-ink-300 leading-relaxed">{item.en}</p>
      </div>

      <div className="rounded-2xl bg-sand-100 dark:bg-ink-900 p-3">
        <p className="text-xs font-bold uppercase tracking-wide text-ink-500 dark:text-ink-400 mb-1">Why review?</p>
        <p className="text-sm text-ink-800 dark:text-sand-100 leading-relaxed">{item.reviewReason}</p>
        {item.suggestedBy && (
          <p className="text-xs text-ink-500 dark:text-ink-400 mt-2">Suggested by: {item.suggestedBy}</p>
        )}
      </div>

      {combinedNotes && (
        <div className="rounded-2xl bg-sea-50 dark:bg-sea-600/10 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-sea-600 dark:text-sea-200 mb-1">Teacher notes</p>
          <p className="text-sm text-ink-800 dark:text-sand-100 leading-relaxed">{combinedNotes}</p>
        </div>
      )}

      {noteOpen && (
        <label className="block">
          <span className="text-sm font-bold text-ink-700 dark:text-ink-300">Note for this item (optional)</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="mt-2 w-full rounded-2xl border-2 border-sand-200 dark:border-white/10 bg-white dark:bg-ink-900 p-3 text-base text-ink-900 dark:text-sand-100 resize-none focus:border-sea-400 outline-none"
            placeholder="e.g. Use Puteți repeta instead"
          />
        </label>
      )}

      <div className="flex flex-col gap-2 pt-1">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={() => onApprove(note.trim() || undefined)}
        >
          <Icon name="Check" className="h-5 w-5" />
          Mark approved
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={() => {
            if (!note.trim()) {
              setNoteOpen(true);
              return;
            }
            onNeedsChanges(note.trim());
          }}
        >
          <Icon name="Wrench" className="h-5 w-5" />
          Needs changes
        </Button>
        {!noteOpen && (
          <Button variant="ghost" size="md" className="w-full" onClick={() => setNoteOpen(true)}>
            Add a note
          </Button>
        )}
        {status !== 'pending' && (
          <Button variant="ghost" size="md" className="w-full" onClick={onReset}>
            <Icon name="RotateCcw" className="h-5 w-5" />
            Reset to pending
          </Button>
        )}
      </div>
    </Card>
  );
}
