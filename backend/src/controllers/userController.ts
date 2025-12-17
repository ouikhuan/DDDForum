import { Request, Response } from 'express';
import { Errors } from '../constants/errors';
import { generateRandomPassword, parseUserForResponse } from '../utils/userUtils';
import {
  findUserByUsername,
  findUserByEmail,
  findUserById,
  createUser as svcCreateUser,
  updateUser as svcUpdateUser,
} from '../services/userService';

export const createUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body;

    if (!userData.username || !userData.email || !userData.firstName || !userData.lastName) {
      return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
    }

    const existingUserByUsername = await findUserByUsername(userData.username);
    if (existingUserByUsername) {
      return res.status(409).json({ error: Errors.UsernameAlreadyTaken, data: undefined, success: false });
    }

    const existingUserByEmail = await findUserByEmail(userData.email);
    if (existingUserByEmail) {
      return res.status(409).json({ error: Errors.EmailAlreadyInUse, data: undefined, success: false });
    }

    const user = await svcCreateUser({ ...userData, password: generateRandomPassword(10) } as any);

    return res.status(201).json({ error: undefined, data: parseUserForResponse(user), success: true });
  } catch (error) {
    return res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
  }
};

export const editUser = async (req: Request, res: Response) => {
  try {
    const userIdParam = req.params.userId;
    const userId = Number(userIdParam);

    if (Number.isNaN(userId)) {
      return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
    }

    const existingUser = await findUserById(userId);
    if (!existingUser) {
      return res.status(404).json({ error: Errors.UserNotFound, data: undefined, success: false });
    }

    const userData = req.body;

    if (userData.username && userData.username !== existingUser.username) {
      const existingUserByUsername = await findUserByUsername(userData.username);
      if (existingUserByUsername && existingUserByUsername.id !== userId) {
        return res.status(409).json({ error: Errors.UsernameAlreadyTaken, data: undefined, success: false });
      }
    }

    const existingUserByEmail = await findUserByEmail(userData.email);
    if (existingUserByEmail && existingUserByEmail.id !== userId) {
      return res.status(409).json({ error: Errors.EmailAlreadyInUse, data: undefined, success: false });
    }

    if (!userData.email || !userData.firstName || !userData.lastName || !userData.username) {
      return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
    }

    const user = await svcUpdateUser(userId, { ...userData } as any);

    return res.status(200).json({ error: undefined, data: parseUserForResponse(user), success: true });
  } catch (error) {
    return res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const email = req.query.email as string;
    if (!email) {
      return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: Errors.UserNotFound, data: undefined, success: false });
    }

    return res.status(200).json({ error: undefined, data: parseUserForResponse(user), success: true });
  } catch (error) {
    return res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
  }
};
