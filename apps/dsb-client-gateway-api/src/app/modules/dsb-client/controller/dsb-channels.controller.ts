import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { DsbApiService } from '../service/dsb-api.service';
import { DigestGuard } from '../../utils/guards/digest.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChannelDTO } from '../dsb-client.interface';

@Controller('dsb')
@ApiTags('channels', 'dsb')
@UseGuards(DigestGuard)
export class DsbChannelsController {
  constructor(protected readonly dsbClientService: DsbApiService) {}

  @Get('channels')
  @ApiOperation({
    description: 'Gets channels',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ChannelDTO,
    description: 'List of channels',
  })
  public async getChannels() {
    return this.dsbClientService.getChannels();
  }
}
