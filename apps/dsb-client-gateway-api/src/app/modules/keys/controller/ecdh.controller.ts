import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ECDHKdfService } from '@dsb-client-gateway/ddhub-client-gateway-encryption';
import { DigestGuard } from '../../utils/guards/digest.guard';

@Controller('keys/ecdh')
@UseGuards(DigestGuard)
@ApiTags('ECDH Configuration')
export class EcdhController {
  constructor(protected readonly ecdhKdfService: ECDHKdfService) {}

  @Post('seed')
  public async createSeed(): Promise<void> {}

  @Post()
  public async derive(): Promise<void> {
    await this.ecdhKdfService.deriveKey(true);
  }

  @Get()
  public async get(): Promise<void> {}
}
