import { useEffect, useState } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

export interface MemoryStats {
  cacheSize: number;
  maxSize: number;
  usagePercentage: number;
}

export interface CacheStats {
  size: number;
  maxSize: number;
  entries: string[];
}

class CacheService {
  private cache = new Map<string, CacheEntry<unknown>>();
  private maxSize = 50; // Maximum number of cache entries
  private defaultTTL = 300000; // 5 minutes

  private cacheSizeValue = 0;
  private listeners = new Set<(size: number) => void>();

  constructor() {
    // Clean up cache every minute
    setInterval(() => this.cleanup(), 60000);

    // Monitor memory pressure
    if ('memory' in performance) {
      setInterval(() => this.checkMemoryPressure(), 30000);
    }
  }

  private setCacheSize(size: number): void {
    this.cacheSizeValue = size;
    this.listeners.forEach((fn) => fn(size));
  }

  get cacheSize(): number {
    return this.cacheSizeValue;
  }

  subscribe(fn: (size: number) => void): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  get memoryStats(): MemoryStats {
    return {
      cacheSize: this.cacheSizeValue,
      maxSize: this.maxSize,
      usagePercentage: Math.round((this.cacheSizeValue / this.maxSize) * 100)
    };
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

    this.setCacheSize(this.cache.size);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.setCacheSize(this.cache.size);
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
      this.setCacheSize(this.cache.size);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    const result = this.cache.delete(key);
    this.setCacheSize(this.cache.size);
    return result;
  }

  clear(): void {
    this.cache.clear();
    this.setCacheSize(0);
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
      this.setCacheSize(this.cache.size);
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
    const memInfo = (performance as unknown as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number } }).memory;

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

        this.setCacheSize(this.cache.size);
        console.warn(`Memory pressure detected. Removed ${removed} cache entries.`);
      }
    }
  }

  // Helper method for debugging
  getStats(): CacheStats {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      entries: Array.from(this.cache.keys())
    };
  }
}

// Singleton instance (mirrors Angular's providedIn: 'root')
export const cacheService = new CacheService();

// React hook exposing reactive cache size, mirroring the Angular cacheSize signal.
export function useCacheSize(): number {
  const [size, setSize] = useState<number>(cacheService.cacheSize);

  useEffect(() => {
    setSize(cacheService.cacheSize);
    return cacheService.subscribe(setSize);
  }, []);

  return size;
}

// React hook exposing reactive memory stats, mirroring the Angular memoryStats computed.
export function useMemoryStats(): MemoryStats {
  const size = useCacheSize();
  void size; // re-render trigger; memoryStats reads from the singleton
  return cacheService.memoryStats;
}
