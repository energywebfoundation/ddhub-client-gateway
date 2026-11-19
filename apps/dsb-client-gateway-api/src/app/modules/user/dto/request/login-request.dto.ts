import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({
    description: 'Username (exact, case sensitive).',
    example: 'operator01',
    minLength: 4,
    maxLength: 64,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(64)
  public username: string;

  @ApiProperty({
    description:
      'Password of the user account. Compared as-is with the stored password.',
    example: 'change-me-please',
    minLength: 4,
    maxLength: 128,
    format: 'password',
  })
  @IsString()
  @MaxLength(128)
  @MinLength(4)
  @IsNotEmpty()
  public password: string;
}
