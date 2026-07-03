import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { storage, Store } from 'nestjs-pino/storage';
import { Observable } from 'rxjs';

@Injectable()
export class PinoContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    if (storage.getStore()) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const log =
      request.log ??
      (request.allLogs?.length
        ? request.allLogs[request.allLogs.length - 1]
        : undefined) ??
      PinoLogger.root;

    if (!log) {
      return next.handle();
    }

    return new Observable((subscriber) => {
      storage.run(new Store(log), () => {
        next.handle().subscribe({
          next: (value) => subscriber.next(value),
          error: (err) => subscriber.error(err),
          complete: () => subscriber.complete(),
        });
      });
    });
  }
}
