import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIdentityDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Private key starting with 0x. If not passed then keys will be generated',
    required: false
  })
  privateKey?: string;
}
