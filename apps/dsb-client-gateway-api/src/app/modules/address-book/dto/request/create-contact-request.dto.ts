import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { IsDID } from '../../../utils/validator/decorators/IsDid';

export class CreateContactDto {
  @ApiProperty({
    description: 'DID of the contact: `did:<method>:[<chain>:]0x<40 hex characters>`. Case sensitive.',
    example: 'did:ethr:volta:0xfeFBb03EFc1054Cc4e3Fbf36362689cc1F5924a8',
    pattern: '^did:[a-z0-9]+:([a-z0-9]+:)?0x[A-Fa-f0-9]{40}$',
  })
  @IsString()
  @IsDID({
    message: 'Malformed DID',
  })
  @IsNotEmpty()
  public did: string;

  @ApiProperty({
    description:
      'Human readable name for the DID. 3 to 255 characters. Must be unique across all contacts.',
    example: 'Grid Operator North',
    minLength: 3,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  public alias: string;
}
