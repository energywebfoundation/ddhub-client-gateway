import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteClientParamsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Client ID',
    type: String,
    example: 'test.cursor',
  })
  clientId: string;
}
