import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { DigestGuard } from '../utils/guards/digest.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GatewayResponseDto } from './dto/gateway-response.dto';
import { ConfigService } from '@nestjs/config';

@Controller('gateway')
@UseGuards(DigestGuard)
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
  public async get(): Promise<GatewayResponseDto> {
    return {
      namespace: this.configService.get<string>('PARENT_NAMESPACE'),
    };
  }
}
