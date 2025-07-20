import axios, { AxiosError } from "axios";
import {
  SearchResult,
  SearchResponse,
  ReverseGeocodeResponse,
} from "../../../shared/src/search";

// Nominatim API response interfaces based on the official API documentation
interface NominatimSearchResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  address?: {
    house_number?: string;
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  };
  boundingbox: [string, string, string, string]; // [min_lat, max_lat, min_lon, max_lon]
  geojson?: {
    type: string;
    coordinates: number[] | number[][];
  };
}

interface NominatimReverseResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  address: {
    house_number?: string;
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  };
  boundingbox: [string, string, string, string];
}

export interface SearchOptions {
  limit?: number;
  countrycodes?: string; // ISO 3166-1 alpha-2 country codes, comma-separated
  viewbox?: string; // left,top,right,bottom
  bounded?: boolean;
  addressdetails?: boolean;
  extratags?: boolean;
  namedetails?: boolean;
}

export interface ReverseOptions {
  zoom?: number; // 0-18, higher values for more detailed results
  addressdetails?: boolean;
  extratags?: boolean;
  namedetails?: boolean;
}

class NominatimService {
  private baseUrl: string;
  private userAgent: string;

  constructor(
    baseUrl: string = "http://localhost:8080",
    userAgent: string = "oh-yeah-that-place-app/1.0"
  ) {
    this.baseUrl = baseUrl;
    this.userAgent = userAgent;
  }

