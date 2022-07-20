import { GatewayConfig } from '@ddhub-client-gateway/identity/models';
import { ApiProperty } from '@nestjs/swagger';

export class GatewayResponseDto implements GatewayConfig {
  @ApiProperty({
    type: String,
    description: 'Configured namespace',
    example: 'ddhub.apps.energyweb.iam.ewc',
  })
  namespace: string;
}
