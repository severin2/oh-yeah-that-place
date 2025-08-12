import { PlacesClient, protos } from '@googlemaps/places';
import { PhotoDetail, SearchResult } from '@shared/search';
import { InMemoryPhotoCache } from './memoryCache';
import { InMemorySearchCache } from './memoryCache';
import chalk from 'chalk';

type IPlace = protos.google.maps.places.v1.IPlace;
type IPlaceWithId = IPlace & { id: string };
export class GooglePlacesService {
  private readonly placesClient: PlacesClient;
  private readonly fieldMask = [
    'places.id',
    'places.displayName',
    'places.formattedAddress',
    'places.location',
    'places.types',
    'places.rating',
    'places.userRatingCount',
    'places.currentOpeningHours',
    'places.photos',
    'places.iconMaskBaseUri',
    'places.businessStatus',
    'places.editorialSummary',
  ].join(',');

  private photoCache = new InMemoryPhotoCache();
  private searchCache = new InMemorySearchCache();

  constructor() {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY is not set in environment variables');
    }
    this.placesClient = new PlacesClient({
      apiKey,
    });
  }

  async searchText(query: string, limit: number = 10): Promise<SearchResult[]> {
    const cacheKey = JSON.stringify({ query, limit });
    const cached = this.searchCache.get(cacheKey);
    if (cached) {
      console.info(chalk.green(`Search cache hit`));
      return cached;
    }
    console.info(chalk.red(`Search cache miss`));

    const request = {
      textQuery: query,
      maxResultCount: limit,
    };

    const [response] = await this.placesClient.searchText(request, {
      otherArgs: {
        headers: {
          'X-Goog-FieldMask': this.fieldMask,
        },
      },
    });

    const results = await this.transformPlacesToResults(response.places || []);
    this.searchCache.set(cacheKey, results);
    return results;
  }

  async searchByLocation(lat: number, lng: number): Promise<SearchResult | null> {
    const request = {
      locationRestriction: {
        circle: {
          center: {
            latitude: lat,
            longitude: lng,
          },
          radius: 1.0, // 1 meter radius to get closest place
        },
      },
      maxResultCount: 1,
    };

    const [response] = await this.placesClient.searchNearby(request, {
      otherArgs: {
        headers: {
          'X-Goog-FieldMask': this.fieldMask,
        },
      },
    });

    const places = response.places || [];
    return places.length > 0 ? this.transformPlaceToResult(places[0]) : null;
  }

  public async getPhotos(photoNames: string[], maxHeightPx: number = 800) {
    const cacheKey = JSON.stringify({ photoNames, maxHeightPx });
    const cached = this.photoCache.get(cacheKey);
    if (cached) {
      console.info(chalk.green(`Photos cache hit`));
      return cached;
    }
    console.info(chalk.red(`Photos cache miss`));

    const photos: PhotoDetail[] = [];
    for (let photoName of photoNames) {
      const photo = await this.placesClient.getPhotoMedia({
        name: photoName + '/media',
        maxHeightPx,
      });
      if (photo.length) {
        photos.push({
          name: photo[0].name || '',
          uri: photo[0].photoUri || '',
        });
      }
    }
    this.photoCache.set(cacheKey, photos);
    return photos;
  }

  private async transformPlaceToResult(place: IPlace): Promise<SearchResult | null> {
    if (!placeHasId(place)) {
      return null;
    }

    return {
      placeId: place.id,
      name: place.displayName?.text || '',
      types: place.types || [],
      formattedAddress: place.formattedAddress || '',
      geometry: {
        location: {
          lat: place.location?.latitude || 0,
          lng: place.location?.longitude || 0,
        },
      },
      rating: place.rating || 0,
      userRatingCount: place.userRatingCount || 0,
      openingHours: {
        openNow: place.currentOpeningHours?.openNow || false,
      },
      photos: (place.photos || []).map((p) => p.name || ''),
      icon: place.iconMaskBaseUri || '',
      businessStatus: `${place.businessStatus}` || '',
      description: place.editorialSummary?.text || '',
    };
  }

  private async transformPlacesToResults(places: IPlace[]): Promise<SearchResult[]> {
    const results = await Promise.all(places.map((place) => this.transformPlaceToResult(place)));
    return results.filter((result): result is SearchResult => result !== null);
  }
}

function placeHasId(place: IPlace): place is IPlaceWithId {
  return !!place.id;
}

export const googlePlacesService = new GooglePlacesService();
