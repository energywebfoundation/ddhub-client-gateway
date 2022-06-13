import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AbstractHttpAdapter, HttpAdapterHost } from '@nestjs/core';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ResponseErrorDto } from '../dto/response-error.dto';
import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  protected readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    if (exception instanceof BaseException) {
      const responseBody: ResponseErrorDto = {
        err: {
          code: exception.code,
          reason: exception.message,
          additionalDetails: exception.additionalDetails,
        },
        timestamp: new Date().toISOString(),
        statusCode: exception.httpCode,
      };

      this.emitError(ctx, httpAdapter, responseBody, exception.httpCode);

      return;
    }

    const responseBody: ResponseErrorDto = {
      err: {
        code: DsbClientGatewayErrors.MB_UNKNOWN,
        reason: exception.message,
        additionalDetails: exception.additionalDetails,
      },
      timestamp: new Date().toISOString(),
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };

    this.emitError(
      ctx,
      httpAdapter,
      responseBody,
      HttpStatus.INTERNAL_SERVER_ERROR
    );

    return;
  }

  protected emitError(
    context: HttpArgumentsHost,
    httpAdapter: AbstractHttpAdapter,
    responseBody: ResponseErrorDto,
    httpStatus: HttpStatus
  ): void {
    httpAdapter.reply(context.getResponse(), responseBody, httpStatus);
  }
}
