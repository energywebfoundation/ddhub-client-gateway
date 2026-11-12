import { ApiProperty } from '@nestjs/swagger';

export class ApiKeyResponseDto {
  @ApiProperty({
    description: 'The generated API key',
  })
  apiKey: string;

  @ApiProperty({
    description: 'The name or label for this API key',
  })
  name: string;

  @ApiProperty({
    description: 'ISO 8601 formatted expiration date of the API key',
    example: '2025-12-31T23:59:59Z',
  })
  expiresAt: string;
}
