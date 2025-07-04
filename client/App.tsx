import React, { useState } from 'react';
import { TRPCProvider } from '@/api/trpc';
import { NavigationContainer } from '@react-navigation/native';
import { AppRouter } from '@server/index';
import { transformer } from '@shared/transformers'; // Adjust the import path as necessary
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink, httpLink, loggerLink } from '@trpc/client';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TabNavigator } from '@/navigation/TabNavigator';

const getBaseUrl = () => {
  return process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';
};

function makeQueryClient() {
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
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function App() {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        loggerLink({
          colorMode: 'none',
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/trpc`,
          transformer,
        }),
      ],
    })
  );

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
          <NavigationContainer>
            <TabNavigator />
          </NavigationContainer>
        </TRPCProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
