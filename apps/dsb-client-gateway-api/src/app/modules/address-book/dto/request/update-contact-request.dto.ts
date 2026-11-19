import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { IsDID } from '../../../utils/validator/decorators/IsDid';

export class UpdateContactRequestDto {
  @ApiProperty({
    description:
      'New display name for the contact. 3 to 255 characters. Must not be used by another contact.',
    example: 'Grid Operator North (backup)',
    minLength: 3,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  public alias: string;
}
