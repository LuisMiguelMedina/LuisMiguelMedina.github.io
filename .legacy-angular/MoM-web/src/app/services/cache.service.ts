import { Injectable, signal, computed } from '@angular/core';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize = 50; // Maximum number of cache entries
  private defaultTTL = 300000; // 5 minutes

  // Signal to track cache size for monitoring
  private cacheSizeSignal = signal(0);
  cacheSize = this.cacheSizeSignal.asReadonly();

  // Memory usage stats
  memoryStats = computed(() => ({
    cacheSize: this.cacheSize(),
    maxSize: this.maxSize,
    usagePercentage: Math.round((this.cacheSize() / this.maxSize) * 100)
  }));

  constructor() {
    // Clean up cache every minute
    setInterval(() => this.cleanup(), 60000);

    // Monitor memory pressure
    if ('memory' in performance) {
      setInterval(() => this.checkMemoryPressure(), 30000);
    }
  }

  set<T>(key: string, data: T, ttl = this.defaultTTL): void {
    // If cache is full, remove oldest entries
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });

    this.cacheSizeSignal.set(this.cache.size);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.cacheSizeSignal.set(this.cache.size);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.cacheSizeSignal.set(this.cache.size);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    const result = this.cache.delete(key);
    this.cacheSizeSignal.set(this.cache.size);
    return result;
  }

  clear(): void {
    this.cache.clear();
    this.cacheSizeSignal.set(0);
  }

  private cleanup(): void {
    const now = Date.now();
    let deleted = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        deleted++;
      }
    }

    if (deleted > 0) {
      this.cacheSizeSignal.set(this.cache.size);
      console.log(`Cache cleanup: removed ${deleted} expired entries`);
    }
  }

  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      console.log(`Cache evicted oldest entry: ${oldestKey}`);
    }
  }

  private checkMemoryPressure(): void {
    // @ts-ignore - performance.memory might not be available in all browsers
    const memInfo = (performance as any).memory;

    if (memInfo) {
      const memoryUsage = memInfo.usedJSHeapSize / memInfo.totalJSHeapSize;

      // If memory usage is high (> 80%), aggressively clear cache
      if (memoryUsage > 0.8) {
        const entriesToRemove = Math.floor(this.cache.size * 0.5);
        let removed = 0;

        for (const [key] of this.cache.entries()) {
          if (removed >= entriesToRemove) break;
          this.cache.delete(key);
          removed++;
        }

        this.cacheSizeSignal.set(this.cache.size);
        console.warn(`Memory pressure detected. Removed ${removed} cache entries.`);
      }
    }
  }

  // Helper method for debugging
  getStats(): any {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      entries: Array.from(this.cache.keys())
    };
  }
}
