import { useEffect, useId, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '../Button';
import { Icon } from '../Icon';

interface Props {
  onScan: (text: string) => void;
  onError?: (message: string) => void;
  className?: string;
}

/** Camera-based QR scanner — works fully offline after page load */
export function QrScanner({ onScan, onError, className = '' }: Props) {
  const regionId = useId().replace(/:/g, '');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState('Tap to open the camera and scan a QR code.');
  const lastScanRef = useRef('');

  useEffect(() => {
    return () => {
      const scanner = scannerRef.current;
      if (scanner?.isScanning) {
        scanner.stop().catch(() => undefined);
      }
      scanner?.clear();
    };
  }, []);

  const stop = async () => {
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop().catch(() => undefined);
    }
    setActive(false);
    setStatus('Scanner stopped.');
  };

  const start = async () => {
    try {
      setStatus('Starting camera…');
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(regionId);
      }
      await scannerRef.current.start(
        { facingMode: 'environment' },
        { fps: 8, qrbox: { width: 260, height: 260 } },
        (decoded) => {
          if (decoded === lastScanRef.current) return;
          lastScanRef.current = decoded;
          onScan(decoded);
          setStatus('Code scanned successfully.');
        },
        () => undefined
      );
      setActive(true);
      setStatus('Point the camera at a QR code.');
    } catch {
      const msg = 'Could not open the camera. Check permissions and try again.';
      setStatus(msg);
      onError?.(msg);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div
        id={regionId}
        className={`overflow-hidden rounded-3xl bg-ink-900 min-h-[280px] ${active ? '' : 'hidden'}`}
      />
      {!active && (
        <div className="rounded-3xl bg-sand-100 dark:bg-ink-900 ring-1 ring-sand-200 dark:ring-white/10 min-h-[200px] flex items-center justify-center p-6">
          <p className="text-sm text-ink-600 dark:text-ink-300 text-center leading-relaxed">{status}</p>
        </div>
      )}
      <div className="flex flex-col gap-2">
        {!active ? (
          <Button variant="primary" size="lg" className="w-full" onClick={start}>
            <Icon name="QrCode" className="h-5 w-5" />
            Scan QR code
          </Button>
        ) : (
          <Button variant="secondary" size="lg" className="w-full" onClick={stop}>
            <Icon name="X" className="h-5 w-5" />
            Stop scanner
          </Button>
        )}
      </div>
    </div>
  );
}
