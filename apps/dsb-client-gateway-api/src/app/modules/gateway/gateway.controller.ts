import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GatewayResponseDto } from './dto/gateway-response.dto';
import { ConfigService } from '@nestjs/config';

@Controller('gateway')
@ApiTags('Gateway')
export class GatewayController {
  constructor(protected readonly configService: ConfigService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gateway data',
    type: () => GatewayResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  public get(): GatewayResponseDto {
    return {
      namespace: this.configService.get<string>('PARENT_NAMESPACE'),
    };
  }
}
