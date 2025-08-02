import { z } from "zod";

// Keep the existing PlaceNoteSchema from the previous location
export const PlaceNoteSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  note: z.string().optional(),
  notifyEnabled: z.boolean().default(true),
  notifyDistance: z.number().min(0).max(5000).default(1609.344), // Distance in meters
  latitude: z.number(),
  longitude: z.number(),
  createdAt: z.date(),
});

export type PlaceNote = z.infer<typeof PlaceNoteSchema>;

// Input schemas for API requests
export const CreatePlaceNoteSchema = z.object({
  title: z.string(),
  note: z.string().optional(),
  notifyEnabled: z.boolean().default(true),
  notifyDistance: z.number().default(1609), // about a mile
  latitude: z.number(),
  longitude: z.number(),
});

export type CreatePlaceNoteInput = z.infer<typeof CreatePlaceNoteSchema>;

// API Response types
export type GetPlaceNotesResponse =
  | {
      data: PlaceNote[];
      status: "success";
    }
  | {
      status: "error";
      error: string;
    };

export type CreatePlaceNoteResponse =
  | {
      data: PlaceNote;
      status: "success";
    }
  | {
      status: "error";
      error: string;
    };

export type DeletePlaceNoteResponse =
  | {
      status: "success";
    }
  | {
      status: "error";
      error: string;
    };

export const UpdatePlaceNoteSchema = PlaceNoteSchema.partial().omit({
  id: true,
  createdAt: true,
});

export type UpdatePlaceNoteInput = z.infer<typeof UpdatePlaceNoteSchema>;

export type UpdatePlaceNoteResponse =
  | {
      data: PlaceNote;
      status: "success";
    }
  | {
      status: "error";
      error: string;
    };
