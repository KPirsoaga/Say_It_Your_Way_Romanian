import { useCallback, useRef, useState } from 'react';
import { assertPackageType, collectChunk, decodeQrString, type QrPackageType } from '../services/qr';
import type { CollectedChunk, SplittablePayload } from '../services/qr/chunking';
import type { QrEnvelope } from '../services/qr/types';

export interface QrScanProgress {
  received: number;
  total: number;
}

export function useQrCollector<T>(
  expectedType: QrPackageType,
  onComplete: (items: T[]) => void
) {
  const chunksRef = useRef(new Map<string, CollectedChunk>());
  const [progress, setProgress] = useState<QrScanProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [lastRaw, setLastRaw] = useState<string | null>(null);

  const reset = useCallback(() => {
    chunksRef.current.clear();
    setProgress(null);
    setError(null);
    setSuccess(false);
    setLastRaw(null);
  }, []);

  const handleScan = useCallback(
    (raw: string) => {
      setLastRaw(raw.slice(0, 48) + (raw.length > 48 ? '…' : ''));
      try {
        const env = decodeQrString(raw);
        assertPackageType(env, expectedType);
        const result = collectChunk(chunksRef.current, env as QrEnvelope<SplittablePayload>);
        if (!result) return;
        if (!result.complete) {
          setProgress({ received: result.received, total: result.total });
          setError(null);
          return;
        }
        setProgress(null);
        setSuccess(true);
        setError(null);
        onComplete(result.items as T[]);
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Could not read this QR code.';
        setError(msg);
        setSuccess(false);
      }
    },
    [expectedType, onComplete]
  );

  return { handleScan, progress, error, success, reset, lastRaw };
}
