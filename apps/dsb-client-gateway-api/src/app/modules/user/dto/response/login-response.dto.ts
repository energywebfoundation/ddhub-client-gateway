import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@dsb-client-gateway/ddhub-client-gateway-user-roles';

export class LoginResponseDto {
  @ApiProperty({
    description:
      'Access token, valid for 1 hour. Send it as `Authorization: Bearer <accessToken>` on protected endpoints.',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im9wZXJhdG9yMDEiLCJhY2NvdW50VHlwZSI6ImFkbWluIiwidHlwZSI6ImFjY2VzcyJ9.signature',
  })
  public accessToken: string;

  @ApiProperty({
    description: 'Refresh token, valid for 20 hours. Use it to get new tokens before the access token expires.',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im9wZXJhdG9yMDEiLCJhY2NvdW50VHlwZSI6ImFkbWluIiwidHlwZSI6InJlZnJlc2gifQ.signature',
  })
  public refreshToken: string;

  @ApiProperty({
    description: [
      'Role of the user:',
      '- `admin`: all endpoints.',
      '- `superadmin`: same as `admin`.',
      '- `messaging`: messaging and read-only lookups only.',
    ].join('\n'),
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  public role: string;

  @ApiProperty({
    description: 'Username the tokens were issued for.',
    example: 'operator01',
  })
  public username: string;
}
