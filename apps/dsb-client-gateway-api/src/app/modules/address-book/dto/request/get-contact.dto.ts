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
    description: 'DID',
    type: String,
    example: 'did:ethr:volta:0xfeFBb03EFc1054Cc4e3Fbf36362689cc1F5924a8',
  })
  did: string;
}
