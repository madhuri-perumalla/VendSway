import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors';

/**
 * Validation middleware factory
 * Creates middleware to validate request body against a schema
 * @param schema - Validation schema (Zod schema object)
 * @param property - Request property to validate (body, query, params)
 * @returns Express middleware function
 */
export const validate = (schema: any, property: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const data = req[property];
      const result = schema.safeParse(data);

      if (!result.success) {
        const errors = result.error.errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        throw new ValidationError('Validation failed', errors);
      }

      // Replace the property with validated data
      req[property] = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Validate request body
 * @param schema - Zod schema for body validation
 * @returns Express middleware function
 */
export const validateBody = (schema: any) => validate(schema, 'body');

/**
 * Validate request query parameters
 * @param schema - Zod schema for query validation
 * @returns Express middleware function
 */
export const validateQuery = (schema: any) => validate(schema, 'query');

/**
 * Validate request parameters
 * @param schema - Zod schema for params validation
 * @returns Express middleware function
 */
export const validateParams = (schema: any) => validate(schema, 'params');

/**
 * Validate UUID format
 * @param uuid - UUID string to validate
 * @returns Boolean indicating validity
 */
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Middleware to validate UUID parameter
 * @param paramName - Parameter name to validate
 * @returns Express middleware function
 */
export const validateUUID = (paramName: string = 'id') => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const uuid = req.params[paramName];
    if (!uuid || !isValidUUID(uuid)) {
      throw new ValidationError(`Invalid ${paramName} format. Expected UUID.`);
    }
    next();
  };
};
