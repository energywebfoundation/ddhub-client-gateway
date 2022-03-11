import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { DsbApiService } from '../service/dsb-api.service';
import { GetMessagesQueryDto, SendMessageBodyDto } from '../dto';
import { Message } from '../dsb-client.interface';
import { DigestGuard } from '../../utils/guards/digest.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('dsb')
@UseGuards(DigestGuard)
@ApiTags('dsb', 'messages')
export class DsbMessagesController {
  constructor(protected readonly dsbApiService: DsbApiService) {}

  @Post('messages')
  public async sendMessage(
    @Body() { fqcn, topic, payload }: SendMessageBodyDto
  ) {
    return this.dsbApiService.sendMessage(fqcn, topic, payload);
  }

  @Get('messages')
  public async getMessages(
    @Query() { fqcn, from, clientId, amount }: GetMessagesQueryDto
  ): Promise<Message[]> {
    return this.dsbApiService.getMessages(fqcn, from, clientId, amount);
  }
}
