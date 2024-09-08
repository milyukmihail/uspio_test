import { CustomExceptionFilter } from 'common/middlewares/custom-exception.filter';

import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { swaggerBootstrap } from './bootstrap/swagger.bootstrap';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<NestExpressApplication>(ConfigService);

  const appPort = configService.get<string>('APP_PORT');

  app.enableShutdownHooks();

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new CustomExceptionFilter());

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  swaggerBootstrap(app);

  await app.listen(appPort, () =>
    console.log(`Server launched on port: ${appPort}`),
  );
}

bootstrap();
