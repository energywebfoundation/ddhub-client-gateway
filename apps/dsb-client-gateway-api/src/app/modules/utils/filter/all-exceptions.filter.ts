import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { DsbMessageBrokerErrors } from '@dsb-client-gateway/dsb-client-gateway-errors';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    if (exception.response) {
      const httpStatus =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      const responseBody = {
        err: {
          reason:
            exception.response.data && exception.response.data.returnMessage
              ? exception.response.data.returnMessage
              : exception.response.message,
          statusCode: httpStatus,
          code:
            exception.response.data && exception.response.data.returnCode
              ? DsbMessageBrokerErrors[exception.response.data.returnCode]
              : exception.code,
          additionalDetails: exception.additionalDetails,
        },

        statusCode: httpStatus,
        timestamp: new Date().toISOString(),
      };

      httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);

      return;
    }

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      err: {
        reason: exception.message,
        statusCode: httpStatus,
        code: exception.code,
      },
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
