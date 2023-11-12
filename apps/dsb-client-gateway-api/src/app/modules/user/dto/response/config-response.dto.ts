import { ApiProperty } from '@nestjs/swagger';

export class ConfigResponseDto {
  @ApiProperty({
    description: 'Is auth enabled',
    example: true,
  })
  public authEnabled: boolean;
}
