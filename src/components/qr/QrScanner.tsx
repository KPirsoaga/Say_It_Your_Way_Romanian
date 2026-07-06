import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Button } from '../Button';
import { Icon } from '../Icon';
import type { ScannerStopFn } from '../../hooks/useScannerSafeBack';

interface Props {
  onScan: (text: string) => void;
  onError?: (message: string) => void;
  onRegisterStop?: (stop: ScannerStopFn) => void;
  className?: string;
}

const FILE_SINK_ID = 'qr-file-sink';

const SCAN_FORMATS = [Html5QrcodeSupportedFormats.QR_CODE];

function pickCameraId(cameras: { id: string; label: string }[]): string {
  const back = cameras.find((c) => /back|rear|environment/i.test(c.label));
  if (back) return back.id;
  // iOS often lists front camera first — prefer the last camera as rear fallback
  return cameras[cameras.length - 1]!.id;
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

/** Reliable QR scanner — camera, image upload, or paste code */
export function QrScanner({ onScan, onError, onRegisterStop, className = '' }: Props) {
  const videoRegionId = `qr-video-${useId().replace(/:/g, '')}`;
  const html5Ref = useRef<Html5Qrcode | null>(null);
  const mountedRef = useRef(true);
  const onScanRef = useRef(onScan);
  const onErrorRef = useRef(onError);
  const [cameraOn, setCameraOn] = useState(false);
  const [status, setStatus] = useState('Use the camera, upload a photo, or paste a code below.');
  const [pasteValue, setPasteValue] = useState('');
  const [showPaste, setShowPaste] = useState(false);

  onScanRef.current = onScan;
  onErrorRef.current = onError;

  const safeSetStatus = useCallback((msg: string) => {
    if (mountedRef.current) setStatus(msg);
  }, []);

  const stopCamera = useCallback(async () => {
    const instance = html5Ref.current;
    html5Ref.current = null;

    if (instance) {
      try {
        if (instance.isScanning) await instance.stop();
      } catch {
        // ignore
      }
      try {
        instance.clear();
      } catch {
        releaseMediaTracks(videoRegionId);
        const el = document.getElementById(videoRegionId);
        if (el) el.innerHTML = '';
      }
    } else {
      releaseMediaTracks(videoRegionId);
    }

    if (mountedRef.current) setCameraOn(false);
  }, [videoRegionId]);

  useEffect(() => {
    onRegisterStop?.(stopCamera);
    return () => {
      onRegisterStop?.(async () => {});
    };
  }, [onRegisterStop, stopCamera]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      void stopCamera();
    };
  }, [stopCamera]);

  const handleDecoded = useCallback(
    (text: string) => {
      if (!mountedRef.current) return;
      onScanRef.current(text);
      safeSetStatus('Code received — processing…');
      void stopCamera();
    },
    [safeSetStatus, stopCamera]
  );

  const startCamera = useCallback(async () => {
    if (html5Ref.current?.isScanning) return;

    if (!window.isSecureContext) {
      const msg = 'Camera needs HTTPS. Use “Upload QR image” or paste the code instead.';
      safeSetStatus(msg);
      onErrorRef.current?.(msg);
      return;
    }

    setCameraOn(true);
    safeSetStatus('Opening camera…');

    // Wait for the video region to be visible and laid out
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
    if (!mountedRef.current) return;

    const el = document.getElementById(videoRegionId);
    if (!el) return;
    el.innerHTML = '';

    const html5 = new Html5Qrcode(videoRegionId, { formatsToSupport: SCAN_FORMATS, verbose: false });
    html5Ref.current = html5;

    const config = {
      fps: 10,
      qrbox: (w: number, h: number) => {
        const size = Math.floor(Math.min(w, h, 280) * 0.8);
        return { width: Math.max(180, size), height: Math.max(180, size) };
      },
    };

    try {
      let started = false;
      const cameras = await Html5Qrcode.getCameras();
      if (cameras.length > 0) {
        await html5.start(pickCameraId(cameras), config, handleDecoded, () => undefined);
        started = true;
      }
      if (!started) {
        const tries: MediaTrackConstraints[] = [
          { facingMode: { ideal: 'environment' } },
          { facingMode: { ideal: 'user' } },
        ];
        for (const constraint of tries) {
          try {
            await html5.start(constraint, config, handleDecoded, () => undefined);
            started = true;
            break;
          } catch {
            // try next
          }
        }
      }
      if (!started) throw new Error('No camera available');
      safeSetStatus('Point the camera at the QR code. Hold steady.');
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : 'Could not open the camera.';
      safeSetStatus(`${msg} Try upload or paste instead.`);
      onErrorRef.current?.(msg);
      await stopCamera();
    }
  }, [handleDecoded, safeSetStatus, stopCamera, videoRegionId]);

  const handleFile = async (file: File) => {
    safeSetStatus('Reading image…');
    const html5 = new Html5Qrcode(FILE_SINK_ID, { formatsToSupport: SCAN_FORMATS, verbose: false });
    try {
      const result = await html5.scanFileV2(file, false);
      handleDecoded(result.decodedText);
    } catch {
      const msg = 'No QR code found in that image. Try a clearer, well-lit photo.';
      safeSetStatus(msg);
      onErrorRef.current?.(msg);
    } finally {
      try {
        html5.clear();
      } catch {
        // ignore
      }
    }
  };

  const submitPaste = () => {
    const text = pasteValue.trim();
    if (!text) return;
    handleDecoded(text);
    setPasteValue('');
    setShowPaste(false);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Always in DOM for file scanning */}
      <div id={FILE_SINK_ID} className="sr-only" aria-hidden />

      <div
        id={videoRegionId}
        className={`qr-video-region w-full overflow-hidden rounded-3xl bg-ink-900 ${
          cameraOn ? 'min-h-[300px]' : 'hidden'
        }`}
        aria-hidden={!cameraOn}
      />

      {!cameraOn && (
        <div className="rounded-3xl bg-sand-100 dark:bg-ink-900 ring-1 ring-sand-200 dark:ring-white/10 min-h-[100px] flex items-center justify-center p-4">
          <p className="text-sm text-ink-600 dark:text-ink-300 text-center leading-relaxed">{status}</p>
        </div>
      )}

      {cameraOn && (
        <p className="text-sm text-ink-600 dark:text-ink-300 text-center leading-relaxed">{status}</p>
      )}

      <div className="flex flex-col gap-2">
        {!cameraOn ? (
          <Button variant="primary" size="lg" className="w-full" onClick={() => void startCamera()}>
            <Icon name="QrCode" className="h-5 w-5" />
            Open camera
          </Button>
        ) : (
          <Button variant="secondary" size="lg" className="w-full" onClick={() => void stopCamera()}>
            <Icon name="X" className="h-5 w-5" />
            Stop camera
          </Button>
        )}

        <label className="w-full cursor-pointer">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
              e.target.value = '';
            }}
          />
          <span className="btn-lg w-full bg-sand-100 text-ink-700 hover:bg-sand-200 dark:bg-ink-900 dark:text-ink-300 dark:hover:bg-ink-800 rounded-2xl font-bold flex items-center justify-center gap-2 transition">
            <Icon name="Eye" className="h-5 w-5" />
            Upload QR photo
          </span>
        </label>

        <Button variant="ghost" size="md" className="w-full" onClick={() => setShowPaste((s) => !s)}>
          Paste code manually
        </Button>
      </div>

      {showPaste && (
        <div className="space-y-2 rounded-2xl bg-sand-100 dark:bg-ink-900 p-3">
          <p className="text-xs text-ink-500 dark:text-ink-400">
            Paste the full code starting with <span className="font-mono">rcd:</span>
          </p>
          <textarea
            value={pasteValue}
            onChange={(e) => setPasteValue(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-sand-200 dark:border-white/10 bg-white dark:bg-ink-800 px-3 py-2 text-sm font-mono text-ink-900 dark:text-sand-100 resize-none"
            placeholder="rcd:eyJ2Ijox..."
          />
          <Button variant="soft" size="md" className="w-full" onClick={submitPaste}>
            Use pasted code
          </Button>
        </div>
      )}
    </div>
  );
}
