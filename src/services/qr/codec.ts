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

/** Compact type codes to shrink QR payloads */
const TYPE_TO_COMPACT: Record<QrPackageType, string> = {
  'review-export': 're',
  'review-response': 'rr',
  'progress-export': 'pe',
};

const COMPACT_TO_TYPE: Record<string, QrPackageType> = {
  re: 'review-export',
  rr: 'review-response',
  pe: 'progress-export',
};

interface CompactEnvelope {
  v: number;
  a: string;
  t: string;
  at: string;
  c?: { b: string; i: number; n: number };
  p: unknown;
}

function toCompact<T>(envelope: QrEnvelope<T>): CompactEnvelope {
  const compact: CompactEnvelope = {
    v: envelope.v,
    a: envelope.app,
    t: TYPE_TO_COMPACT[envelope.type],
    at: envelope.at,
    p: envelope.payload,
  };
  if (envelope.chunk) {
    compact.c = { b: envelope.chunk.bid, i: envelope.chunk.i, n: envelope.chunk.n };
  }
  return compact;
}

function fromCompact(raw: CompactEnvelope): QrEnvelope {
  const type = COMPACT_TO_TYPE[raw.t];
  if (!type) throw new QrDecodeError('Unknown QR package type.');
  return {
    v: raw.v,
    app: raw.a,
    type,
    at: raw.at,
    chunk: raw.c ? { bid: raw.c.b, i: raw.c.i, n: raw.c.n } : undefined,
    payload: raw.p,
  };
}

export function encodeEnvelope<T>(envelope: QrEnvelope<T>): string {
  const compact = toCompact(envelope);
  const json = JSON.stringify(compact);
  return `${QR_PREFIX}${utf8ToBase64(json)}`;
}

export function decodeQrString(raw: string): QrEnvelope {
  const trimmed = raw.trim();
  if (!trimmed.startsWith(QR_PREFIX)) {
    throw new QrDecodeError('This is not a Say It Your Way code. It should start with rcd:');
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

  // Support compact (new) and legacy (full field names) envelopes
  const obj = parsed as Record<string, unknown>;
  const env =
    't' in obj && typeof obj.t === 'string' && obj.t.length <= 2
      ? fromCompact(obj as unknown as CompactEnvelope)
      : (obj as unknown as QrEnvelope);

  if (env.v !== QR_SCHEMA_VERSION) {
    throw new QrDecodeError('This QR code was made with a different app version.');
  }
  if (!env.type || env.payload === undefined) {
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
