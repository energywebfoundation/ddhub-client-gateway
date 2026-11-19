import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DownloadMessagesDto {
  @IsString()
  @Matches(/^[a-zA-Z0-9-]+$/, {
    message: 'fileId must contain only alphanumeric characters and hyphens',
  })
  @ApiProperty({
    type: String,
    pattern: '^[a-zA-Z0-9-]+$',
    description: 'ID of the file, from a file message on a `download` channel. Letters, digits and hyphens only.',
    example: '624bfd4f4c6cf04abfc20041',
  })
  fileId: string;
}
