import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DigestGuard } from '../../utils/guards/digest.guard';
import { DsbApiService } from '../service/dsb-api.service';
import { FileUploadBodyDto } from '../dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('dsb')
@ApiTags('files', 'dsb')
@UseGuards(DigestGuard)
export class DsbFilesController {
  constructor(protected readonly dsbApiService: DsbApiService) {}

  @Post('file/upload')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(
    @UploadedFile('file') file: Express.Multer.File,
    @Body() { topicId, fqcn, fileName }: FileUploadBodyDto
  ): Promise<void> {
    await this.dsbApiService.uploadFile(file, fileName, fqcn, 'ssss', topicId);
  }
}
