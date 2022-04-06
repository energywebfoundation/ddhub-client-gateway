import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonRpcProvider } from '@ethersproject/providers';

@Injectable()
export class Provider extends JsonRpcProvider {
  constructor(configService: ConfigService) {
    super(configService.get('ENS_URL'));
  }
}
