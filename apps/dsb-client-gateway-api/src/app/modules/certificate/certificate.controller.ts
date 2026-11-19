import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CertificateService } from './service/certificate.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UploadCertificateBodyDto } from './dto/request/upload-certificates-body.dto';
import {
  Roles,
  UserGuard,
  UserRole,
} from '@dsb-client-gateway/ddhub-client-gateway-user-roles';
import { ResponseErrorDto } from '../utils/dto/response-error.dto';
import { SwaggerTags } from '../../../swagger/swagger.constants';

@Controller('certificate')
@ApiTags(SwaggerTags.GATEWAY_CONFIGURATION)
@UseGuards(UserGuard)
export class CertificateController {
  constructor(protected readonly certificateService: CertificateService) {}

  @Post()
  @ApiOperation({
    summary: 'Upload the mTLS client certificate for the Message Broker',
    description: [
      'Uploads the certificate the gateway uses to connect securely to the EWDS Message Broker.',
      '',
      '**Send** (form upload)',
      '- `certificate`: PEM file. Required.',
      '- `privateKey`: PEM file without a password. Required.',
      '- `caCertificate`: PEM file. Only for a Message Broker with a private certificate authority.',
      '',
      '**Returns**',
      '- `201` with an empty body.',
      '',
      '**Notes**',
      '- Each upload replaces the previous files; leaving out `caCertificate` removes an earlier one.',
      '- With the default settings, channels, topics and messaging work only once a certificate is in place.',
      '- Files are not checked on upload: a wrong file shows up later as `mtlsIsValid: false` in the gateway status.',
    ].join('\n'),
  })
  @ApiBody({
    type: UploadCertificateBodyDto,
    description: 'Certificate files as multipart form fields.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Certificate files stored and loaded. Empty body.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: [
      'Returned as `DHCG::UNKNOWN` (see `err.reason`) for:',
      '- `certificate` or `privateKey` missing or empty: `Both certificate and privateKey files are required`.',
      '- A form field with another name, or more than one file in a field (`Unexpected field`).',
      '- The files could not be saved.',
    ].join('\n'),
    type: ResponseErrorDto,
  })
  // Decorators are applied bottom-up, so CREATED (201) is the effective status.
  @HttpCode(HttpStatus.CREATED)
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'certificate',
        maxCount: 1,
      },
      {
        name: 'privateKey',
        maxCount: 1,
      },
      {
        name: 'caCertificate',
        maxCount: 1,
      },
    ])
  )
  @Roles(UserRole.ADMIN)
  public async save(
    @UploadedFiles()
    {
      certificate,
      privateKey,
      caCertificate,
    }: {
      certificate?: Express.Multer.File[];
      privateKey?: Express.Multer.File[];
      caCertificate?: Express.Multer.File[];
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() dto: UploadCertificateBodyDto
  ): Promise<void> {
    const certificateFile = certificate?.[0];
    const privateKeyFile = privateKey?.[0];

    if (!certificateFile?.buffer || !privateKeyFile?.buffer) {
      throw new BadRequestException(
        'Both certificate and privateKey files are required'
      );
    }

    await this.certificateService.save(
      certificateFile,
      privateKeyFile,
      caCertificate?.[0]
    );
  }
}
