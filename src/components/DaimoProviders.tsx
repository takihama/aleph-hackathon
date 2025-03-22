"use client";

import React from "react";
import { DaimoPayProvider, getDefaultConfig } from "@daimo/pay";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig } from "wagmi";

// Configure Daimo Pay with app configuration
const config = createConfig(
  getDefaultConfig({
    appName: "Aleph Hackathon App",
    ssr: true, // Set to true if your project uses server side rendering (SSR)
  })
);

// Create a query client for React Query
const queryClient = new QueryClient();

// Define the Provider component to wrap your application
export function DaimoProviders({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <DaimoPayProvider payApiUrl={process.env.NEXT_PUBLIC_DAIMO_API_URL!} debugMode>
          {children}
        </DaimoPayProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
