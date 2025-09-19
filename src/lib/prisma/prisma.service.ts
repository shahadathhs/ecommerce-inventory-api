import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import chalk from 'chalk';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'error'>
  implements OnModuleInit
{
  private readonly logger = new Logger(PrismaService.name);
  constructor() {
    super({
      log: [{ emit: 'event', level: 'error' }],
    });

    this.$on('error', (e: Prisma.LogEvent) => {
      console.info(chalk.gray('-'.repeat(60)));
      console.group(chalk.bgRed.white.bold('❌ Prisma Error'));
      console.error(e);
      console.groupEnd();
      console.info(chalk.gray('-'.repeat(60)));
      this.logger.error(e);
    });
  }

  async onModuleInit() {
    console.info(chalk.bgGreen.white.bold('Prisma connected'));
    this.logger.log('PrismaService initialized');
    await this.$connect();
  }
}
