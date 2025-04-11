import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteClientParamsDto {
  @IsString()
  @IsNotEmpty()
    @Matches(/^[^&<>"'\-\/\\\.]+$/, {
    message: 'clientId contains invalid characters & < > " \' / - .',
  })
  @ApiProperty({
    description: 'Client ID',
    type: String,
    example: 'test.cursor',
  })
  clientId: string;
}
