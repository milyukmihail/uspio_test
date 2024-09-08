import { Observable, throwError } from 'rxjs';

import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcExceptionHandler implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException): Observable<any> {
    return throwError(() => exception.getError());
  }
}
