import { encodeEnvelope, makeBatchId } from './codec';
import { APP_VERSION, QR_SCHEMA_VERSION, type QrChunkMeta, type QrEnvelope, type QrPackageType } from './types';

const MAX_QR_CHARS = 900;

export interface SplittablePayload {
  items: unknown[];
}

function envelopeSize<T>(envelope: QrEnvelope<T>): number {
  return encodeEnvelope(envelope).length;
}

function buildEnvelope<T>(
  type: QrPackageType,
  payload: T,
  at: string,
  chunk?: QrChunkMeta
): QrEnvelope<T> {
  return {
    v: QR_SCHEMA_VERSION,
    app: APP_VERSION,
    type,
    at,
    chunk,
    payload,
  };
}

/** Split item arrays across multiple QR codes when payload is too large */
export function encodePackageToQrStrings<T extends SplittablePayload>(type: QrPackageType, payload: T): string[] {
  const at = new Date().toISOString();
  const single = buildEnvelope(type, payload, at);
  if (envelopeSize(single) <= MAX_QR_CHARS) {
    return [encodeEnvelope(single)];
  }

  const bid = makeBatchId();
  const items = payload.items;
  if (items.length === 0) {
    return [encodeEnvelope(single)];
  }

  const groups: unknown[][] = [];
  let current: unknown[] = [];

  for (const item of items) {
    const trial = [...current, item];
    const trialEnv = buildEnvelope(type, { items: trial } as T, at, { bid, i: 0, n: 1 });
    if (envelopeSize(trialEnv) > MAX_QR_CHARS && current.length > 0) {
      groups.push(current);
      current = [item];
    } else {
      current = trial;
    }
  }
  if (current.length > 0) groups.push(current);

  const n = groups.length;
  return groups.map((group, i) => {
    const env = buildEnvelope(type, { items: group } as T, at, { bid, i, n });
    return encodeEnvelope(env);
  });
}

export interface CollectedChunk {
  bid: string;
  i: number;
  n: number;
  items: unknown[];
  type: QrPackageType;
  at: string;
}

/** Merge scanned chunks; returns null until all chunks received */
export function collectChunk(
  existing: Map<string, CollectedChunk>,
  env: QrEnvelope<SplittablePayload>
): { complete: true; type: QrPackageType; at: string; items: unknown[] } | { complete: false; received: number; total: number } | null {
  if (!env.chunk) {
    return { complete: true, type: env.type, at: env.at, items: env.payload.items ?? [] };
  }

  const { bid, i, n } = env.chunk;
  const key = `${bid}:${i}`;
  if (existing.has(key)) {
    const received = existing.size;
    return received >= n ? null : { complete: false, received, total: n };
  }

  existing.set(key, {
    bid,
    i,
    n,
    items: env.payload.items ?? [],
    type: env.type,
    at: env.at,
  });

  const batchKeys = [...existing.values()].filter((c) => c.bid === bid);
  if (batchKeys.length < n) {
    return { complete: false, received: batchKeys.length, total: n };
  }

  const merged = batchKeys
    .sort((a, b) => a.i - b.i)
    .flatMap((c) => c.items);

  batchKeys.forEach((c) => {
    existing.delete(`${c.bid}:${c.i}`);
  });

  return { complete: true, type: env.type, at: batchKeys[0]?.at ?? env.at, items: merged };
}
