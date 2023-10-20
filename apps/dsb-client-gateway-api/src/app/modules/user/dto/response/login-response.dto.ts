import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    description: 'Access token',
  })
  public accessToken: string;

  @ApiProperty({
    description: 'Refresh token',
  })
  public refreshToken: string;
}
