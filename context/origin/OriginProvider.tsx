'use client';

import React, { ReactNode } from 'react';
import { CampProvider } from '@campnetwork/origin/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

interface OriginProviderProps {
  children: ReactNode;
}

export function OriginProvider({ children }: OriginProviderProps) {
  // Ensure we have the client ID, otherwise the provider might fail or warn
  const clientId = process.env.NEXT_PUBLIC_ORIGIN_CLIENT_ID || 'demo-client-id';

  return (
    <QueryClientProvider client={queryClient}>
      <CampProvider clientId={clientId}>
        {children}
      </CampProvider>
    </QueryClientProvider>
  );
}
