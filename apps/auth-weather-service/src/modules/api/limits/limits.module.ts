import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { QueueEnum } from '../../../../../../common/queues/queue.enum';
import { UsersModule } from '../users/users.module';
import { ClientsEnjectKeysEnum } from '../weathers/inject-keys/clients-inject-keys.enum';
import { LimitsController } from './limits.controller';
import { LimitsService } from './limits.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: ClientsEnjectKeysEnum.NOTIFICATION_SERVICE,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('config.rabbitMQ.url')],
            queue: QueueEnum.NOTIFICATION,
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
    UsersModule,
  ],
  controllers: [LimitsController],
  providers: [LimitsService],
  exports: [LimitsService],
})
export class LimitsModule {}
