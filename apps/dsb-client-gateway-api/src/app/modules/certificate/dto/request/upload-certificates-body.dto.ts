import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

// Swagger-only shape: files arrive via FileFieldsInterceptor, not the body, so
// the required certificate and privateKey files are enforced in the controller.
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
    description: 'privateKey to be uploaded',
  })
  privateKey: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'caCertificate to be uploaded',
  })
  @IsOptional()
  caCertificate: string;
}
