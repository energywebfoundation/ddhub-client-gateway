import { Controller, Get, UseGuards } from '@nestjs/common';
import { DsbApiService } from '../service/dsb-api.service';
import { DigestGuard } from '../../utils/guards/digest.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('dsb')
@UseGuards(DigestGuard)
@ApiTags('dsb', 'topics')
export class DsbTopicsController {
  constructor(protected readonly dsbClientService: DsbApiService) {}

  @Get('topics')
  public async getChannels() {
    return this.dsbClientService.getTopics();
  }
}
