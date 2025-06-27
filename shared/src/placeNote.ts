import { z } from "zod";

export const PlaceNoteSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  note: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  createdAt: z.date(),
});

export type PlaceNote = z.infer<typeof PlaceNoteSchema>;
