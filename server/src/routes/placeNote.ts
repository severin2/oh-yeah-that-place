import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { PlaceNoteSchema } from "@shared/placeNote";
import { initTRPC } from "@trpc/server";

const t = initTRPC.create();

const loggingMiddleware = t.middleware(
  async ({ path, type, next, getRawInput }) => {
    console.log(`[tRPC] ${type.toUpperCase()} ${path}`);
    if (type === "mutation") {
      console.log("→ input:", getRawInput());
    }

    const result = await next();

    if (result.ok) {
      console.log("← result:", result.data);
    } else {
      console.log("← error:", result.error);
    }

    return result;
  }
);

export const placeNoteRouter = t.router({
  addNote: t.procedure
    .use(loggingMiddleware)
    .input(
      z.object({
        title: z.string(),
        note: z.string().optional(),
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
        latitude: input.latitude,
        longitude: input.longitude,
        createdAt: new Date(),
      };
      memoryStore.push(newNote);
      return newNote;
    }),

  getNotes: t.procedure.use(loggingMiddleware).query(() => {
    return memoryStore;
  }),
});

// In-memory storage for now
const memoryStore: Array<z.infer<typeof PlaceNoteSchema>> = [];
