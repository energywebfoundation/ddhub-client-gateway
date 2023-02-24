import { Injectable, Logger } from '@nestjs/common';
import { DdhubBaseService } from './ddhub-base.service';
import { HttpService } from '@nestjs/axios';
import { RetryConfigService } from '@dsb-client-gateway/ddhub-client-gateway-utils';
import { DidAuthService } from '@dsb-client-gateway/ddhub-client-gateway-did-auth';
import { TlsAgentService } from '@dsb-client-gateway/ddhub-client-gateway-tls-agent';
import { Span } from 'nestjs-otel';
import FormData from 'form-data';
import { DdhubLoginService } from './ddhub-login.service';
import 'multer';
import { SendMessageResponseFile } from '../dto';
import { IncomingMessage } from 'http';
import { UploadFailedException } from '../exceptions/upload-failed-exception';

@Injectable()
export class DdhubFilesService extends DdhubBaseService {
  constructor(
    protected readonly httpService: HttpService,
    protected readonly retryConfigService: RetryConfigService,
    protected readonly didAuthService: DidAuthService,
    protected readonly tlsAgentService: TlsAgentService,
    protected readonly ddhubLoginService: DdhubLoginService
  ) {
    super(
      new Logger(DdhubFilesService.name),
      retryConfigService,
      ddhubLoginService,
      tlsAgentService
    );
  }

  @Span('ddhub_mb_uploadFile')
  public async uploadFile(
    file,
    originalname: string,
    fqcns: string[],
    topicId: string,
    topicVersion: string,
    signature: string,
    clientGatewayMessageId: string,
    payloadEncryption: boolean,
    transactionId?: string
  ): Promise<SendMessageResponseFile> {
    this.logger.log('Uploading File');
    try {
      const formData = new FormData();

      formData.append('file', file);
      formData.append('fileName', originalname);
      formData.append('fqcns', fqcns.join(','));
      formData.append('signature', signature);
      formData.append('topicId', topicId);
      formData.append('topicVersion', topicVersion);
      formData.append('clientGatewayMessageId', clientGatewayMessageId);
      formData.append(
        'payloadEncryption',
        payloadEncryption ? 'true' : 'false'
      );

      if (transactionId) {
        formData.append('transactionId', transactionId);
      }

      const result = await this.request<null>(
        () =>
          this.httpService.post('/messages/upload', formData, {
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            httpsAgent: this.tlsAgentService.get(),
            headers: {
              Authorization: `Bearer ${this.didAuthService.getToken()}`,
              ...formData.getHeaders(),
            },
          }),
        {
          stopOnResponseCodes: ['10'],
        }
      );

      const _data = result.data as SendMessageResponseFile;
      if (_data.recipients.failed > 0) {
        throw new UploadFailedException(`upload file with file name: ${originalname} failed`);
      }
      this.logger.log(`upload file with file name: ${originalname} successful`);
      return result.data;
    } catch (e) {
      this.logger.error(
        `upload file with file name: ${originalname} failed`,
        e
      );
      throw e;
    }
  }

  @Span('ddhub_mb_uploadFile_chunk')
  public async uploadFileChunk(
    file,
    fileSize: number,
    chunkSize: number,
    currentChunkIndex: number,
    checksum: string,
    originalname: string,
    fqcns: string[],
    topicId: string,
    topicVersion: string,
    signature: string,
    clientGatewayMessageId: string,
    payloadEncryption: boolean,
    transactionId?: string
  ): Promise<SendMessageResponseFile | null> {
    try {
      const formData = new FormData();

      formData.append('file', file);
      formData.append('fileSize', fileSize);
      formData.append('chunkSize', chunkSize);
      formData.append('currentChunkIndex', currentChunkIndex);
      formData.append('fileChecksum', checksum);
      formData.append('fileName', originalname);
      formData.append('fqcns', fqcns.join(','));
      formData.append('signature', signature);
      formData.append('topicId', topicId);
      formData.append('topicVersion', topicVersion);
      formData.append('clientGatewayMessageId', clientGatewayMessageId);
      formData.append(
        'payloadEncryption',
        payloadEncryption ? 'true' : 'false'
      );

      if (transactionId) {
        formData.append('transactionId', transactionId);
      }

      const result = await this.request<null>(
        () =>
          this.httpService.post('/messages/uploadc', formData, {
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            httpsAgent: this.tlsAgentService.get(),
            headers: {
              Authorization: `Bearer ${this.didAuthService.getToken()}`,
              ...formData.getHeaders(),
            },
          }),
        {
          stopOnResponseCodes: ['10'],
        }
      );

      if (!result.data) {
        this.logger.log(`upload chunk ${currentChunkIndex} file with file name: ${originalname}`);
        return null;
      }

      const _data = result.data as SendMessageResponseFile;
      if (_data.recipients.failed > 0) {
        throw new UploadFailedException(`upload file with file name: ${originalname} failed`);
      }
      this.logger.log(`upload file with file name: ${originalname} successful`);
      return result.data;
    } catch (e) {
      this.logger.error(
        `upload file with file name: ${originalname} failed`,
        e
      );
      throw e;
    }
  }

  @Span('ddhub_mb_downloadFile')
  public async downloadFile(
    fileId: string
  ): Promise<{ data: IncomingMessage; headers: any }> {
    try {
      const result = await this.request<null>(
        () =>
          this.httpService.get('/messages/download', {
            params: {
              fileId,
            },
            responseType: 'stream',
            httpsAgent: this.tlsAgentService.get(),
            headers: {
              Authorization: `Bearer ${this.didAuthService.getToken()}`,
            },
          }),
        {
          stopOnResponseCodes: ['10'],
        }
      );

      this.logger.log(
        `download file with fileId: ${fileId} successful from MB`
      );
      return result;
    } catch (e) {
      this.logger.error(
        `download file with fileId: ${fileId} failed from MB`,
        e
      );
      throw e;
    }
  }
}
