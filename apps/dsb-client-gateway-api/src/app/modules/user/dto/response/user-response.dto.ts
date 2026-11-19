import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@dsb-client-gateway/ddhub-client-gateway-user-roles';

export class UserDetailsDto {
  @ApiProperty({
    example: 'operator01',
    description:
      'Username of the account.',
  })
  username: string;

  @ApiProperty({
    example: 'change-me-please',
    description:
      'Password of the account. Treat this response as sensitive.',
    format: 'password',
  })
  password: string;

  @ApiProperty({
    example: UserRole.ADMIN,
    description: [
      'Role of the account:',
      '- `admin`: all endpoints.',
      '- `superadmin`: same as `admin`; cannot be created through the API.',
      '- `messaging`: messaging and read-only lookups only.',
    ].join('\n'),
    enum: UserRole,
  })
  role: string;
}
