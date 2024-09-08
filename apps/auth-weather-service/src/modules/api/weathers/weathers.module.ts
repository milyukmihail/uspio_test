import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

import { PrismaModule } from '../../services/prisma/prisma.module';
import { LimitsModule } from '../limits/limits.module';
import { UsersModule } from '../users/users.module';
import { WeathersController } from './weathers.controller';
import { WeathersRepository } from './weathers.repository';
import { WeathersService } from './weathers.service';

@Module({
  imports: [PrismaModule, LimitsModule, UsersModule],
  providers: [
    WeathersService,
    WeathersRepository,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  controllers: [WeathersController],
})
export class WeathersModule {}
