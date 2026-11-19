import { ApiProperty } from '@nestjs/swagger';

export class GetAssociationKeysDto {
  @ApiProperty({
    type: String,
    description:
      'The association key itself (66 hex characters). Other parties can use it to send messages to this gateway instead of its DID.',
    example:
      '03ced868821e185bc7f2aaa2f68b0b1d4b725259117edd1ef6fbccb08e4a4d2ef1',
  })
  public associationKey: string;

  @ApiProperty({
    description:
      'End of the validity window (exclusive): `validFrom` + `ASSOCIATION_KEY_INTERVAL` hours (default 24). From this moment the next key becomes current.',
    type: String,
    format: 'date-time',
    example: '2024-06-09T05:43:15.510Z',
  })
  public validTo: Date;

  @ApiProperty({
    description:
      'Start of the validity window. For the first key it is the time it was generated; each following key starts at the `validTo` of the previous one.',
    type: String,
    format: 'date-time',
    example: '2024-06-08T05:43:15.510Z',
  })
  public validFrom: Date;

  @ApiProperty({
    description: '`true` when the key is registered with the Message Broker. `false`: not yet, or registration failed.',
    type: Boolean,
    example: true,
  })
  public isSent: boolean;

  @ApiProperty({
    description:
      'When the key was registered at the Message Broker (`isSent` became true). Null if it has not been registered.',
    type: String,
    format: 'date-time',
    nullable: true,
    example: '2024-06-08T05:43:16.020Z',
  })
  public sentDate: Date | null;

  @ApiProperty({
    description: '`true` when the key was shared on the association keys channel (`AK_FQCN`).',
    type: Boolean,
    example: false,
  })
  public isShared: boolean;

  @ApiProperty({
    description:
      'When the key was last shared on the association keys channel. Null if it was never shared.',
    type: String,
    format: 'date-time',
    nullable: true,
    example: '2024-06-08T05:44:00.000Z',
  })
  public sharedDate: Date | null;

  @ApiProperty({
    description: 'Sequence label of the key, from its `validFrom` (`<YYYYMMDD>_<time>`). Keys are sorted by it.',
    type: String,
    example: '20240608_54315',
  })
  public iteration: string;

  @ApiProperty({
    description: 'DID of the gateway identity that owns the key.',
    type: String,
    example: 'did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993',
  })
  public owner: string;

  @ApiProperty({
    description: 'When the gateway created the key.',
    type: String,
    format: 'date-time',
    example: '2024-06-08T05:43:15.600Z',
  })
  createdDate: Date;

  @ApiProperty({
    description:
      'When the key record was last updated (registration or sharing state changed).',
    type: String,
    format: 'date-time',
    example: '2024-06-08T05:44:00.000Z',
  })
  updatedDate: Date;
}
