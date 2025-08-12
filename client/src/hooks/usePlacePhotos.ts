import type { PhotoDetail } from '@shared/search';
import { useCallback, useState } from 'react';
import { loadPhotoDetails } from '../api/search';

export function usePlacePhotos() {
  const [photos, setPhotos] = useState<PhotoDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (photos: string[]) => {
    setLoading(true);
    setError(null);
    setPhotos([]);
    try {
      const places = await loadPhotoDetails(photos);
      setPhotos(places);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  return { photos, loading, error, load };
}
