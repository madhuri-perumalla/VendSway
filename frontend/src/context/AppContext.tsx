import React, { createContext, useContext } from 'react';
import { UserRole } from '@/types/shared';
import { useRoleStore } from '@/store';

interface AppContextValue {
  userRole: UserRole | null;
  setUserRole: (role: UserRole) => void;
  isAuthenticated: boolean;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userRole, setUserRole, isAuthenticated } = useRoleStore();

  return (
    <AppContext.Provider value={{ userRole, setUserRole, isAuthenticated }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
