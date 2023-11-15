import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { IsDID } from '../../../utils/validator/decorators/IsDid';

export class UpdateContactRequestDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  public alias: string;
}
