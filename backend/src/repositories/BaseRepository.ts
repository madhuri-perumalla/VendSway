import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../utils/errors';

/**
 * Base repository class providing common CRUD operations
 * All repositories should extend this class
 */
export abstract class BaseRepository<T, CreateInput, UpdateInput> {
  protected prisma: PrismaClient;
  protected modelName: string;

  constructor(prisma: PrismaClient, modelName: string) {
    this.prisma = prisma;
    this.modelName = modelName;
  }

  /**
   * Find a single record by ID
   * @param id - Record ID
   * @param include - Optional include object for relations
   * @returns Found record or null
   */
  async findById(id: string, include?: any): Promise<T | null> {
    return (this.prisma as any)[this.modelName].findUnique({
      where: { id },
      ...(include && { include }),
    });
  }

  /**
   * Find a single record by ID or throw error
   * @param id - Record ID
   * @param include - Optional include object for relations
   * @returns Found record
   * @throws NotFoundError if record not found
   */
  async findByIdOrThrow(id: string, include?: any): Promise<T> {
    const record = await this.findById(id, include);
    if (!record) {
      throw new NotFoundError(`${this.modelName} with id ${id} not found`);
    }
    return record;
  }

  /**
   * Find all records with optional filters
   * @param where - Filter conditions
   * @param include - Optional include object for relations
   * @param orderBy - Optional ordering
   * @returns Array of records
   */
  async findAll(where?: any, include?: any, orderBy?: any): Promise<T[]> {
    return (this.prisma as any)[this.modelName].findMany({
      ...(where && { where }),
      ...(include && { include }),
      ...(orderBy && { orderBy }),
    });
  }

  /**
   * Find records with pagination
   * @param where - Filter conditions
   * @param include - Optional include object for relations
   * @param orderBy - Optional ordering
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @returns Paginated records and metadata
   */
  async findWithPagination(
    where?: any,
    include?: any,
    orderBy?: any,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: T[]; total: number; page: number; limit: number; totalPages: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      (this.prisma as any)[this.modelName].findMany({
        ...(where && { where }),
        ...(include && { include }),
        ...(orderBy && { orderBy }),
        skip,
        take: limit,
      }),
      (this.prisma as any)[this.modelName].count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Find a single record by conditions
   * @param where - Filter conditions
   * @param include - Optional include object for relations
   * @returns Found record or null
   */
  async findOne(where: any, include?: any): Promise<T | null> {
    return (this.prisma as any)[this.modelName].findFirst({
      where,
      ...(include && { include }),
    });
  }

  /**
   * Find a single record by conditions or throw error
   * @param where - Filter conditions
   * @param include - Optional include object for relations
   * @returns Found record
   * @throws NotFoundError if record not found
   */
  async findOneOrThrow(where: any, include?: any): Promise<T> {
    const record = await this.findOne(where, include);
    if (!record) {
      throw new NotFoundError(`${this.modelName} not found`);
    }
    return record;
  }

  /**
   * Create a new record
   * @param data - Create input data
   * @param include - Optional include object for relations
   * @returns Created record
   */
  async create(data: CreateInput, include?: any): Promise<T> {
    return (this.prisma as any)[this.modelName].create({
      data,
      ...(include && { include }),
    });
  }

  /**
   * Create multiple records
   * @param data - Array of create input data
   * @returns Created records
   */
  async createMany(data: CreateInput[]): Promise<{ count: number }> {
    return (this.prisma as any)[this.modelName].createMany({
      data,
      skipDuplicates: true,
    });
  }

  /**
   * Update a record by ID
   * @param id - Record ID
   * @param data - Update input data
   * @param include - Optional include object for relations
   * @returns Updated record
   */
  async update(id: string, data: UpdateInput, include?: any): Promise<T> {
    await this.findByIdOrThrow(id);
    return (this.prisma as any)[this.modelName].update({
      where: { id },
      data,
      ...(include && { include }),
    });
  }

  /**
   * Update multiple records by conditions
   * @param where - Filter conditions
   * @param data - Update input data
   * @returns Update result
   */
  async updateMany(where: any, data: UpdateInput): Promise<{ count: number }> {
    return (this.prisma as any)[this.modelName].updateMany({
      where,
      data,
    });
  }

  /**
   * Delete a record by ID
   * @param id - Record ID
   * @returns Deleted record
   */
  async delete(id: string): Promise<T> {
    await this.findByIdOrThrow(id);
    return (this.prisma as any)[this.modelName].delete({
      where: { id },
    });
  }

  /**
   * Delete multiple records by conditions
   * @param where - Filter conditions
   * @returns Delete result
   */
  async deleteMany(where: any): Promise<{ count: number }> {
    return (this.prisma as any)[this.modelName].deleteMany({
      where,
    });
  }

  /**
   * Count records by conditions
   * @param where - Filter conditions
   * @returns Count of records
   */
  async count(where?: any): Promise<number> {
    return (this.prisma as any)[this.modelName].count({ where });
  }

  /**
   * Check if a record exists
   * @param where - Filter conditions
   * @returns Boolean indicating existence
   */
  async exists(where: any): Promise<boolean> {
    const count = await this.count(where);
    return count > 0;
  }
}
