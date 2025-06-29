import { z } from 'zod';

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
