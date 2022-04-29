import {
  HttpStatus,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Agent } from 'https';
import { TlsAgentService } from './tls-agent.service';
import {
  ApplicationDTO,
  IamService,
} from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { lastValueFrom, Observable } from 'rxjs';
import {
  Channel,
  GetInternalMessageResponse,
  Message,
  SearchMessageResponseDto,
  SendInternalMessageRequestDTO,
  SendInternalMessageResponse,
  SendMessageData,
  SendMessageResponse,
  Topic,
  TopicDataResponse,
  TopicResultDTO,
  TopicVersion,
  TopicVersionResponse,
  UpdateTopicBodyDTO,
  UpdateTopicHistoryDTO,
} from '../dsb-client.interface';

import promiseRetry from 'promise-retry';
import FormData from 'form-data';
import { DidAuthService } from '../module/did-auth/service/did-auth.service';
import * as qs from 'qs';
import 'multer';
import { RetryConfigService } from '../../utils/service/retry-config.service';
import { AxiosResponse } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces';
import { isAxiosError } from '@nestjs/terminus/dist/utils';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { RoleStatus } from '@dsb-client-gateway/dsb-client-gateway/identity/models';
import { OperationOptions } from 'retry';
import { Span } from 'nestjs-otel';
import { EnrolmentService } from '../../enrolment/service/enrolment.service';
import { UnableToLoginException } from '../exceptions/unable-to-login.exception';

export interface RetryOptions {
  stopOnStatusCodes?: HttpStatus[];
  stopOnResponseCodes?: string[];
  retryWithAuth?: boolean;
}

