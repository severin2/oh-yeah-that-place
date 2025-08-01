import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { TrpcRouter as ServerRouter } from "@server/index";

export type TrpcRouter = ServerRouter;

export type RouterInput = inferRouterInputs<TrpcRouter>;
export type RouterOutput = inferRouterOutputs<TrpcRouter>;
