import { PlacesClient, protos } from '@googlemaps/places';
import { SearchResult } from '@shared/search';

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

    const places = response.places || [];
    const photos: Record<string, []> = await Promise.all(
      places.flatMap((place) => (place.photos || []).map((photo) => this.getMediaForPhoto(photo)))
    );
    return this.transformPlaceResults(response.places || []);
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
    return places.length > 0 ? this.transformPlaceResults(places)[0] : null;
  }

  private getMediaForPhoto(photo: protos.google.maps.places.v1.IPhoto) {
    return this.placesClient.getPhotoMedia({ name: photo.name });
  }

  private async transformPlaceResults(places: IPlace[]): Promise<SearchResult[]> {
    const photos: Record<string, protos.google.maps.places.v1.IPhotoMedia[]> = await Promise.all(
      places.flatMap((place) => (place.photos || []).map((photo) => this.getMediaForPhoto(photo)))
    );

    return places.filter(placeHasId).map((place) => ({
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
      photos: (place.photos || []).map((photo: protos.google.maps.places.v1.IPhoto) => photo.name),
      icon: place.iconMaskBaseUri || '',
      businessStatus: `${place.businessStatus}` || '',
      description: place.editorialSummary?.text || '',
    }));
  }
}

function placeHasId(place: IPlace): place is IPlaceWithId {
  return !!place.id;
}

export const googlePlacesService = new GooglePlacesService();
