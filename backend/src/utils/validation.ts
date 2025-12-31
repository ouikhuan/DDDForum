import { Request, Response, NextFunction } from 'express';
import { ResponseHelper } from './response';
import { CreateUserRequest, UpdateUserRequest } from '../types/user';

export const validateCreateUser = (
  req: Request<{}, {}, CreateUserRequest>,
  res: Response,
  next: NextFunction
): Response | void => {
  const { username, email, firstName, lastName } = req.body;

  if (!username || !email || !firstName || !lastName) {
    return ResponseHelper.validationError(res);
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return ResponseHelper.validationError(res);
  }

  next();
};

export const validateUpdateUser = (
  req: Request<{ userId: string }, {}, UpdateUserRequest>,
  res: Response,
  next: NextFunction
): Response | void => {
  const userIdParam = req.params.userId;
  const userId = Number(userIdParam);

  if (Number.isNaN(userId)) {
    return ResponseHelper.validationError(res);
  }

  const { username, email, firstName, lastName } = req.body;

  // At least one field must be provided
  if (!username && !email && !firstName && !lastName) {
    return ResponseHelper.validationError(res);
  }

  // If email is provided, validate it
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return ResponseHelper.validationError(res);
    }
  }

  next();
};

export const validateEmailQuery = (
  req: Request<{}, {}, {}, { email?: string }>,
  res: Response,
  next: NextFunction
): Response | void => {
  const { email } = req.query;

  if (!email || typeof email !== 'string') {
    return ResponseHelper.validationError(res);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return ResponseHelper.validationError(res);
  }

  next();
};
