import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { IsDID } from '../../../utils/validator/decorators/IsDid';

export class CreateContactDto {
  @IsString()
  @IsDID({
    message: 'Malformed DID',
  })
  @IsNotEmpty()
  public did: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  public alias: string;
}
