"use client";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "@/lib/clients/wagmish/config";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/lib/clients/apollo/apollo.client";

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <WagmiProvider config={config}>
      <ApolloProvider client={apolloClient}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ApolloProvider>
    </WagmiProvider>
  );
}
