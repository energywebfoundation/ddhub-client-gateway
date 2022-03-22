import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class LokiMetadataStripInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        if (!data) {
          return data;
        }

        if (Array.isArray(data)) {
          data.forEach((val) => {
            delete val['meta'];
            delete val['$loki'];
          });
        }

        delete data['meta'];
        delete data['$loki'];

        return data;
      })
    );
  }
}
