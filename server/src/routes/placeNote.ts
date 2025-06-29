import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { PlaceNoteSchema } from '@shared/placeNote';
import { initTRPC } from '@trpc/server';

const t = initTRPC.create();

export const placeNoteRouter = t.router({
  addNote: t.procedure
    .input(
      z.object({
        title: z.string(),
        note: z.string().optional(),
        notifyEnabled: z.boolean().default(true),
        notifyDistance: z.number().default(1609), // about a mile
        latitude: z.number(),
        longitude: z.number(),
      })
    )
    .output(PlaceNoteSchema)
    .mutation(({ input }) => {
      const newNote = {
        id: uuidv4(),
        title: input.title,
        note: input.note,
        notifyEnabled: input.notifyEnabled,
        notifyDistance: input.notifyDistance,
        latitude: input.latitude,
        longitude: input.longitude,
        createdAt: new Date(),
      };
      memoryStore.push(newNote);
      return newNote;
    }),

  getNotes: t.procedure.query(() => {
    console.log(memoryStore);
    return memoryStore;
  }),
});

// In-memory storage for now
const memoryStore: Array<z.infer<typeof PlaceNoteSchema>> = [];
