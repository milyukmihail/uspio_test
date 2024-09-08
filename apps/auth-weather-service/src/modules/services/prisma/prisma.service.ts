import { PrismaClient } from '@prisma/client';

import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('DB_URL'),
        },
      },
      log: ['info', 'warn', 'error'],
      errorFormat: 'pretty',
    });
  }

  public async onModuleInit(): Promise<void> {
    await this.$connect();
  }
}
