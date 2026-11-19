import {
  BalanceState,
  Enrolment,
  IdentityWithEnrolment,
  Role,
  RoleStatus,
} from '@ddhub-client-gateway/identity/models';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Shared description of the enrolment role statuses, as computed by
 * EnrolmentService.generateEnrolment (libs/ddhub-client-gateway-enrolment).
 */
export const ENROLMENT_ROLE_STATUS_DESCRIPTION = [
  'Status of the role:',
  '- `NOT_ENROLLED`: not requested yet (only shown for required roles).',
  '- `AWAITING_APPROVAL`: requested, waiting for an issuer.',
  '- `APPROVED`: approved; the gateway publishes it within about a minute.',
  '- `REJECTED`: rejected by the issuer; not requested again automatically.',
  '- `SYNCED`: published and active. Required roles must be `SYNCED`.',
].join('\n');

export class RoleDto implements Role {
  @ApiProperty({
    type: String,
    description: 'Full role namespace: `<role>.roles.<application namespace>`.',
    example: 'user.roles.ddhub.apps.energyweb.iam.ewc',
  })
  namespace: string;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the gateway needs this role to work. Only `user.roles.<PARENT_NAMESPACE>` is required; other roles are listed for information.',
    example: true,
  })
  required: boolean;

  @ApiProperty({
    enum: RoleStatus,
    description: ENROLMENT_ROLE_STATUS_DESCRIPTION,
    example: RoleStatus.SYNCED,
  })
  status: RoleStatus;
}

export class EnrolmentDto implements Enrolment {
  @ApiProperty({
    type: String,
    description: 'DID of the gateway identity this enrolment belongs to.',
    example: 'did:ethr:volta:0xfeFBb03EFc1054Cc4e3Fbf36362689cc1F5924a8',
  })
  did: string | null;

  @ApiProperty({
    description: [
      'Roles of the gateway with their status.',
      '- Every requested role, plus `NOT_ENROLLED` entries for required roles not requested yet.',
      '- Updated about once a minute.',
    ].join('\n'),
    type: () => [RoleDto],
  })
  roles: RoleDto[];
}

export class IdentityResponseDto implements IdentityWithEnrolment {
  @ApiProperty({
    type: String,
    description:
      'Blockchain address of the gateway identity. The gateway DID is `did:ethr:<chain>:<address>`.',
    example: '0xfeFBb03EFc1054Cc4e3Fbf36362689cc1F5924a8',
  })
  address: string;

  @ApiProperty({
    enum: [BalanceState.LOW, BalanceState.OK, BalanceState.NONE],
    description: [
      'Funds on `address`, used for small transaction fees:',
      '- `NONE`: no funds; setting up the identity and requesting roles fail.',
      '- `LOW`: below 0.005; works, but top up soon.',
      '- `OK`: 0.005 or more.',
    ].join('\n'),
    example: BalanceState.OK,
  })
  balance: BalanceState;

  @ApiProperty({
    description: 'Roles of the gateway and their status.',
    type: () => EnrolmentDto,
  })
  enrolment: Enrolment;

  @ApiProperty({
    type: String,
    description:
      'Public key of the gateway identity. It is published in the DID document so that other parties can check the signatures of messages from this gateway.',
    example:
      '0x04341da2f081cef1a9c19557551b9c9f10ce135eeec9e45a41f3750db8ef2d34e990b27ee730c6643d1862f5899dccbdf011e8a33fd8cd7de42442b0c7570540db',
  })
  publicKey: string;
}
