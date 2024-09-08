import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { UserRequestLimitEventInterface } from '../../../../../../apps/auth-weather-service/src/modules/api/weathers/interfaces/user-request-limit-event.interface';
import { QueueMessagesEnum } from '../../../../../../common/queues/queue-messages.enum';
import { EmailsService } from './emails.service';

@Controller()
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @MessagePattern(QueueMessagesEnum.USER_REQUESTS_LIMIT)
  public handleLimitExceeded(
    @Payload() data: UserRequestLimitEventInterface,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    return this.emailsService.handleLimitsExceeded(data, context);
  }
}
