import { CityWeather } from '@prisma/client';

import { ApiProperty } from '@nestjs/swagger';

export class GetWeatherResponse
  implements Pick<CityWeather, 'weatherDate' | 'weatherCondition'>
{
  @ApiProperty()
  weatherCondition: string;

  @ApiProperty()
  weatherDate: Date;
}
