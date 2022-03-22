import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { DidAuthResponse } from '../did-auth.interface';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class DidAuthApiService {
  private readonly logger = new Logger(DidAuthApiService.name);

  constructor(protected readonly httpService: HttpService) {}

  public async login(identityToken: string): Promise<DidAuthResponse> {
    console.log('token', identityToken);

    return {
      refresh_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhhYzI5NTY1LWI4M2EtNDJmYi1hZTRhLTA0MzA0OTVmMTAxYSIsImRpZCI6ImRpZDpldGhyOnZvbHRhOjB4ZmQ2YjgwOUI4MWNBRWJjM0VBQjBkMzNmMDIxMUU1OTM0NjIxYjJEMiIsInJvbGVzIjpbXSwiaWF0IjoxNjQ3MjY0MDI3LCJleHAiOjE2NDcyNjQwMzJ9.OUWbswHTmzXbQZXWyy1y_N3TOzZRYOCLCFqlD7oC0kk',
      access_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhhYzI5NTY1LWI4M2EtNDJmYi1hZTRhLTA0MzA0OTVmMTAxYSIsImRpZCI6ImRpZDpldGhyOnZvbHRhOjB4ZmQ2YjgwOUI4MWNBRWJjM0VBQjBkMzNmMDIxMUU1OTM0NjIxYjJEMiIsInJvbGVzIjpbXSwiaWF0IjoxNjQ3MjY0MDI3LCJleHAiOjE2NDcyNjQwMzJ9.OUWbswHTmzXbQZXWyy1y_N3TOzZRYOCLCFqlD7oC0kk',
      type: 'Bearer',
      expires_in: 6000,
    };

    // const { data } = await lastValueFrom(
    //   this.httpService.post<DidAuthResponse>('/auth/login', {
    //     identityToken,
    //   })
    // ).catch((e) => {
    //   this.logger.error('Login failed');
    //
    //   this.logger.error(e.message);
    //   this.logger.error(e.response.data);
    //
    //   throw e;
    // });
    //
    // return data;
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
