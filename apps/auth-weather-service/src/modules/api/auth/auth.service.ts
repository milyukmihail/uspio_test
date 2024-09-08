import { hash } from 'node:crypto';

import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UsersRepository } from '../users/users.repository';
import { AuthDto } from './dto/auth.dto';
import TokenPayload from './interfaces/token-payload.interface';
import { AuthResponse } from './responses/auth.response';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getAccessTokenByEmailAndPassword(
    authDto: AuthDto,
  ): Promise<AuthResponse> {
    const user = await this.usersRepository.getUserByEmail(authDto.email);

    if (!user) {
      throw new BadRequestException('Invalid login or password');
    }

    const hashFromPassword = hash('sha256', authDto.password, 'hex');

    if (user.password !== hashFromPassword) {
      throw new BadRequestException('Invalid login or password');
    }

    const accessToken = this.getAccessJwtToken(user.id);

    return { accessToken };
  }

  private getAccessJwtToken(userId: string): string {
    const payload: TokenPayload = { userId };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('config.jwt.accessTokenSecret'),
      expiresIn: this.configService.get('config.jwt.accessTokenExpirationTime'),
    });

    return token;
  }
}
