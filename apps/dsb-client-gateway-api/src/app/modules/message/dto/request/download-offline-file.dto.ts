import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DownloadOfflineFileDto {
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Client gateway message id of uploaded file',
    example: 'bb2686d2-97be-436b-8869',
  })
  clientGatewayMessageId: string;
}
