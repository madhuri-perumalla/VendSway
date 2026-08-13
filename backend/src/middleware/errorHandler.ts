import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export interface AppError extends Error {
  statusCode?: number;
  errorCode?: string;
  details?: any;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const fields = (err.meta?.target as string[])?.join(', ') || 'field';
      res.status(409).json({
        status: 'error',
        message: `A record with this ${fields} already exists. Please use a different value or check your application status.`,
        errorCode: 'DUPLICATE_ENTRY',
      });
      return;
    }

    if (err.code === 'P2003') {
      res.status(400).json({
        status: 'error',
        message: 'Invalid reference to a related record',
        errorCode: 'FOREIGN_KEY_VIOLATION',
      });
      return;
    }
  }

  const statusCode = err.statusCode || 500;
  const errorCode = err.errorCode || 'SERVER_ERROR';
  const message = err.message || 'Internal server error';

  console.error(`[${new Date().toISOString()}] Error:`, {
    message: err.message,
    statusCode,
    errorCode,
    stack: err.stack,
  });

  res.status(statusCode).json({
    status: 'error',
    message,
    errorCode,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
    errorCode: 'NOT_FOUND',
  });
};
