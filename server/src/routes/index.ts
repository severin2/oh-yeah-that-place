import { initTRPC } from '@trpc/server';
import { placeNoteRouter } from './placeNote';
import { transformer } from '@shared/transformers'; // Adjust the import path as necessary

const t = initTRPC.create({
  transformer,
});

export const trpcRouter = t.router({
  placeNote: placeNoteRouter,
});

export type TrpcRouter = typeof trpcRouter;
