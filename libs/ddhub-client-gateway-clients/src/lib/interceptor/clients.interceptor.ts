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

      if (param) {
        const paramTrim = param.trim();
        const clientIdRegex = new RegExp(/^[a-zA-Z0-9]+$/);

        if (clientIdRegex.test(paramTrim)) {
          const fullClientId = `${paramTrim}:${fqcn}`;

          if (fullClientId.length <= 247) {
            await this.clientsService.upsert(fullClientId);
          }
        }
      }

      return next.handle();
    }
  }

  const Interceptor = mixin(MixinInterceptor);

  return Interceptor;
}
