import { PlacesClient } from '@googlemaps/places';
import { SearchResult } from '@shared/search';

interface GooglePlace {
  id: string;
  displayName?: {
    text: string;
    languageCode?: string;
  };
  formattedAddress?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  types?: string[];
  rating?: number;
  userRatingsTotal?: number;
  currentOpeningHours?: {
    openNow: boolean;
    periods?: Array<{
      open: { day: number; hour: number; minute: number };
      close: { day: number; hour: number; minute: number };
    }>;
    weekdayDescriptions?: string[];
  };
  photos?: Array<{
    name: string;
    widthPx?: number;
    heightPx?: number;
    authorAttributions?: Array<{
      displayName?: string;
      uri?: string;
      photoUri?: string;
    }>;
  }>;
  iconUri?: string;
  businessStatus?: string;
  editorialSummary?: {
    text: string;
    languageCode?: string;
  };
}

interface GoogleSearchResponse {
  places: GooglePlace[];
}

export class GooglePlacesService {
  private readonly placesClient: PlacesClient;
  private readonly fieldMask = [
    'places.displayName',
    'places.formattedAddress',
    'places.location',
    'places.types',
    'places.rating',
    'places.userRatingsTotal',
    'places.currentOpeningHours',
    'places.photos',
    'places.iconUri',
    'places.businessStatus',
    'places.editorialSummary',
  ].join(',');

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

    return this.transformPlaceResults((response as GoogleSearchResponse).places || []);
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

    const places = (response as GoogleSearchResponse).places || [];
    return places.length > 0 ? this.transformPlaceResults(places)[0] : null;
  }

  private transformPlaceResults(places: GooglePlace[]): SearchResult[] {
    return places.map((place) => ({
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
      userRatingsTotal: place.userRatingsTotal || 0,
      openingHours: {
        openNow: place.currentOpeningHours?.openNow || false,
      },
      photos: (place.photos || []).map((photo: any) => ({
        photoReference: photo.name || '',
      })),
      icon: place.iconUri || '',
      businessStatus: place.businessStatus || '',
      description: place.editorialSummary?.text || '',
    }));
  }
}

export const googlePlacesService = new GooglePlacesService();
