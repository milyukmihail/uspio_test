import * as redisStore from 'cache-manager-redis-store';
import * as Joi from 'joi';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';

import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService, registerAs } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import JsonBodyMiddleware from '../../../../common/middlewares/json-body.middleware';
import { ApiModule } from './api/api.module';
import {
  APP_CONFIG,
  APP_CONFIG_VALIDATION_SCHEMA,
} from './services/app-config/app.config';
import { CONFIG_NAME } from './services/app-config/consts/config.const';
import { PrismaModule } from './services/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [registerAs(CONFIG_NAME, APP_CONFIG)],
      expandVariables: true,
      validationSchema: Joi.object(APP_CONFIG_VALIDATION_SCHEMA),
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        store: redisStore as any,
        socket: {
          host: configService.get<string>('config.redis.host'),
          port: configService.get<string>('config.redis.port'),
        },
        isGlobal: true,
      }),
      inject: [ConfigService],
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: +config.getOrThrow('config.rateLimit.weatherWindowMs'),
          limit: +config.getOrThrow('config.rateLimit.weatherMaxCount'),
          storage: new ThrottlerStorageRedisService(
            `redis://${config.getOrThrow('config.redis.host')}:${config.getOrThrow('config.redis.port')}`,
          ),
        },
      ],
    }),
    PrismaModule,
    ApiModule,
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(JsonBodyMiddleware).forRoutes('*');
  }
}
