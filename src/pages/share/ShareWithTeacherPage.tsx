import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { Icon } from '../../components/Icon';

interface Props {
  onBack: () => void;
  onReviewSync: () => void;
  onProgressSync: () => void;
}

export function ShareWithTeacherPage({ onBack, onReviewSync, onProgressSync }: Props) {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Share with Teacher"
        subtitle="Offline QR codes for lessons with your teacher"
        onBack={onBack}
      />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-4">
        <Card className="bg-gradient-to-br from-sea-50 to-white dark:from-ink-900 dark:to-ink-900">
          <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
            The app supports the lesson — it does not replace the teacher. Share review items or your progress using QR codes. No accounts, no internet needed.
          </p>
        </Card>

        <button type="button" onClick={onReviewSync} className="w-full text-left">
          <Card className="p-5 hover:ring-2 hover:ring-sea-400 transition">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-2xl bg-rose-50 dark:bg-rose-400/20 flex items-center justify-center shrink-0">
                <Icon name="BookOpen" className="h-7 w-7 text-rose-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-ink-900 dark:text-sand-100 text-xl">Review Sync</p>
                <p className="text-sm text-ink-500 dark:text-ink-300 mt-1 leading-relaxed">
                  Two-way — share Romanian you want checked, your teacher reviews, you scan the response back.
                </p>
              </div>
              <Icon name="ChevronRight" className="h-6 w-6 text-ink-300 shrink-0 mt-1" />
            </div>
          </Card>
        </button>

        <button type="button" onClick={onProgressSync} className="w-full text-left">
          <Card className="p-5 hover:ring-2 hover:ring-sea-400 transition">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-2xl bg-sun-50 dark:bg-sun-300/20 flex items-center justify-center shrink-0">
                <Icon name="BarChart3" className="h-7 w-7 text-sun-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-ink-900 dark:text-sand-100 text-xl">Progress Sync</p>
                <p className="text-sm text-ink-500 dark:text-ink-300 mt-1 leading-relaxed">
                  One-way — before each lesson, show your teacher what you have practised.
                </p>
              </div>
              <Icon name="ChevronRight" className="h-6 w-6 text-ink-300 shrink-0 mt-1" />
            </div>
          </Card>
        </button>
      </div>
    </div>
  );
}
