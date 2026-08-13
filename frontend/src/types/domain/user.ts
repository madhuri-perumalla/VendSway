// ============================================================================
// USER DOMAIN TYPES
// ============================================================================
// Domain models for User entity

import { BaseEntity } from '../shared/common';
import { UserRole } from '../shared/enums';

export interface User extends BaseEntity {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  createdAt: string;
  updatedAt: string;
}
