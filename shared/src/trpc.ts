import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter as ServerRouter } from "@server/index";

export type AppRouter = ServerRouter;

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
