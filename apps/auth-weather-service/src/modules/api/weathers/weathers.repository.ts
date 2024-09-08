import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../services/prisma/prisma.service';
import { WeatherConditionType } from './interfaces/weather-condition.type';

@Injectable()
export class WeathersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  getWeatherByCityAndDate(
    city: string,
    date: string,
  ): Promise<WeatherConditionType> {
    return this.prismaService.cityWeather.findFirstOrThrow({
      where: {
        city: {
          name: {
            contains: city,
            mode: 'insensitive',
          },
        },
        weatherDate: date,
      },
      select: {
        weatherCondition: true,
        weatherDate: true,
      },
    });
  }
}
