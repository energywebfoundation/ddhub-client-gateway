import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DownloadMessagesDto {
  @IsString()
  @ApiProperty({
    type: String,
    description: 'file Id for which file will be downloaded',
    example: 'bb2686d2-97be-436b-8869',
  })
  fileId: string;
}
