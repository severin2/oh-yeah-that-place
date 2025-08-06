export type SearchResult = {
  placeId: string;
  name: string;
  types: string[];
  formattedAddress: string;
  geometry: {
    location: { lat: number; lng: number };
  };
  rating: number;
  userRatingCount: number;
  openingHours: { openNow: boolean };
  photos: string[];
  icon: string;
  businessStatus: string;
  description: string;
};

export type SearchResponse = {
  results: SearchResult[];
  status: 'OK' | 'ZERO_RESULTS' | 'INVALID_REQUEST' | 'ERROR';
  error?: string;
};

export type SearchQuery = {
  query: string;
  limit?: number;
  countrycodes?: string;
  bounded?: boolean;
};

export type ReverseGeocodeQuery = {
  lat: number;
  lng: number;
  zoom?: number;
};

export type ReverseGeocodeResponse = {
  result: SearchResult | null;
  status: 'OK' | 'ZERO_RESULTS' | 'INVALID_REQUEST' | 'ERROR';
  error?: string;
};
