'use client';

import * as React from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme } from '@/theme/theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export const useThemeMode = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = React.useState<ThemeMode>('system');
  const [resolvedMode, setResolvedMode] = React.useState<'light' | 'dark'>('light');

  React.useEffect(() => {
    // Load saved preference
    const savedMode = localStorage.getItem('whisperrflow-theme') as ThemeMode | null;
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  React.useEffect(() => {
    // Save preference
    localStorage.setItem('whisperrflow-theme', mode);

    // Resolve system preference
    let activeMode: 'light' | 'dark';
    if (mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      activeMode = mediaQuery.matches ? 'dark' : 'light';
      setResolvedMode(activeMode);

      const handler = (e: MediaQueryListEvent) => {
        const newMode = e.matches ? 'dark' : 'light';
        setResolvedMode(newMode);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newMode);
      };

      mediaQuery.addEventListener('change', handler);

      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(activeMode);

      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      activeMode = mode;
      setResolvedMode(mode);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(mode);
    }
  }, [mode]);

  const toggleMode = React.useCallback(() => {
    setMode(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  }, []);

  const theme = resolvedMode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggleMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
