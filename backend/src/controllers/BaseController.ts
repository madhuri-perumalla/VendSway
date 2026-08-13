import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import {
  successResponse,
  paginatedResponse,
  createdResponse,
  noContentResponse,
} from '../utils/responseFormatter';
import { BaseService } from '../services/BaseService';

/**
 * Base controller class providing common HTTP operations
 * All controllers should extend this class
 */
export abstract class BaseController<T, CreateInput, UpdateInput> {
  protected service: BaseService<T, CreateInput, UpdateInput>;

  constructor(service: BaseService<T, CreateInput, UpdateInput>) {
    this.service = service;
  }

  /**
   * Get a single record by ID
   * @param req - Express request
   * @param res - Express response
   */
  getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const include = (req as any).include;
    const record = await this.service.getByIdOrThrow(id, include);
    return successResponse(res, record, 'Record retrieved successfully');
  });

  /**
   * Get all records with optional filters
   * @param req - Express request
   * @param res - Express response
   */
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const where = (req as any).where;
    const include = (req as any).include;
    const orderBy = (req as any).orderBy;
    const records = await this.service.getAll(where, include, orderBy);
    return successResponse(res, records, 'Records retrieved successfully');
  });

  /**
   * Get paginated records
   * @param req - Express request
   * @param res - Express response
   */
  getPaginated = asyncHandler(async (req: Request, res: Response) => {
    const where = (req as any).where;
    const include = (req as any).include;
    const orderBy = (req as any).orderBy;
    const page = parseInt((req.query.page as string) || '1', 10);
    const limit = parseInt((req.query.limit as string) || '10', 10);

    const result = await this.service.getPaginated(where, include, orderBy, page, limit);
    return paginatedResponse(res, result.data, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    }, 'Records retrieved successfully');
  });

  /**
   * Create a new record
   * @param req - Express request
   * @param res - Express response
   */
  create = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body as CreateInput;
    const include = (req as any).include;
    const record = await this.service.create(data, include);
    return createdResponse(res, record, 'Record created successfully');
  });

  /**
   * Update a record by ID
   * @param req - Express request
   * @param res - Express response
   */
  update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body as UpdateInput;
    const include = (req as any).include;
    const record = await this.service.update(id, data, include);
    return successResponse(res, record, 'Record updated successfully');
  });

  /**
   * Delete a record by ID
   * @param req - Express request
   * @param res - Express response
   */
  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.service.delete(id);
    return noContentResponse(res);
  });

  /**
   * Get count of records
   * @param req - Express request
   * @param res - Express response
   */
  count = asyncHandler(async (req: Request, res: Response) => {
    const where = (req as any).where;
    const count = await this.service.count(where);
    return successResponse(res, { count }, 'Count retrieved successfully');
  });

  /**
   * Check if a record exists
   * @param req - Express request
   * @param res - Express response
   */
  exists = asyncHandler(async (req: Request, res: Response) => {
    const where = (req as any).where;
    const exists = await this.service.exists(where);
    return successResponse(res, { exists }, 'Existence check completed');
  });
}
