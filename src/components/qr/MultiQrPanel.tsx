import { useState } from 'react';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { QrDisplay } from './QrDisplay';

interface Props {
  codes: string[];
  title?: string;
  hint?: string;
}

/** Show one or more QR codes with simple prev/next navigation */
export function MultiQrPanel({ codes, title = 'QR code', hint }: Props) {
  const [index, setIndex] = useState(0);
  const total = codes.length;
  const current = codes[index] ?? '';

  if (total === 0) {
    return (
      <p className="text-sm text-ink-500 dark:text-ink-300 text-center">
        Nothing to share yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <p className="font-bold text-ink-900 dark:text-sand-100 text-lg">{title}</p>
        {total > 1 && (
          <p className="text-sm font-bold text-sea-600 dark:text-sea-200">
            QR {index + 1} of {total}
          </p>
        )}
        {hint && <p className="text-sm text-ink-500 dark:text-ink-300 leading-relaxed">{hint}</p>}
      </div>

      <QrDisplay value={current} />

      {total > 1 && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
          >
            <Icon name="ArrowLeft" className="h-5 w-5" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            disabled={index >= total - 1}
            onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
          >
            Next
            <Icon name="ArrowRight" className="h-5 w-5" />
          </Button>
        </div>
      )}

      {total > 1 && (
        <p className="text-xs text-ink-500 dark:text-ink-300 text-center leading-relaxed">
          Scan every QR code in order. The app combines them automatically.
        </p>
      )}
    </div>
  );
}
