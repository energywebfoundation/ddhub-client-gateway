import { ApiProperty } from '@nestjs/swagger';

export class GetAssociationKeysDto {
  @ApiProperty({
    type: String,
    description: 'association key',
    example:
      '03ced868821e185bc7f2aaa2f68b0b1d4b725259117edd1ef6fbccb08e4a4d2ef1',
  })
  public associationKey: string;

  @ApiProperty({
    description: 'timestamp of when key is valid to use',
    type: String,
    example: '2022-06-08T05:43:15.510Z',
  })
  public validTo: Date;

  @ApiProperty({
    description: 'timestamp of when key is valid to use',
    type: String,
    example: '2022-06-08T05:43:15.510Z',
  })
  public validFrom: Date;

  @ApiProperty({
    description: 'was key sent',
    type: Boolean,
    example: false,
  })
  public isSent: boolean;

  @ApiProperty({
    description: 'when key was sent',
    type: String,
    nullable: true,
    example: '2022-06-08T05:43:15.510Z',
  })
  public sentDate: Date | null;

  @ApiProperty({
    description: 'key iteration',
    type: Number,
    example: 2022111,
  })
  public iteration: number;

  @ApiProperty({
    description: 'key owner DID',
    type: String,
    example: 'did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993',
  })
  public owner: string;

  @ApiProperty({
    description: 'timestamp of the key created',
    type: String,
    example: '2022-06-08T05:43:15.510Z',
  })
  createdDate: Date;

  @ApiProperty({
    description: 'timestamp of the key updated',
    type: String,
    example: '2022-06-08T05:43:15.510Z',
  })
  updatedDate: Date;
}
