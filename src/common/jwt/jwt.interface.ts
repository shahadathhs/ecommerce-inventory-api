import { Request } from 'express';

export interface UserRequest extends Request {
  user?: JWTPayload;
}

export interface JWTPayload {
  sub: string;
  email: string;
  username: string;
  useCase?: 'access' | 'refresh';
}
