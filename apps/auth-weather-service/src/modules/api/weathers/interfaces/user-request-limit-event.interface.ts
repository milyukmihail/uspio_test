import { User } from '@prisma/client';

export interface UserRequestLimitEventInterface extends Pick<User, 'email'> {
  requestCount: number;
}
