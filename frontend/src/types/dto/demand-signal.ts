// ============================================================================
// DEMAND SIGNAL DTO TYPES
// ============================================================================
// Data Transfer Objects for DemandSignal entity

import { UUID } from '../shared/base';
import { Seasonality } from '../shared/enums';

export interface DemandSignalDTO {
  id: UUID;
  regionId: UUID;
  category: string;
  festivalId: UUID | null;
  demandScore: number;
  seasonality: Seasonality;
  source: string;
  period: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDemandSignalDTO {
  regionId: UUID;
  category: string;
  festivalId: UUID | null;
  demandScore: number;
  seasonality: Seasonality;
  source: string;
  period: string;
}

export interface UpdateDemandSignalDTO {
  regionId?: UUID;
  category?: string;
  festivalId?: UUID | null;
  demandScore?: number;
  seasonality?: Seasonality;
  source?: string;
  period?: string;
}

export interface DemandSignalResponseDTO extends DemandSignalDTO {}

export interface DemandSignalListDTO {
  demandSignals: DemandSignalDTO[];
  total: number;
}
