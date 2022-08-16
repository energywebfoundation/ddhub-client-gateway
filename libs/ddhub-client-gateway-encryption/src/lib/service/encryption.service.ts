import { Logger } from '@nestjs/common';

export abstract class EncryptionService {
  protected readonly logger = new Logger(EncryptionService.name);

  constructor(protected readonly) {}
}
