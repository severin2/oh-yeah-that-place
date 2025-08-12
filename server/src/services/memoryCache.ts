// In-memory cache for search results, with a standard interface for future persistence
import { SearchResult } from '@shared/search';

export interface ISearchCache {
  get(key: string): SearchResult[] | undefined;
  set(key: string, value: SearchResult[]): void;
  clear(): void;
}

export class InMemorySearchCache implements ISearchCache {
  private cache = new Map<string, SearchResult[]>();

  get(key: string): SearchResult[] | undefined {
    return this.cache.get(key);
  }

  set(key: string, value: SearchResult[]): void {
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }
}
// PhotoCache.ts
// In-memory cache for photo details, with a standard interface for future persistence
import { PhotoDetail } from '@shared/search';

export interface IPhotoCache {
  get(key: string): PhotoDetail[] | undefined;
  set(key: string, value: PhotoDetail[]): void;
  clear(): void;
}

export class InMemoryPhotoCache implements IPhotoCache {
  private cache = new Map<string, PhotoDetail[]>();

  get(key: string): PhotoDetail[] | undefined {
    return this.cache.get(key);
  }

  set(key: string, value: PhotoDetail[]): void {
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }
}
