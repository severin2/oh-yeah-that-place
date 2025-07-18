import type { SearchResult } from '@shared/search';

export async function searchPlaces(query: string): Promise<SearchResult[]> {
  const res = await fetch(
    `${
      process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000'
    }/search?query=${encodeURIComponent(query)}`
  );
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Search failed');
  }
  const data = await res.json();
  return data.results;
}
