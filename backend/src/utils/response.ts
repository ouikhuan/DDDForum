import { Response } from 'express';
import { Errors } from '../constants/errors';

export interface ApiResponse<T = any> {
  error?: string;
  data?: T;
  success: boolean;
}

export class ResponseHelper {
  static success<T>(res: Response, data: T, statusCode: number = 200): Response {
    return res.status(statusCode).json({
      error: undefined,
      data,
      success: true,
    } as ApiResponse<T>);
  }

  static error(res: Response, error: string, statusCode: number = 400): Response {
    return res.status(statusCode).json({
      error,
      data: undefined,
      success: false,
    } as ApiResponse);
  }

  static validationError(res: Response): Response {
    return this.error(res, Errors.ValidationError, 400);
  }

  static notFound(res: Response, error: string = Errors.UserNotFound): Response {
    return this.error(res, error, 404);
  }

  static conflict(res: Response, error: string): Response {
    return this.error(res, error, 409);
  }

  static serverError(res: Response): Response {
    return this.error(res, Errors.ServerError, 500);
  }
}
