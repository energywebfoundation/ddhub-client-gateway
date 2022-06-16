import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UploadCertificateBodyDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'certificate to be uploaded',
  })
  @IsNotEmpty()
  certificate: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'privateKey to be  uploaded',
  })
  @IsNotEmpty()
  privateKey: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'caCertificate to be  uploaded',
  })
  @IsNotEmpty()
  caCertificate: string;
}
