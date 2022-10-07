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

type ReqParams = 'body' | 'params' | 'query';

export function ClientsInterceptor(
  fieldName: string,
  fieldPath: ReqParams,
  fqcnName: string,
  fqcnPath: ReqParams
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
      const fqcn = request[fqcnPath][fqcnName];

      if (!param || !fqcn) {
        return next.handle();
      }

      const fullClientId = `${param}:${fqcn}`;
      const canUse: boolean = await this.clientsService.canUse(fullClientId);

      if (canUse) {
        return next.handle();
      }

      await this.clientsService.upsert(fullClientId);

      return next.handle().pipe();
    }
  }

  const Interceptor = mixin(MixinInterceptor);

  return Interceptor;
}
