import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetApplicationsByNamespaceDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description:
      'Full SSI-Hub namespace of the application, matched exactly (case sensitive, no wildcard or prefix matching).',
    example: 'ddhub.apps.energyweb.iam.ewc',
    type: String,
  })
  public namespace: string;
}
