'use client';

import React from 'react';
import { ThemeProvider } from '@/theme';
import { TaskProvider, AuthProvider, LayoutProvider, OriginProvider } from '@/context';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LayoutProvider>
          <OriginProvider>
            <TaskProvider>
              {children}
            </TaskProvider>
          </OriginProvider>
        </LayoutProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
