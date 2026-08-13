import { BaseRepository } from '../repositories/BaseRepository';

/**
 * Base service class providing common business logic operations
 * All services should extend this class
 */
export abstract class BaseService<T, CreateInput, UpdateInput> {
  protected repository: BaseRepository<T, CreateInput, UpdateInput>;

  constructor(repository: BaseRepository<T, CreateInput, UpdateInput>) {
    this.repository = repository;
  }

  /**
   * Get a single record by ID
   * @param id - Record ID
   * @param include - Optional include object for relations
   * @returns Found record or null
   */
  async getById(id: string, include?: any): Promise<T | null> {
    return this.repository.findById(id, include);
  }

  /**
   * Get a single record by ID or throw error
   * @param id - Record ID
   * @param include - Optional include object for relations
   * @returns Found record
   */
  async getByIdOrThrow(id: string, include?: any): Promise<T> {
    return this.repository.findByIdOrThrow(id, include);
  }

  /**
   * Get all records with optional filters
   * @param where - Filter conditions
   * @param include - Optional include object for relations
   * @param orderBy - Optional ordering
   * @returns Array of records
   */
  async getAll(where?: any, include?: any, orderBy?: any): Promise<T[]> {
    return this.repository.findAll(where, include, orderBy);
  }

  /**
   * Get records with pagination
   * @param where - Filter conditions
   * @param include - Optional include object for relations
   * @param orderBy - Optional ordering
   * @param page - Page number
   * @param limit - Items per page
   * @returns Paginated records and metadata
   */
  async getPaginated(
    where?: any,
    include?: any,
    orderBy?: any,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: T[]; total: number; page: number; limit: number; totalPages: number }> {
    return this.repository.findWithPagination(where, include, orderBy, page, limit);
  }

  /**
   * Get a single record by conditions
   * @param where - Filter conditions
   * @param include - Optional include object for relations
   * @returns Found record or null
   */
  async getOne(where: any, include?: any): Promise<T | null> {
    return this.repository.findOne(where, include);
  }

  /**
   * Get a single record by conditions or throw error
   * @param where - Filter conditions
   * @param include - Optional include object for relations
   * @returns Found record
   */
  async getOneOrThrow(where: any, include?: any): Promise<T> {
    return this.repository.findOneOrThrow(where, include);
  }

  /**
   * Create a new record
   * @param data - Create input data
   * @param include - Optional include object for relations
   * @returns Created record
   */
  async create(data: CreateInput, include?: any): Promise<T> {
    return this.repository.create(data, include);
  }

  /**
   * Create multiple records
   * @param data - Array of create input data
   * @returns Create result
   */
  async createMany(data: CreateInput[]): Promise<{ count: number }> {
    return this.repository.createMany(data);
  }

  /**
   * Update a record by ID
   * @param id - Record ID
   * @param data - Update input data
   * @param include - Optional include object for relations
   * @returns Updated record
   */
  async update(id: string, data: UpdateInput, include?: any): Promise<T> {
    return this.repository.update(id, data, include);
  }

  /**
   * Update multiple records by conditions
   * @param where - Filter conditions
   * @param data - Update input data
   * @returns Update result
   */
  async updateMany(where: any, data: UpdateInput): Promise<{ count: number }> {
    return this.repository.updateMany(where, data);
  }

  /**
   * Delete a record by ID
   * @param id - Record ID
   * @returns Deleted record
   */
  async delete(id: string): Promise<T> {
    return this.repository.delete(id);
  }

  /**
   * Delete multiple records by conditions
   * @param where - Filter conditions
   * @returns Delete result
   */
  async deleteMany(where: any): Promise<{ count: number }> {
    return this.repository.deleteMany(where);
  }

  /**
   * Count records by conditions
   * @param where - Filter conditions
   * @returns Count of records
   */
  async count(where?: any): Promise<number> {
    return this.repository.count(where);
  }

  /**
   * Check if a record exists
   * @param where - Filter conditions
   * @returns Boolean indicating existence
   */
  async exists(where: any): Promise<boolean> {
    return this.repository.exists(where);
  }
}
