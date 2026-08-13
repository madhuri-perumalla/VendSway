// ============================================================================
// ANALYTICS SNAPSHOT DTO TYPES
// ============================================================================
// Data Transfer Objects for AnalyticsSnapshot entity

import { UUID } from '../shared/base';

export interface AnalyticsSnapshotDTO {
  id: UUID;
  regionId: UUID | null;
  metricType: string;
  metricValue: number;
  period: string;
  breakdown: Record<string, number>;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnalyticsSnapshotDTO {
  regionId: UUID | null;
  metricType: string;
  metricValue: number;
  period: string;
  breakdown: Record<string, number>;
  metadata: Record<string, unknown>;
}

export interface UpdateAnalyticsSnapshotDTO {
  regionId?: UUID | null;
  metricType?: string;
  metricValue?: number;
  period?: string;
  breakdown?: Record<string, number>;
  metadata?: Record<string, unknown>;
}

export interface AnalyticsSnapshotResponseDTO extends AnalyticsSnapshotDTO {}

export interface AnalyticsSnapshotListDTO {
  snapshots: AnalyticsSnapshotDTO[];
  total: number;
}
