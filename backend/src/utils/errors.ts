import { AppError } from '../middleware/errorHandler';

export class BadRequestError extends Error implements AppError {
  statusCode = 400;
  errorCode = 'BAD_REQUEST';
  details?: any;

  constructor(message: string, details?: any) {
    super(message);
    this.name = 'BadRequestError';
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class UnauthorizedError extends Error implements AppError {
  statusCode = 401;
  errorCode = 'UNAUTHORIZED';
  details?: any;

  constructor(message: string = 'Unauthorized access', details?: any) {
    super(message);
    this.name = 'UnauthorizedError';
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ForbiddenError extends Error implements AppError {
  statusCode = 403;
  errorCode = 'FORBIDDEN';
  details?: any;

  constructor(message: string = 'Access forbidden', details?: any) {
    super(message);
    this.name = 'ForbiddenError';
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends Error implements AppError {
  statusCode = 404;
  errorCode = 'NOT_FOUND';
  details?: any;

  constructor(message: string = 'Resource not found', details?: any) {
    super(message);
    this.name = 'NotFoundError';
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ConflictError extends Error implements AppError {
  statusCode = 409;
  errorCode = 'CONFLICT';
  details?: any;

  constructor(message: string, details?: any) {
    super(message);
    this.name = 'ConflictError';
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends Error implements AppError {
  statusCode = 422;
  errorCode = 'VALIDATION_ERROR';
  details?: any;

  constructor(message: string, details?: any) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InternalServerError extends Error implements AppError {
  statusCode = 500;
  errorCode = 'INTERNAL_SERVER_ERROR';
  details?: any;

  constructor(message: string = 'Internal server error', details?: any) {
    super(message);
    this.name = 'InternalServerError';
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ServiceUnavailableError extends Error implements AppError {
  statusCode = 503;
  errorCode = 'SERVICE_UNAVAILABLE';
  details?: any;

  constructor(message: string = 'Service temporarily unavailable', details?: any) {
    super(message);
    this.name = 'ServiceUnavailableError';
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}
