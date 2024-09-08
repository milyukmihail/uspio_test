import { Module } from '@nestjs/common';

import { EmailsModule } from './emails/emails.module';

@Module({
  imports: [EmailsModule],
})
export class ApiModule {}
