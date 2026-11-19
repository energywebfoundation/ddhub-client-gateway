import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsDID } from '../../../utils/validator/decorators/IsDid';

export class GetContactParamsDto {
  @IsString()
  @IsDID({
    message: 'Malformed DID',
  })
  @IsNotEmpty()
  @ApiProperty({
    description: 'DID of the contact: `did:<method>:[<chain>:]0x<40 hex characters>`. Case sensitive.',
    type: String,
    example: 'did:ethr:volta:0xfeFBb03EFc1054Cc4e3Fbf36362689cc1F5924a8',
    pattern: '^did:[a-z0-9]+:([a-z0-9]+:)?0x[A-Fa-f0-9]{40}$',
  })
  did: string;
}
