import {
  BalanceState,
  Enrolment,
  IdentityWithEnrolment,
  Role,
  RoleStatus,
} from '@dsb-client-gateway/dsb-client-gateway/identity/models';
import { ApiProperty } from '@nestjs/swagger';

export class RoleDto implements Role {
  @ApiProperty({
    type: String,
    description: 'Namespace',
    example: 'user.roles.dsb.apps.szostak.iam.ewc',
  })
  namespace: string;

  @ApiProperty({
    type: Boolean,
    description: 'Describes if role is required for basic usage',
    example: true,
  })
  required: boolean;

  @ApiProperty({
    enum: RoleStatus,
    description: 'Role status',
    example: RoleStatus.APPROVED,
  })
  status: RoleStatus;
}

export class EnrolmentDto implements Enrolment {
  @ApiProperty({
    type: String,
    description: 'DID address',
    example: 'did:ethr:volta:0xfeFBb03EFc1054Cc4e3Fbf36362689cc1F5924a8',
  })
  did: string | null;

  @ApiProperty({
    description: 'Array of roles',
    type: () => [RoleDto],
  })
  roles: RoleDto[];
}

export class IdentityResponseDto implements IdentityWithEnrolment {
  @ApiProperty({
    type: String,
    description: 'Wallet address',
    example: '0xfeFBb03EFc1054Cc4e3Fbf36362689cc1F5924a8',
  })
  address: string;

  @ApiProperty({
    enum: [BalanceState.LOW, BalanceState.OK, BalanceState.NONE],
    description: 'User balance',
    example: BalanceState.OK,
  })
  balance: BalanceState;

  @ApiProperty({
    description: 'Enrolment response',
    type: () => EnrolmentDto,
  })
  enrolment: Enrolment;

  @ApiProperty({
    type: String,
    description: 'Public key',
    example:
      '0x04341da2f081cef1a9c19557551b9c9f10ce135eeec9e45a41f3750db8ef2d34e990b27ee730c6643d1862f5899dccbdf011e8a33fd8cd7de42442b0c7570540db',
  })
  publicKey: string;
}
