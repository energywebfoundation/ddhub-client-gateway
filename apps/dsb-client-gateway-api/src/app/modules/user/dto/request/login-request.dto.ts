import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@dsb-client-gateway/ddhub-client-gateway-user-roles';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({
    description: 'Username',
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(UserRole)
  public username: UserRole;

  @ApiProperty({
    description: 'Password',
    example: 'password',
  })
  @IsString()
  @MaxLength(128)
  @MinLength(4)
  @IsNotEmpty()
  public password: string;
}
