// Simple memoization cache for thermodynamic calculations
class CalculationCache {
  private cache: Map<string, any> = new Map();
  private readonly maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  // Generate cache key from parameters
  private generateKey(params: any[]): string {
    return JSON.stringify(params);
  }

  // Get cached result
  get<T>(...params: any[]): T | undefined {
    const key = this.generateKey(params);
    return this.cache.get(key);
  }

  // Set cached result
  set<T>(result: T, ...params: any[]): void {
    // Remove oldest entry if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    const key = this.generateKey(params);
    this.cache.set(key, result);
  }

  // Clear cache
  clear(): void {
    this.cache.clear();
  }

  // Get cache size
  size(): number {
    return this.cache.size;
  }
}

// Global cache instances for different calculation types
export const pvDiagramCache = new CalculationCache(50);
export const tsDiagramCache = new CalculationCache(50);
export const cycleCalculationCache = new CalculationCache(30);

// Helper function to create memoized calculation functions
export function createMemoizedFunction<T extends (...args: any[]) => any>(
  fn: T,
  cache: CalculationCache
): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    // Check cache first
    const cachedResult = cache.get<ReturnType<T>>(...args);
    if (cachedResult !== undefined) {
      return cachedResult;
    }

    // Calculate and cache result
    const result = fn(...args);
    cache.set(result, ...args);
    
    return result;
  }) as T;
}