'use client';

import React from 'react';
import { ThemeProvider } from '@/theme';
import { TaskProvider, AuthProvider, LayoutProvider, OriginProvider } from '@/context';
import { useEcosystemIntents } from '@/hooks/useEcosystemIntents';
import { useEcosystemNode } from '@/hooks/useEcosystemNode';

interface AppProvidersProps {
  children: React.ReactNode;
}

function EcosystemHandler() {
  useEcosystemIntents();
  useEcosystemNode('flow');
  return null;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LayoutProvider>
          <OriginProvider>
            <TaskProvider>
              <EcosystemHandler />
              {children}
            </TaskProvider>
          </OriginProvider>
        </LayoutProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
