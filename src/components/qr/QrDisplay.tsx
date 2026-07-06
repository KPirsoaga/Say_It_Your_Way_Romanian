import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

interface Props {
  value: string;
  size?: number;
  className?: string;
}

/** Large, scannable QR code for offline transfer */
export function QrDisplay({ value, size = 320, className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !value) return;
    const level = value.length > 800 ? 'L' : 'M';
    QRCode.toCanvas(canvas, value, {
      width: size,
      margin: 4,
      errorCorrectionLevel: level,
      color: { dark: '#000000', light: '#ffffff' },
    }).catch(() => setError('Could not generate QR code.'));
  }, [value, size]);

  if (error) {
    return <p className="text-sm text-coral-500 text-center">{error}</p>;
  }

  return (
    <div className={`flex justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        className="rounded-3xl bg-white p-3 shadow-soft-lg max-w-full h-auto"
        aria-label="QR code"
      />
    </div>
  );
}
