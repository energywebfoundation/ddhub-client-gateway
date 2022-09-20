import { Injectable } from '@nestjs/common';
import { ClientWrapperRepository } from '@dsb-client-gateway/dsb-client-gateway-storage';

@Injectable()
export class ClientsService {
  constructor(
    protected readonly wrapper: ClientWrapperRepository,
    protected readonly ddhubConfigService: DDhubConfig
  ) {}

  public async upsert(clientId: string): Promise<void> {}
}
