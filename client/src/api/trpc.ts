import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@server/index"; // You'll create this in shared later

export const trpc = createTRPCReact<AppRouter>();
