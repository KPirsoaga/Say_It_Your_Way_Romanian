import { useCallback, useRef } from 'react';

export type ScannerStopFn = () => Promise<void>;

/** Stop an active QR scanner before navigating away — prevents broken pages */
export function useScannerSafeBack(onBack: () => void) {
  const stopRef = useRef<ScannerStopFn | null>(null);

  const registerScannerStop = useCallback((stop: ScannerStopFn) => {
    stopRef.current = stop;
  }, []);

  const handleBack = useCallback(() => {
    void (async () => {
      if (stopRef.current) {
        await stopRef.current().catch(() => undefined);
      }
      onBack();
    })();
  }, [onBack]);

  return { handleBack, registerScannerStop };
}
