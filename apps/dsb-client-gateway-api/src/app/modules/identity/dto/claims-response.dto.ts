import { RoleStatus } from '@ddhub-client-gateway/identity/models';
import { ApiProperty } from '@nestjs/swagger';

export class ClaimResponseDto {
  @ApiProperty({
    type: String,
    description: 'Full role namespace: `<role>.roles.<application namespace>`.',
    example: 'user.roles.ddhub.apps.energyweb.iam.ewc',
  })
  namespace: string;

  @ApiProperty({
    enum: RoleStatus,
    description: [
      'Status of the request:',
      '- `AWAITING_APPROVAL`: waiting for an issuer.',
      '- `APPROVED`: approved by an issuer.',
      '- `REJECTED`: rejected by an issuer.',
    ].join('\n'),
    example: RoleStatus.APPROVED,
  })
  status: RoleStatus;

  @ApiProperty({
    type: Boolean,
    description: '`true` when the role is published in the DID document and active. An approved role with `false` is published within about a minute.',
    example: true,
  })
  syncedToDidDoc: boolean;
}

export class ClaimsResponseDto {
  @ApiProperty({
    type: String,
    description: 'DID of the gateway identity (claim subject).',
    example: 'did:ethr:volta:0xfeFBb03EFc1054Cc4e3Fbf36362689cc1F5924a8',
  })
  did: string;

  @ApiProperty({
    description:
      'A list of claims held for the gateway DID. The same role can appear more than once if it was requested several times.',
    type: () => [ClaimResponseDto],
  })
  claims: ClaimResponseDto[];
}
