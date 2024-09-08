import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

export function swaggerBootstrap(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Auth Weather Service API')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  };

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, customOptions);
}
