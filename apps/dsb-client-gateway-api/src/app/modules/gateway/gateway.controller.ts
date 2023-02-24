import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  GatewayResponseDto,
  MessageBrokerStatus,
} from './dto/gateway-response.dto';
import { ConfigService } from '@nestjs/config';
import { CertificateService } from '../certificate/service/certificate.service';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { DdhubHealthService } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { VersionService } from '@dsb-client-gateway/ddhub-client-gateway-version';

@Controller('gateway')
@ApiTags('Gateway')
export class GatewayController {
  constructor(
    protected readonly configService: ConfigService,
    protected readonly healthService: DdhubHealthService,
    protected readonly certificateService: CertificateService,
    protected readonly iamService: IamService,
    protected readonly versionService: VersionService
  ) { }

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
    const health = await this.healthService.health();

    const fqcn: string | undefined = this.configService.get<string>('AK_FQCN');
    const topicName: string | undefined = this.configService.get<string>('AK_TOPIC_NAME');
    const topicOwner: string | undefined = this.configService.get<string>('AK_TOPIC_OWNER');
    const topicVersion: string | undefined = this.configService.get<string>('AK_TOPIC_VERSION');

    let isAssociationKeyEnabled: boolean = true;
    if (!fqcn || !topicName || !topicOwner || !topicVersion) {
      isAssociationKeyEnabled = false;
    }

    return {
      version: this.versionService.getVersion(),
      did: this.iamService.getDIDAddress(),
      messageBrokerStatus:
        health.statusCode === 200
          ? MessageBrokerStatus.OK
          : MessageBrokerStatus.ERROR,
      mtlsIsValid: this.configService.get<boolean>('MTLS_ENABLED')
        ? await this.certificateService.isMTLSConfigured()
        : undefined,
      namespace: this.configService.get<string>('PARENT_NAMESPACE'),
      isAssociationKeyEnabled: isAssociationKeyEnabled,
    };
  }
}
