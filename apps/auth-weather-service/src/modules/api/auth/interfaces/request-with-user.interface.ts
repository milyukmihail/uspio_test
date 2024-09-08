import { Request } from 'express';

interface RequestWithUserId extends Request {
  user: {
    userId: string;
  };
}

export default RequestWithUserId;
