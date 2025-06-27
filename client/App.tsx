import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "./src/api/trpc";
import superjson from "superjson";
import Constants from "expo-constants";
import { MapScreen } from "./src/screens/MapScreen";
import { httpBatchLink, httpLink } from "@trpc/client";
import { transformer } from "@shared/transformers"; // Adjust the import path as necessary

const Stack = createNativeStackNavigator();

const getBaseUrl = () => {
  return Constants.expoConfig?.extra?.API_URL ?? "http://localhost:4000";
};

export default function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/trpc`,
          transformer,
        }),
        httpLink({
          url: `${getBaseUrl()}/trpc`,
          transformer,
        }),
      ],
    })
  );

  return (
    <SafeAreaProvider>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Map" component={MapScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </QueryClientProvider>
      </trpc.Provider>
    </SafeAreaProvider>
  );
}
