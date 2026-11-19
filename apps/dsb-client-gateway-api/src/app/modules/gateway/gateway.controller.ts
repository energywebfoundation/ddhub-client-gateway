import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  GatewayResponseDto,
  MessageBrokerStatus,
} from './dto/gateway-response.dto';
import { ConfigService } from '@nestjs/config';
import { CertificateService } from '../certificate/service/certificate.service';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { DdhubHealthService } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { VersionService } from '@dsb-client-gateway/ddhub-client-gateway-version';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { UserAuthService } from '@dsb-client-gateway/ddhub-client-gateway-user-roles';
import { SwaggerTags } from '../../../swagger/swagger.constants';

@Controller('gateway')
@ApiTags(SwaggerTags.GATEWAY)
export class GatewayController {
  protected readonly isAssociationKeyEnabled: boolean;

  constructor(
    protected readonly configService: ConfigService,
    protected readonly healthService: DdhubHealthService,
    protected readonly certificateService: CertificateService,
    protected readonly iamService: IamService,
    protected readonly versionService: VersionService,
    protected readonly secretsEngineService: SecretsEngineService,
    protected readonly userAuthService: UserAuthService,
  ) {
    const fqcn: string | undefined = this.configService.get<string>('AK_FQCN');
    const topicName: string | undefined =
      this.configService.get<string>('AK_TOPIC_NAME');
    const topicOwner: string | undefined =
      this.configService.get<string>('AK_TOPIC_OWNER');
    const topicVersion: string | undefined =
      this.configService.get<string>('AK_TOPIC_VERSION');

    let isAssociationKeyEnabled: boolean = true;

    if (!fqcn || !topicName || !topicOwner || !topicVersion) {
      isAssociationKeyEnabled = false;
    }

    this.isAssociationKeyEnabled = isAssociationKeyEnabled;
  }

  @Get()
  @ApiOperation({
    summary: 'Get the gateway runtime status',
    description: [
      'Shows the gateway status and settings.',
      '',
      '**Returns**',
      '- Version, DID, whether login is enabled, Message Broker status, certificate status, enrolment namespace and association key sharing.',
      '',
      '**Notes**',
      '- Checks the Message Broker on every call; a failing broker shows as `messageBrokerStatus: ERROR`.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gateway runtime status.',
    type: () => GatewayResponseDto,
  })
  public async get(): Promise<GatewayResponseDto> {
    const health = await this.healthService.health();
    const authEnabled = this.userAuthService.isAuthEnabled();
    return {
      authEnabled,
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
      isAssociationKeyEnabled: this.isAssociationKeyEnabled,
    };
  }
}
