import { Controller, Get, HttpStatus } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SwaggerTags } from '../../../swagger/swagger.constants';

@Controller('health')
@ApiTags(SwaggerTags.HEALTH)
export class HealthController {
  @Get()
  @ApiOperation({
    summary: 'Liveness probe of the API',
    description: [
      'Tells whether the API is running.',
      '',
      '**Returns**',
      '- `{ "message": "OK" }` with HTTP 200.',
      '',
      '**Notes**',
      '- Meant for liveness and load balancer checks.',
      '- Does not check the database, Message Broker or SSI Hub.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The API process is up.',
    headers: {
      'Cache-Control': {
        description: 'Always `no-cache, no-store, must-revalidate`.',
        schema: { type: 'string', example: 'no-cache, no-store, must-revalidate' },
      },
    },
    schema: {
      type: 'object',
      required: ['message'],
      properties: {
        message: {
          type: 'string',
          enum: ['OK'],
          description: 'Always `OK`.',
          example: 'OK',
        },
      },
    },
  })
  // swaggerDocumentation is disabled because terminus would document its own
  // HealthCheckResult shape (status/info/error/details, 503), which this
  // endpoint never returns. noCache keeps the runtime Cache-Control header.
  @HealthCheck({ noCache: true, swaggerDocumentation: false })
  public async check(): Promise<{
    message: string;
  }> {
    return {
      message: 'OK',
    };
  }
}
