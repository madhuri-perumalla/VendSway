// ============================================================================
// NAVIGATION STORE
// ============================================================================
// Zustand store for navigation state management

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NavigationState {
  currentPath: string;
  previousPath: string | null;
  navigationHistory: string[];
  setCurrentPath: (path: string) => void;
  setPreviousPath: (path: string) => void;
  addToHistory: (path: string) => void;
  clearHistory: () => void;
  goBack: () => void;
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set, get) => ({
      currentPath: '/',
      previousPath: null,
      navigationHistory: ['/'],
      setCurrentPath: (path) => set({ currentPath: path }),
      setPreviousPath: (path) => set({ previousPath: path }),
      addToHistory: (path) => set((state) => ({
        navigationHistory: [...state.navigationHistory, path],
      })),
      clearHistory: () => set({ navigationHistory: ['/'] }),
      goBack: () => {
        const { navigationHistory } = get();
        if (navigationHistory.length > 1) {
          const newHistory = navigationHistory.slice(0, -1);
          const previousPath = newHistory[newHistory.length - 1];
          set({
            navigationHistory: newHistory,
            currentPath: previousPath,
            previousPath: navigationHistory[navigationHistory.length - 1],
          });
        }
      },
    }),
    {
      name: 'navigation-storage',
    }
  )
);
