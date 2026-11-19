import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Not bound to any route at the moment: `GET /messages/sent/download/:cgwId`
// reads the ID from the path parameter instead.
export class DownloadOfflineFileDto {
  @IsString()
  @ApiProperty({
    type: String,
    format: 'uuid',
    description:
      'Client gateway message ID (UUID v4) that the gateway generated when the file was uploaded.',
    example: 'f923afb7-e334-419c-a72c-a60b293184ea',
  })
  clientGatewayMessageId: string;
}
