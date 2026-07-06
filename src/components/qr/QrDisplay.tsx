import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

interface Props {
  value: string;
  size?: number;
  className?: string;
}

/** Large, scannable QR code for offline transfer */
export function QrDisplay({ value, size = 360, className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !value) return;

    let cancelled = false;

    QRCode.toCanvas(canvas, value, {
      width: size,
      margin: 4,
      errorCorrectionLevel: 'L',
      color: { dark: '#000000', light: '#ffffff' },
    })
      .then(() => {
        if (!cancelled) setError(null);
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setError(
            e.message?.includes('too big')
              ? 'Too much data for one QR code — this should have been split automatically. Try again.'
              : 'Could not generate QR code.'
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [value, size]);

  if (error) {
    return (
      <div className={`rounded-3xl bg-coral-50 dark:bg-coral-400/10 p-6 text-center ${className}`}>
        <p className="text-sm font-bold text-coral-500">{error}</p>
      </div>
    );
  }

  return (
    <div className={`flex justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        className="rounded-3xl bg-white p-4 shadow-soft-lg max-w-full h-auto"
        aria-label="QR code"
      />
    </div>
  );
}
