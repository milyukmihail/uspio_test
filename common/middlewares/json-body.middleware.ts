import * as bodyParser from 'body-parser';

import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export default class JsonBodyMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => any) {
    bodyParser.json()(req, res, next);
  }
}
