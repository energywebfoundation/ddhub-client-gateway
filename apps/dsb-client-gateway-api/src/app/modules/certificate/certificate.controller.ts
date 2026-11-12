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
import { ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UploadCertificateBodyDto } from './dto/request/upload-certificates-body.dto';
import {
  Roles,
  UserGuard,
  UserRole,
} from '@dsb-client-gateway/ddhub-client-gateway-user-roles';

@Controller('certificate')
@ApiTags('Gateway Configuration')
@UseGuards(UserGuard)
export class CertificateController {
  constructor(protected readonly certificateService: CertificateService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Certificates Uploaded Successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Validation failed or some requirements were not fully satisfied',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
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
