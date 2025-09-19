import {
  createParamDecorator,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWTPayload, UserRequest } from './jwt.interface';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

export const GetUser = createParamDecorator(
  (key: JWTPayload['sub'] | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<UserRequest>();
    const user = request.user;

    return key ? user?.sub : user;
  },
);
