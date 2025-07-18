import { useState, useCallback } from 'react';
import { searchPlaces } from '../api/search';
import type { SearchResult } from '@shared/search';

export function usePlaceSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const places = await searchPlaces(query);
      setResults(places);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, search };
}
