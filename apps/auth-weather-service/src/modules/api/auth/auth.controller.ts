import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

import { swaggerType } from '../../../../../../common/swagger/utils';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthResponse } from './responses/auth.response';

@ApiTags('auth')
@SkipThrottle()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse(swaggerType(AuthResponse))
  @HttpCode(HttpStatus.OK)
  @Post()
  public async auth(@Body() authDto: AuthDto): Promise<AuthResponse> {
    return this.authService.getAccessTokenByEmailAndPassword(authDto);
  }
}
