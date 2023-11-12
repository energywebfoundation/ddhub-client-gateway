import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenRequestDto {
  @ApiProperty({
    description: 'Refresh token',
  })
  @IsNotEmpty()
  public refreshToken: string;
}
