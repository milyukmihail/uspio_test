import * as Joi from 'joi';

import { Module } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';

import { ApiModule } from './api/api.module';
import {
  APP_CONFIG,
  APP_CONFIG_VALIDATION_SCHEMA,
} from './services/app-config/app.config';
import { CONFIG_NAME } from './services/app-config/consts/config.const';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [registerAs(CONFIG_NAME, APP_CONFIG)],
      expandVariables: true,
      validationSchema: Joi.object(APP_CONFIG_VALIDATION_SCHEMA),
      isGlobal: true,
    }),
    ApiModule,
  ],
})
export class AppModule {}
