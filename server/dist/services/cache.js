export const CACHE_TTL_MS = 30_000;
export const DEGRADED_TTL_MS = 60_000;
const store = new Map();
export function getCache(key) {
    const entry = store.get(key);
    if (!entry) {
        return null;
    }
    if (Date.now() > entry.expiresAt) {
        store.delete(key);
        return null;
    }
    return entry.value;
}
export function peekCache(key) {
    const entry = store.get(key);
    return entry ? entry.value : null;
}
export function setCache(key, value, ttlMs = CACHE_TTL_MS) {
    store.set(key, { value, expiresAt: Date.now() + ttlMs });
}
//# sourceMappingURL=cache.js.map