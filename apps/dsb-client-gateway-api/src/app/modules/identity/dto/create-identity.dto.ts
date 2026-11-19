import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIdentityDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: [
      'Private key that becomes the gateway identity.',
      '- 64 hex characters, with or without `0x`.',
      '- Its address must hold funds.',
      '- Stored securely; never returned.',
    ].join('\n'),
    required: false,
    type: String,
    // Dummy value with the right shape, not a real key.
    example:
      '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  })
  privateKey?: string;
}
