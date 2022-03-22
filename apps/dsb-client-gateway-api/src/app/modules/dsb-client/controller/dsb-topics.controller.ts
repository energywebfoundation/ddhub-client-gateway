import {
  Controller, Get, UseGuards, Body, Post, Patch, Query, HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DsbApiService } from '../service/dsb-api.service';
import { DigestGuard } from '../../utils/guards/digest.guard';
import { ApiTags, ApiResponse, } from '@nestjs/swagger';
import { SendTopicBodyDTO } from '../dsb-client.interface';
import { GetTopicsCountQueryDto, PaginatedResponse } from '../dto';

@Controller('dsb')
@UseGuards(DigestGuard)
@ApiTags('dsb', 'topics')
export class DsbTopicsController {
  constructor(protected readonly dsbClientService: DsbApiService) { }

  @Get('topics')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Topics List',
    type: () => PaginatedResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  public async getTopics() {
    return this.dsbClientService.getTopics();
  }

  @Get('topics/count')
  public async getTopicsCountByOwner(
    @Query() { owner }: GetTopicsCountQueryDto) {
    return this.dsbClientService.getTopicsCountByOwner(owner);
  }

  @Post('topics')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Topic successfully created',
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
  public async postTopics(
    @Body() data: SendTopicBodyDTO
  ) {
    return this.dsbClientService.postTopics(data);
  }

  @Patch('topics')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Topic updated successfully',
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
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Topic not found',
  })
  @HttpCode(HttpStatus.CREATED)
  public async updateTopics(
    @Body() data: SendTopicBodyDTO
  ) {
    return this.dsbClientService.updateTopics(data);
  }
}
