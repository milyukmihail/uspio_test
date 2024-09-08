import { ApiProperty } from '@nestjs/swagger';

export class GetUserLimitsResponse {
  @ApiProperty()
  maxRequests: number;

  @ApiProperty()
  actualValue: number;
}
