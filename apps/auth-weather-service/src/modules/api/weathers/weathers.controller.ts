import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { swaggerType } from '../../../../../../common/swagger/utils';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import RequestWithUserId from '../auth/interfaces/request-with-user.interface';
import { GetWeatherDto } from './dto/get-weather.dto';
import { GetWeatherResponse } from './responses/get-weather.response';
import { WeathersService } from './weathers.service';

@ApiTags('weathers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('weathers')
export class WeathersController {
  constructor(private readonly weathersService: WeathersService) {}

  @ApiOkResponse(swaggerType(GetWeatherResponse))
  @HttpCode(HttpStatus.OK)
  @Get()
  public async getWeather(
    @Query() getWeatherDto: GetWeatherDto,
    @Req() req: RequestWithUserId,
  ): Promise<GetWeatherResponse> {
    return this.weathersService.getWeatherByCityAndDate(
      getWeatherDto,
      req.user.userId,
    );
  }
}
