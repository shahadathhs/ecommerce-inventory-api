import { PrismaService } from '@/lib/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { RefreshToken } from '@prisma/client';

@Injectable()
export class RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    token: string;
    userId: string;
    expiresAt: Date;
  }): Promise<RefreshToken> {
    return this.prisma.refreshToken.create({ data });
  }

  async findValidToken(token: string): Promise<RefreshToken | null> {
    return this.prisma.refreshToken.findFirst({
      where: { token, expiresAt: { gt: new Date() } },
    });
  }

  async revokeToken(id: string) {
    return this.prisma.refreshToken.delete({
      where: { id },
    });
  }

  async revokeAllForUser(userId: string) {
    return this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }
}
