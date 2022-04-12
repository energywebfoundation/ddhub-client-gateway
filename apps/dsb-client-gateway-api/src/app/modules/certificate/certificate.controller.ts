import {
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CertificateService } from './service/certificate.service';
import { DigestGuard } from '../utils/guards/digest.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('certificate')
@UseGuards(DigestGuard)
@ApiTags('Gateway Configuration')
export class CertificateController {
  constructor(protected readonly certificateService: CertificateService) {}

  @Post()
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
  public async save(
    @UploadedFiles()
    {
      certificate,
      privateKey,
      caCertificate,
    }: {
      certificate;
      privateKey;
      caCertificate;
    }
  ): Promise<void> {
    await this.certificateService.save(
      certificate[0],
      privateKey[0],
      caCertificate
    );
  }
}
