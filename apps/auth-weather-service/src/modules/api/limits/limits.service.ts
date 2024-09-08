import { Cache } from 'cache-manager';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';

import { QueueMessagesEnum } from '../../../../../../common/queues/queue-messages.enum';
import { UsersRepository } from '../users/users.repository';
import { ClientsEnjectKeysEnum } from '../weathers/inject-keys/clients-inject-keys.enum';
import { RequestCountInterface } from '../weathers/interfaces/request-count.interface';
import { UserRequestLimitEventInterface } from '../weathers/interfaces/user-request-limit-event.interface';
import { ActialLimitValueInterface } from './interfaces/actual-limit-value.interface';
import { GetUserLimitsResponse } from './responses/get-user-limits.response';

@Injectable()
export class LimitsService {
  private requestMaxCount: number;

  constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly usersRepository: UsersRepository,
    @Inject(ClientsEnjectKeysEnum.NOTIFICATION_SERVICE)
    private readonly client: ClientProxy,
  ) {
    this.requestMaxCount = +this.configService.getOrThrow<number>(
      'config.rateLimit.requestMaxCount',
    );
  }

  async getUserLimits(userId: string): Promise<GetUserLimitsResponse> {
    const cacheKey = this.getCacheKey(userId);

    const limits =
      await this.cacheService.get<ActialLimitValueInterface>(cacheKey);

    const actualValue = limits ? limits.count : 0;

    return {
      actualValue,
      maxRequests: this.requestMaxCount,
    };
  }

  async handleUserRequestLimit(userId: string): Promise<void> {
    const userRequestKey = this.getCacheKey(userId);

    const requestCount =
      await this.cacheService.get<RequestCountInterface>(userRequestKey);

    if (requestCount && requestCount.isNotificationTriggered) {
      throw new HttpException(
        'Request limit exceeded',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    if (requestCount && requestCount.count >= this.requestMaxCount) {
      const [user] = await Promise.all([
        this.usersRepository.getUserByIdlOrThrowError(userId),
        this.cacheService.set(
          userRequestKey,
          {
            count: requestCount.count,
            isNotificationTriggered: true,
          },
          { ttl: 0 },
        ),
      ]);

      this.client
        .emit<void, UserRequestLimitEventInterface>(
          QueueMessagesEnum.USER_REQUESTS_LIMIT,
          {
            email: user.email,
            requestCount: this.requestMaxCount,
          },
        )
        .subscribe({
          error: () => {},
        });

      throw new HttpException(
        'Request limit exceeded',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    await this.cacheService.set(
      userRequestKey,
      {
        count: requestCount ? requestCount.count + 1 : 1,
        isNotificationTriggered: false,
      },
      { ttl: 0 },
    );
  }

  getCacheKey(userId: string) {
    return `user:requests:${userId}`;
  }
}
