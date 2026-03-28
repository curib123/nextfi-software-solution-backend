import { Request } from 'express';
import { UserRole } from '../enums/user-role.enum';

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  permissions: string[];
}

export type RequestWithUser = Request & {
  user?: AuthenticatedUser;
};
