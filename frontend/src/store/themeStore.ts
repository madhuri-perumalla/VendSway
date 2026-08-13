// ============================================================================
// THEME STORE
// ============================================================================
// Zustand store for theme management

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  systemTheme: 'light' | 'dark';
  setSystemTheme: (theme: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      systemTheme: 'light',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => {
        const { theme } = get();
        if (theme === 'light') {
          set({ theme: 'dark' });
        } else if (theme === 'dark') {
          set({ theme: 'light' });
        } else {
          set({ theme: get().systemTheme === 'light' ? 'dark' : 'light' });
        }
      },
      setSystemTheme: (theme) => set({ systemTheme: theme }),
    }),
    {
      name: 'theme-storage',
    }
  )
);
