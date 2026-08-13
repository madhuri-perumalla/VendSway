// ============================================================================
// USER DTO TYPES
// ============================================================================
// Data Transfer Objects for User entity

import { UUID } from '../shared/base';
import { UserRole } from '../shared/enums';

export interface UserDTO {
  id: UUID;
  email: string;
  role: UserRole;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDTO {
  email: string;
  name: string;
  role: UserRole;
  password: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
}

export interface UserResponseDTO extends UserDTO {}

export interface UserListDTO {
  users: UserDTO[];
  total: number;
}
