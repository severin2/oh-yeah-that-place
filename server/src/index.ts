import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import morgan from "morgan";
import { placeNoteRouter } from "./routes/placeNote";
import { transformer } from "@shared/transformers"; // Adjust the import path as necessary
import { initTRPC } from "@trpc/server";

const t = initTRPC.create({
  transformer,
});

export const appRouter = t.router({
  placeNote: placeNoteRouter,
});

export type AppRouter = typeof appRouter;

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
  })
);

const port = 4000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
