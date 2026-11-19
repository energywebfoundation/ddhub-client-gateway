import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@dsb-client-gateway/ddhub-client-gateway-user-roles';

export class ApiKeyResponseDto {
  @ApiProperty({
    description: 'The API key (48 lowercase letters and digits). Send it in the `x-api-key` header.',
    example: 'k3v9x0q2m7w1z8r4t6y5u0i9o8p7a6s5d4f3g2h1j0klzx9c',
  })
  apiKey: string;

  @ApiProperty({
    description:
      'Human readable label of the key, chosen when the key is created or updated. The name is unique across API keys.',
    example: 'erp-integration',
  })
  name: string;

  @ApiProperty({
    description: 'When the key stops working (ISO 8601). Expired keys stay listed until deleted.',
    example: '2026-12-18T10:15:30.000Z',
    format: 'date-time',
  })
  expiresAt: string;

  @ApiProperty({
    description: [
      'Access of the key:',
      '- `admin`: all endpoints.',
      '- `superadmin`: same as `admin`.',
      '- `messaging`: messaging and read-only lookups only. Keys without a role get this access.',
    ].join('\n'),
    enum: UserRole,
    example: UserRole.MESSAGING,
  })
  role: string;
}
