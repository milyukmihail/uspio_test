import { User } from '@prisma/client';

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../services/prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  getUserByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  getUserByIdlOrThrowError(id: string): Promise<User> {
    return this.prismaService.user.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }
}
