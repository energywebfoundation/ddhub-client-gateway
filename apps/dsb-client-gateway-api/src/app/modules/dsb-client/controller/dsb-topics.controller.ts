import { Controller, Get, UseGuards, Body, Post, Patch, Query } from '@nestjs/common';
import { DsbApiService } from '../service/dsb-api.service';
import { DigestGuard } from '../../utils/guards/digest.guard';
import { ApiTags } from '@nestjs/swagger';
import { Topic, SendTopicBodyDTO } from '../dsb-client.interface';
import { GetTopicsCountQueryDto } from '../dto';

@Controller('dsb')
@UseGuards(DigestGuard)
@ApiTags('dsb', 'topics')
export class DsbTopicsController {
  constructor(protected readonly dsbClientService: DsbApiService) { }

  @Get('topics')
  public async getTopics() {
    return this.dsbClientService.getTopics();
  }

  @Get('topic/count')
  public async getTopicsCountByOwner(
    @Query() { owner }: GetTopicsCountQueryDto) {
    return this.dsbClientService.getTopicsCountByOwner(owner);
  }

  @Post('topics')
  public async postTopics(
    @Body() data: SendTopicBodyDTO
  ) {
    return this.dsbClientService.postTopics(data);
  }

  @Patch('topics')
  public async updateTopics(
    @Body() data: SendTopicBodyDTO
  ) {
    return this.dsbClientService.postTopics(data);
  }
}
