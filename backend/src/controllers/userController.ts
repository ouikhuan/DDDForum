import { Request, Response, NextFunction } from 'express';
import { ResponseHelper } from '../utils/response';
import { parseUserForResponse } from '../utils/userUtils';
import {
  createUser as createUserService,
  updateUser as updateUserService,
  getUserByEmail as getUserByEmailService,
  UserConflictError,
  UserNotFoundError,
} from '../services/userService';
import { CreateUserRequest, UpdateUserRequest } from '../types/user';

/**
 * Controller: Handles HTTP requests/responses
 * Delegates business logic to Service layer (Model)
 */
export const createUser = async (
  req: Request<{}, {}, CreateUserRequest>,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const userData = req.body;
    const user = await createUserService(userData);
    return ResponseHelper.success(res, parseUserForResponse(user), 201);
  } catch (error) {
    if (error instanceof UserConflictError) {
      return ResponseHelper.conflict(res, error.message);
    }
    next(error);
  }
};

export const editUser = async (
  req: Request<{ userId: string }, {}, UpdateUserRequest>,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const userId = Number(req.params.userId);
    const userData = req.body;
    const updatedUser = await updateUserService(userId, userData);
    return ResponseHelper.success(res, parseUserForResponse(updatedUser));
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return ResponseHelper.notFound(res);
    }
    if (error instanceof UserConflictError) {
      return ResponseHelper.conflict(res, error.message);
    }
    next(error);
  }
};

export const getUserByEmail = async (
  req: Request<{}, {}, {}, { email: string }>,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { email } = req.query;
    const user = await getUserByEmailService(email);
    return ResponseHelper.success(res, parseUserForResponse(user));
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return ResponseHelper.notFound(res);
    }
    next(error);
  }
};
