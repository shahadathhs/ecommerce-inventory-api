import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokenRepository } from './repo/refresh-token.repository';
import { UserRepository } from './repo/user.repository';

@Module({
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenRepository, UserRepository, JwtService],
})
export class AuthModule {}
