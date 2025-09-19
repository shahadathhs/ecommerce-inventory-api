import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './common/jwt/jwt.strategy';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ModulesModule } from './modules/modules.module';
import { LibModule } from './lib/lib.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PassportModule,

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
