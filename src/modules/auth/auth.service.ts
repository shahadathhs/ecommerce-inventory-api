import { UserResponseDto } from '@/common/dto/user-response.dto';
import { ENVEnum } from '@/common/enum/env.enum';
import { AppError } from '@/common/error/handle-error.app';
import { HandleError } from '@/common/error/handle-error.decorator';
import { JWTPayload } from '@/common/jwt/jwt.interface';
import { successResponse } from '@/common/utils/response.utils';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { RefreshTokenRepository } from './repo/refresh-token.repository';
import { UserRepository } from './repo/user.repository';

@Injectable()
export class AuthService {
  private accessTokenExpiry: string;
  private refreshTokenExpiry = '90d';
  private expirySeconds = 90 * 24 * 60 * 60;

  constructor(
    private readonly userRepo: UserRepository,
    private readonly refreshTokenRepo: RefreshTokenRepository,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {
    this.accessTokenExpiry = this.config.getOrThrow<string>(
      ENVEnum.ACCESS_TOKEN_EXPIRES_IN,
    );
  }

  @HandleError('Error creating user', 'User')
  async register(dto: RegisterDto) {
    const existingUser = await this.userRepo.findByEmail(dto.email);
    if (existingUser) throw new AppError(409, 'User already exists');

    const existingUserName = await this.userRepo.findByUserName(dto.username);
    if (existingUserName) throw new AppError(409, 'Username already exists');

    const hashedPassword = await this.hash(dto.password);

    const user = await this.userRepo.create({
      ...dto,
      password: hashedPassword,
    });

    const tokens = await this.generateTokens(user);

    return this.wrapResponse(
      { user, tokens },

      'User created successfully',
    );
  }

  @HandleError('Error logging in user', 'User')
  async login(dto: LoginDto) {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) throw new AppError(404, 'Token Not Found');

    const match = await this.compare(dto.password, user.password);
    if (!match) throw new AppError(401, 'Invalid credentials');

    const tokens = await this.generateTokens(user);
    return this.wrapResponse({ user, tokens }, 'Login successful');
  }

  @HandleError('Error refreshing token', 'Token or User')
  async refreshToken(token: string) {
    const decoded = this.jwtService.decode(token);
    if (
      !decoded ||
      !(decoded as JWTPayload).sub ||
      !(decoded as JWTPayload).useCase
    )
      throw new AppError(401, 'Invalid RefreshToken token');

    if ((decoded as JWTPayload).useCase !== 'refresh')
      throw new AppError(401, 'Invalid RefreshToken token');

    const user = await this.userRepo.findById(decoded.sub);
    if (!user) throw new AppError(404, 'User Not Found');

    const saved = await this.refreshTokenRepo.findValidToken(
      decoded.sub,
      token,
    );
    if (!saved || saved === null) throw new AppError(404, 'Token Not Found');

    await this.refreshTokenRepo.revokeToken(saved.id);

    const tokens = await this.generateTokens(user);
    return this.wrapResponse({ user, tokens }, 'Token refreshed successfully');
  }

  @HandleError('Error logging out user', 'User')
  async logout(userId: string) {
    await this.refreshTokenRepo.revokeAllForUser(userId);
    return successResponse(null, 'Logout successful');
  }

  // Helpers
  private async generateTokens(user: {
    id: string;
    email: string;
    username: string;
  }) {
    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    const accessToken = this.genTokenByExpires(payload, this.accessTokenExpiry);

    const refreshToken = this.genTokenByExpires(
      payload,
      this.refreshTokenExpiry,
      true,
    );

    await this.refreshTokenRepo.create({
      token: await this.hash(refreshToken),
      userId: user.id,
      expiresAt: new Date(Date.now() + this.expirySeconds * 1000),
    });

    return { accessToken, refreshToken };
  }

  private async wrapResponse(data: any, message = 'Operation successful') {
    const sanitized = plainToInstance(UserResponseDto, data.user);

    return successResponse({ user: sanitized, tokens: data.tokens }, message);
  }

  private async hash(data: string) {
    return await bcrypt.hash(data, 10);
  }

  private async compare(data: string, hash: string) {
    return await bcrypt.compare(data, hash);
  }

  private genTokenByExpires(
    payload: JWTPayload,
    expiresIn: string,
    isRefreshToken = false,
  ) {
    return this.jwtService.sign(
      {
        ...payload,
        useCase: isRefreshToken ? 'refresh' : 'access',
      },
      {
        secret: this.config.getOrThrow<string>(ENVEnum.JWT_SECRET),
        expiresIn,
      },
    );
  }
}
