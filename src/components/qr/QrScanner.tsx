import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '../Button';
import { Icon } from '../Icon';

interface Props {
  onScan: (text: string) => void;
  onError?: (message: string) => void;
  className?: string;
}

function pickCameraId(cameras: { id: string; label: string }[]): string {
  const back = cameras.find((c) => /back|rear|environment/i.test(c.label));
  const front = cameras.find((c) => /front|user|facetime|integrated|built-in/i.test(c.label));
  return (back ?? front ?? cameras[0])!.id;
}

const SCAN_CONFIG = {
  fps: 10,
  // Full-frame scan — no dark shaded overlay (cleaner on desktop webcams)
  disableFlip: false,
};

/** Camera-based QR scanner — works fully offline after page load */
export function QrScanner({ onScan, onError, className = '' }: Props) {
  const regionId = `qr-${useId().replace(/:/g, '')}`;
  const fileInputId = `${regionId}-file`;
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const startingRef = useRef(false);
  const onScanRef = useRef(onScan);
  const onErrorRef = useRef(onError);
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState('Tap to open the camera and scan a QR code.');
  const lastScanRef = useRef('');

  onScanRef.current = onScan;
  onErrorRef.current = onError;

  const stop = useCallback(async () => {
    startingRef.current = false;
    const scanner = scannerRef.current;
    if (scanner?.isScanning) {
      try {
        await scanner.stop();
      } catch {
        // ignore stop errors
      }
    }
    scanner?.clear();
    scannerRef.current = null;
    setActive(false);
    setStatus('Scanner stopped.');
  }, []);

  useEffect(() => () => {
    const scanner = scannerRef.current;
    if (scanner?.isScanning) {
      scanner.stop().catch(() => undefined);
    }
    scanner?.clear();
  }, []);

  const startScanner = useCallback(async () => {
    if (startingRef.current || scannerRef.current?.isScanning) return;
    startingRef.current = true;

    try {
      setStatus('Starting camera…');

      if (!window.isSecureContext) {
        throw new Error('Camera needs a secure connection (HTTPS). Open the app via https:// or localhost.');
      }

      const scanner = new Html5Qrcode(regionId, false);
      scannerRef.current = scanner;

      const onDecoded = (decoded: string) => {
        if (decoded === lastScanRef.current) return;
        lastScanRef.current = decoded;
        onScanRef.current(decoded);
        setStatus('Code scanned successfully.');
      };

      let started = false;

      try {
        const cameras = await Html5Qrcode.getCameras();
        if (cameras.length > 0) {
          await scanner.start(pickCameraId(cameras), SCAN_CONFIG, onDecoded, () => undefined);
          started = true;
        }
      } catch {
        // fall through to facingMode attempts
      }

      if (!started) {
        const constraints: MediaTrackConstraints[] = [
          { facingMode: { ideal: 'user' } },
          { facingMode: { ideal: 'environment' } },
        ];
        for (const constraint of constraints) {
          try {
            await scanner.start(constraint, SCAN_CONFIG, onDecoded, () => undefined);
            started = true;
            break;
          } catch {
            // try next
          }
        }
      }

      if (!started) {
        throw new Error('No camera found on this device.');
      }

      setStatus('Point the camera at a QR code. Hold steady for a moment.');
    } catch (e) {
      const msg =
        e instanceof Error && e.message
          ? e.message
          : 'Could not open the camera. Check permissions and try again.';
      setStatus(msg);
      onErrorRef.current?.(msg);
      await stop();
    } finally {
      startingRef.current = false;
    }
  }, [regionId, stop]);

  const start = () => {
    lastScanRef.current = '';
    setActive(true);
  };

  const scanFile = async (file: File) => {
    try {
      setStatus('Reading image…');
      const scanner = scannerRef.current ?? new Html5Qrcode(regionId, false);
      const result = await scanner.scanFileV2(file, false);
      const decoded = result.decodedText;
      if (decoded === lastScanRef.current) return;
      lastScanRef.current = decoded;
      onScanRef.current(decoded);
      setStatus('Code scanned successfully.');
    } catch {
      const msg = 'Could not find a QR code in that image. Try a clearer photo.';
      setStatus(msg);
      onErrorRef.current?.(msg);
    }
  };

  // Start only after the scanner region is visible in the DOM (not display:none)
  useEffect(() => {
    if (!active) return;
    const timer = window.setTimeout(() => {
      void startScanner();
    }, 150);
    return () => window.clearTimeout(timer);
  }, [active, startScanner]);

  return (
    <div className={`space-y-3 ${className}`}>
      <div
        id={regionId}
        className={`qr-scanner-region relative w-full aspect-[4/3] min-h-[280px] overflow-hidden rounded-3xl bg-ink-900 ${
          active ? 'block' : 'hidden'
        }`}
        aria-hidden={!active}
      />
      {!active && (
        <div className="rounded-3xl bg-sand-100 dark:bg-ink-900 ring-1 ring-sand-200 dark:ring-white/10 min-h-[200px] flex items-center justify-center p-6">
          <p className="text-sm text-ink-600 dark:text-ink-300 text-center leading-relaxed">{status}</p>
        </div>
      )}
      {active && status && (
        <p className="text-sm text-ink-600 dark:text-ink-300 text-center leading-relaxed">{status}</p>
      )}
      <div className="flex flex-col gap-2">
        {!active ? (
          <Button variant="primary" size="lg" className="w-full" onClick={start}>
            <Icon name="QrCode" className="h-5 w-5" />
            Scan QR code
          </Button>
        ) : (
          <Button variant="secondary" size="lg" className="w-full" onClick={() => void stop()}>
            <Icon name="X" className="h-5 w-5" />
            Stop scanner
          </Button>
        )}
        <label htmlFor={fileInputId} className="w-full">
          <input
            id={fileInputId}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void scanFile(file);
              e.target.value = '';
            }}
          />
          <span className="btn-lg w-full bg-sand-100 text-ink-700 hover:bg-sand-200 dark:bg-ink-900 dark:text-ink-300 dark:hover:bg-ink-800 rounded-2xl font-bold flex items-center justify-center gap-2 cursor-pointer transition">
            <Icon name="Eye" className="h-5 w-5" />
            Upload QR image
          </span>
        </label>
      </div>
      <p className="text-xs text-ink-400 dark:text-ink-500 text-center leading-relaxed">
        On desktop, you can screenshot the QR on your phone and upload it here.
      </p>
    </div>
  );
}
