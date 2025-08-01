import type { TrpcRouter } from '@server/index';
import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<TrpcRouter>();
