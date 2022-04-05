import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Agent } from 'https';
import { TlsAgentService } from './tls-agent.service';
import { EthersService } from '../../utils/service/ethers.service';
import { IamService } from '../../iam-service/service/iam.service';
import { lastValueFrom, Observable } from 'rxjs';
import {
  Channel,
  Message,
  SendInternalMessageResponse,
  SendMessageData,
  SendTopicBodyDTO,
  Topic,
  TopicDataResponse,
  TopicResultDTO,
  TopicVersionResponse,
  SendInternalMessageRequestDTO,
  SendMessageResponse,
  ApplicationDTO,
  SearchMessageResponseDto,
  GetInternalMessageResponse,
} from '../dsb-client.interface';
import { SecretsEngineService } from '../../secrets-engine/secrets-engine.interface';

import promiseRetry from 'promise-retry';
import FormData from 'form-data';
import { EnrolmentRepository } from '../../storage/repository/enrolment.repository';
import { DidAuthService } from '../module/did-auth/service/did-auth.service';
import * as qs from 'qs';
import 'multer';
import { RetryConfigService } from '../../utils/service/retry-config.service';
import { AxiosResponse } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces';
import { isAxiosError } from '@nestjs/terminus/dist/utils';

export interface RetryOptions {
  stopOnStatusCodes?: HttpStatus[];
  stopOnResponseCodes?: string[];
  retryWithAuth?: boolean;
}

@Injectable()
export class DsbApiService implements OnModuleInit {
  private readonly logger = new Logger(DsbApiService.name);

  protected tls: Agent | null;
  protected baseUrl: string;

  public async onModuleInit(): Promise<void> {
    await this.login().catch((e) => {
      this.logger.error(`Login failed`, e);
    });
  }

  constructor(
    protected readonly configService: ConfigService,
    protected readonly httpService: HttpService,
    protected readonly tlsAgentService: TlsAgentService,
    protected readonly ethersService: EthersService,
    protected readonly enrolmentRepository: EnrolmentRepository,
    protected readonly iamService: IamService,
    protected readonly secretsEngineService: SecretsEngineService,
    protected readonly didAuthService: DidAuthService,
    protected readonly retryConfigService: RetryConfigService
  ) {
    this.baseUrl = this.configService.get<string>(
      'DSB_BASE_URL',
      'https://dsb-dev.energyweb.org'
    );
  }

  protected async request<T>(
    requestFn: Observable<AxiosResponse<T>>,
    retryOptions: RetryOptions = {}
  ): Promise<T> {
    const { data } = await promiseRetry<AxiosResponse<T>>(async (retry) => {
      return lastValueFrom(requestFn).catch((err) =>
        this.handleRequestWithRetry(err, retry, retryOptions)
      );
    }, this.retryConfigService.config);

    return data;
  }

  public async getDIDsFromRoles(
    roles: string[],
    searchType: 'ANY'
  ): Promise<string[]> {
    if (roles.length === 0) {
      return [];
    }

    const { data } = await promiseRetry(async (retry, attempt) => {
      return lastValueFrom(
        this.httpService.get(this.baseUrl + '/roles/list', {
          params: {
            roles,
            searchType,
          },
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' });
          },
          httpsAgent: this.getTLS(),
          headers: {
            Authorization: `Bearer ${this.didAuthService.getToken()}`,
          },
        })
      ).catch((err) => this.handleRequestWithRetry(err, retry));
    });

