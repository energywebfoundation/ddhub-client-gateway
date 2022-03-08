import { Controller, Post, UseGuards } from '@nestjs/common';
import { KeysService } from './service/keys.service';
import { DigestGuard } from '../utils/guards/digest.guard';

@Controller('keys')
@UseGuards(DigestGuard)
export class KeysController {
  constructor(protected readonly keysService: KeysService) {}

  @Post('')
  public async derive(): Promise<void> {
    await this.keysService.deriveKeys();
  }
}
