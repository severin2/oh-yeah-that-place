import { Router, Request, Response } from 'express';
import { mockSearchResults } from './mockSearchResults';
import { SearchResult } from '../../../shared/src/search';

export const searchRouter = Router();

// GET /search?query=string
searchRouter.get('/', (req: Request, res: Response) => {
  const query = ((req.query.query as string) || '').toLowerCase();
  if (!query) {
    res.status(400).json({ error: 'Missing or empty search query.' });
    return;
  }
  setTimeout(() => {
    // Filter mock results by name or description, similar to Google API
    const filtered = mockSearchResults.results;
    // Map to camelCase fields for frontend
    const camelResults: SearchResult[] = filtered.map((place) => ({
      placeId: place.place_id,
      name: place.name,
      types: place.types,
      formattedAddress: place.formatted_address,
      geometry: place.geometry,
      rating: place.rating,
      userRatingsTotal: place.user_ratings_total,
      openingHours: { openNow: place.opening_hours.open_now },
      photos: place.photos.map((photo) => ({
        photoReference: photo.photo_reference,
      })),
      icon: place.icon,
      businessStatus: place.business_status,
      description: place.description,
    }));
    res.json({ results: camelResults, status: mockSearchResults.status });
  }, 700); // 700ms fake API delay
});
