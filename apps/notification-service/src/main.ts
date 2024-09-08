import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { RpcExceptionHandler } from '../../../common/middlewares/rpc-exception.filter';
import { QueueEnum } from '../../../common/queues/queue.enum';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const microserviceOptions: MicroserviceOptions = {
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow<string>('config.rabbitMQ.url')],
      queue: QueueEnum.NOTIFICATION,
      noAck: false,
      queueOptions: {
        durable: true,
      },
    },
  };

  app.connectMicroservice(microserviceOptions);

  app.useGlobalFilters(new RpcExceptionHandler());

  await app.startAllMicroservices();

  console.log('Notification service is running and listening for messages...');
}

bootstrap();
