import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

// Swagger-only shape: files arrive via FileFieldsInterceptor, not the body.
// @IsOptional() keeps this class valid under class-validator's forbidUnknownValues.
export class UploadCertificateBodyDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'certificate to be uploaded',
  })
  @IsOptional()
  certificate: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'privateKey to be uploaded',
  })
  @IsOptional()
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
