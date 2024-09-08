import { Strategy, ExtractJwt } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { UsersRepository } from '../../users/users.repository';
import TokenPayload from '../interfaces/token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('config.jwt.accessTokenSecret'),
    });
  }

  public async validate(payload: TokenPayload): Promise<{ userId: string }> {
    const user = await this.usersRepository.getUserByIdlOrThrowError(
      payload.userId,
    );

    return { userId: user.id };
  }
}
