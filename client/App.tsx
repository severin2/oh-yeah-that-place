import React, { useState } from 'react';
import { trpc } from '@/api/trpc';
import { TrpcRouter } from '@server/index';
import { transformer } from '@shared/trpc/transformers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Navigation } from '@/navigation/TabNavigator';
import { log, setLogEnabled } from '@/api/log';

setLogEnabled(true); // Toggle logging on/off here

const getBaseUrl = () => {
  return process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';
};

function makeQueryClient() {
  log('Creating new QueryClient');
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  });
}
let browserQueryClient: QueryClient | undefined = undefined;
function getQueryClient() {
  if (typeof window === 'undefined') {
    log('SSR: Creating new QueryClient');
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) {
      log('Browser: Creating new QueryClient');
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}

export default function App() {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() => {
    log('Creating TRPC client');
    return createTRPCClient<TrpcRouter>({
      links: [
        loggerLink({
          colorMode: 'none',
          logger: (props) => log('tRPC logger', props),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/trpc`,
          transformer,
        }),
      ],
    });
  });

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <Navigation />
        </trpc.Provider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