    return data.dids;
  }

  public async getTopicVersions(
    topicId: string
  ): Promise<TopicVersionResponse> {
    const { data } = await promiseRetry(async (retry, attempt) => {
      return lastValueFrom(
        this.httpService.get(this.baseUrl + `/topics/${topicId}/version`, {
          httpsAgent: this.getTLS(),
          headers: {
            Authorization: `Bearer ${this.didAuthService.getToken()}`,
          },
        })
      ).catch((err) => this.handleRequestWithRetry(err, retry));
    });
    return data;
  }

  public async checkIfDIDHasRoles(
    did: string,
    roles: string[]
  ): Promise<boolean> {
    const { data } = await promiseRetry(async (retry, attempt) => {
      return lastValueFrom(
        this.httpService.get(this.baseUrl + '/roles/check', {
          params: {
            did,
            roles,
          },
          httpsAgent: this.getTLS(),
          headers: {
            Authorization: `Bearer ${this.didAuthService.getToken()}`,
          },
        })
      ).catch((err) => this.handleRequestWithRetry(err, retry));
    });

    return data;
  }

  public async uploadFile(
    file: Express.Multer.File,
    fqcns: string[],
    topicId: string,
    topicVersion: string,
    signature: string,
    encryptedMessage: string,
    clientGatewayMessageId: string,
    transactionId?: string
  ): Promise<SendMessageResponse> {
    this.logger.log('Uploading File');
    try {
      const formData = new FormData();

      formData.append('file', encryptedMessage);
      formData.append('fileName', file.originalname);
      formData.append('fqcns', fqcns.join(','));
      formData.append('signature', signature);
      formData.append('topicId', topicId);
      formData.append('topicVersion', topicVersion);
      formData.append('clientGatewayMessageId', clientGatewayMessageId);
      formData.append('transactionId', transactionId);

      const { data } = await promiseRetry(async (retry, attempt) => {
        return lastValueFrom(
          this.httpService.post(this.baseUrl + '/messages/upload', formData, {
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            httpsAgent: this.getTLS(),
            headers: {
              Authorization: `Bearer ${this.didAuthService.getToken()}`,
              ...formData.getHeaders(),
            },
          })
        ).catch((err) => {
          return this.handleRequestWithRetry(err, retry);
        });
      });
      this.logger.log('File Uploaded Successfully');
      return data;
    } catch (e) {
      this.logger.error(e);
    }
  }

  public async downloadFile(fileId: string): Promise<any> {
    const response = await promiseRetry(async (retry, attempt) => {
      return lastValueFrom(
        this.httpService.get(this.baseUrl + '/messages/download', {
          params: {
            fileId,
          },
          httpsAgent: this.getTLS(),
          headers: {
            Authorization: `Bearer ${this.didAuthService.getToken()}`,
          },
        })
      ).catch((err) => this.handleRequestWithRetry(err, retry));
    });

    return response;
  }

  public async getTopicsByOwnerAndName(
    name: string,
    owner: string
  ): Promise<TopicDataResponse> {
    const { data } = await promiseRetry(async (retry, attempt) => {
      return lastValueFrom(
        this.httpService.get(this.baseUrl + '/topics', {
          params: {
            owner,
            name,
          },
          httpsAgent: this.getTLS(),
          headers: {
            Authorization: `Bearer ${this.didAuthService.getToken()}`,
          },
        })
      ).catch((err) => this.handleRequestWithRetry(err, retry));
    });

    return data;
  }

  public async getApplicationsByOwnerAndRole(
    roleName: string
  ): Promise<ApplicationDTO[]> {
    this.logger.debug('start: dsb API service getApplicationsByOwnerAndRole ');
    try {
      const enrolment = this.enrolmentRepository.getEnrolment();
      const ownerDID = enrolment.did;
      this.logger.debug('sucessfully fetched owner did');
      return this.iamService.getApplicationsByOwnerAndRole(roleName, ownerDID);
    } catch (e) {
      this.logger.error('error while getting applications', e);
      return e;
    } finally {
      this.logger.debug('end: dsb API service getApplicationsByOwnerAndRole');
    }
  }

  public async getTopics(owner: string): Promise<TopicDataResponse> {
    const { data } = await promiseRetry(async (retry, attempt) => {
      return lastValueFrom(
        this.httpService.get(this.baseUrl + '/topics', {
          params: {
            owner: owner,
          },
          httpsAgent: this.getTLS(),
          headers: {
            Authorization: `Bearer ${this.didAuthService.getToken()}`,
          },
        })
      ).catch((err) => this.handleRequestWithRetry(err, retry));
    });

    return data;
  }

  public async getTopicsCountByOwner(owners: string[]): Promise<Topic[]> {
    if (!owners || owners.length === 0) {
      return [];
    }

    const { data } = await promiseRetry(async (retry, attempt) => {
      return lastValueFrom(
        this.httpService.get(this.baseUrl + '/topics/count', {
          params: {
            owner: owners,
          },
          paramsSerializer: function (params) {
            return qs.stringify(params, { arrayFormat: 'repeat' });
          },
          httpsAgent: this.getTLS(),
          headers: {
            Authorization: `Bearer ${this.didAuthService.getToken()}`,
          },
        })
      ).catch((err) => this.handleRequestWithRetry(err, retry));
    });

    return data;
  }

  public async postTopics(data: SendTopicBodyDTO): Promise<Topic> {
    const result = await promiseRetry(async (retry, attempt) => {
      return lastValueFrom(
        this.httpService.post(this.baseUrl + '/topics', data, {
          httpsAgent: this.getTLS(),
          headers: {
            Authorization: `Bearer ${this.didAuthService.getToken()}`,
          },
        })
      ).catch((err) => this.handleRequestWithRetry(err, retry));
    });

    return result.data;
  }

  public async updateTopics(data: SendTopicBodyDTO): Promise<TopicResultDTO> {
    const result = await promiseRetry(async (retry, attempt) => {
      return lastValueFrom(
        this.httpService.put(this.baseUrl + '/topics', data, {
          httpsAgent: this.getTLS(),
          headers: {
            Authorization: `Bearer ${this.didAuthService.getToken()}`,
          },
        })
      ).catch((err) => this.handleRequestWithRetry(err, retry));
    });
    return result.data;
  }

  public async messagesSearch(
    topicId: string[],
    senderId: string[],
    clientId?: string,
    from?: string,
    amount?: number
  ): Promise<SearchMessageResponseDto[]> {
    const requestBody = {
      topicId,
      clientId,
      amount,
      from,
      senderId,
    };
    const { data } = await promiseRetry(async (retry, attempt) => {
      return lastValueFrom(
        this.httpService.post(this.baseUrl + '/messages/search', requestBody, {
          httpsAgent: this.getTLS(),
          headers: {
            Authorization: `Bearer ${this.didAuthService.getToken()}`,
          },
        })
      ).catch((err) => this.handleRequestWithRetry(err, retry));
    });
    return data;
  }

  public async getMessages(
    fqcn: string,
    from?: string,
    clientId?: string,
    amount?: number
  ): Promise<Message[]> {
    try {
      const { data } = await promiseRetry(async (retry, attempt) => {
        return lastValueFrom(
          this.httpService.get(this.baseUrl + '/messages', {
            httpsAgent: this.getTLS(),
            params: {
              fqcn,
              from,
              clientId,
              amount,
            },
            headers: {
              Authorization: `Bearer ${this.didAuthService.getToken()}`,
            },
          })
        ).catch((err) => this.handleRequestWithRetry(err, retry));
      });

      return data;
    } catch (e) {
      this.logger.error(e);

      return [];
    }
  }

  public async sendMessage(
    fqcns: string[],
    payload: string,
    topicId: string,
    topicVersion: string,
    signature: string,
    clientGatewayMessageId: string,
    transactionId?: string
  ): Promise<SendMessageResponse> {
    const messageData: SendMessageData = {
      fqcns,
      transactionId,
      payload: payload,
      topicId,
      topicVersion,
      signature,
      clientGatewayMessageId,
    };

    console.log('messageData', messageData);

    const { data } = await promiseRetry(async (retry, attempt) => {
      return lastValueFrom(
        this.httpService.post(this.baseUrl + '/messages', messageData, {
          httpsAgent: this.getTLS(),
          headers: {
            Authorization: `Bearer ${this.didAuthService.getToken()}`,
          },
        })
      ).catch((err) => this.handleRequestWithRetry(err, retry));
    });
    this.logger.log('Message Sent Successfully!', data.clientGatewayMessageId);

    return data;
  }

  public async sendMessageInternal(
    fqcn: string,
    clientGatewayMessageId: string,
    payload: string
  ): Promise<SendInternalMessageResponse> {
    const requestData: SendInternalMessageRequestDTO = {
      fqcn,
      clientGatewayMessageId,
      payload: payload,
    };

    console.log('payload', payload);

    const { data } = await promiseRetry(async (retry, attempt) => {
      console.log(this.baseUrl + '/messages/internal');

      return lastValueFrom(
        this.httpService.post(
          this.baseUrl + '/messages/internal',
          requestData,
          {
            httpsAgent: this.getTLS(),
            headers: {
              Authorization: `Bearer ${this.didAuthService.getToken()}`,
            },
          }
        )
      ).catch((err) => this.handleRequestWithRetry(err, retry));
    });

    return data;
  }

  public async getInternalMessages(
    clientId: string
  ): Promise<GetInternalMessageResponse[]> {
    const { data } = await promiseRetry(async (retry, attempt) => {
      return lastValueFrom(
        this.httpService.get(this.baseUrl + '/messages/internal', {
          httpsAgent: this.getTLS(),
          params: {
            clientId,
          },
          headers: {
            Authorization: `Bearer ${this.didAuthService.getToken()}`,
          },
        })
      ).catch((err) => this.handleRequestWithRetry(err, retry));
    });

    return data;
  }

  protected async handleRequestWithRetry(
    e,
    retry,
    options: RetryOptions = {}
  ): Promise<any> {
    const defaults: RetryOptions = {
      stopOnStatusCodes: [HttpStatus.FORBIDDEN],
      stopOnResponseCodes: [],
      retryWithAuth: true,
      ...options,
    };

    if (!isAxiosError(e)) {
      this.logger.error('Request failed due to unknown error', e);

      throw e;
    }

    const { status } = e.response;

    this.logger.error('Request failed', e.request.path);
    this.logger.error(e.response.data);

    if (defaults.stopOnStatusCodes.includes(status)) {
      this.logger.error(
        'Request stopped because of stopOnResponseCodes rule',
        status,
        defaults.stopOnStatusCodes
      );

      throw e;
    }

    if (
      e.response.data.returnCode &&
      defaults.stopOnResponseCodes.includes(e.response.data.returnCode)
    ) {
      this.logger.error(
        'Request stopped because of stopOnResponseCodes rule',
        e.response.data.returnCode,
        defaults.stopOnResponseCodes
      );

      throw e;
    }

    if (status === HttpStatus.UNAUTHORIZED) {
      this.logger.log('Unauthorized, attempting to login');

      await this.login();

      return retry(e);
    }

    return retry(e);
  }

  public async getChannels(): Promise<Channel[]> {
    await this.enableTLS();

    const { data } = await promiseRetry(async (retry, attempt) => {
      return lastValueFrom(
        this.httpService.get(this.baseUrl + '/channel/pubsub', {
          httpsAgent: this.getTLS(),
          headers: {
            Authorization: `Bearer ${this.didAuthService.getToken()}`,
          },
        })
      ).catch((err) => this.handleRequestWithRetry(err, retry));
    });

    return data;
  }

  public async login(): Promise<void> {
    this.logger.log('Attempting to login to DID Auth Server');

    const privateKey: string | null =
      await this.secretsEngineService.getPrivateKey();

    if (!privateKey) {
      this.logger.error('Private key is missing');

      return;
    }

    await promiseRetry(async (retry) => {
      await this.didAuthService
        .login(privateKey, this.iamService.getDIDAddress())
        .catch((e) => retry(e));
    }, this.retryConfigService.config);

    this.logger.log('Login successful, attempting to init ext channel');

    await this.initExtChannel();
  }

  public async health(): Promise<{ statusCode: number; message?: string }> {
    await this.enableTLS();

    try {
      await this.httpService.get('/health', {
        httpsAgent: this.getTLS(),
      });

      return { statusCode: 200 };
    } catch (e) {
      if (e.response) {
        this.logger.error(`DSB Health failed - ${e.response.data}`);
      }

      return {
        statusCode: e.response.status,
        message: e.response.data,
      };
    }
  }

  protected translateIdempotencyKey(
    body: { transactionId?: string; correlationId?: string },
    outgoing: boolean
  ): any {
    if (outgoing) {
      const correlationId = body.transactionId;
      delete body.transactionId;
      return {
        ...body,
        correlationId,
      };
    } else {
      const transactionId = body.correlationId;
      delete body.correlationId;
      return {
        ...body,
        transactionId,
      };
    }
  }

  protected async initExtChannel(): Promise<void> {
    try {
      await this.request<null>(
        this.httpService.post(
          this.baseUrl + '/channel/initExtChannel',
          {
            httpsAgent: this.getTLS(),
          },
          {
            headers: {
              ...this.getAuthHeader(),
            },
          }
        ),
        {
          stopOnResponseCodes: ['10'],
        }
      );

      this.logger.log('Init ext channel successful');
    } catch (e) {
      this.logger.error('Init ext channel failed', e);
    }
  }

  protected getAuthHeader(): { Authorization: string } {
    return {
      Authorization: `Bearer ${this.didAuthService.getToken()}`,
    };
  }

  protected getTLS(): Agent | null {
    return this.tls;
  }

  protected async enableTLS(): Promise<void> {
    this.tls = await this.tlsAgentService.create();
  }

  protected disableTLS(): void {
    this.tls.destroy();

    this.tls = null;
  }
}
