import { PrismaService } from '@/lib/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { RefreshToken } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

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

  async findValidToken(userId: string, token: string) {
    const tokens = await this.prisma.refreshToken.findMany({
      where: { userId, expiresAt: { gt: new Date() } },
    });

    for (const t of tokens) {
      if (await bcrypt.compare(token, t.token)) {
        return t;
      }
    }

    return null;
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
