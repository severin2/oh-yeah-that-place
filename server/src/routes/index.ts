import { initTRPC } from "@trpc/server";
import { placeNoteRouter } from "./placeNote";
import { transformer } from "@shared/trpc/transformers"; // Adjust the import path as necessary
export { searchRouter } from "./search"; // Import your search router if you have one

const t = initTRPC.create({
  transformer,
});

export const trpcRouter = t.router({
  placeNote: placeNoteRouter,
});

export type TrpcRouter = typeof trpcRouter;
