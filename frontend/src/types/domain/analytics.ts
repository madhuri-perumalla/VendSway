// ============================================================================
// ANALYTICS DOMAIN TYPES
// ============================================================================
// Domain models for Analytics feature

import { BaseEntity } from '../shared/common';
import { Region } from './regional-intelligence';

export interface AnalyticsSnapshot extends BaseEntity {
  id: string;
  regionId: string | null;
  metricType: string;
  metricValue: number;
  period: string;
  breakdown: Record<string, number>;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// Relationship types
export interface AnalyticsSnapshotWithRelations extends AnalyticsSnapshot {
  region?: Region;
}
