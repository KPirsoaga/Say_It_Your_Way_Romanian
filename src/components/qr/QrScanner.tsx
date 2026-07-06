import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { Button } from '../Button';
import { Icon } from '../Icon';
import type { ScannerStopFn } from '../../hooks/useScannerSafeBack';

interface Props {
  onScan: (text: string) => void;
  onError?: (message: string) => void;
  onRegisterStop?: (stop: ScannerStopFn) => void;
  className?: string;
}

function releaseMediaTracks(containerId: string) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.querySelectorAll('video').forEach((video) => {
    const stream = video.srcObject as MediaStream | null;
    stream?.getTracks().forEach((track) => track.stop());
    video.srcObject = null;
  });
}

/** Camera + file QR scanner with safe cleanup on navigate away */
export function QrScanner({ onScan, onError, onRegisterStop, className = '' }: Props) {
  const regionId = `qr-${useId().replace(/:/g, '')}`;
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const mountedRef = useRef(true);
  const onScanRef = useRef(onScan);
  const onErrorRef = useRef(onError);
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState('Tap below to open the camera or upload a QR image.');

  onScanRef.current = onScan;
  onErrorRef.current = onError;

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;
    scannerRef.current = null;

    if (scanner) {
      try {
        await scanner.clear();
      } catch {
        releaseMediaTracks(regionId);
        const el = document.getElementById(regionId);
        if (el) el.innerHTML = '';
      }
    } else {
      releaseMediaTracks(regionId);
    }

    if (mountedRef.current) {
      setActive(false);
      setStatus('Scanner stopped.');
    }
  }, [regionId]);

  useEffect(() => {
    onRegisterStop?.(stopScanner);
    return () => {
      onRegisterStop?.(async () => {});
    };
  }, [onRegisterStop, stopScanner]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      void stopScanner();
    };
  }, [stopScanner]);

  const start = () => {
    setStatus('Starting scanner…');
    setActive(true);
  };

  useEffect(() => {
    if (!active) return;

    const timer = window.setTimeout(() => {
      if (!mountedRef.current || scannerRef.current) return;

      const el = document.getElementById(regionId);
      if (!el) return;
      el.innerHTML = '';

      try {
        const scanner = new Html5QrcodeScanner(
          regionId,
          {
            fps: 10,
            qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
              const max = Math.min(viewfinderWidth, viewfinderHeight, 280);
              const size = Math.max(200, Math.floor(max * 0.85));
              return { width: size, height: size };
            },
            rememberLastUsedCamera: true,
            showTorchButtonIfSupported: true,
            supportedScanTypes: [
              Html5QrcodeScanType.SCAN_TYPE_CAMERA,
              Html5QrcodeScanType.SCAN_TYPE_FILE,
            ],
          },
          false
        );

        scannerRef.current = scanner;

        scanner.render(
          (decoded) => {
            if (!mountedRef.current) return;
            onScanRef.current(decoded);
            if (mountedRef.current) {
              setStatus('Code scanned successfully.');
            }
          },
          (errorMessage) => {
            // Fires continuously while no code is in view — only surface real failures
            if (
              typeof errorMessage === 'string' &&
              /permission|not found|not supported|failed/i.test(errorMessage)
            ) {
              if (mountedRef.current) {
                setStatus(errorMessage);
                onErrorRef.current?.(errorMessage);
              }
            }
          }
        );

        if (mountedRef.current) {
          setStatus('Allow camera access, then point at the QR code. Or use “Scan an Image File”.');
        }
      } catch (e) {
        const msg =
          e instanceof Error ? e.message : 'Could not start the scanner. Try uploading an image instead.';
        if (mountedRef.current) {
          setStatus(msg);
          onErrorRef.current?.(msg);
          setActive(false);
        }
      }
    }, 250);

    return () => {
      window.clearTimeout(timer);
    };
  }, [active, regionId]);

  return (
    <div className={`space-y-3 ${className}`}>
      <div
        id={regionId}
        className={`qr-scanner-host w-full min-h-[120px] ${active ? 'block' : 'hidden'}`}
        aria-hidden={!active}
      />

      {!active && (
        <div className="rounded-3xl bg-sand-100 dark:bg-ink-900 ring-1 ring-sand-200 dark:ring-white/10 min-h-[120px] flex items-center justify-center p-6">
          <p className="text-sm text-ink-600 dark:text-ink-300 text-center leading-relaxed">{status}</p>
        </div>
      )}

      {active && (
        <p className="text-sm text-ink-600 dark:text-ink-300 text-center leading-relaxed">{status}</p>
      )}

      <div className="flex flex-col gap-2">
        {!active ? (
          <Button variant="primary" size="lg" className="w-full" onClick={start}>
            <Icon name="QrCode" className="h-5 w-5" />
            Scan QR code
          </Button>
        ) : (
          <Button variant="secondary" size="lg" className="w-full" onClick={() => void stopScanner()}>
            <Icon name="X" className="h-5 w-5" />
            Stop scanner
          </Button>
        )}
      </div>

      <p className="text-xs text-ink-400 dark:text-ink-500 text-center leading-relaxed">
        Tip: on desktop, use “Scan an Image File” with a screenshot of the QR code.
      </p>
    </div>
  );
}
