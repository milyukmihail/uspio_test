import { google } from 'googleapis';
import { OAuth2Client } from 'googleapis-common';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext } from '@nestjs/microservices';

import { UserRequestLimitEventInterface } from '../../../../../../apps/auth-weather-service/src/modules/api/weathers/interfaces/user-request-limit-event.interface';
import { Gmail } from './classes/gmail.class';

@Injectable()
export class EmailsService {
  private oAuth2Client: OAuth2Client;

  constructor(private readonly configService: ConfigService) {
    this.oAuth2Client = new google.auth.OAuth2(
      configService.getOrThrow<string>('config.email.gmail.clientId'),
      configService.getOrThrow<string>('config.email.gmail.clientSecret'),
      configService.getOrThrow<string>('config.email.gmail.redirectUri'),
    );

    this.oAuth2Client.setCredentials({
      access_token: configService.getOrThrow<string>(
        'config.email.gmail.accessToken',
      ),
      refresh_token: configService.getOrThrow<string>(
        'config.email.gmail.refreshToken',
      ),
      scope: 'https://www.googleapis.com/auth/gmail.send',
      token_type: 'Bearer',
      expiry_date: configService.getOrThrow<number>(
        'config.email.gmail.expiryDate',
      ),
    });
  }

  async handleLimitsExceeded(
    data: UserRequestLimitEventInterface,
    context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      await this.sendLimitExceededEmail(data.email, data.requestCount);

      channel.ack(originalMsg);
    } catch (error) {
      channel.nack(originalMsg, false, true);
    }
  }

  async sendLimitExceededEmail(
    emailTo: string,
    requestCount: number,
  ): Promise<void> {
    const gmail = new Gmail(this.oAuth2Client);

    await gmail.sendMessage(
      emailTo,
      'Request Limit Exceeded',
      `You exceeded request limit of ${requestCount}`,
    );
  }
}
