import { ApiProperty } from '@nestjs/swagger';

export class UploadCertificateBodyDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'certificate to be uploaded',
  })
  certificate: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'privateKey to be  uploaded',
  })
  privateKey: string;
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'caCertificate to be  uploaded',
  })
  caCertificate: string;
}
