import { ApiProperty } from '@nestjs/swagger';

/**
 * Swagger-only description of the multipart form accepted by
 * `POST /certificate`. The files themselves are read by
 * `FileFieldsInterceptor` in the controller, not by this DTO.
 */
export class UploadCertificateBodyDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: [
      'The certificate of the gateway, as a PEM file (it starts with `-----BEGIN CERTIFICATE-----`). Required.',
    ].join('\n'),
  })
  certificate: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: [
      'The private key that belongs to `certificate`, as a PEM file without a password. Required. It is stored securely and never returned by the API.',
    ].join('\n'),
  })
  privateKey: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: [
      'Optional PEM file. Only for a Message Broker with a private certificate authority.',
      '- Leaving it out removes one uploaded earlier.',
    ].join('\n'),
  })
  caCertificate: string;
}
