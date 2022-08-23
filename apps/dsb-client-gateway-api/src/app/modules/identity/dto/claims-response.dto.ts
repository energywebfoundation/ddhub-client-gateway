import { RoleStatus } from '@ddhub-client-gateway/identity/models';
import { ApiProperty } from '@nestjs/swagger';

export class ClaimResponseDto {
  @ApiProperty({
    type: String,
    description: 'Namespace',
    example: 'user.roles.ddhub.apps.szostak.iam.ewc',
  })
  namespace: string;

  @ApiProperty({
    enum: RoleStatus,
    description: 'Role status',
    example: RoleStatus.APPROVED,
  })
  status: RoleStatus;

  @ApiProperty({
    type: Boolean,
    description: 'Role enrolment status on DID document',
    example: true,
  })
  syncedToDidDoc: boolean;
}

export class ClaimsResponseDto {
  @ApiProperty({
    type: String,
    description: 'DID address',
    example: 'did:ethr:volta:0xfeFBb03EFc1054Cc4e3Fbf36362689cc1F5924a8',
  })
  did: string;

  @ApiProperty({
    description: 'Array of claims',
    type: () => [ClaimResponseDto],
  })
  claims: ClaimResponseDto[];
}
