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
}
