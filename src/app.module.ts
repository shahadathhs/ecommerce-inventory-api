import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ENVEnum } from './common/enum/env.enum';
import { JwtStrategy } from './common/jwt/jwt.strategy';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { LibModule } from './lib/lib.module';
import { ModulesModule } from './modules/modules.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PassportModule,

    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: await config.getOrThrow(ENVEnum.JWT_SECRET),
        signOptions: { expiresIn: '1d' },
      }),
    }),

    ModulesModule,

    LibModule,
  ],
  providers: [JwtStrategy],
  exports: [JwtStrategy],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
