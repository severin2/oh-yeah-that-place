import type {
  PhotoDetail,
  PhotoDetailsResponse,
  SearchResponse,
  SearchResult,
} from '@shared/search';
import { getBaseUrl } from './vars';

export async function loadPhotoDetails(photos: string[]): Promise<PhotoDetail[]> {
  if (!photos || photos.length === 0) {
    throw new Error('Photo names cannot be empty');
  }

  const url = `${getBaseUrl()}/search/photos`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ photos }),
    });
    const data = (await res.json()) as PhotoDetailsResponse;

    if (!res.ok || data.status === 'ERROR') {
      throw new Error(data.error || `Failed to load photos with status ${res.status}`);
    }

    return data.photos;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to load photos');
  }
}

export async function searchPlaces(query: string): Promise<SearchResult[]> {
  if (!query?.trim()) {
    throw new Error('Search query cannot be empty');
  }

  const params = new URLSearchParams({
    query: query.trim(),
    limit: '10', // Default limit
  });

  const url = `${getBaseUrl()}/search?${params}`;

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

  const url = `${getBaseUrl()}/search/reverse?${params}`;

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
