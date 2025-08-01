import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import morgan from "morgan";
import { searchRouter, trpcRouter } from "./routes";
export { TrpcRouter } from "./routes";

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use(
  "/trpc",
  createExpressMiddleware({
    router: trpcRouter,
    createContext: () => ({}),
  })
);

app.use("/search", searchRouter);

const port = 4000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
