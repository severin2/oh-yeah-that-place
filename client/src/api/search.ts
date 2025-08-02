import type { SearchResponse, SearchResult } from '@shared/search';

export async function searchPlaces(query: string): Promise<SearchResult[]> {
  if (!query?.trim()) {
    throw new Error('Search query cannot be empty');
  }

  const params = new URLSearchParams({
    query: query.trim(),
    limit: '10', // Default limit
  });

  const url = `${process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000'}/search?${params}`;

  try {
    const res = await fetch(url);
    const data = (await res.json()) as SearchResponse;

    if (!res.ok || data.status === 'ERROR') {
      throw new Error(data.error || `Search failed with status ${res.status}`);
    }

    if (data.status === 'ZERO_RESULTS') {
      return [];
    }

    return data.results;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to perform search');
  }
}

/**
 * Helper function to get a place by its coordinates
 */
export async function getPlaceByCoordinates(
  latitude: number,
  longitude: number
): Promise<SearchResult | null> {
  const params = new URLSearchParams({
    lat: latitude.toString(),
    lng: longitude.toString(),
  });

  const url = `${
    process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000'
  }/search/reverse?${params}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `Failed to get place details`);
    }

    return data.result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to get place details');
  }
}
