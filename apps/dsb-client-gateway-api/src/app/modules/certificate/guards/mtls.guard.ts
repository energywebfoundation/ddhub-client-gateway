import { CanActivate, Injectable } from '@nestjs/common';
import { CertificateService } from '../service/certificate.service';

@Injectable()
export class MtlsGuard implements CanActivate {
  constructor(protected readonly certificateService: CertificateService) {}

  public async canActivate(): Promise<boolean> {
    const configured = await this.certificateService.isMTLSConfigured();
    if (configured) {
      return true;
    } else {
      return await this.certificateService.configureMTLS();
    }
  }
}
