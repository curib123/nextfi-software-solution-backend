import { Request } from 'express';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

export type RequestWithUser = Request & {
  user?: AuthenticatedUser;
};
