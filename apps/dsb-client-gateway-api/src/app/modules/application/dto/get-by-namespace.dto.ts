import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetApplicationsByNamespaceDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'ddhub.apps.energyweb.iam.ewc',
    type: String,
  })
  public namespace: string;
}
