import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { DsbApiService } from '../service/dsb-api.service';
import { Response } from 'express';
import { DigestGuard } from '../../utils/guards/digest.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('dsb')
@ApiTags('health', 'dsb')
@UseGuards(DigestGuard)
export class DsbHealthController {
  constructor(protected readonly dsbClientService: DsbApiService) {}

  @Get('health')
  public async getHealth(@Res() res: Response) {
    const { statusCode, message } = await this.dsbClientService.health();

    if (statusCode === 200) {
      return res.status(statusCode).end();
    }

    return res.status(statusCode).json({
      err: message,
    });
  }
}
