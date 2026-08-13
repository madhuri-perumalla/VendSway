// ============================================================================
// REGION STORE
// ============================================================================
// Zustand store for region selection and management

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Region } from '@/types/domain';

interface RegionState {
  selectedRegion: Region | null;
  selectedRegionId: string | null;
  setSelectedRegion: (region: Region) => void;
  setSelectedRegionId: (regionId: string) => void;
  clearRegion: () => void;
}

export const useRegionStore = create<RegionState>()(
  persist(
    (set) => ({
      selectedRegion: null,
      selectedRegionId: null,
      setSelectedRegion: (region) => set({ 
        selectedRegion: region, 
        selectedRegionId: region.id 
      }),
      setSelectedRegionId: (regionId) => set({ selectedRegionId: regionId }),
      clearRegion: () => set({ selectedRegion: null, selectedRegionId: null }),
    }),
    {
      name: 'region-storage',
    }
  )
);
