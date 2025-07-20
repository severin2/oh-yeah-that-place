import { Router, Request, Response, NextFunction } from "express";
import { SearchResponse, ReverseGeocodeResponse } from "@shared/search";
import { nominatimService } from "../services/nominatimService";

export const searchRouter = Router();

/**
 * GET /search?query=string&limit=number&countrycodes=string&bounded=boolean
 * Search for places using text query
 */
searchRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query, limit, countrycodes, bounded } = req.query as Record<
        string,
        string
      >;

      // Validate required parameters
      if (!query || typeof query !== "string" || !query.trim()) {
        const errorResponse: SearchResponse = {
          results: [],
          status: "INVALID_REQUEST",
          error: "Query parameter is required and cannot be empty",
        };
        res.status(400).json(errorResponse);
      }

      // Parse optional parameters
      const searchOptions = {
        limit: limit ? parseInt(limit, 10) : 10,
        countrycodes: countrycodes || undefined,
        bounded: bounded === "true",
        addressdetails: true, // Always include address details
      };

      // Validate limit parameter
      if (
        searchOptions.limit &&
        (isNaN(searchOptions.limit) ||
          searchOptions.limit < 1 ||
          searchOptions.limit > 50)
      ) {
        const errorResponse: SearchResponse = {
          results: [],
          status: "INVALID_REQUEST",
          error: "Limit must be a number between 1 and 50",
        };
        res.status(400).json(errorResponse);
      }

      // Perform the search
      const searchResponse = await nominatimService.search(
        query.trim(),
        searchOptions
      );

      // Set appropriate HTTP status code based on result
      let httpStatus = 200;
      if (searchResponse.status === "ERROR") {
        httpStatus = 500;
      } else if (searchResponse.status === "INVALID_REQUEST") {
        httpStatus = 400;
      }

      res.status(httpStatus).json(searchResponse);
    } catch (error) {
      console.error("Search route error:", error);

      const errorResponse: SearchResponse = {
        results: [],
        status: "ERROR",
        error: "Internal server error",
      };

      res.status(500).json(errorResponse);
    }
  }
);

/**
 * GET /search/reverse?lat=number&lng=number&zoom=number
 * Reverse geocode coordinates to get place information
 */
searchRouter.get(
  "/reverse",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lat, lng, zoom } = req.query as Record<string, string>;

      // Validate required parameters
      if (!lat || !lng) {
        const errorResponse: ReverseGeocodeResponse = {
          result: null,
          status: "INVALID_REQUEST",
          error: "Both lat and lng parameters are required",
        };
        res.status(400).json(errorResponse);
      }

      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);

      // Validate coordinate values
      if (isNaN(latitude) || isNaN(longitude)) {
        const errorResponse: ReverseGeocodeResponse = {
          result: null,
          status: "INVALID_REQUEST",
          error: "Invalid latitude or longitude values",
        };
        res.status(400).json(errorResponse);
      }

      if (
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
      ) {
        const errorResponse: ReverseGeocodeResponse = {
          result: null,
          status: "INVALID_REQUEST",
          error:
            "Latitude must be between -90 and 90, longitude must be between -180 and 180",
        };
        res.status(400).json(errorResponse);
      }

      // Parse optional parameters
      const reverseOptions = {
        zoom: zoom ? parseInt(zoom, 10) : 18,
        addressdetails: true,
      };

      // Validate zoom parameter
      if (
        reverseOptions.zoom &&
        (isNaN(reverseOptions.zoom) ||
          reverseOptions.zoom < 0 ||
          reverseOptions.zoom > 18)
      ) {
        const errorResponse: ReverseGeocodeResponse = {
          result: null,
          status: "INVALID_REQUEST",
          error: "Zoom must be a number between 0 and 18",
        };
        res.status(400).json(errorResponse);
      }

      // Perform reverse geocoding
      const reverseResponse = await nominatimService.reverse(
        latitude,
        longitude,
        reverseOptions
      );

      // Set appropriate HTTP status code based on result
      let httpStatus = 200;
      if (reverseResponse.status === "ERROR") {
        httpStatus = 500;
      } else if (reverseResponse.status === "INVALID_REQUEST") {
        httpStatus = 400;
      }

      res.status(httpStatus).json(reverseResponse);
    } catch (error) {
      console.error("Reverse geocoding route error:", error);

      const errorResponse: ReverseGeocodeResponse = {
        result: null,
        status: "ERROR",
        error: "Internal server error",
      };

      res.status(500).json(errorResponse);
    }
  }
);
