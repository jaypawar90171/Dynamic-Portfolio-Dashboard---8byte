export declare const CACHE_TTL_MS = 30000;
export declare const DEGRADED_TTL_MS = 60000;
export declare function getCache<T>(key: string): T | null;
export declare function peekCache<T>(key: string): T | null;
export declare function setCache<T>(key: string, value: T, ttlMs?: number): void;
//# sourceMappingURL=cache.d.ts.map