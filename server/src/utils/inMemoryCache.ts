interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class InMemoryCache<T = unknown> {
  private readonly store = new Map<string, CacheEntry<T>>();

  constructor(private readonly defaultTtlSeconds: number) {}

  get(key: string): T | undefined {
    const entry = this.store.get(key);

    if (!entry) {
      return undefined;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }

    return entry.value;
  }

  set(key: string, value: T, ttlSeconds: number = this.defaultTtlSeconds): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
    this.sweepExpired();
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  private sweepExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
  }
}