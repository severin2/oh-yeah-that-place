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
    return memoryStore;
  }),
});

// In-memory storage for now
const memoryStore: Array<z.infer<typeof PlaceNoteSchema>> = [
  {
    id: '6ae5f357-c0fe-4ba9-ab74-f0a6384efac8',
    title: 'Test 1',
    note: 'This is a test note',
    notifyEnabled: true,
    notifyDistance: 1000,
    latitude: 40.08485509988256,
    longitude: -104.95040606707335,
    createdAt: new Date('2025-07-01T04:17:57.524Z'),
  },
  {
    id: '6ae5f357-c0fe-4ba9-ab74-f0a6384efac9',
    title: 'Casa Cortes',
    note: 'Good mexican food',
    notifyEnabled: true,
    notifyDistance: 1500,
    latitude: 40.087509,
    longitude: -104.935554,
    createdAt: new Date('2025-07-01T04:17:57.524Z'),
  },
];
