import {
  CallHandler,
  ExecutionContext,
  Injectable,
  mixin,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { ClientsService } from '../service/clients.service';
import { Observable } from 'rxjs';

export function ClientsInterceptor(
  fieldName: string,
  fieldPath: 'body' | 'params' | 'query' = 'body'
): Type<NestInterceptor> {
  @Injectable()
  class MixinInterceptor implements NestInterceptor {
    constructor(protected readonly clientsService: ClientsService) {}

    public async intercept(
      context: ExecutionContext,
      next: CallHandler<any>
    ): Promise<Observable<any>> {
      const request = context.switchToHttp().getRequest();

      const param = request[fieldPath][fieldName];

      if (!param) {
        return next.handle();
      }

      await this.clientsService.upsert(param);

      return next.handle();
    }
  }

  const Interceptor = mixin(MixinInterceptor);

  return Interceptor;
}
