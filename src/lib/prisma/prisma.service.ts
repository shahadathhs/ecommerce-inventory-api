import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import chalk from 'chalk';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'error'>
  implements OnModuleInit
{
  constructor() {
    super({
      log: [{ emit: 'event', level: 'error' }],
    });

    this.$on('error', (e: Prisma.LogEvent) => {
      console.group(chalk.bgRed.white.bold('❌ Prisma Error'));
      console.error(e);
      console.groupEnd();
    });
  }

  async onModuleInit() {
    console.info(chalk.bgGreen.white.bold('🚀 Prisma connected'));
    await this.$connect();
  }
}
