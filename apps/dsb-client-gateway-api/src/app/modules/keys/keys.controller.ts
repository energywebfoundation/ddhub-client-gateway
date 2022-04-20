import { Controller, Post, UseGuards } from '@nestjs/common';
import { KeysService } from './service/keys.service';
import { DigestGuard } from '../utils/guards/digest.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('keys')
@UseGuards(DigestGuard)
@ApiTags('Gateway Configuration')
export class KeysController {
  constructor(protected readonly keysService: KeysService) {}

  @Post('')
  public async derive(): Promise<void> {
    // await this.keysService.deriveKeys();
  }
}
