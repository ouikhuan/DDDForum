import { Request, Response, NextFunction } from 'express';
import { ResponseHelper } from '../utils/response';
import { Errors } from '../constants/errors';
import { UserConflictError, UserNotFoundError } from '../services/userService';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  // Log error for debugging
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  // Handle business logic errors from Service layer
  if (err instanceof UserConflictError) {
    return ResponseHelper.conflict(res, err.message);
  }

  if (err instanceof UserNotFoundError) {
    return ResponseHelper.notFound(res);
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return ResponseHelper.validationError(res);
  }

  // Default to server error
  return ResponseHelper.serverError(res);
};
