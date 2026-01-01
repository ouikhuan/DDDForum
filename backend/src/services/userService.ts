import { prisma } from '../lib/prisma';
import { Prisma, User } from '@prisma/client';
import { CreateUserRequest, UpdateUserRequest } from '../types/user';
import { generateRandomPassword } from '../utils/userUtils';
import { Errors } from '../constants/errors';

// Custom error classes for business logic
export class UserConflictError extends Error {
  constructor(public conflictType: 'username' | 'email') {
    super(conflictType === 'username' ? Errors.UsernameAlreadyTaken : Errors.EmailAlreadyInUse);
    this.name = 'UserConflictError';
  }
}

export class UserNotFoundError extends Error {
  constructor() {
    super(Errors.UserNotFound);
    this.name = 'UserNotFoundError';
  }
}

// Data access layer (Repository pattern)
async function findUserByUsername(username: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { username } });
}

async function findUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}

async function findUserById(id: number): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

async function createUserInDb(data: Prisma.UserCreateInput): Promise<User> {
  return prisma.user.create({ data });
}

async function updateUserInDb(id: number, data: Prisma.UserUpdateInput): Promise<User> {
  return prisma.user.update({ where: { id }, data });
}

// Business logic layer (Model in MVC)
export async function getUserByEmail(email: string): Promise<User> {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new UserNotFoundError();
  }
  return user;
}

export async function getUserById(id: number): Promise<User> {
  const user = await findUserById(id);
  if (!user) {
    throw new UserNotFoundError();
  }
  return user;
}

async function checkUserConflicts(
  username?: string,
  email?: string,
  excludeUserId?: number
): Promise<void> {
  if (username) {
    const existingUser = await findUserByUsername(username);
    if (existingUser && existingUser.id !== excludeUserId) {
      throw new UserConflictError('username');
    }
  }

  if (email) {
    const existingUser = await findUserByEmail(email);
    if (existingUser && existingUser.id !== excludeUserId) {
      throw new UserConflictError('email');
    }
  }
}

export async function createUser(userData: CreateUserRequest): Promise<User> {
  // Business logic: Check for conflicts
  await checkUserConflicts(userData.username, userData.email);

  // Business logic: Generate password
  const password = generateRandomPassword(10);

  // Create user
  return createUserInDb({
    ...userData,
    password,
  });
}

export async function updateUser(userId: number, userData: UpdateUserRequest): Promise<User> {
  // Business logic: Validate user exists
  await getUserById(userId);

  // Business logic: Check for conflicts (only if username/email is being changed)
  await checkUserConflicts(userData.username, userData.email, userId);

  // Update user
  return updateUserInDb(userId, userData);
}
