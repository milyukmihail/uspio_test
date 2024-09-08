import { Cache } from 'cache-manager';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { LimitsService } from '../limits/limits.service';
import { GetWeatherDto } from './dto/get-weather.dto';
import { GetWeatherResponse } from './responses/get-weather.response';
import { WeathersRepository } from './weathers.repository';

@Injectable()
export class WeathersService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
    private readonly weathersRepository: WeathersRepository,
    private readonly configService: ConfigService,
    private readonly limitsService: LimitsService,
  ) {}

  async getWeatherByCityAndDate(
    getWeatherDto: GetWeatherDto,
    userId: string,
  ): Promise<GetWeatherResponse> {
    const cacheKey = this.getCacheKey(getWeatherDto.city, getWeatherDto.date);

    await this.limitsService.handleUserRequestLimit(userId);

    const cachedWeather =
      await this.cacheService.get<GetWeatherResponse>(cacheKey);

    if (cachedWeather) {
      return cachedWeather;
    }

    const date = getWeatherDto.date.split('T')[0];

    const weathers = await this.weathersRepository.getWeatherByCityAndDate(
      getWeatherDto.city,
      `${date}T00:00:00.000Z`,
    );

    await this.cacheService.set(cacheKey, weathers, {
      ttl: +this.configService.getOrThrow<string>(
        'config.cache.weatherCacheTtlMs',
      ),
    });

    return weathers;
  }

  private getCacheKey(city: string, date: string): string {
    return `weather:${city}:${date}`;
  }
}
