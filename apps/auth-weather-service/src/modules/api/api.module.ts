import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { LimitsModule } from './limits/limits.module';
import { UsersModule } from './users/users.module';
import { WeathersModule } from './weathers/weathers.module';

@Module({
  imports: [AuthModule, UsersModule, LimitsModule, WeathersModule],
})
export class ApiModule {}
