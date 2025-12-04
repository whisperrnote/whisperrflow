'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

// Dynamic import of the real provider to avoid initial bundle bloat
// This removes @campnetwork/origin and its heavy dependencies (pino, etc.) from the main bundle
const CampProvider = dynamic(
  () => import('@campnetwork/origin/react').then((mod) => mod.CampProvider),
  { 
    ssr: false,
  }
);

interface OriginProviderProps {
  children: ReactNode;
}

export function OriginProvider({ children }: OriginProviderProps) {
  const clientId = process.env.NEXT_PUBLIC_ORIGIN_CLIENT_ID || 'demo-client-id';
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Delay loading the heavy Origin SDK
    // This allows the main app (LCP) to render instantly.
    const timer = setTimeout(() => {
        setShouldLoad(true);
    }, 3000); // Wait 3s to ensure main thread is clear
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {shouldLoad ? (
         <CampProvider clientId={clientId}>
            {children}
         </CampProvider>
      ) : (
         <>{children}</>
      )}
    </QueryClientProvider>
  );
}
