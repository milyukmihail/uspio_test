import { CityWeather } from '@prisma/client';

export type WeatherConditionType = Pick<
  CityWeather,
  'weatherCondition' | 'weatherDate'
>;
