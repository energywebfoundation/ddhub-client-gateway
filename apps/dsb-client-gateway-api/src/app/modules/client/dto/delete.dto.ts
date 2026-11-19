import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteClientParamsDto {
  @IsString()
  @IsNotEmpty()
    @Matches(/^[^\s&<>"'/\r\n]+$/, {
    message: 'clientId contains invalid characters',
  })
  @ApiProperty({
    description: 'Client id to delete. No spaces, line breaks or `&` `<` `>` `"` `\'` `/`; URL-encode other special characters such as `@` or `:`.',
    type: String,
    example: 'consumer01:channel.name',
    pattern: '^[^\\s&<>"\'/\\r\\n]+$',
  })
  clientId: string;
}
