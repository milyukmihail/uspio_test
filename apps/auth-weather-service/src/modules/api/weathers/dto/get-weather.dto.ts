import { IsISO8601, IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class GetWeatherDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ type: Date })
  @IsNotEmpty()
  @IsISO8601()
  date: string;
}
