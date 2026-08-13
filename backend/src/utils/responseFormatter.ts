import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types';

/**
 * Standard success response formatter
 * @param res - Express response object
 * @param data - Response data
 * @param message - Success message
 * @param statusCode - HTTP status code (default: 200)
 */
export const successResponse = <T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    status: 'success',
    message,
    data,
  };
  return res.status(statusCode).json(response);
};

/**
 * Standard paginated response formatter
 * @param res - Express response object
 * @param data - Response data array
 * @param pagination - Pagination metadata
 * @param message - Success message
 * @param statusCode - HTTP status code (default: 200)
 */
export const paginatedResponse = <T>(
  res: Response,
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  },
  message: string = 'Success',
  statusCode: number = 200
): Response => {
  const response: PaginatedResponse<T> = {
    data,
    pagination,
  };
  return res.status(statusCode).json({
    status: 'success',
    message,
    ...response,
  });
};

/**
 * Standard error response formatter
 * @param res - Express response object
 * @param message - Error message
 * @param errorCode - Error code
 * @param statusCode - HTTP status code (default: 500)
 * @param details - Additional error details
 */
export const errorResponse = (
  res: Response,
  message: string,
  errorCode: string = 'INTERNAL_ERROR',
  statusCode: number = 500,
  details?: any
): Response => {
  const response: ApiResponse = {
    status: 'error',
    message,
    errorCode,
    ...(details && { details }),
  };
  return res.status(statusCode).json(response);
};

/**
 * Created response formatter (201)
 * @param res - Express response object
 * @param data - Created resource data
 * @param message - Success message
 */
export const createdResponse = <T>(
  res: Response,
  data: T,
  message: string = 'Resource created successfully'
): Response => {
  return successResponse(res, data, message, 201);
};

/**
 * No content response formatter (204)
 * @param res - Express response object
 */
export const noContentResponse = (res: Response): Response => {
  return res.status(204).send();
};

/**
 * Accepted response formatter (202)
 * @param res - Express response object
 * @param data - Response data
 * @param message - Success message
 */
export const acceptedResponse = <T>(
  res: Response,
  data: T,
  message: string = 'Request accepted'
): Response => {
  return successResponse(res, data, message, 202);
};
