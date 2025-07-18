export type SearchResult = {
  placeId: string;
  name: string;
  types: string[];
  formattedAddress: string;
  geometry: {
    location: { lat: number; lng: number };
  };
  rating: number;
  userRatingsTotal: number;
  openingHours: { openNow: boolean };
  photos: { photoReference: string }[];
  icon: string;
  businessStatus: string;
  description: string;
};
