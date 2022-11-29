import { ApiProperty } from '@nestjs/swagger';
import { GetAssociationKeysDto } from './get-association-keys.dto';

export class GetCurrentKeyDto {
  @ApiProperty({
    type: () => GetAssociationKeysDto,
    description: 'Current association key',
    nullable: true,
  })
  current: GetAssociationKeysDto | null;

  @ApiProperty({
    type: () => GetAssociationKeysDto,
    nullable: true,
    description: 'Next association key',
  })
  next: GetAssociationKeysDto | null;
}
