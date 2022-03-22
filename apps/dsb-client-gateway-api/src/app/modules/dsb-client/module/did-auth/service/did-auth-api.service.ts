import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { DidAuthResponse } from '../did-auth.interface';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class DidAuthApiService {
  private readonly logger = new Logger(DidAuthApiService.name);

  constructor(protected readonly httpService: HttpService) { }

  public async login(identityToken: string): Promise<DidAuthResponse> {
    const { data } = await lastValueFrom(
      this.httpService.post<DidAuthResponse>('/auth/login', {
        identityToken,
      })
    ).catch((e) => {
      this.logger.error('Login failed');

      this.logger.error(e.message);
      this.logger.error(e.response.data);

      throw e;
    });

    return data;
  }

  public async refreshToken(
    refreshToken: string | null
  ): Promise<DidAuthResponse | null> {
    if (!this.refreshToken) {
      this.logger.error('No refresh token to use');

      return null;
    }

    const { data } = await lastValueFrom(
      this.httpService.post<DidAuthResponse>('/auth/refresh-token', {
        refreshToken,
      })
    ).catch((e) => {
      this.logger.error('Refresh token failed');

      this.logger.error(e.message);
      this.logger.error(e.response.data);

      throw e;
    });

    return data;
  }
}
