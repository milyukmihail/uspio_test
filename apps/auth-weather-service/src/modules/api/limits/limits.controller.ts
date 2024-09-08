import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

import { swaggerType } from '../../../../../../common/swagger/utils';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import RequestWithUserId from '../auth/interfaces/request-with-user.interface';
import { LimitsService } from './limits.service';
import { GetUserLimitsResponse } from './responses/get-user-limits.response';

@ApiTags('limits')
@ApiBearerAuth()
@SkipThrottle()
@UseGuards(JwtAuthGuard)
@Controller('limits')
export class LimitsController {
  constructor(private readonly limitsService: LimitsService) {}

  @ApiOkResponse(swaggerType(GetUserLimitsResponse))
  @HttpCode(HttpStatus.OK)
  @Get()
  public async getWeather(
    @Req() req: RequestWithUserId,
  ): Promise<GetUserLimitsResponse> {
    return this.limitsService.getUserLimits(req.user.userId);
  }
}
