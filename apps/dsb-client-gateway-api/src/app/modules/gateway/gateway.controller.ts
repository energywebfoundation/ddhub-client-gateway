import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { DigestGuard } from '../utils/guards/digest.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  GatewayResponseDto,
  MessageBrokerStatus,
} from './dto/gateway-response.dto';
import { ConfigService } from '@nestjs/config';
import { CertificateService } from '../certificate/service/certificate.service';
import { HealthController } from '../health/health.controller';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';

@Controller('gateway')
@UseGuards(DigestGuard)
@ApiTags('Gateway')
export class GatewayController {
  constructor(
    protected readonly configService: ConfigService,
    protected readonly healthService: HealthController,
    protected readonly certificateService: CertificateService,
    protected readonly iamService: IamService
  ) {}

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
    const health = await this.healthService.check();

    return {
      did: this.iamService.getDIDAddress(),
      messageBrokerStatus:
        health.messageBroker.statusCode === 200
          ? MessageBrokerStatus.OK
          : MessageBrokerStatus.ERROR,
      mtlsIsValid: this.configService.get<boolean>('MTLS_ENABLED')
        ? await this.certificateService.isMTLSConfigured()
        : undefined,
      namespace: this.configService.get<string>('PARENT_NAMESPACE'),
    };
  }
}
