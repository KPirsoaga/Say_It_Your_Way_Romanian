import { QR_PREFIX, QR_SCHEMA_VERSION, type QrEnvelope, type QrPackageType } from './types';

export class QrDecodeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QrDecodeError';
  }
}

function utf8ToBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

function base64ToUtf8(b64: string): string {
  const binary = atob(b64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeEnvelope<T>(envelope: QrEnvelope<T>): string {
  const json = JSON.stringify(envelope);
  return `${QR_PREFIX}${utf8ToBase64(json)}`;
}

export function decodeQrString(raw: string): QrEnvelope {
  const trimmed = raw.trim();
  if (!trimmed.startsWith(QR_PREFIX)) {
    throw new QrDecodeError('This is not a Say It Your Way code.');
  }
  const b64 = trimmed.slice(QR_PREFIX.length);
  let json: string;
  try {
    json = base64ToUtf8(b64);
  } catch {
    throw new QrDecodeError('Could not read this QR code.');
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new QrDecodeError('This QR code is not valid app data.');
  }
  if (!parsed || typeof parsed !== 'object') {
    throw new QrDecodeError('This QR code is not valid app data.');
  }
  const env = parsed as QrEnvelope;
  if (env.v !== QR_SCHEMA_VERSION) {
    throw new QrDecodeError('This QR code was made with a different app version.');
  }
  if (!env.type || !env.payload) {
    throw new QrDecodeError('This QR code is missing required data.');
  }
  return env;
}

export function assertPackageType(env: QrEnvelope, expected: QrPackageType): void {
  if (env.type !== expected) {
    throw new QrDecodeError(`Expected ${expected} data, but this code is for ${env.type}.`);
  }
}

export function makeBatchId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}
