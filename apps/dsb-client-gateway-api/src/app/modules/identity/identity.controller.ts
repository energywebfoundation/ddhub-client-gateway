import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { IdentityService } from './service/identity.service';
import { Identity } from '../storage/storage.interface';
import { CreateIdentityDto } from './dto/create-identity.dto';
import { DigestGuard } from '../utils/guards/digest.guard';

@Controller('identity')
@UseGuards(DigestGuard)
export class IdentityController {
  constructor(protected readonly identityService: IdentityService) {}

  @Get('')
  public async get(): Promise<Identity> {
    return this.identityService.getIdentity();
  }

  @Post('')
  public async post(
    @Body() { privateKey }: CreateIdentityDto
  ): Promise<Identity> {
    await this.identityService.createIdentity(privateKey);

    return this.identityService.getIdentity();
  }
}
