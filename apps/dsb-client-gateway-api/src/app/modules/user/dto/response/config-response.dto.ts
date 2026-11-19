import { ApiProperty } from '@nestjs/swagger';

export class ConfigResponseDto {
  @ApiProperty({
    description: [
      'Whether user login is enabled (`USER_AUTH_ENABLED`, default `false`).',
      '- `true`: protected endpoints need a login token or an API key.',
      '- `false`: no credentials needed; login is not available.',
    ].join('\n'),
    example: true,
  })
  public authEnabled: boolean;
}
