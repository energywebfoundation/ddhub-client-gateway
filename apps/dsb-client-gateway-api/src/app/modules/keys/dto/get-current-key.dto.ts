import { ApiProperty } from '@nestjs/swagger';
import { GetAssociationKeysDto } from './get-association-keys.dto';

export class GetCurrentKeyDto {
  @ApiProperty({
    type: () => GetAssociationKeysDto,
    description: 'Key valid now. Null when no key could be created (for example no identity).',
    nullable: true,
  })
  current: GetAssociationKeysDto | null;

  @ApiProperty({
    type: () => GetAssociationKeysDto,
    nullable: true,
    description: 'Upcoming key; usually the same as `current`. Null only when `current` is null.',
  })
  next: GetAssociationKeysDto | null;
}
