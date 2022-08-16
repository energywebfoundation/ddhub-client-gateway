import { Controller, Post, UseGuards } from '@nestjs/common';
import { DigestGuard } from '../utils/guards/digest.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('keys')
@UseGuards(DigestGuard)
@ApiTags('Gateway Configuration')
export class KeysController {
  @Post('')
  public async derive(): Promise<void> {
    // await this.keysService.deriveKeys();
  }
}
