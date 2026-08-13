// ============================================================================
// ROLE STORE
// ============================================================================
// Zustand store for user role management

import { create } from 'zustand';
import { UserRole } from '@/types/shared';

interface RoleState {
  userRole: UserRole | null;
  setUserRole: (role: UserRole) => void;
  clearRole: () => void;
  isAuthenticated: boolean;
}

export const useRoleStore = create<RoleState>()((set) => ({
  userRole: null,
  isAuthenticated: false,
  setUserRole: (role) => {
    console.log('setUserRole called with:', role);
    set({ userRole: role, isAuthenticated: true });
  },
  clearRole: () => set({ userRole: null, isAuthenticated: false }),
}));
