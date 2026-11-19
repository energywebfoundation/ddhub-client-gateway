import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenRequestDto {
  @ApiProperty({
    description: 'Refresh token from an earlier login or refresh (valid 20 hours). An access token is rejected.',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im9wZXJhdG9yMDEiLCJhY2NvdW50VHlwZSI6ImFkbWluIiwidHlwZSI6InJlZnJlc2gifQ.signature',
  })
  @IsNotEmpty()
  public refreshToken: string;
}