@Injectable()
export class DsbApiService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DsbApiService.name);

  protected tls: Agent | null;
  protected baseUrl: string;

  public async onApplicationBootstrap(): Promise<void> {
    await this.login().catch((e) => {
      this.logger.error(`Login failed`, e);
    });
  }

  constructor(
    protected readonly configService: ConfigService,
    protected readonly httpService: HttpService,
    protected readonly tlsAgentService: TlsAgentService,
    protected readonly enrolmentService: EnrolmentService,
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
    requestFn: () => Observable<AxiosResponse<T>>,
    retryOptions: RetryOptions = {},
    overrideRetryConfig?: OperationOptions
  ): Promise<{ data: T; headers: any }> {
    const { data, headers } = await promiseRetry<AxiosResponse<T>>(
      async (retry) => {
        return lastValueFrom(requestFn()).catch((err) =>
          this.handleRequestWithRetry(err, retry, retryOptions)
        );
      },
      {
        ...this.retryConfigService.config,
        ...overrideRetryConfig,
      }
    );

    return { data, headers };
  }

  @Span('ddhub_mb_getDIDsFromRoles')
  public async getDIDsFromRoles(
    roles: string[],
    searchType: 'ANY',
    overrideRetry?: OperationOptions
  ): Promise<string[]> {
    if (roles.length === 0) {
      return [];
    }

    const { data } = await this.request<{ dids: string[] }>(
      () =>
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
        }),
      {},
      overrideRetry
    );

    return data.dids;
  }

  @Span('ddhub_mb_getTopicVersions')
  public async getTopicVersions(
    topicId: string
  ): Promise<TopicVersionResponse> {
    try {
      const result = await this.request<null>(
        () =>
          this.httpService.get(this.baseUrl + `/topics/${topicId}/versions`, {
            httpsAgent: this.getTLS(),
            headers: {
              Authorization: `Bearer ${this.didAuthService.getToken()}`,
            },
          }),
        {
          stopOnResponseCodes: ['10'],
        }
      );

      this.logger.log('get Topic Versions successful');
      return result.data;
    } catch (e) {
      this.logger.error('get Topic Versions failed', e);
      throw new Error(e);
    }
  }

  public async checkIfDIDHasRoles(
    did: string,
    roles: string[]
  ): Promise<boolean> {
    try {
      const result = await this.request<null>(
        () =>
          this.httpService.get(this.baseUrl + '/roles/check', {
            params: {
              did,
              roles,
            },
            httpsAgent: this.getTLS(),
            headers: {
              Authorization: `Bearer ${this.didAuthService.getToken()}`,
            },
          }),
        {
          stopOnResponseCodes: ['10'],
        }
      );

      this.logger.log('check If DID Has Roles  successful');
      return result.data;
    } catch (e) {
      this.logger.error('check If DID Has Roles  failed', e);
      throw new Error(e);
    }
  }

  @Span('ddhub_mb_downloadFile')
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

      if (transactionId) {
        formData.append('transactionId', transactionId);
      }

      const result = await this.request<null>(
        () =>
          this.httpService.post(this.baseUrl + '/messages/upload', formData, {
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            httpsAgent: this.getTLS(),
            headers: {
              Authorization: `Bearer ${this.didAuthService.getToken()}`,
              ...formData.getHeaders(),
            },
          }),
        {
          stopOnResponseCodes: ['10'],
        }
      );

      this.logger.log(
        `upload file with file name: ${file.originalname} successful`
      );
      return result.data;
    } catch (e) {
      this.logger.error(
        `upload file with file name: ${file.originalname} failed`,
        e
      );
      throw new Error(e);
    }
  }

  @Span('ddhub_mb_downloadFile')
  public async downloadFile(
    fileId: string
  ): Promise<{ data: string; headers: any }> {
    try {
      const result = await this.request<null>(
        () =>
          this.httpService.get(this.baseUrl + '/messages/download', {
            params: {
              fileId,
            },
            httpsAgent: this.getTLS(),
            headers: {
              ...this.getAuthHeader(),
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
      throw new Error(e);
    }
  }

  @Span('ddhub_mb_getTopicsByOwnerAndName')
  public async getTopicsByOwnerAndName(
    name: string,
    owner: string
  ): Promise<TopicDataResponse> {
    try {
      const { data } = await this.request<TopicDataResponse>(
        () =>
          this.httpService.get(this.baseUrl + '/topics', {
            params: {
              owner,
              name,
            },
            httpsAgent: this.getTLS(),
            headers: {
              Authorization: `Bearer ${this.didAuthService.getToken()}`,
            },
          }),
        {
          stopOnResponseCodes: ['10'],
        }
      );

      this.logger.log(
        `get topics with owner: ${owner} and name: ${name} successful`
      );
      return data;
    } catch (e) {
      this.logger.error(
        `get topics with owner: ${owner} and name: ${name} failed`,
        e
      );
      throw new Error(e);
    }
  }

  @Span('ddhub_mb_getApplicationsByOwnerAndRole')
  public async getApplicationsByOwnerAndRole(
    roleName: string
  ): Promise<ApplicationDTO[]> {
    this.logger.debug('start: dsb API service getApplicationsByOwnerAndRole ');
    try {
      const ownerDID = this.iamService.getDIDAddress();
      this.logger.debug('sucessfully fetched owner did');
      return this.iamService.getApplicationsByOwnerAndRole(roleName, ownerDID);
    } catch (e) {
      this.logger.error('error while getting applications', e);
      throw e;
    } finally {
      this.logger.debug('end: dsb API service getApplicationsByOwnerAndRole');
    }
  }

  @Span('ddhub_mb_getTopics')
  public async getTopics(
    limit: number,
    name: string,
    owner: string,
    page: number,
    tags: string[]
  ): Promise<TopicDataResponse> {
    try {
      const { data } = await this.request<TopicDataResponse>(
        () =>
          this.httpService.get(this.baseUrl + '/topics', {
            params: {
              limit,
              name,
              owner,
              page,
              tags,
            },
            httpsAgent: this.getTLS(),
            headers: {
              ...this.getAuthHeader(),
            },
          }),
        {
          stopOnResponseCodes: ['10'],
        }
      );

      this.logger.log(`get topics with owner:${owner} successful`);
      return data;
    } catch (e) {
      this.logger.error(`get topics with owner:${owner} failed`, e);
      throw new Error(e);
    }
  }

  @Span('ddhub_mb_getTopicsCountByOwner')
  public async getTopicsCountByOwner(owners: string[]): Promise<Topic[]> {
    if (!owners || owners.length === 0) {
      return [];
    }

    try {
      const result = await this.request<Topic[]>(
        () =>
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
          }),
        {
          stopOnResponseCodes: ['10'],
        }
      );

      this.logger.log(`get topics count with owners: ${owners} successful`);
      return result.data;
    } catch (e) {
      this.logger.error(`get topics count with owners: ${owners} failed`, e);
      throw new Error(e);
    }
  }

  @Span('ddhub_mb_getTopicsBySearch')
  public async getTopicsBySearch(
    keyword: string,
    limit?: number,
    page?: number
  ): Promise<Topic[]> {
    if (!keyword) {
      this.logger.debug(`no keyword given so returning empty array`);
      return [];
    }

    try {
      const result = await this.request<null>(
        () =>
          this.httpService.get(this.baseUrl + '/topics/search', {
            params: {
              keyword,
              limit,
              page,
            },
            httpsAgent: this.getTLS(),
            headers: {
              Authorization: `Bearer ${this.didAuthService.getToken()}`,
            },
          }),
        {
          stopOnResponseCodes: ['10'],
        }
      );

      this.logger.log(`get topics search with keyword: ${keyword} successful`);
      return result.data;
    } catch (e) {
      this.logger.error(`get topics search with keyword: ${keyword} failed`, e);
      throw new Error(e);
    }
  }

  @Span('ddhub_mb_getTopicHistoryById')
  public async getTopicHistoryById(id: string): Promise<TopicDataResponse> {
    try {
      const { data } = await this.request<TopicDataResponse>(
        () =>
          this.httpService.get(`${this.baseUrl}/topics/${id}/versions`, {
            httpsAgent: this.getTLS(),
            headers: {
              ...this.getAuthHeader(),
            },
          }),
        {
          stopOnResponseCodes: ['10'],
        }
      );

      this.logger.log(`get topics history with id:${id} successful`);
      return data;
    } catch (e) {
      this.logger.error(`get topics history with id:${id} failed`, e);
      throw new Error(e);
    }
  }

  @Span('ddhub_mb_getTopicHistoryByIdAndVersion')
  public async getTopicHistoryByIdAndVersion(
    id: string,
    version: string
  ): Promise<TopicDataResponse> {
    try {
      const { data } = await this.request<TopicDataResponse>(
        () =>
          this.httpService.get(
            `${this.baseUrl}/topics/${id}/versions/${version}`,
            {
              httpsAgent: this.getTLS(),
              headers: {
                ...this.getAuthHeader(),
              },
            }
          ),
        {
          stopOnResponseCodes: ['10'],
        }
      );

      this.logger.log(
        `get topics history with id:${id} and version: ${version} successful`
      );
      return data;
    } catch (e) {
      this.logger.error(
        `get topics history with id:${id} and version: ${version} failed`,
        e
      );
      throw new Error(e);
    }
  }

  public async postTopics(topicData: UpdateTopicBodyDTO): Promise<Topic> {
    try {
      const { data } = await this.request<null>(
        () =>
          this.httpService.post(this.baseUrl + '/topics', topicData, {
            httpsAgent: this.getTLS(),
            headers: {
              ...this.getAuthHeader(),
            },
          }),
        {
          stopOnResponseCodes: ['10'],
        }
      );

      this.logger.log('post topics successful', data);

      return data;
    } catch (e) {
      this.logger.error('post topics failed', e);
      throw new Error(e);
    }
  }

  @Span('ddhub_mb_updateTopics')
  public async updateTopic(
    data: UpdateTopicBodyDTO,
    id: string
  ): Promise<TopicResultDTO> {
    try {
      this.logger.log('topic to be updated', data);
      const result = await this.request<TopicResultDTO>(
        () =>
          this.httpService.put(`${this.baseUrl}/topics/${id}`, data, {
            httpsAgent: this.getTLS(),
            headers: {
              ...this.getAuthHeader(),
            },
          }),
        {
          stopOnResponseCodes: ['10'],
        }
      );

      this.logger.log(`update topics successful with id: ${id}`);

      return result.data;
    } catch (e) {
      this.logger.error(`update topics failed with id: ${id}`, e);
      throw new Error(e);
    }
  }

  @Span('ddhub_mb_updateTopicByIdAndVersion')
  public async updateTopicByIdAndVersion(
    topicData: UpdateTopicHistoryDTO,
    id: string,
    versionNumber: string
  ): Promise<TopicResultDTO> {
    try {
      this.logger.log('topic data to be updated', topicData);
      const result = await this.request<TopicResultDTO>(
        () =>
          this.httpService.put(
            `${this.baseUrl}/topics/${id}/versions/${versionNumber}`,
            topicData,
            {
              httpsAgent: this.getTLS(),
              headers: {
                ...this.getAuthHeader(),
              },
            }
          ),
        {
          stopOnResponseCodes: ['10'],
        }
      );

      this.logger.log(
        `update topics successful with id: ${id} and versionNumber:${versionNumber}`
      );

      return result.data;
    } catch (e) {
      this.logger.error(
        `update topics failed with id: ${id} and versionNumber:${versionNumber}`,
        e
      );
      throw new Error(e);
    }
  }

  @Span('ddhub_mb_deleteTopic')
  public async deleteTopic(id: string): Promise<TopicResultDTO> {
    try {
      this.logger.log('topic to be deleted', id);
      const result = await this.request<TopicResultDTO>(
        () =>
          this.httpService.delete(`${this.baseUrl}/topics/${id}`, {
            httpsAgent: this.getTLS(),
            headers: {
              ...this.getAuthHeader(),
            },
          }),
        {
          stopOnResponseCodes: ['10'],
        }
      );

      this.logger.log(`delete topic successful with id:${id}`);

      return result.data;
    } catch (e) {
      this.logger.error(`delete topic failed with id:${id}`, e);
      throw new Error(e);
    }
  }

  @Span('ddhub_mb_deleteTopicByVersion')
  public async deleteTopicByVersion(
    id: string,
    version: string
  ): Promise<TopicResultDTO> {
    try {
      this.logger.log(
        `topic to be deleted with version: ${version} and id:${id}`
      );
      const { data } = await this.request<TopicResultDTO>(
        () =>
          this.httpService.delete(
            `${this.baseUrl}/topics/${id}/versions/${version}`,
            {
              httpsAgent: this.getTLS(),
              headers: {
                ...this.getAuthHeader(),
              },
            }
          ),
        {
          stopOnResponseCodes: ['10'],
        }
      );

      this.logger.log(
        `delete topic successful with version: ${version} and id:${id}`
      );

      return data;
    } catch (e) {
      this.logger.error(
        `delete topic with id ${id} and version ${version} failed`,
        e
      );
      throw new Error(e);
    }
  }

  @Span('ddhub_mb_messagesSearch')
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

    try {
      const result = await this.request<SearchMessageResponseDto[]>(
        () =>
          this.httpService.post(
            this.baseUrl + '/messages/search',
            requestBody,
            {
              httpsAgent: this.getTLS(),
              headers: {
                ...this.getAuthHeader(),
              },
            }
          ),
        {
          stopOnResponseCodes: ['10'],
        }
      );

      this.logger.log('messages search successful', result);

      return result.data;
    } catch (e) {
      this.logger.error('messages search failed', e);
      throw new Error(e);
    }
  }

  @Span('ddhub_mb_getMessages')
  public async getMessages(
    fqcn: string,
    from?: string,
    clientId?: string,
    amount?: number
  ): Promise<Message[]> {
    try {
      const result = await this.request<null>(
        () =>
          this.httpService.get(this.baseUrl + '/messages', {
            httpsAgent: this.getTLS(),
            params: {
              fqcn,
              from,
              clientId,
              amount,
            },
            headers: {
              ...this.getAuthHeader(),
            },
          }),
        {
          stopOnResponseCodes: ['10'],
        }
      );

      this.logger.log(`get messages successful for fqcn: ${fqcn}`);

      return result.data;
    } catch (e) {
      this.logger.error(`get messages failed for fqcn: ${fqcn}`, e);
      throw new Error(e);
    }
  }

  @Span('ddhub_mb_sendMessage')
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

    try {
      const result = await this.request<null>(
        () =>
          this.httpService.post(this.baseUrl + '/messages', messageData, {
            httpsAgent: this.getTLS(),
            headers: {
              ...this.getAuthHeader(),
            },
          }),
        {
          stopOnResponseCodes: ['10'],
        }
      );

      this.logger.log('send message successful', result);

      return result.data;
    } catch (e) {
      this.logger.error('send message failed', e);
      throw new Error(e);
    }
  }

  @Span('ddhub_mb_sendMessageInternal')
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

    try {
      const result = await this.request<null>(
        () =>
          this.httpService.post(
            this.baseUrl + '/messages/internal',
            requestData,
            {
              httpsAgent: this.getTLS(),
              headers: {
                ...this.getAuthHeader(),
              },
            }
          ),
        {
          stopOnResponseCodes: ['10'],
        }
      );

      this.logger.log(
        `send message internal successful with clientGatewayMessageId: ${clientGatewayMessageId}`
      );

      return result.data;
    } catch (e) {
      this.logger.error(
        `send message internal failed with clientGatewayMessageId: ${clientGatewayMessageId}`,
        e
      );
      throw new Error(e);
    }
  }

  @Span('ddhub_mb_getSymmetricKeys')
  public async getSymmetricKeys(
    dto: { clientId: string; amount: number },
    overrideRetry?: OperationOptions
  ): Promise<GetInternalMessageResponse[]> {
    try {
      const { data } = await this.request<null>(
        () =>
          this.httpService.post(
            this.baseUrl + '/messages/internal/search',
            dto,
            {
              httpsAgent: this.getTLS(),
              headers: {
                ...this.getAuthHeader(),
              },
            }
          ),
        {
          stopOnResponseCodes: ['10'],
        },
        overrideRetry
      );

      this.logger.log(`get symmetric keys successful with dto:`, dto);

      return data;
    } catch (e) {
      this.logger.error(`get symmetric keys failed with dto:`, dto, e);
      throw new Error(e);
    }
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

      return retry();
    }

    throw e;
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

  @Span('ddhub_mb_login')
  public async login(): Promise<void> {
    const enrolment = await this.enrolmentService.get();

    if (!enrolment) {
      this.logger.warn('Stopping login, enrolment is not enabled');

      throw new UnableToLoginException();
    }

    const hasRequiredRoles =
      enrolment.roles.filter(
        (role) => role.required === true && role.status === RoleStatus.SYNCED
      ).length > 0;

    if (!hasRequiredRoles) {
      this.logger.warn('Stopping login, roles are missing');

      throw new UnableToLoginException();
    }

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

  @Span('ddhub_mb_initExtChannel')
  protected async initExtChannel(): Promise<void> {
    try {
      await this.request<null>(
        () =>
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

  async getTopicById(topicId: string): Promise<TopicVersion | null> {
    try {
      const { data } = await this.request<TopicVersion | null>(
        () =>
          this.httpService.get(
            this.baseUrl + '/topics/' + topicId + '/versions',
            {
              httpsAgent: this.getTLS(),
              headers: {
                ...this.getAuthHeader(),
              },
            }
          ),
        {
          stopOnResponseCodes: ['10'],
        }
      );
      this.logger.error(`Get topic with topicId: ${topicId} successful`);

      return data;
    } catch (e) {
      this.logger.error(`Get topic with topicId: ${topicId} failed`, e);

      return null;
    }
  }
}
