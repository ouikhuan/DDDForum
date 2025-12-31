export interface CreateUserRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface UserQueryParams {
  email?: string;
}
