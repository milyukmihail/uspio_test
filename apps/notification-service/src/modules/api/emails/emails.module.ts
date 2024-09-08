import { Module } from '@nestjs/common';

import { EmailsController } from './emails.controller';
import { EmailsService } from './emails.service';

@Module({
  imports: [],
  providers: [EmailsService],
  controllers: [EmailsController],
})
export class EmailsModule {}