  /**
   * Search for places using Nominatim's search API
   * @param query - The search query string
   * @param options - Additional search options
   * @returns Promise<SearchResponse>
   */
  async search(
    query: string,
    options: SearchOptions = {}
  ): Promise<SearchResponse> {
    if (!query.trim()) {
      return {
        results: [],
        status: "INVALID_REQUEST",
        error: "Search query cannot be empty",
      };
    }

    try {
      const params = new URLSearchParams({
        q: query.trim(),
        format: "json",
        addressdetails: "1",
        limit: (options.limit || 10).toString(),
        ...Object.fromEntries(
          Object.entries(options)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => [key, value.toString()])
        ),
      });

      const response = await axios.get<NominatimSearchResult[]>(
        `${this.baseUrl}/search?${params.toString()}`,
        {
          headers: {
            "User-Agent": this.userAgent,
          },
          timeout: 10000, // 10 second timeout
        }
      );

      const results = this.mapNominatimResultsToSearchResults(response.data);

      return {
        results,
        status: results.length > 0 ? "OK" : "ZERO_RESULTS",
      };
    } catch (error) {
      console.error("Nominatim search error:", error);

      const isAxiosError = error instanceof AxiosError;
      const errorMessage =
        isAxiosError && error.response?.status === 404
          ? "Nominatim service not available"
          : "Failed to search places";

      return {
        results: [],
        status: "ERROR",
        error: errorMessage,
      };
    }
  }

  /**
   * Reverse geocoding using Nominatim's reverse API
   * @param lat - Latitude
   * @param lon - Longitude
   * @param options - Additional reverse options
   * @returns Promise<ReverseGeocodeResponse>
   */
  async reverse(
    lat: number,
    lon: number,
    options: ReverseOptions = {}
  ): Promise<ReverseGeocodeResponse> {
    if (!lat || !lon) {
      return {
        result: null,
        status: "INVALID_REQUEST",
        error: "Valid latitude and longitude are required",
      };
    }

    try {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lon: lon.toString(),
        format: "json",
        addressdetails: "1",
        zoom: (options.zoom || 18).toString(),
        ...Object.fromEntries(
          Object.entries(options)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => [key, value.toString()])
        ),
      });

      const response = await axios.get<NominatimReverseResult>(
        `${this.baseUrl}/reverse?${params.toString()}`,
        {
          headers: {
            "User-Agent": this.userAgent,
          },
          timeout: 10000, // 10 second timeout
        }
      );

      if (!response.data || !response.data.display_name) {
        return {
          result: null,
          status: "ZERO_RESULTS",
        };
      }

      const result = this.mapNominatimReverseResultToSearchResult(
        response.data
      );

      return {
        result,
        status: "OK",
      };
    } catch (error) {
      console.error("Nominatim reverse geocoding error:", error);

      const isAxiosError = error instanceof AxiosError;
      const errorMessage =
        isAxiosError && error.response?.status === 404
          ? "Nominatim service not available"
          : "Failed to reverse geocode location";

      return {
        result: null,
        status: "ERROR",
        error: errorMessage,
      };
    }
  }

  /**
   * Get service status
   * @returns Promise<boolean>
   */
  async getStatus(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/status`, {
        headers: {
          "User-Agent": this.userAgent,
        },
        timeout: 5000, // 5 second timeout
      });

      return response.status === 200;
    } catch (error) {
      console.error("Nominatim status check error:", error);
      return false;
    }
  }

  /**
   * Map Nominatim search results to our SearchResult interface
   */
  private mapNominatimResultsToSearchResults(
    results: NominatimSearchResult[]
  ): SearchResult[] {
    return results.map((result) =>
      this.mapNominatimResultToSearchResult(result)
    );
  }

  /**
   * Map a single Nominatim search result to our SearchResult interface
   */
  private mapNominatimResultToSearchResult(
    result: NominatimSearchResult
  ): SearchResult {
    return {
      placeId: result.place_id.toString(),
      name: result.name || result.display_name.split(",")[0].trim(),
      types: [result.type, result.class].filter(Boolean),
      formattedAddress: result.display_name,
      geometry: {
        location: {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
        },
      },
      rating: 0, // Nominatim doesn't provide ratings
      userRatingsTotal: 0, // Nominatim doesn't provide ratings
      openingHours: { openNow: false }, // Nominatim doesn't provide opening hours
      photos: [], // Nominatim doesn't provide photos
      icon: this.getIconForType(result.type, result.class),
      businessStatus: "OPERATIONAL", // Default status since Nominatim doesn't provide this
      description: this.generateDescription(result),
    };
  }

  /**
   * Map a Nominatim reverse result to our SearchResult interface
   */
  private mapNominatimReverseResultToSearchResult(
    result: NominatimReverseResult
  ): SearchResult {
    return {
      placeId: result.place_id.toString(),
      name: result.name || result.display_name.split(",")[0].trim(),
      types: [result.type, result.class].filter(Boolean),
      formattedAddress: result.display_name,
      geometry: {
        location: {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
        },
      },
      rating: 0, // Nominatim doesn't provide ratings
      userRatingsTotal: 0, // Nominatim doesn't provide ratings
      openingHours: { openNow: false }, // Nominatim doesn't provide opening hours
      photos: [], // Nominatim doesn't provide photos
      icon: this.getIconForType(result.type, result.class),
      businessStatus: "OPERATIONAL", // Default status since Nominatim doesn't provide this
      description: this.generateDescription(result),
    };
  }

  /**
   * Generate an appropriate icon URL based on the place type and class
   */
  private getIconForType(type: string, placeClass: string): string {
    const iconMap: Record<string, string> = {
      restaurant: "🍴",
      cafe: "☕",
      bank: "🏦",
      hospital: "🏥",
      school: "🏫",
      hotel: "🏨",
      shop: "🛍️",
      park: "🌳",
      church: "⛪",
      museum: "🏛️",
      theatre: "🎭",
      cinema: "🎬",
      gas_station: "⛽",
      pharmacy: "💊",
      post_office: "📮",
      library: "📚",
      police: "👮",
      fire_station: "🚒",
    };

    return iconMap[type] || iconMap[placeClass] || "📍";
  }

  /**
   * Generate a description from the Nominatim result
   */
  private generateDescription(
    result: NominatimSearchResult | NominatimReverseResult
  ): string {
    const parts = [];

    if (result.type && result.class) {
      parts.push(`${result.type} (${result.class})`);
    }

    if ("address" in result && result.address) {
      const address = result.address;
      if (address.city) parts.push(address.city);
      if (address.state) parts.push(address.state);
      if (address.country) parts.push(address.country);
    }

    return parts.length > 0 ? parts.join(", ") : result.display_name;
  }
}

// Create a default instance
export const nominatimService = new NominatimService();

// Export the class for custom instances
export { NominatimService };
