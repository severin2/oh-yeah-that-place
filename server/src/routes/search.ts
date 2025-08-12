import { Router, Request, Response, NextFunction } from 'express';
import { SearchResponse, ReverseGeocodeResponse, PhotoDetailsResponse } from '@shared/search';
import { googlePlacesService } from '../services/googleService';

export const searchRouter = Router();

/**
 * GET /search?query=string&limit=number
 * Search for places using text query
 */
searchRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const { query, limit } = req.query as Record<string, string>;

  try {
    // Validate required parameters
    if (!query || typeof query !== 'string' || !query.trim()) {
      const errorResponse: SearchResponse = {
        results: [],
        status: 'INVALID_REQUEST',
        error: 'Query parameter is required and cannot be empty',
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Parse and validate limit parameter
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 50) {
      const errorResponse: SearchResponse = {
        results: [],
        status: 'INVALID_REQUEST',
        error: 'Limit must be a number between 1 and 50',
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Search using Google Places API
    try {
      const results = await googlePlacesService.searchText(query.trim(), parsedLimit);
      const response: SearchResponse = {
        results,
        status: results.length > 0 ? 'OK' : 'ZERO_RESULTS',
      };
      res.json(response);
    } catch (error) {
      const response: SearchResponse = {
        results: [],
        status: 'ERROR',
        error: 'Failed to fetch search results',
      };
      res.status(500).json(response);
      return;
    }
  } catch (error) {
    next(error);
  }
});

searchRouter.post('/photos', async (req: Request, res: Response, next: NextFunction) => {
  const { photos } = req.body as { photos: string[] };

  try {
    if (!Array.isArray(photos) || photos.length === 0) {
      const errorResponse: PhotoDetailsResponse = {
        photos: [],
        status: 'INVALID_REQUEST',
        error: `Parameter 'photos' is required and cannot be empty`,
      };
      res.status(400).json(errorResponse);
      return;
    }

    const photoDetails = await googlePlacesService.getPhotos(photos);
    const response: PhotoDetailsResponse = {
      photos: photoDetails,
      status: photoDetails ? 'OK' : 'ZERO_RESULTS',
    };
    res.json(response);
  } catch (error) {
    const response: PhotoDetailsResponse = {
      photos: [],
      status: 'ERROR',
      error: 'Failed to fetch search results',
    };
    res.status(500).json(response);
    return;
  }
});

/**
 * GET /search/reverse?lat=number&lng=number
 * Get place information from coordinates
 */
searchRouter.get('/reverse', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { lat, lng } = req.query as Record<string, string>;

    // Validate required parameters
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      const errorResponse: ReverseGeocodeResponse = {
        result: null,
        status: 'INVALID_REQUEST',
        error: 'Valid lat and lng parameters are required',
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Search using Google Places API
    try {
      const result = await googlePlacesService.searchByLocation(latitude, longitude);
      const response: ReverseGeocodeResponse = {
        result,
        status: result ? 'OK' : 'ZERO_RESULTS',
      };
      res.json(response);
      return;
    } catch (error) {
      const response: ReverseGeocodeResponse = {
        result: null,
        status: 'ERROR',
        error: 'Failed to fetch location information',
      };
      res.status(500).json(response);
      return;
    }
  } catch (error) {
    next(error);
  }
});
