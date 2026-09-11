export const CACHE_TTL_MS = 30_000;
export const DEGRADED_TTL_MS = 60_000;

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

export function getCache<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) {
    return null;
  }
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value as T;
}

export function peekCache<T>(key: string): T | null {
  const entry = store.get(key);
  return entry ? (entry.value as T) : null;
}

export function setCache<T>(
  key: string,
  value: T,
  ttlMs: number = CACHE_TTL_MS
): void {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}